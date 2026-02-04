import './VenderSidebar.css';

const VenderSidebar = ({ activeSection, onSectionChange }) => {
  const navButtonClass = (key) =>
    key === activeSection ? 'vender-nav__item vender-nav__item--active' : 'vender-nav__item';

  return (
    <aside className="vender-sidebar" aria-label="Panel de Ventas">
      <h2 className="vender-sidebar__title">Panel de Ventas</h2>
      <nav className="vender-nav" aria-label="Navegación de ventas">
        <button
          type="button"
          className={navButtonClass('dashboard')}
          onClick={() => onSectionChange('dashboard')}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={navButtonClass('productos')}
          onClick={() => onSectionChange('productos')}
        >
          Productos
        </button>
        <button
          type="button"
          className={navButtonClass('pedidos')}
          onClick={() => onSectionChange('pedidos')}
        >
          Pedidos
        </button>
        <button
          type="button"
          className={navButtonClass('clientes')}
          onClick={() => onSectionChange('clientes')}
        >
          Clientes
        </button>
        <button
          type="button"
          className={navButtonClass('analiticas')}
          onClick={() => onSectionChange('analiticas')}
        >
          Analíticas
        </button>
      </nav>
    </aside>
  );
};

export default VenderSidebar;
