import { useState, useEffect } from 'react'
import './DetalleProductoParte5.css'
import { obtenerResenasPorProducto, crearResena } from '../../services/resenasApi'
import { useAuth } from '../../context/AuthContext'

const DetalleProductoParte5 = ({ idProducto }) => {
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        promedio: 0,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    })
    const [resenas, setResenas] = useState([])
    const [loading, setLoading] = useState(true)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [nuevaResena, setNuevaResena] = useState({ estrellas: 5, comentario: '' })
    const [enviando, setEnviando] = useState(false)

    const { session, profile } = useAuth()
    const token = session?.access_token
    const userId = profile?.id

    useEffect(() => {
        if (!idProducto) return

        async function cargarResenas() {
            setLoading(true)
            try {
                const data = await obtenerResenasPorProducto(idProducto, { limit: 10 })
                setEstadisticas(data.estadisticas || {
                    total: 0,
                    promedio: 0,
                    distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                })
                setResenas(data.resenas || [])
            } catch (error) {
                console.error('Error cargando reseñas:', error)
            } finally {
                setLoading(false)
            }
        }

        cargarResenas()
    }, [idProducto])

    const handleEnviarResena = async (e) => {
        e.preventDefault()
        if (!token || !userId) {
            alert('Debes iniciar sesión para dejar una reseña')
            return
        }

        try {
            setEnviando(true)
            await crearResena(token, {
                id_producto: idProducto,
                id_usuario: userId,
                estrellas: nuevaResena.estrellas,
                comentario: nuevaResena.comentario
            })

            // Recargar reseñas
            const data = await obtenerResenasPorProducto(idProducto, { limit: 10 })
            setEstadisticas(data.estadisticas)
            setResenas(data.resenas || [])
            setNuevaResena({ estrellas: 5, comentario: '' })
            setMostrarFormulario(false)
            alert('Reseña enviada exitosamente')
        } catch (error) {
            alert(error.message || 'Error al enviar la reseña')
        } finally {
            setEnviando(false)
        }
    }

    const calcularPorcentaje = (cantidad) => {
        if (estadisticas.total === 0) return 0
        return Math.round((cantidad / estadisticas.total) * 100)
    }

    const renderEstrellas = (cantidad, interactive = false) => {
        const estrellas = []
        for (let i = 1; i <= 5; i++) {
            if (interactive) {
                estrellas.push(
                    <span
                        key={i}
                        className={`dp5__star ${i <= cantidad ? 'dp5__star--full' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setNuevaResena(prev => ({ ...prev, estrellas: i }))}
                    />
                )
            } else {
                const isFull = i <= Math.floor(cantidad)
                const isHalf = !isFull && i === Math.ceil(cantidad) && cantidad % 1 >= 0.5
                estrellas.push(
                    <span
                        key={i}
                        className={`dp5__star ${isFull ? 'dp5__star--full' : ''} ${isHalf ? 'dp5__star--half' : ''}`}
                    />
                )
            }
        }
        return estrellas
    }

    const formatearFecha = (fecha) => {
        if (!fecha) return ''
        return new Date(fecha).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <section className="dp5">
                <div className="dp5__loading">Cargando reseñas...</div>
            </section>
        )
    }

    return (
        <section className="dp5">
            <div className="dp5__grid">
                <div className="dp5__left">
                    <h3 className="dp5__title">Opiniones del producto</h3>

                    <div className="dp5__ratingRow">
                        <div className="dp5__ratingValue">{estadisticas.promedio.toFixed(1)}</div>
                        <div className="dp5__stars" aria-label={`Calificación ${estadisticas.promedio} de 5`}>
                            {renderEstrellas(estadisticas.promedio)}
                        </div>
                    </div>

                    <div className="dp5__subtitle">{estadisticas.total} reseñas</div>

                    <div className="dp5__breakdown" role="list">
                        {[5, 4, 3, 2, 1].map(estrella => (
                            <div key={estrella} className="dp5__breakdownRow" role="listitem">
                                <div className="dp5__bar">
                                    <div
                                        className="dp5__barFill"
                                        style={{ width: `${calcularPorcentaje(estadisticas.distribucion[estrella])}%` }}
                                    />
                                </div>
                                <div className="dp5__breakdownLabel">{estrella}</div>
                                <div className="dp5__breakdownIcon" aria-hidden="true">☆</div>
                            </div>
                        ))}
                    </div>

                    {token && (
                        <button
                            className="dp5__addReviewBtn"
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        >
                            {mostrarFormulario ? 'Cancelar' : 'Escribir una reseña'}
                        </button>
                    )}

                    {mostrarFormulario && (
                        <form className="dp5__form" onSubmit={handleEnviarResena}>
                            <div className="dp5__formStars">
                                <span>Tu calificación:</span>
                                <div className="dp5__stars">
                                    {renderEstrellas(nuevaResena.estrellas, true)}
                                </div>
                            </div>
                            <textarea
                                className="dp5__formTextarea"
                                placeholder="Escribe tu opinión sobre el producto..."
                                value={nuevaResena.comentario}
                                onChange={(e) => setNuevaResena(prev => ({ ...prev, comentario: e.target.value }))}
                                rows={4}
                            />
                            <button
                                type="submit"
                                className="dp5__formSubmit"
                                disabled={enviando}
                            >
                                {enviando ? 'Enviando...' : 'Enviar reseña'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="dp5__right">
                    <h3 className="dp5__title">Opiniones Destacadas</h3>

                    {resenas.length === 0 ? (
                        <div className="dp5__empty">
                            No hay reseñas aún. ¡Sé el primero en opinar!
                        </div>
                    ) : (
                        resenas.map(resena => (
                            <article key={resena.id_resena} className="dp5__card">
                                <p className="dp5__cardText">
                                    {resena.comentario || 'Sin comentario'}
                                </p>

                                <div className="dp5__cardMeta">
                                    <span className="dp5__metaDate">
                                        {formatearFecha(resena.fecha_creacion)}
                                    </span>
                                </div>

                                <div className="dp5__cardStars" aria-label={`Calificación ${resena.estrellas} de 5`}>
                                    {renderEstrellas(resena.estrellas)}
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default DetalleProductoParte5