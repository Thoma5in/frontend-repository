import "./Header.css"
import LupeIcon from "../../../assets/icons/LupeIcon"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";


const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout, isAdmin, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  useEffect(() => {
    const handleDocumentMouseDown = (event) => {
      if (!userMenuRef.current) return;
      if (userMenuRef.current.contains(event.target)) return;
      setIsUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__top">
          <div onClick={() => navigate("/")} className="header__logo">
            <img src="./img/logo-header.png" alt="Cryopath Logo" />
          </div>

          <search className="header__search">
            <input
              type="text"
              className="header__search-input"
              placeholder="Busca tu proximo producto......"
            />
            <button type="button" className="header__search-button">
              <LupeIcon />
            </button>
          </search>

          

          {!isAuthenticated && (
            <div className="header__nav">
              <a onClick={() => navigate('/login')}>Iniciar Sesión</a>
              <a onClick={() => navigate('/register')}>Registrate</a>
            </div>
          )}

          {isAuthenticated && (
            <div className="header__user-panel">
              <p className="header__user-greeting">Hola, {profile?.nombre || profile?.data?.nombre || user?.email || 'usuario'}</p>
              <div className="header__user-row header__user-row--icons">
                <button
                  type="button"
                  className="header__user-button header__user-button--icon"
                  aria-label="Notificaciones"
                >
                  <span className="header__user-icon" aria-hidden="true">
                    🔔
                  </span>
                </button>
                <button
                  type="button"
                  className="header__user-button header__user-button--icon"
                  aria-label="Carrito"
                >
                  <span className="header__user-icon" aria-hidden="true">
                    🛒
                  </span>
                </button>
              </div>
              <div className="header__user-menu" ref={userMenuRef}>
                <button
                  type="button"
                  className="header__user-menu-trigger"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Menú de usuario"
                >
                  <span className="header__user-avatar" aria-hidden="true">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="35" r="15" />
                      <path d="M 20 70 Q 20 50 50 50 Q 80 50 80 70" />
                    </svg>
                  </span>
                  <span className="header__user-menu-chevron" aria-hidden="true" />
                </button>

                {isUserMenuOpen && (
                  <div className="header__user-menu-dropdown" role="menu">
                    <button
                      type="button"
                      className="header__user-menu-item"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mis Compras
                    </button>
                    <button
                      type="button"
                      className="header__user-menu-item"
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/profile');
                      }}
                    >
                      Perfil
                    </button>

                    {isAdmin && (
                    <button
                      type="button"
                      className="header__user-menu-item"
                      onClick={() => navigate('/admin')}
                    >
                      Panel Admin
                    </button>
                  )}
                    <button
                      type="button"
                      className="header__user-menu-item"
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            type="button"
            className="header__hamburger"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Menú"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <div className="header__actions">
          <button className="header__action header__action--dropdown">
            <span>Categorías</span>
            <span className="header__chevron" aria-hidden="true" />
          </button>
          <button className="header__action">Supermercado</button>
          <button className="header__action">Vender</button>
          <button className="header__action" onClick={() => navigate('/assistant')}>Ayuda</button>
        </div>

        <div className={`header__mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {!isAuthenticated && (
            <>
              <a onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>Iniciar Sesión</a>
              <a onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>Registrate</a>
            </>
          )}
          {isAuthenticated && (
            <>
              <div className="header__mobile-user-info">
                <p>Hola, {profile?.nombre || profile?.data?.nombre || user?.email || 'usuario'}</p>
              </div>
              <a onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>Perfil</a>
              <a onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Cerrar Sesión</a>
            </>
          )}
          <div className="header__mobile-divider"></div>
          <a onClick={() => setIsMobileMenuOpen(false)}>Categorías</a>
          <a onClick={() => setIsMobileMenuOpen(false)}>Supermercado</a>
          <a onClick={() => setIsMobileMenuOpen(false)}>Vender</a>
          <a onClick={() => { navigate('/assistant'); setIsMobileMenuOpen(false); }}>Ayuda</a>
        </div>
      </div>
    </header>
  )
}

export default Header