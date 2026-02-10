import './Vender.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import VenderSidebar from '../../components/vendedor-producto/VenderSidebar';
import VenderDashboard from '../../components/vendedor-producto/VenderDashboard';
import VendedorProducto from '../../components/vendedor-producto/VendedorProducto';
import VendedorDescuento from '../../components/vendedor-descuento/VendedorDescuento';
import VendedorAgregarProducto from '../../components/vendedor-producto/VendedorAgregarProducto';
import { obtenerPromocionesConCategorias, obtenerPromocionesConProductos } from '../../services/promocionesApi';
import { formatDateEs, formatDiscountValue } from '../../utils/formatters';

const PromocionesCard = ({
  title,
  caption,
  headers,
  rows,
  loading,
  error,
  emptyText,
  renderRow
}) => (
  <div className="vender-card">
    <div className="vender-card__header">
      <h2 className="vender-card__title">{title}</h2>
    </div>

    {loading && <div className="vender-card__state">Cargando promociones...</div>}

    {!loading && error && (
      <div className="vender-card__state vender-card__state--error">{error}</div>
    )}

    {!loading && !error && rows.length === 0 && (
      <div className="vender-card__state">{emptyText}</div>
    )}

    {!loading && !error && rows.length > 0 && (
      <div className="vender-table">
        <table>
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows.map(renderRow)}</tbody>
        </table>
      </div>
    )}
  </div>
);

const Vender = () => {
  const { profile, user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [promociones, setPromociones] = useState([]);
  const [promocionesProductos, setPromocionesProductos] = useState([]);
  const [promocionesLoading, setPromocionesLoading] = useState(false);
  const [promocionesError, setPromocionesError] = useState('');

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
  }, []);

  const fullName = useMemo(() => {
    if (profile?.nombre ) return `${profile.nombre}`;
    return user?.email?.split('@')?.[0] || 'Usuario';
  }, [profile?.nombre, user?.email]);

  useEffect(() => {
    const controller = new AbortController();
    const cargarPromociones = async () => {
      setPromocionesLoading(true);
      setPromocionesError('');
      try {
        const [responseCategorias, responseProductos] = await Promise.all([
          obtenerPromocionesConCategorias({ signal: controller.signal }),
          obtenerPromocionesConProductos({ signal: controller.signal })
        ]);
        if (controller.signal.aborted) return;
        setPromociones(responseCategorias?.promociones || []);
        setPromocionesProductos(responseProductos?.promociones || []);
      } catch (error) {
        if (controller.signal.aborted) return;
        setPromocionesError(error?.message || 'No se pudieron cargar las promociones.');
      } finally {
        if (controller.signal.aborted) return;
        setPromocionesLoading(false);
      }
    };

    cargarPromociones();
    return () => {
      controller.abort();
    };
  }, []);

  const promocionesConCategorias = useMemo(
    () => promociones.filter((promocion) => (promocion.categorias || []).length > 0),
    [promociones]
  );

  const promocionesConProductos = useMemo(
    () => promocionesProductos.filter((promocion) => (promocion.productos || []).length > 0),
    [promocionesProductos]
  );

  const categoriasHeaders = [
    'Nombre',
    'Descripción',
    'Tipo',
    'Valor',
    'Inicio',
    'Fin',
    'Activa',
    'Prioridad',
    'Combinable',
    'Categorías'
  ];

  const productosHeaders = [
    'Nombre',
    'Descripción',
    'Tipo',
    'Valor',
    'Inicio',
    'Fin',
    'Activa',
    'Prioridad',
    'Combinable',
    'Productos'
  ];

  return (
    <div className="vender-page">
      <main className="vender-shell">
        <VenderSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

        <section className="vender-content" aria-label="Contenido principal">
          <header className="vender-top">
            <h1 className="vender-top__title">Bienvenido, {fullName}</h1>
          </header>

          {activeSection === 'dashboard' && <VenderDashboard />}

          {activeSection === 'productos' && (
            <div className="vender-promociones">
              <VendedorProducto onNavigate={handleSectionChange} />

              <PromocionesCard
                title="Categorías con promociones"
                caption="Tabla de categorías con promociones"
                headers={categoriasHeaders}
                rows={promocionesConCategorias}
                loading={promocionesLoading}
                error={promocionesError}
                emptyText="No hay categorías con promociones."
                renderRow={(promocion, index) => (
                  <tr
                    key={
                      promocion.id_promocion ??
                      `${promocion.nombre ?? 'promocion'}-${promocion.fecha_inicio ?? 'na'}-${index}`
                    }
                  >
                    <td>{promocion.nombre}</td>
                    <td>{promocion.descripcion || '-'}</td>
                    <td>{promocion.tipo_descuento}</td>
                    <td>{formatDiscountValue(promocion.tipo_descuento, promocion.valor_descuento)}</td>
                    <td>{formatDateEs(promocion.fecha_inicio)}</td>
                    <td>{formatDateEs(promocion.fecha_fin)}</td>
                    <td>{promocion.activa ? 'Sí' : 'No'}</td>
                    <td>{promocion.prioridad}</td>
                    <td>{promocion.combinable ? 'Sí' : 'No'}</td>
                    <td>
                      {(promocion.categorias || []).length > 0
                        ? promocion.categorias.map((categoria) => categoria?.nombre).filter(Boolean).join(', ')
                        : 'Sin categorías'}
                    </td>
                  </tr>
                )}
              />

              <PromocionesCard
                title="Productos con promociones"
                caption="Tabla de productos con promociones"
                headers={productosHeaders}
                rows={promocionesConProductos}
                loading={promocionesLoading}
                error={promocionesError}
                emptyText="No hay productos con promociones."
                renderRow={(promocion, index) => (
                  <tr
                    key={
                      promocion.id_promocion ??
                      `${promocion.nombre ?? 'promocion'}-${promocion.fecha_inicio ?? 'na'}-${index}`
                    }
                  >
                    <td>{promocion.nombre}</td>
                    <td>{promocion.descripcion || '-'}</td>
                    <td>{promocion.tipo_descuento}</td>
                    <td>{formatDiscountValue(promocion.tipo_descuento, promocion.valor_descuento)}</td>
                    <td>{formatDateEs(promocion.fecha_inicio)}</td>
                    <td>{formatDateEs(promocion.fecha_fin)}</td>
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
                )}
              />
            </div>
          )}

          {activeSection === 'nuevo-producto' && (
            <VendedorAgregarProducto onNavigate={handleSectionChange} />
          )}

          {activeSection === 'descuentos' && <VendedorDescuento onNavigate={handleSectionChange} />}

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
