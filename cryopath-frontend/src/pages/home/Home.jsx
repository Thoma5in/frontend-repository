import './Home.css';
import Pagination from '../../components/Pagination';
import HomeLeftPanel from '../../components/HomeLeftPanel';
import { useState, useEffect } from "react";
import { obtenerProductosRequest } from "../../services/productosApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
    const { profile, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = profile?.id || user?.id || "";

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await obtenerProductosRequest(user?.token);
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
    }, [user]);

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
                    currentProducts.map((product) => (
                        <div className="product-card" key={product.id_producto || Math.random()}>
                            <div className="product-image">
                                <img
                                    src={product.imagen_url || "https://placehold.co/300x200?text=No+Image"}
                                    alt={product.nombre}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200?text=Sin+Imagen"; }}
                                />
                            </div>
                            <h2>{product.nombre}</h2>
                            <p>{product.descripcion}</p>
                            <p>Precio: ${typeof product.precio_base === 'number' ? product.precio_base.toFixed(2) : product.precio_base}</p>
                            <button className="details-button">Ver más detalles</button>
                            <button className="buy-button">Comprar</button>
                            <button className="cart-button">Añadir al carrito</button>
                        </div>
                    ))
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