import React, { useEffect, useState } from 'react';
import './Categorias.css';
import { obtenerCategoria, crearCategoria, eliminarCategoria, actualizarCategoria,listarCategorias } from '../../services/categoriasApi';
import { useAuth } from '../../context/AuthContext';

const Categorias = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = useAuth().session?.access_token;

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const data = await listarCategorias();
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) return;

        try {
            setLoading(true);

            const nuevaCategoria = await crearCategoria({ nombre, descripcion }, token);

            setCategorias([...categorias, nuevaCategoria]);
            setNombre('');
            setDescripcion('');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id_categoria) => {
        try {
            await eliminarCategoria(id_categoria, token);
            setCategorias(categorias.filter(cat => cat.id_categoria !== id_categoria));
        } catch (error) {
            alert(error.message);
        }
    };

        return (
            <div className="categorias-container">
                <h2>Gestión de Categorías</h2>
                <form onSubmit={handlesubmit} className="categoria-form">
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
    
                    <div className="form-group">
                        <label>Descripcion</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows="4"    
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </form>

                <div className="categorias-lista">
                    <h3>Categorías existentes</h3>
                    {categorias.length === 0 ? (
                        <p>No hay categorías disponibles.</p>
                    ) : (
                        <ul>
                            {categorias.map((categoria) => (
                                <li key={categoria.id_categoria} className="categoria-item">
                                    <div className="categoria-info">
                                        <strong>{categoria.nombre}</strong>
                                        <p>{categoria.descripcion}</p>
                                        <button
                                            className="eliminar-button"
                                            onClick={() => handleEliminar(categoria.id_categoria)}
                                            >Eliminar</button>
                                         </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    };
    
    export default Categorias;
