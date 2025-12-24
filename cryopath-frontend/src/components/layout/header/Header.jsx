import "./Header.css"
import LupeIcon from "../../../assets/icons/LupeIcon"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout } = useAuth();

  console.log('USER:', user)
  console.log('PROFILE:', profile)

  const handleLogout = () => {
    logout();
    navigate("/");
  }

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
            <button className="header__search-button">
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
              <button type="button" className="header__user-button header__user-button--stacked">
                Mis Compras
              </button>
              <button
                type="button"
                className="header__user-button header__user-button--stacked"
                onClick={() => navigate('/profile')}
              >
                Perfil
              </button>
              <button
                type="button"
                className="header__user-button header__user-button--stacked"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <div className="header__actions">
          <button className="header__action header__action--dropdown">
            <span>Categorías</span>
            <span className="header__chevron" aria-hidden="true" />
          </button>
          <button className="header__action">Supermercado</button>
          <button className="header__action">Vender</button>
          <button className="header__action">Ayuda</button>
        </div>
      </div>
    </header>
  )
}

export default Header