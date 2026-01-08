import './Home.css';
import Pagination from '../../components/Pagination';
import HomeLeftPanel from '../../components/HomeLeftPanel';
import { useState, useEffect } from "react";
import { obtenerProductosRequest, obtenerImagenProductoRequest } from "../../services/productosApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { agregarAlCarrito } from "../../services/cartApi";

export default function Home() {
const { session, profile, isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    const navigate = useNavigate();
    


    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await obtenerProductosRequest(session?.access_token);
                if (data && Array.isArray(data.productos)) {
                    setProducts(data.productos);
                } else if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Estructura de datos inesperada:", data);
                    // Fallback para evitar romper la UI si no hay array
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error al cargar productos en Home:", err);
                setError("Error al cargar productos.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, [session]);

    useEffect(() => {
        const fetchImagenes = async () => {
            if (!products.length) return;
            try {
                const urls = {};
                await Promise.all(
                    products.map(async (product) => {
                        const id = product.id_producto;
                        if (!id) return;
                        try {
                            const data = await obtenerImagenProductoRequest(id, session?.access_token);
                            if (data?.url) {
                                urls[id] = data.url;
                            }
                        } catch (err) {
                            // Silenciar error por producto individual
                            console.error(`Error al obtener imagen para producto ${id}:`, err);
                        }
                    })
                );
                setImageUrls(urls);
            } catch (err) {
                console.error("Error al cargar imágenes de productos:", err);
            }
        };
        fetchImagenes();
    }, [products, session]);

    // Calcular precios solo si hay productos
    const validProducts = products.filter(p => typeof p.precio_base === 'number');
    const numericPrices = validProducts.map((p) => p.precio_base);
    // Valores por defecto si no hay productos para evitar -Infinity/Infinity
    const minPrice = numericPrices.length > 0 ? Math.min(...numericPrices) : 0;
    const maxPrice = numericPrices.length > 0 ? Math.max(...numericPrices) : 1000;

    const pageSize = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPriceFilter, setMaxPriceFilter] = useState(maxPrice || 1000); // Inicializar con un valor seguro
    const [sortOrder, setSortOrder] = useState('asc');

    // Actualizar el filtro cuando cambien los productos (y por ende el maxPrice)
    useEffect(() => {
        if (maxPrice > 0) {
            setMaxPriceFilter(maxPrice);
        }
    }, [maxPrice]);

    const filteredAndSortedProducts = products
        .filter((product) => {
            const priceValue = Number(product.precio_base) || 0;
            return priceValue <= maxPriceFilter;
        })
        .sort((a, b) => {
            const priceA = Number(a.precio_base) || 0;
            const priceB = Number(b.precio_base) || 0;
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });

    const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize) || 1;

    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleMaxPriceChange = (value) => {
        setMaxPriceFilter(value);
        setCurrentPage(1);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

const handleAddToCart = async (product) => {
  try {
    if (loading) return;

    if (!isAuthenticated || !session || !profile?.id) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      navigate("/login");
      return;
    }

    const payload = {
        id_producto: product.id_producto,
        cantidad: 1,
    }

    await agregarAlCarrito(
        session.access_token,
        profile.id,
        payload
    )

    console.log("Producto añadido al carrito con éxito");

    } catch (error) {
        console.error("Error al añadir al carrito", error)
    }
}


    return (
        <div className="home-background">
            <HomeLeftPanel
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentMaxPrice={maxPriceFilter}
                onMaxPriceChange={handleMaxPriceChange}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
            />

            <div className="home-products">
                {loading ? (
                    <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>Cargando catálogo...</p>
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center', width: '100%' }}>{error}</p>
                ) : currentProducts.length === 0 ? (
                    <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>No se encontraron productos.</p>
                ) : (
                    currentProducts.map((product) => {
                        const servicioImageUrl = product.id_producto
                            ? imageUrls[product.id_producto]
                            : null;

                        return (
                            <div className="product-card" key={product.id_producto || Math.random()}>
                                <div className="product-image">
                                    {(() => {
                                        const imagenRelacionada = Array.isArray(product.producto_imagen)
                                          ? product.producto_imagen[0]
                                          : null;

                                        const fallbackImageUrl =
                                          imagenRelacionada?.url ||
                                          imagenRelacionada?.url_imagen ||
                                          product.imagen_url ||
                                          product.imagen?.url ||
                                          product.imagen?.secure_url ||
                                          product.imagen;

                                        const imageUrl =
                                          servicioImageUrl || fallbackImageUrl;

                                        return (
                                          <img
                                            src={imageUrl || "https://placehold.co/300x200?text=No+Image"}
                                            alt={product.nombre}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = "https://placehold.co/300x200?text=Sin+Imagen";
                                            }}
                                          />
                                        );
                                    })()}
                                </div>
                                <h2>{product.nombre}</h2>
                                <p>{product.descripcion}</p>
                                <p>Precio: ${typeof product.precio_base === 'number' ? product.precio_base.toFixed(2) : product.precio_base}</p>
                                <button className="details-button">Ver más detalles</button>
                                <div className="product-actions-row">
                                    <button className="buy-button">Comprar</button>
                                    <button className="cart-button" onClick={() => handleAddToCart(product)}>Añadir al carrito</button>
                                    
                                </div>
                            </div>
                        );
                    })
                )}

                {!loading && !error && currentProducts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                )}
            </div>
        </div>
    );
}