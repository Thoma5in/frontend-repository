import './Home.css';
import Pagination from '../../components/Pagination';
import HomeLeftPanel from '../../components/HomeLeftPanel';
import { useEffect, useRef, useState } from "react";
import { obtenerProductosRequest, obtenerImagenesProductoRequest } from "../../services/productosApi";
import { obtenerCategoriaDeProducto } from "../../services/categoriasApi";
import { obtenerProductosPorSupercategoria } from "../../services/supercategoriasApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { actualizarCantidad, agregarAlCarrito, obtenerCarrito } from "../../services/cartApi";
import { getInventario, getInventarioByProducto } from "../../services/inventarioApi";
import ChatList from "../chat-list/ChatList.jsx";

const DESCRIPTION_WORD_LIMIT = 20;

function truncateWords(text, limit = DESCRIPTION_WORD_LIMIT) {
    if (text === null || text === undefined) return "";
    const normalized = String(text).trim().replace(/\s+/g, " ");
    if (!normalized) return ""

    const words = normalized.split(" ");
    if (words.length <= limit) return normalized;
    return `${words.slice(0, limit).join(" ")}...`;
}

export default function Home({ idSupercategoria = null }) {
    const { session, profile, isAuthenticated, refreshCartCount } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    // Map: { [id_producto]: { id: number|null, nombre: string } | null }
    const [categoriasPorProducto, setCategoriasPorProducto] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [addingToCart, setAddingToCart] = useState(false);
    const [inventarioMap, setInventarioMap] = useState({});

    const getCategoriaIdFromUrl = () => {
        try {
            const searchId = new URLSearchParams(location.search).get('categoria');
            if (searchId != null && searchId !== '') {
                const n = Number(searchId);
                return Number.isFinite(n) ? n : null;
            }

            const match = String(location.pathname || '').match(/^\/categoria\/(\d+)(?:\/|$)/);
            if (match?.[1]) {
                const n = Number(match[1]);
                return Number.isFinite(n) ? n : null;
            }
        } catch {
            // ignore
        }
        return null;
    };

    const selectedCategoriaId = getCategoriaIdFromUrl();
    const isCategoriaFilterActive = selectedCategoriaId !== null;

    const [toast, setToast] = useState(null);
    const toastTimerRef = useRef(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => setToast(null), 2600);
    };

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        };
    }, []);

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
                            const nombre = categoria?.nombre || "";
                            const rawId = categoria?.id_categoria ?? categoria?.id ?? data?.id_categoria ?? data?.id ?? null;
                            const idCategoria = rawId == null ? null : Number(rawId);
                            return [idProducto, { id: Number.isFinite(idCategoria) ? idCategoria : null, nombre }];
                        } catch {
                            // 404 u otro error: lo dejamos vacío para no repetir request
                            return [idProducto, { id: null, nombre: "" }];
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
                console.error("Error al cargar categorías por producto en Home:", err);
            }
        };

        fetchCategoriasPorProducto();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    const categoryMetaLoading = isCategoriaFilterActive &&
        products.some((p) => {
            const id = p?.id_producto;
            return id != null && categoriasPorProducto[id] === undefined;
        });

    useEffect(() => {
        const fetchInventario = async () => {
            try {
                const data = await getInventario() 
                const map = {}

                data.forEach(item => {
                    map [item.id_producto] = item.cantidad_disponible;
                })

                setInventarioMap (map)
            } catch (error) {
                console.error("Error al obtener inventario:", error);
            }
        }


        fetchInventario();
        
    }, []);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                let productosData;

                // Si hay un idSupercategoria, usar el endpoint de supercategorías
                if (idSupercategoria) {
                    const response = await obtenerProductosPorSupercategoria(idSupercategoria, {
                        limit: 1000,
                        offset: 0,
                        estado: "activo"
                    });
                    productosData = response?.data || [];
                } else {
                    // Comportamiento normal
                    const data = await obtenerProductosRequest(session?.access_token);
                    if (data && Array.isArray(data.productos)) {
                        productosData = data.productos;
                    } else if (Array.isArray(data)) {
                        productosData = data;
                    } else {
                        console.error("Estructura de datos inesperada:", data);
                        productosData = [];
                    }
                }

                setProducts(productosData);
            } catch (err) {
                console.error("Error al cargar productos en Home:", err);
                setError("Error al cargar productos.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, [session, idSupercategoria]);

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
                            const data = await obtenerImagenesProductoRequest(id, session?.access_token);
                            console.log(`Imágenes para producto ${id}:`, data);
                            // Backend returns array of objects with url property
                            const images = Array.isArray(data) 
                                ? data.map(img => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
                                : [];
                            if (images.length > 0) {
                                urls[id] = images[0]; // Use first image for product card
                                console.log(`Imagen asignada para producto ${id}:`, images[0]);
                            } else {
                                console.log(`No se encontraron imágenes para producto ${id}`);
                            }
                        } catch (err) {
                            // Silenciar error por producto individual
                            console.error(`Error al obtener imágenes para producto ${id}:`, err);
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

    const parsePrice = (raw) => {
        if (typeof raw === 'number') {
            return Number.isFinite(raw) ? raw : null;
        }

        if (raw == null) return null;

        if (typeof raw === 'string') {
            const cleaned = raw.trim().replace(/[^0-9.,-]/g, '');
            if (!cleaned) return null;

            const lastDot = cleaned.lastIndexOf('.');
            const lastComma = cleaned.lastIndexOf(',');

            let normalized = cleaned;
            if (lastDot !== -1 && lastComma !== -1) {
                // If the last separator is a comma, assume comma decimal and dot thousands.
                if (lastComma > lastDot) {
                    normalized = cleaned.replace(/\./g, '').replace(',', '.');
                } else {
                    // Dot decimal, comma thousands
                    normalized = cleaned.replace(/,/g, '');
                }
            } else if (lastComma !== -1) {
                // Only comma present: assume decimal comma.
                normalized = cleaned.replace(',', '.');
            }

            const n = Number.parseFloat(normalized);
            return Number.isFinite(n) ? n : null;
        }

        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    };

    const hasInventory = Object.keys(inventarioMap).length > 0;

    // Calcular precios (soporta number o string formateado)
    const numericPrices = products
        .map((p) => parsePrice(p?.precio_base))
        .filter((p) => typeof p === 'number');

    // Valores por defecto si no hay productos para evitar -Infinity/Infinity
    const minPrice = numericPrices.length > 0 ? Math.min(...numericPrices) : 0;
    const maxPrice = numericPrices.length > 0 ? Math.max(...numericPrices) : 0;

    const numericQuantities = hasInventory
        ? Object.values(inventarioMap)
            .map((q) => Number(q))
            .filter((q) => Number.isFinite(q) && q >= 0)
        : [];

    const minQuantity = numericQuantities.length > 0 ? Math.min(...numericQuantities) : 0;
    const maxQuantity = numericQuantities.length > 0 ? Math.max(...numericQuantities) : 0;

    const pageSize = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPriceFilter, setMaxPriceFilter] = useState(maxPrice || 0);
    const [maxQuantityFilter, setMaxQuantityFilter] = useState(maxQuantity || 0);
    const [sortOrder, setSortOrder] = useState('asc');

    const skeletonItems = Array.from({ length: pageSize }, (_, index) => index);

    // Mantener el filtro dentro del rango real de precios.
    useEffect(() => {
        if (maxPrice <= 0) return;
        setMaxPriceFilter((prev) => {
            if (!Number.isFinite(prev) || prev <= 0) return maxPrice;
            return Math.min(prev, maxPrice);
        });
    }, [maxPrice]);

    useEffect(() => {
        if (!hasInventory || maxQuantity <= 0) return;
        setMaxQuantityFilter((prev) => {
            if (!Number.isFinite(prev) || prev <= 0) return maxQuantity;
            return Math.min(prev, maxQuantity);
        });
    }, [hasInventory, maxQuantity]);

    const filteredAndSortedProducts = products
        .filter((product) => {
            if (!isCategoriaFilterActive) return true;
            const info = categoriasPorProducto?.[product?.id_producto];
            if (info === undefined) return false;
            return Number(info?.id) === Number(selectedCategoriaId);
        })
        .filter((product) => {
            const priceValue = parsePrice(product?.precio_base);
            if (typeof priceValue !== 'number') return true;
            return priceValue <= maxPriceFilter;
        })
        .filter((product) => {
            if (!hasInventory) return true;
            const stock = Number(inventarioMap?.[product?.id_producto]);
            if (!Number.isFinite(stock)) return true;
            return stock <= maxQuantityFilter;
        })
        .sort((a, b) => {
            const priceA = parsePrice(a?.precio_base) ?? 0;
            const priceB = parsePrice(b?.precio_base) ?? 0;
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

    const handleMaxQuantityChange = (value) => {
        setMaxQuantityFilter(value);
        setCurrentPage(1);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handleAddToCart = async (product) => {
        try {
            if (addingToCart) return;

            if (!isAuthenticated || !session || !profile?.id) {
                alert("Debes iniciar sesión para agregar productos al carrito");
                navigate("/login");
                return;
            }
            setAddingToCart(true);

            const stock = inventarioMap[product.id_producto] ?? 0;
            if (stock <= 0) {
                showToast("Producto sin stock", "error");
                return;
            }

            // Si el producto ya existe en el carrito, incrementamos su cantidad.
            let cartItems = [];
            try {
                const raw = await obtenerCarrito(session.access_token, profile.id);
                const maybe = raw?.data ?? raw;
                cartItems = Array.isArray(maybe) ? maybe : (Array.isArray(maybe?.items) ? maybe.items : []);
            } catch {
                cartItems = [];
            }

            const existing = cartItems.find((it) => Number(it?.id_producto) === Number(product.id_producto));

            if (existing?.id) {
                const currentQty = Math.max(1, Number(existing?.cantidad ?? 1) || 1);
                const nextQty = currentQty + 1;

                if (nextQty > stock) {
                    showToast("No hay suficiente stock", "error");
                    return;
                }

                await actualizarCantidad(session.access_token, profile.id, existing.id, nextQty);
                showToast("Cantidad actualizada", "success");
            } else {
                const payload = {
                    id_producto: product.id_producto,
                    cantidad: 1,
                }

                await agregarAlCarrito(
                    session.access_token,
                    profile.id,
                    payload
                );

                showToast("Añadido al carrito", "success");
            }

            console.log("Producto añadido al carrito con éxito");

            await refreshCartCount();

        } catch (error) {
            console.error("Error al añadir al carrito", error)
            showToast("No se pudo añadir al carrito", "error");
        } finally {
            setAddingToCart(false);
        }
    };


    return (
        <div className="home-background">
            <HomeLeftPanel
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentMaxPrice={maxPriceFilter}
                onMaxPriceChange={handleMaxPriceChange}
                minQuantity={minQuantity}
                maxQuantity={maxQuantity}
                currentMaxQuantity={maxQuantityFilter}
                onMaxQuantityChange={handleMaxQuantityChange}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
            />

            <div className="home-products">
                {loading ? (
                    skeletonItems.map((index) => (
                        <div
                            className="product-card product-card--skeleton"
                            key={`skeleton-${index}`}
                            aria-hidden="true"
                        >
                            <div className="product-image skeleton-block" />
                            <div className="skeleton-line skeleton-line--title" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line skeleton-line--short" />
                            <div className="skeleton-line skeleton-line--medium" />
                            <div className="skeleton-line skeleton-line--price" />
                            <div className="skeleton-button skeleton-button--full" />
                            <div className="skeleton-actions-row">
                                <div className="skeleton-button" />
                                <div className="skeleton-button" />
                            </div>
                        </div>
                    ))
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center', width: '100%' }}>{error}</p>
                ) : categoryMetaLoading ? (
                    skeletonItems.map((index) => (
                        <div
                            className="product-card product-card--skeleton"
                            key={`skeleton-category-${index}`}
                            aria-hidden="true"
                        >
                            <div className="product-image skeleton-block" />
                            <div className="skeleton-line skeleton-line--title" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line skeleton-line--short" />
                            <div className="skeleton-line skeleton-line--medium" />
                            <div className="skeleton-line skeleton-line--price" />
                            <div className="skeleton-button skeleton-button--full" />
                            <div className="skeleton-actions-row">
                                <div className="skeleton-button" />
                                <div className="skeleton-button" />
                            </div>
                        </div>
                    ))
                ) : currentProducts.length === 0 ? (
                    <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>No se encontraron productos.</p>
                ) : (
                    currentProducts.map((product) => {

                        const stock = inventarioMap[product.id_producto] ?? 0;
                        const sinStock = stock <= 0;

                        const servicioImageUrl = product.id_producto
                            ? imageUrls[product.id_producto]
                            : null;

                        return (
                            <div className="product-card" key={product.id_producto}>
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
                                {categoriasPorProducto[product.id_producto]?.nombre && (
                                    <p style={{ marginTop: "-6px", marginBottom: "10px", color: "#6b7280" }}>
                                        {categoriasPorProducto[product.id_producto].nombre}
                                    </p>
                                )}
                                <p>{truncateWords(product.descripcion)}</p>
                                <p>
                                    Cantidad disponible: {" "}
                                    <strong style = {{color: sinStock ? "red" : "green"}}>{stock}</strong>
                                </p>

                                <p>Precio: ${typeof product.precio_base === 'number' ? product.precio_base.toFixed(2) : product.precio_base}</p>
                                <button className="details-button" onClick={() => navigate(`/product-details/${product.id_producto}`)}>Ver más detalles</button>
                                <div className="product-actions-row">
                                    <button className="buy-button">Comprar</button>
                                    <button
                                        className="cart-button"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={addingToCart || sinStock}
                                        title={sinStock ? "Sin stock" : "Añadir al carrito"}
                                    >
                                        Añadir al carrito
                                    </button>

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

            {isAuthenticated && (
                <ChatList />
            )}

            {toast && (
                <div
                    className={`home-toast home-toast--${toast.type}`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="home-toast__icon" aria-hidden="true">
                        {toast.type === 'success' ? '✓' : '⚠'}
                    </span>
                    <span className="home-toast__text">{toast.message}</span>
                </div>
            )}
        </div>
    );
}