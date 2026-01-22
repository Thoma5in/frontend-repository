import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerProductoPorIdRequest, obtenerProductosRequest } from '../../services/productosApi';
import './DetalleProductoParte3.css';

const FALLBACK_DESCRIPTION = 'Descripción no disponible para este producto.';

export default function DetalleProductoParte3() {
    const { id } = useParams();
    const { session, user } = useAuth();
    const authToken = session?.access_token ?? user?.token ?? '';

    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDescripcion = async () => {
            try {
                const productId = Number(id);
                let productoData = null;

                // Intentar primero con la lista (evita errores 404 puntuales)
                try {
                    const data = await obtenerProductosRequest(authToken);
                    const productos = data?.productos || data || [];
                    productoData = productos.find((p) => Number(p.id_producto || p.id) === productId) || null;
                } catch (listErr) {
                    console.error('Error al obtener lista de productos para descripción:', listErr);
                }

                // Si no se encontró en la lista, intentar el endpoint individual
                if (!productoData) {
                    try {
                        productoData = await obtenerProductoPorIdRequest(id, authToken);
                    } catch (err) {
                        console.error('Error al obtener producto por ID para descripción:', err);
                    }
                }

                const texto = productoData?.descripcion?.trim();
                setDescripcion(texto || FALLBACK_DESCRIPTION);
            } catch (error) {
                console.error('Error al cargar descripción del producto:', error);
                setDescripcion(FALLBACK_DESCRIPTION);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDescripcion();
        }
    }, [id, authToken]);

    return (
        <section className="dp3" aria-labelledby="dp3-title">
            <h2 id="dp3-title" className="dp3__title">Descripción</h2>
            {loading ? (
                <p className="dp3__loading">Cargando descripción...</p>
            ) : (
                <p className="dp3__text">{descripcion}</p>
            )}
        </section>
    );
}
