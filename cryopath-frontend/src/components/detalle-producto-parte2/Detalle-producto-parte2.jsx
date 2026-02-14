import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './detalle-producto-parte2.css';
import { agregarAlCarrito } from '../../services/cartApi';
import { useAuth } from '../../context/AuthContext';

const DetalleProductoParte2 = ({ productos = [], loading = false }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [agregando, setAgregando] = useState(null); // id del producto que se está agregando
    const navigate = useNavigate();
    const { session, profile, refreshCartCount } = useAuth();

    const token = session?.access_token;
    const userId = profile?.id;

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        // Verificar scroll inicial después de que el componente se monte o cambien productos
        const timer = setTimeout(() => {
            checkScroll();
        }, 100);

        window.addEventListener('resize', checkScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScroll);
        };
    }, [productos]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const cardWidth = 280;
            const gap = 24;
            const scrollAmount = (cardWidth * 3) + (gap * 2);

            const container = scrollContainerRef.current;

            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            setTimeout(() => {
                checkScroll();
            }, 300);
        }
    };

    const handleProductoClick = (idProducto) => {
        if (idProducto) {
            navigate(`/producto/${idProducto}`);
        }
    };

    const handleAgregarCarrito = async (e, producto) => {
        e.stopPropagation(); // Evitar que el click navegue al detalle
        
        if (!token || !userId) {
            navigate('/login');
            return;
        }

        try {
            setAgregando(producto.id);
            await agregarAlCarrito(token, userId, {
                id_producto: producto.id,
                cantidad: 1
            });
            await refreshCartCount();
            alert('Producto agregado al carrito');
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert(error.message || 'Error al agregar al carrito');
        } finally {
            setAgregando(null);
        }
    };

    return (
        <div className="productos-relacionados-container">
            <div className="productos-relacionados-header">
                <h2 className="productos-relacionados-title">Productos relacionados</h2>
            </div>

            <div className="productos-relacionados-wrapper">
                {canScrollLeft && (
                    <button
                        className="nav-button nav-button-prev"
                        onClick={() => scroll('left')}
                        aria-label="Anterior"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

                <div
                    className="productos-relacionados-grid"
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                >
                    {loading && productos.length === 0 && (
                        <div className="productos-relacionados-loading">Cargando recomendados...</div>
                    )}

                    {!loading && productos.length === 0 && (
                        <div className="productos-relacionados-empty">No hay productos relacionados</div>
                    )}

                    {productos.map((producto, index) => (
                        <div key={index} className="producto-card" onClick={() => handleProductoClick(producto.id)}>
                            <div className="producto-card-inner">
                                <div className="producto-image-container">
                                    <div className="producto-badge">{producto.marca || 'Marca'}</div>
                                    {producto.imagen ? (
                                        <img className="producto-image" src={producto.imagen} alt={producto.nombre} />
                                    ) : (
                                        <div className="producto-image-placeholder">
                                            <div className="image-placeholder-content">
                                                <svg className="image-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="producto-info">
                                    <h3 className="producto-nombre">{producto.nombre}</h3>
                                    <div className="producto-precios">
                                        {producto.precioOriginal != null && (
                                            <span className="precio-original">${producto.precioOriginal?.toLocaleString('es-CL')}</span>
                                        )}
                                        {producto.precioActual != null && (
                                            <span className="precio-actual">${producto.precioActual?.toLocaleString('es-CL')}</span>
                                        )}
                                        {producto.descuento && (
                                            <span className="descuento-badge">{producto.descuento}% OFF</span>
                                        )}
                                    </div>
                                    <button 
                                        className="agregar-carrito-button" 
                                        onClick={(e) => handleAgregarCarrito(e, producto)}
                                        disabled={agregando === producto.id}
                                    >
                                        {agregando === producto.id ? 'Agregando...' : 'Agregar al carrito'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {canScrollRight && (
                    <button
                        className="nav-button nav-button-next"
                        onClick={() => scroll('right')}
                        aria-label="Siguiente"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default DetalleProductoParte2;

