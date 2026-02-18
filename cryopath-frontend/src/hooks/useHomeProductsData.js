import { useEffect, useMemo, useState } from 'react';
import { obtenerProductosRequest, obtenerImagenesProductoRequest } from '../services/productosApi';
import { obtenerCategoriaDeProducto } from '../services/categoriasApi';
import { obtenerProductosPorSupercategoria } from '../services/supercategoriasApi';
import { getInventario } from '../services/inventarioApi';

export default function useHomeProductsData({ idSupercategoria = null, token = null, productsLimit = 1000 } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [categoriasPorProducto, setCategoriasPorProducto] = useState({});
  const [inventarioMap, setInventarioMap] = useState({});

  const hasInventory = useMemo(() => Object.keys(inventarioMap).length > 0, [inventarioMap]);

  useEffect(() => {
    let mounted = true;

    const fetchInventario = async () => {
      try {
        const data = await getInventario();
        if (!mounted) return;

        const map = {};
        data.forEach((item) => {
          map[item.id_producto] = item.cantidad_disponible;
        });

        setInventarioMap(map);
      } catch (err) {
        console.error('Error al obtener inventario:', err);
      }
    };

    fetchInventario();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        let productosData;

        if (idSupercategoria) {
          const response = await obtenerProductosPorSupercategoria(idSupercategoria, {
            limit: productsLimit,
            offset: 0,
            estado: 'activo',
          });
          productosData = response?.data || [];
        } else {
          const data = await obtenerProductosRequest(token);
          if (data && Array.isArray(data.productos)) {
            productosData = data.productos;
          } else if (Array.isArray(data)) {
            productosData = data;
          } else {
            console.error('Estructura de datos inesperada:', data);
            productosData = [];
          }
        }

        if (!mounted) return;
        setProducts(productosData);
      } catch (err) {
        console.error('Error al cargar productos en Home:', err);
        if (!mounted) return;
        setError('Error al cargar productos.');
        setProducts([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchProductos();

    return () => {
      mounted = false;
    };
  }, [token, idSupercategoria, productsLimit]);

  useEffect(() => {
    let mounted = true;

    const fetchImagenes = async () => {
      if (!products.length) {
        setImageUrls({});
        return;
      }

      try {
        const urls = {};

        await Promise.all(
          products.map(async (product) => {
            const id = product?.id_producto;
            if (!id) return;

            try {
              const data = await obtenerImagenesProductoRequest(id, token);
              const images = Array.isArray(data)
                ? data.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
                : [];

              if (images.length > 0) urls[id] = images[0];
            } catch (err) {
              console.error(`Error al obtener imágenes para producto ${id}:`, err);
            }
          })
        );

        if (!mounted) return;
        setImageUrls(urls);
      } catch (err) {
        console.error('Error al cargar imágenes de productos:', err);
      }
    };

    fetchImagenes();

    return () => {
      mounted = false;
    };
  }, [products, token]);

  useEffect(() => {
    let mounted = true;

    const fetchCategoriasPorProducto = async () => {
      try {
        const idsToFetch = products
          .map((p) => p?.id_producto)
          .filter((id) => id !== null && id !== undefined)
          .filter((id) => categoriasPorProducto[id] === undefined);

        if (!idsToFetch.length) return;

        const results = await Promise.all(
          idsToFetch.map(async (idProducto) => {
            try {
              const data = await obtenerCategoriaDeProducto(idProducto);
              const categoria = data?.categoria || data?.data?.categoria || null;
              const nombre = categoria?.nombre || '';
              const rawId = categoria?.id_categoria ?? categoria?.id ?? data?.id_categoria ?? data?.id ?? null;
              const idCategoria = rawId == null ? null : Number(rawId);
              return [idProducto, { id: Number.isFinite(idCategoria) ? idCategoria : null, nombre }];
            } catch {
              return [idProducto, { id: null, nombre: '' }];
            }
          })
        );

        if (!mounted) return;

        setCategoriasPorProducto((prev) => {
          const next = { ...prev };
          results.forEach(([id, info]) => {
            next[id] = info;
          });
          return next;
        });
      } catch (err) {
        console.error('Error al cargar categorías por producto en Home:', err);
      }
    };

    fetchCategoriasPorProducto();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return {
    products,
    loading,
    error,
    imageUrls,
    categoriasPorProducto,
    inventarioMap,
    hasInventory,
  };
}
