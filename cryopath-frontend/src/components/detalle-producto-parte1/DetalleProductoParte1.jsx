import './DetalleProductoParte1.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorIdRequest, obtenerProductosRequest, obtenerImagenProductoRequest } from '../../services/productosApi';
import { obtenerCategoriaDeProducto } from '../../services/categoriasApi';
import { useAuth } from '../../context/AuthContext';

export default function DetalleProductoParte1() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session, user } = useAuth();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoria, setCategoria] = useState('No data');

    const authToken = session?.access_token ?? user?.token ?? '';

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                // Intentar obtener producto individual primero
                let productoData;
                try {
                    productoData = await obtenerProductoPorIdRequest(id, authToken);
                } catch (err) {
                    // Si falla, obtener todos y filtrar
                    const data = await obtenerProductosRequest(authToken);
                    const productos = data?.productos || data || [];
                    productoData = productos.find(
                        p => (p.id_producto || p.id) === parseInt(id)
                    );
                }
                
                if (productoData) {
                    setProducto(productoData);
                    
                    // Obtener imagen del producto
                    try {
                        const imgData = await obtenerImagenProductoRequest(productoData.id_producto || productoData.id, authToken);
                        if (imgData?.url) {
                            setImageUrl(imgData.url);
                        }
                    } catch (imgErr) {
                        console.error('Error al obtener imagen:', imgErr);
                    }
                    
                    // Obtener categoría del producto
                    try {
                        const catData = await obtenerCategoriaDeProducto(productoData.id_producto || productoData.id);
                        if (catData?.categoria?.nombre) {
                            setCategoria(catData.categoria.nombre);
                        }
                    } catch (catErr) {
                        console.error('Error al obtener categoría:', catErr);
                    }
                } else {
                    setError('Producto no encontrado');
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

    const handleAddToCart = () => {
        console.log('Agregar al carrito:', producto);
        // Implementar lógica del carrito
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
                                <strong>Stock disponible:</strong> {producto.stock || 0} unidades
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
                            disabled={producto.stock === 0}
                        >
                            Comprar Ahora
                        </button>
                        <button 
                            className="btn-add-cart" 
                            onClick={handleAddToCart}
                            disabled={producto.stock === 0}
                        >
                            Agregar al Carrito
                        </button>
                        {producto.stock === 0 && (
                            <p className="out-of-stock-message">Producto agotado</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}