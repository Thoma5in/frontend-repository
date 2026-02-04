import './Vender.css';
import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import VenderSidebar from '../../components/vendedor-producto/VenderSidebar';
import VenderDashboard from '../../components/vendedor-producto/VenderDashboard';
import VendedorProducto from '../../components/vendedor-producto/VendedorProducto';

const Vender = () => {
  const { profile, user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const fullName = useMemo(() => {
    if (profile?.nombre ) return `${profile.nombre}`;
    return user?.email?.split('@')?.[0] || 'Usuario';
  }, [profile?.nombre, user?.email]);

  return (
    <div className="vender-page">
      <main className="vender-shell">
        <VenderSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <section className="vender-content" aria-label="Contenido principal">
          <header className="vender-top">
            <h1 className="vender-top__title">Bienvenido, {fullName}</h1>
          </header>

          {activeSection === 'dashboard' && <VenderDashboard />}

          {activeSection === 'productos' && <VendedorProducto />}

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