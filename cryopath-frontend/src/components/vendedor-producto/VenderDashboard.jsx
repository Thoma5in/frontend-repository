import { useMemo } from 'react';
import './VenderDashboard.css';

const VenderDashboard = () => {
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
        value: '666',
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
    []
  );

  const recentOrders = useMemo(
    () => [
      { id: '#UJT-234', cliente: 'Armando Webbs', productos: 5, total: '$100000,99', estado: 'Entregado' },
      { id: '#UJT-234', cliente: 'Armando Webbs', productos: 5, total: '$100000,99', estado: 'En camino' },
      { id: '#UJT-234', cliente: 'Armando Webbs', productos: 5, total: '$100000,99', estado: 'En camino' },
      { id: '#UJT-234', cliente: 'Armando Webbs', productos: 5, total: '$100000,99', estado: 'Entregado' },
      { id: '#UJT-234', cliente: 'Armando Webbs', productos: 5, total: '$100000,99', estado: 'Entregado' },
      { id: '#UJT-234', cliente: 'Armando Webbs', productos: 5, total: '$100000,99', estado: 'Entregado' },
      { id: '#UJT-234', cliente: 'Armando Webbs', productos: 5, total: '$100000,99', estado: 'Entregado' },
    ],
    []
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
    if (normalized.includes('camino')) return 'vender-pill vender-pill--warn';
    return 'vender-pill';
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
                  <td className="vender-right">{row.total}</td>
                  <td className="vender-right">
                    <span className={getStatusClass(row.estado)}>{row.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
