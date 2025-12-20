import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__logo">
          <img src="./img/logo-header.png" alt="Cryopath Logo" />
          <p className="footer__copyright">Copyright © CryoPath Colombia.</p>
          <p className="footer__address">Calle de la casa de luis.</p>
        </div>

        <div className="footer__column">
          <h4 className="footer__title">Términos y Condiciones</h4>
        </div>

        <div className="footer__column">
          <h4 className="footer__title">Accesibilidad</h4>
        </div>

        <div className="footer__column">
          <h4 className="footer__title">Acerca de Nosotros</h4>
          <ul className="footer__list">
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>

        <div className="footer__column">
          <h4 className="footer__title">Redes Sociales</h4>
          <ul className="footer__list">
            <li><a href="#instagram">Instagram</a></li>
            <li><a href="#facebook">Facebook</a></li>
            <li><a href="#x">X</a></li>
          </ul>
        </div>

        <div className="footer__column">
          <h4 className="footer__title">Ayuda</h4>
          <ul className="footer__list">
            <li><a href="#compra">Compra</a></li>
            <li><a href="#venta">Venta</a></li>
            <li><a href="#contactanos">Contactanos</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer