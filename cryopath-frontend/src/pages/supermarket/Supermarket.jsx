import './Supermarket.css'
import Home from '../home/Home';

const Supermarket = () =>{
    return(
        <section className="supermarket-page">
            <header className="supermarket-hero">
                <div className="supermarket-hero__content">
                    <h1 className="supermarket-hero__title">Supermercado</h1>
                    <p className="supermarket-hero__subtitle">Productos, ofertas y todo lo que necesitas en un solo lugar.</p>
                </div>
            </header>

            <div className="supermarket-content">
                <Home />
            </div>
        </section>
    )
}

export default Supermarket