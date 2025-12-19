import "./Header.css"
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img src="./img/logo-header.png" alt="Cryopath Logo" />
        </div>

        <search>
          <input
            type="text"
            className="header__search-input"
            placeholder="Search..."
          />
          <button className="header__search-button">Search</button>
        </search>

        <div className="header__nav">
          <a onClick={() => navigate('/login')}>Iniciar Sesión</a>
          <a onClick={() => navigate('/register')}>Registrate</a>
        </div>

      </div>
    </header>
  )
}

export default Header