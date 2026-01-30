import './Supermarket.css'
import Home from '../home/Home';
import { useState, useEffect } from 'react';
import { listarSupercategorias } from '../../services/supercategoriasApi';

const Supermarket = () =>{
    const [idSupercategoriaSupermercado, setIdSupercategoriaSupermercado] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerSupercategoriaSupermercado = async () => {
            try {
                const supercategorias = await listarSupercategorias();
                const supermercado = supercategorias.find(
                    (sc) => sc.nombre.toLowerCase() === 'supermercado'
                );
                if (supermercado) {
                    setIdSupercategoriaSupermercado(supermercado.id_super_categoria);
                }
            } catch (error) {
                console.error('Error al obtener supercategoría supermercado:', error);
            } finally {
                setLoading(false);
            }
        };

        obtenerSupercategoriaSupermercado();
    }, []);

    return(
        <section className="supermarket-page">
            <header className="supermarket-hero">
                <div className="supermarket-hero__content">
                    <h1 className="supermarket-hero__title">Supermercado</h1>
                    <p className="supermarket-hero__subtitle">Productos, ofertas y todo lo que necesitas en un solo lugar.</p>
                </div>
            </header>

            <div className="supermarket-content">
                {!loading && (
                    <Home idSupercategoria={idSupercategoriaSupermercado} />
                )}
            </div>
        </section>
    )
}

export default Supermarket