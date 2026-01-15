import React, { useEffect, useState } from 'react';
import './categorias.css';
import { obtenerCategoria, crearCategoria, eliminarCategoria, actualizarCategoria,listarCategorias } from '../../services/categoriasApi';
import { useAuth } from '../../context/AuthContext';

const Categorias = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editando, setEditando] = useState(null);
    const [editNombre, setEditNombre] = useState('');
    const [editDescripcion, setEditDescripcion] = useState('');

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

    const handleEditar = (categoria) => {
        setEditando(categoria.id_categoria);
        setEditNombre(categoria.nombre);
        setEditDescripcion(categoria.descripcion);
    };

    const handleActualizar = async (id_categoria) => {
        if (!editNombre.trim()) return;

        try {
            setLoading(true);
            await actualizarCategoria(id_categoria, { nombre: editNombre, descripcion: editDescripcion }, token);
            setCategorias(categorias.map(cat => 
                cat.id_categoria === id_categoria 
                    ? { ...cat, nombre: editNombre, descripcion: editDescripcion }
                    : cat
            ));
            setEditando(null);
            setEditNombre('');
            setEditDescripcion('');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        setEditando(null);
        setEditNombre('');
        setEditDescripcion('');
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
                    <button type="submit" disabled={loading} className="btn-crear">
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
                                        {editando === categoria.id_categoria ? (
                                            <div className="edit-form">
                                                <input
                                                    type="text"
                                                    value={editNombre}
                                                    onChange={(e) => setEditNombre(e.target.value)}
                                                    className="edit-input"
                                                />
                                                <textarea
                                                    value={editDescripcion}
                                                    onChange={(e) => setEditDescripcion(e.target.value)}
                                                    rows="2"
                                                    className="edit-textarea"
                                                />
                                                <div className="edit-buttons">
                                                    <button
                                                        className="actualizar-button"
                                                        onClick={() => handleActualizar(categoria.id_categoria)}
                                                        disabled={loading}
                                                    >
                                                        {loading ? 'Guardando...' : 'Actualizar'}
                                                    </button>
                                                    <button
                                                        className="cancelar-button"
                                                        onClick={handleCancelar}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <strong>{categoria.nombre}</strong>
                                                <p>{categoria.descripcion}</p>
                                                <div className="categoria-buttons">
                                                    <button
                                                        className="actualizar-button"
                                                        onClick={() => handleEditar(categoria)}
                                                    >
                                                        Actualizar
                                                    </button>
                                                    <button
                                                        className="eliminar-button"
                                                        onClick={() => handleEliminar(categoria.id_categoria)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </>
                                        )}
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
