import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listarTodosPedidosRequest } from '../../services/pedidosApi';
import './VenderDashboard.css';

const VenderDashboard = () => {
  const { session } = useAuth();
  const token = session?.access_token;
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const cargarPedidos = async () => {
      setLoadingOrders(true);
      setOrdersError('');

      try {
        const response = await listarTodosPedidosRequest({ limit: 10, offset: 0 }, token);
        if (!isMounted) return;

        const pedidos = Array.isArray(response?.data) ? response.data : [];
        const mappedOrders = pedidos.map((pedido) => {
          const items = Array.isArray(pedido?.pedido_detalle) ? pedido.pedido_detalle : [];
          const totalProductos = items.reduce(
            (acc, item) => acc + Number(item?.cantidad || 0),
            0
          );

          return {
            id: pedido?.id_pedido,
            cliente: pedido?.id_usuario || 'N/A',
            productos: totalProductos,
            total: pedido?.total ?? 0,
            estado: pedido?.estado || 'PENDIENTE',
          };
        });

        setRecentOrders(mappedOrders);
      } catch (error) {
        if (!isMounted) return;
        setOrdersError(error?.message || 'No se pudieron cargar los pedidos.');
        setRecentOrders([]);
      } finally {
        if (!isMounted) return;
        setLoadingOrders(false);
      }
    };

    cargarPedidos();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const stats = useMemo(
    () => [
      {
        label: 'Ventas Totales',
        value: '$1000 bolívares',
        meta: 'vs. mes anterior',
        delta: '+12%',
        icon: '$',
      },
      {
        label: 'Pedidos',
        value: String(recentOrders.length),
        meta: 'Este mes',
        delta: '+12%',
        icon: '📦',
      },
      {
        label: 'Productos activos',
        value: '69',
        meta: 'En catálogo',
        delta: '+12%',
        icon: '🧾',
      },
      {
        label: 'Clientes nuevos',
        value: '8888',
        meta: 'Este mes',
        delta: '+12%',
        icon: '👤',
      },
    ],
    [recentOrders.length]
  );

  const topProducts = useMemo(
    () => [
      { name: 'iPhone 15 Pro Max', sold: 1324, price: '$10.000.000' },
      { name: 'iPhone 14 Pro Max', sold: 824, price: '$10.000.000' },
      { name: 'iPhone 13 Pro Max', sold: 324, price: '$10.000.000' },
      { name: 'iPhone 12 Pro Max', sold: 124, price: '$10.000.000' },
      { name: 'iPhone 11 Pro Max', sold: 24, price: '$10.000.000' },
    ],
    []
  );

  const getStatusClass = (estado) => {
    const normalized = String(estado || '').toLowerCase();
    if (normalized.includes('entregado')) return 'vender-pill vender-pill--ok';
    if (normalized.includes('enviado') || normalized.includes('camino')) {
      return 'vender-pill vender-pill--warn';
    }
    return 'vender-pill';
  };

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <section className="vender-stats" aria-label="Métricas">
        {stats.map((card) => (
          <article key={card.label} className="vender-stat">
            <div className="vender-stat__row">
              <div className="vender-stat__icon" aria-hidden="true">
                {card.icon}
              </div>
              <span className="vender-stat__delta">{card.delta}</span>
            </div>
            <p className="vender-stat__label">{card.label}</p>
            <p className="vender-stat__value">{card.value}</p>
            <p className="vender-stat__meta">{card.meta}</p>
          </article>
        ))}
      </section>

      <section className="vender-card" aria-label="Pedidos recientes">
        <div className="vender-card__header">
          <h2 className="vender-card__title">Pedidos Recientes</h2>
          <button type="button" className="vender-card__action">
            Ver todos
          </button>
        </div>

        {loadingOrders ? (
          <p className="vender-empty">Cargando pedidos...</p>
        ) : ordersError ? (
          <p className="vender-empty">{ordersError}</p>
        ) : recentOrders.length === 0 ? (
          <p className="vender-empty">No hay pedidos aun. Cuando lleguen, apareceran aqui.</p>
        ) : (
          <div className="vender-tableWrap">
            <table className="vender-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Num. Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((row, idx) => (
                  <tr key={`${row.id}-${idx}`}>
                    <td className="vender-mono">{row.id}</td>
                    <td>{row.cliente}</td>
                    <td className="vender-center">{row.productos}</td>
                    <td className="vender-right">{formatCurrency(row.total)}</td>
                    <td className="vender-right">
                      <span className={getStatusClass(row.estado)}>{row.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="vender-card" aria-label="Productos más vendidos">
        <div className="vender-card__header">
          <h2 className="vender-card__title">Productos mas vendidos</h2>
          <button type="button" className="vender-card__action">
            Ver todos
          </button>
        </div>

        <ul className="vender-products" aria-label="Lista de productos más vendidos">
          {topProducts.map((p) => (
            <li key={p.name} className="vender-product">
              <div className="vender-product__left">
                <div className="vender-product__thumb" aria-hidden="true">
                  <img src="/img/theme-logo.png" alt="" />
                </div>
                <div className="vender-product__meta">
                  <p className="vender-product__name">{p.name}</p>
                  <p className="vender-product__sub">{p.sold} vendidos</p>
                </div>
              </div>
              <div className="vender-product__price">{p.price}</div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default VenderDashboard;
