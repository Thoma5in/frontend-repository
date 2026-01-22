import './DetalleProductoParte1.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorIdRequest, obtenerProductosRequest, obtenerImagenProductoRequest } from '../../services/productosApi';
import { getInventarioByProducto } from '../../services/inventarioApi';
import { obtenerCategoriaDeProducto } from '../../services/categoriasApi';
import { useAuth } from '../../context/AuthContext';
import { agregarAlCarrito, actualizarCantidad, obtenerCarrito } from '../../services/cartApi';

export default function DetalleProductoParte1() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session, user, isAuthenticated, profile, refreshCartCount } = useAuth();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoria, setCategoria] = useState('No data');
    const [inventarioCantidad, setInventarioCantidad] = useState(null);

    const authToken = session?.access_token ?? user?.token ?? '';

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const productId = Number(id);
                let productoData = null;

                // Intentar resolver desde la lista para evitar 404 del endpoint individual
                try {
                    const data = await obtenerProductosRequest(authToken);
                    const productos = data?.productos;
                    productoData = productos.find(
                        (p) => Number(p.id_producto ) === productId
                    );
                } catch (listErr) {
                    console.error('Error al obtener la lista de productos:', listErr);
                }

                // Si no se encontró en la lista, intentar el endpoint por ID
                if (!productoData) {
                    try {
                        productoData = await obtenerProductoPorIdRequest(id, authToken);
                    } catch (err) {
                        console.error('Error al obtener producto por ID:', err);
                    }
                }

                if (!productoData) {
                    setError('Producto no encontrado');
                    return;
                }

                setProducto(productoData);

                // Obtener imagen del producto
                try {
                    const imgData = await obtenerImagenProductoRequest(productoData.id_producto, authToken);
                    if (imgData?.url) {
                        setImageUrl(imgData.url);
                    }
                } catch (imgErr) {
                    console.error('Error al obtener imagen:', imgErr);
                }

                // Obtener inventario del producto
                try {
                    const invData = await getInventarioByProducto(productoData.id_producto);
                    const cantidad =
                        typeof invData?.cantidad_disponible === 'number'
                            ? invData.cantidad_disponible
                            : typeof invData?.inventario?.cantidad_disponible === 'number'
                                ? invData.inventario.cantidad_disponible
                                : 0;
                    setInventarioCantidad(cantidad);
                } catch (invErr) {
                    console.error('Error al obtener inventario:', invErr);
                    setInventarioCantidad(null);
                }

                // Obtener categoría del producto
                try {
                    const catData = await obtenerCategoriaDeProducto(productoData.id_producto);
                    if (catData?.categoria?.nombre) {
                        setCategoria(catData.categoria.nombre);
                    }
                } catch (catErr) {
                    console.error('Error al obtener categoría:', catErr);
                }
            } catch (err) {
                console.error('Error al cargar producto:', err);
                setError('Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchProducto();
        }
    }, [id, authToken]);

    const [addingToCart, setAddingToCart] = useState(false);
    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 2500);
    };

    const handleAddToCart = async () => {
        try {
            if (addingToCart) return;

            if (!isAuthenticated || !session || !profile?.id) {
                alert('Debes iniciar sesión para agregar productos al carrito');
                navigate('/login');
                return;
            }

            setAddingToCart(true);

            const stock = typeof inventarioCantidad === 'number' ? inventarioCantidad : (producto?.stock ?? 0);
            if (stock <= 0) {
                showToast('Producto sin stock', 'error');
                return;
            }

            // Obtener carrito actual
            let cartItems = [];
            try {
                const raw = await obtenerCarrito(session.access_token, profile.id);
                const maybe = raw?.data ?? raw;
                cartItems = Array.isArray(maybe) ? maybe : (Array.isArray(maybe?.items) ? maybe.items : []);
            } catch {
                cartItems = [];
            }

            const productId = producto.id_producto;
            const existing = cartItems.find((it) => Number(it?.id_producto) === Number(productId));

            if (existing?.id) {
                const currentQty = Math.max(1, Number(existing?.cantidad ?? 1) || 1);
                const nextQty = currentQty + 1;

                if (nextQty > stock) {
                    showToast('No hay suficiente stock', 'error');
                    return;
                }

                await actualizarCantidad(session.access_token, profile.id, existing.id, nextQty);
                showToast('Cantidad actualizada', 'success');
            } else {
                const payload = {
                    id_producto: productId,
                    cantidad: 1,
                };
                await agregarAlCarrito(session.access_token, profile.id, payload);
                showToast('Añadido al carrito', 'success');
            }

            await refreshCartCount();
        } catch (error) {
            console.error('Error al añadir al carrito', error);
            showToast('No se pudo añadir al carrito', 'error');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        console.log('Comprar ahora:', producto);
        // Implementar lógica de compra
    };

    if (loading) {
        return <div className="product-detail-loading">Cargando producto...</div>;
    }

    if (error || !producto) {
        return (
            <div className="product-detail-error">
                <p>{error || 'Producto no encontrado'}</p>
                <button onClick={() => navigate('/')}>Volver al inicio</button>
            </div>
        );
    }

    // Preparar imágenes (usar placeholder si no hay)
    const imagenes = imageUrl ? [imageUrl] : ['/img/placeholder-product.jpg'];

    // Calcular precio con descuento
    const precioBase = producto.precio_base || 0;
    const descuento = producto.descuento || 0;
    const precioConDescuento = precioBase * (1 - descuento / 100);

    // Calcular calificación promedio (usar datos reales o valores por defecto)
    const calificacion = producto.calificacion_promedio || producto.rating || 0;
    const totalReviews = producto.total_reviews || producto.reviews_count || 0;

    // Stock desde inventario (fallback al campo del producto si falta)
    const stockDisponible =
        typeof inventarioCantidad === 'number' && inventarioCantidad >= 0
            ? inventarioCantidad
            : typeof producto.stock === 'number'
                ? producto.stock
                : 0;

    return (
        <div className="product-detail-container">
            <div className="product-detail-content">
                {/* Sección de imágenes */}
                <div className="product-images-section">
                    <div className="product-main-image">
                        <img 
                            src={imagenes[selectedImage]} 
                            alt={producto.nombre}
                            onError={(e) => {
                                e.target.src = '/img/placeholder-product.jpg';
                            }}
                        />
                    </div>
                    <div className="product-thumbnails">
                        {imagenes.map((img, index) => (
                            <div 
                                key={index}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img 
                                    src={img} 
                                    alt={`${producto.nombre} ${index + 1}`}
                                    onError={(e) => {
                                        e.target.src = '/img/placeholder-product.jpg';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de información del producto */}
                <div className="product-info-section">
                    <h1 className="product-title">{producto.nombre}</h1>
                    
                    {/* Calificación */}
                    <div className="product-rating">
                        <span className="rating-value">{calificacion.toFixed(1)}</span>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= Math.round(calificacion) ? 'star filled' : 'star'}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="rating-count">({totalReviews} reseñas)</span>
                    </div>

                    {/* Precio */}
                    <div className="product-pricing">
                        {descuento > 0 && (
                            <span className="price-original">$ {precioBase.toLocaleString('es-CL')}</span>
                        )}
                        <div className="price-current-container">
                            <span className="price-current">$ {precioConDescuento.toLocaleString('es-CL')}</span>
                            {descuento > 0 && (
                                <span className="price-discount">{descuento}% OFF</span>
                            )}
                        </div>
                        <a href="#" className="payment-methods-link">Ver medios de pago</a>
                    </div>

                    {/* Detalles del producto */}
                    <div className="product-details">
                        <h3>Detalles del producto</h3>
                        <ul className="details-list">
                            <li>
                                <strong>Categoría:</strong> {categoria}
                            </li>
                            <li>
                                <strong>Stock disponible:</strong> {stockDisponible} {stockDisponible === 1 ? 'unidad' : 'unidades'}
                            </li>
                            <li>
                                <strong>Estado:</strong> {producto.estado_producto || producto.estado || 'No data'}
                            </li>
                            <li>
                                <strong>Descripción:</strong> {producto.descripcion || 'No data'}
                            </li>
                            {producto.caracteristicas && (
                                <li>
                                    <strong>Características:</strong> {producto.caracteristicas}
                                </li>
                            )}
                            {producto.marca && (
                                <li>
                                    <strong>Marca:</strong> {producto.marca}
                                </li>
                            )}
                            {producto.modelo && (
                                <li>
                                    <strong>Modelo:</strong> {producto.modelo}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Información del vendedor */}
                    <div className="seller-info">
                        <h3>Vendido por <span className="seller-name">{producto.vendedor_nombre || producto.seller_name || 'LUISORTIZ'}</span></h3>
                        <div className="seller-details">
                            <p>↶ Devolución gratis antes de 30 días.</p>
                            <p>◈ Si recibes otro producto diferente te devolvemos tu dinero.</p>
                            <p>⌚ {producto.garantia_meses || producto.warranty_months || 12} meses de garantía</p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="product-actions">
                        <div className="shipping-info">
                            <span className="shipping-free">Llega gratis</span> 
                            <span className="shipping-day">el viernes</span>
                            <a href="#" className="shipping-details-link">Más detalles y formas de entrega</a>
                        </div>
                        <button 
                            className="btn-buy-now" 
                            onClick={handleBuyNow}
                            disabled={stockDisponible === 0}
                        >
                            Comprar Ahora
                        </button>
                        <button 
                            className="btn-add-cart" 
                            onClick={handleAddToCart}
                            disabled={stockDisponible === 0 || addingToCart}
                        >
                            Agregar al Carrito
                        </button>
                        {stockDisponible === 0 && (
                            <p className="out-of-stock-message">Producto agotado</p>
                        )}
                        {toast && (
                            <p style={{ textAlign: 'center', color: toast.type === 'error' ? '#d32f2f' : '#2e7d32', margin: 0 }}>
                                {toast.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}