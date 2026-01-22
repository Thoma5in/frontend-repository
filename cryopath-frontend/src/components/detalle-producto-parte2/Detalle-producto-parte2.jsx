import './detalle-producto-parte2.css';

const DetalleProductoParte2 = ({ productos = [] }) => {
    return (
        <div className="productos-relacionados-container">
            <div className="productos-relacionados-header">
                <h2 className="productos-relacionados-title">Productos Relacionados</h2>
            </div>

            <div className="productos-relacionados-wrapper">
                <div className="productos-relacionados-grid">
                    {productos.map((producto, index) => (
                        <div key={index} className="producto-card">
                            <div className="producto-card-inner">
                                <div className="producto-image-container">
                                    <div className="producto-badge">{producto.marca || 'Marca'}</div>
                                    <div className="producto-image-placeholder">
                                        {/* Placeholder para imagen del producto */}
                                        <div className="image-placeholder-content">
                                            <svg className="image-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="producto-info">
                                    <h3 className="producto-nombre">{producto.nombre}</h3>
                                    <div className="producto-precios">
                                        <span className="precio-original">${producto.precioOriginal?.toLocaleString('es-CL')}</span>
                                        <span className="precio-actual">${producto.precioActual?.toLocaleString('es-CL')}</span>
                                        {producto.descuento && (
                                            <span className="descuento-badge">{producto.descuento}% OFF</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="nav-button nav-button-next" aria-label="Siguiente">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DetalleProductoParte2;
