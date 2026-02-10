import './Vender.css';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import VenderSidebar from '../../components/vendedor-producto/VenderSidebar';
import VenderDashboard from '../../components/vendedor-producto/VenderDashboard';
import VendedorProducto from '../../components/vendedor-producto/VendedorProducto';
import VendedorDescuento from '../../components/vendedor-descuento/VendedorDescuento';
import VendedorAgregarProducto from '../../components/vendedor-producto/VendedorAgregarProducto';
import { obtenerPromocionesConCategorias, obtenerPromocionesConProductos } from '../../services/promocionesApi';

const Vender = () => {
  const { profile, user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [promociones, setPromociones] = useState([]);
  const [promocionesProductos, setPromocionesProductos] = useState([]);
  const [promocionesLoading, setPromocionesLoading] = useState(false);
  const [promocionesError, setPromocionesError] = useState('');

  const fullName = useMemo(() => {
    if (profile?.nombre ) return `${profile.nombre}`;
    return user?.email?.split('@')?.[0] || 'Usuario';
  }, [profile?.nombre, user?.email]);

  useEffect(() => {
    let isMounted = true;
    const cargarPromociones = async () => {
      setPromocionesLoading(true);
      setPromocionesError('');
      try {
        const [responseCategorias, responseProductos] = await Promise.all([
          obtenerPromocionesConCategorias(),
          obtenerPromocionesConProductos()
        ]);
        if (!isMounted) return;
        setPromociones(responseCategorias?.promociones || []);
        setPromocionesProductos(responseProductos?.promociones || []);
      } catch (error) {
        if (!isMounted) return;
        setPromocionesError(error?.message || 'No se pudieron cargar las promociones.');
      } finally {
        if (!isMounted) return;
        setPromocionesLoading(false);
      }
    };

    cargarPromociones();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const parsed = new Date(fecha);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const promocionesConCategorias = useMemo(
    () => promociones.filter((promocion) => (promocion.categorias || []).length > 0),
    [promociones]
  );

  const promocionesConProductos = useMemo(
    () => promocionesProductos.filter((promocion) => (promocion.productos || []).length > 0),
    [promocionesProductos]
  );

  return (
    <div className="vender-page">
      <main className="vender-shell">
        <VenderSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <section className="vender-content" aria-label="Contenido principal">
          <header className="vender-top">
            <h1 className="vender-top__title">Bienvenido, {fullName}</h1>
          </header>

          {activeSection === 'dashboard' && <VenderDashboard />}

          {activeSection === 'productos' && (
            <div className="vender-promociones">
              <VendedorProducto onNavigate={setActiveSection} />

              <div className="vender-card">
                <div className="vender-card__header">
                  <h2 className="vender-card__title">Categorías con promociones</h2>
                </div>

                {promocionesLoading && (
                  <div className="vender-card__state">Cargando promociones...</div>
                )}

                {!promocionesLoading && promocionesError && (
                  <div className="vender-card__state vender-card__state--error">{promocionesError}</div>
                )}

                {!promocionesLoading && !promocionesError && promocionesConCategorias.length === 0 && (
                  <div className="vender-card__state">No hay categorías con promociones.</div>
                )}

                {!promocionesLoading && !promocionesError && promocionesConCategorias.length > 0 && (
                  <div className="vender-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Valor</th>
                          <th>Inicio</th>
                          <th>Fin</th>
                          <th>Activa</th>
                          <th>Prioridad</th>
                          <th>Combinable</th>
                          <th>Categorías</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promocionesConCategorias.map((promocion) => (
                          <tr key={promocion.id_promocion}>
                            <td>{promocion.nombre}</td>
                            <td>{promocion.descripcion || '-'}</td>
                            <td>{promocion.tipo_descuento}</td>
                            <td>{Number(promocion.valor_descuento).toFixed(2)}</td>
                            <td>{formatearFecha(promocion.fecha_inicio)}</td>
                            <td>{formatearFecha(promocion.fecha_fin)}</td>
                            <td>{promocion.activa ? 'Sí' : 'No'}</td>
                            <td>{promocion.prioridad}</td>
                            <td>{promocion.combinable ? 'Sí' : 'No'}</td>
                            <td>
                              {(promocion.categorias || []).length > 0
                                ? promocion.categorias.map((categoria) => categoria?.nombre).filter(Boolean).join(', ')
                                : 'Sin categorías'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="vender-card">
                <div className="vender-card__header">
                  <h2 className="vender-card__title">Productos con promociones</h2>
                </div>

                {promocionesLoading && (
                  <div className="vender-card__state">Cargando promociones...</div>
                )}

                {!promocionesLoading && promocionesError && (
                  <div className="vender-card__state vender-card__state--error">{promocionesError}</div>
                )}

                {!promocionesLoading && !promocionesError && promocionesConProductos.length === 0 && (
                  <div className="vender-card__state">No hay productos con promociones.</div>
                )}

                {!promocionesLoading && !promocionesError && promocionesConProductos.length > 0 && (
                  <div className="vender-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Valor</th>
                          <th>Inicio</th>
                          <th>Fin</th>
                          <th>Activa</th>
                          <th>Prioridad</th>
                          <th>Combinable</th>
                          <th>Productos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promocionesConProductos.map((promocion) => (
                          <tr key={promocion.id_promocion}>
                            <td>{promocion.nombre}</td>
                            <td>{promocion.descripcion || '-'}</td>
                            <td>{promocion.tipo_descuento}</td>
                            <td>{Number(promocion.valor_descuento).toFixed(2)}</td>
                            <td>{formatearFecha(promocion.fecha_inicio)}</td>
                            <td>{formatearFecha(promocion.fecha_fin)}</td>
                            <td>{promocion.activa ? 'Sí' : 'No'}</td>
                            <td>{promocion.prioridad}</td>
                            <td>{promocion.combinable ? 'Sí' : 'No'}</td>
                            <td>
                              {(promocion.productos || []).length > 0
                                ? promocion.productos
                                    .map((producto) => producto?.nombre)
                                    .filter(Boolean)
                                    .join(', ')
                                : 'Sin productos'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'nuevo-producto' && (
            <VendedorAgregarProducto onNavigate={setActiveSection} />
          )}

          {activeSection === 'descuentos' && <VendedorDescuento onNavigate={setActiveSection} />}

          {activeSection === 'pedidos' && (
            <div className="vender-placeholder">Vista pendiente.</div>
          )}

          {activeSection === 'clientes' && (
            <div className="vender-placeholder">Vista pendiente.</div>
          )}

          {activeSection === 'analiticas' && (
            <div className="vender-placeholder">Vista pendiente.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Vender;