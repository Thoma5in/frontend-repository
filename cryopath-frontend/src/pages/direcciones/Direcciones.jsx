import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { agregarDireccion, getDirecciones } from "../../services/direccionApi"
import "./Direcciones.css"

const getDireccionLabel = (direccion) => {
    if (typeof direccion === "string") return direccion
    if (!direccion || typeof direccion !== "object") return ""

    const nombre = direccion.nombre_direccion || direccion.nombreDireccion || direccion.nombre || ""
    const linea =
        direccion.direccion ||
        direccion.direccion_completa ||
        direccion.direccionCompleta ||
        direccion.detalle ||
        direccion.descripcion ||
        ""
    const ciudad = direccion.ciudad || direccion.municipio || ""

    return [nombre, linea, ciudad].filter(Boolean).join(" · ")
}

const pick = (obj, keys, fallback = "") => {
    if (!obj) return fallback
    for (const key of keys) {
        const value = obj?.[key]
        if (typeof value === "string" && value.trim()) return value
    }
    return fallback
}

const Direcciones = () => {
    const { isAuthenticated, session } = useAuth()
    const navigate = useNavigate()

    const token = session?.access_token

    const [direcciones, setDirecciones] = useState([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    const [form, setForm] = useState({
        nombre_direccion: "",
        direccion: "",
        ciudad: "",
        referencia: "",
    })

    const canLoad = useMemo(() => Boolean(isAuthenticated && token), [isAuthenticated, token])

    const cargarDirecciones = useCallback(async () => {
        if (!token) return

        setLoading(true)
        setError("")

        try {
            const payload = await getDirecciones(token)
            setDirecciones(Array.isArray(payload) ? payload : [])
        } catch (err) {
            setError(err?.message || "No se pudieron cargar las direcciones")
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        if (canLoad) {
            cargarDirecciones()
        }
    }, [canLoad, cargarDirecciones])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            nombre_direccion: form.nombre_direccion.trim(),
            direccion: form.direccion.trim(),
            ciudad: form.ciudad.trim(),
            referencia: form.referencia.trim(),
        }

        if (!payload.nombre_direccion || !payload.direccion || !payload.ciudad) return
        if (!token) return

        setSaving(true)
        setError("")

        try {
            await agregarDireccion(payload, token)
            setForm({ nombre_direccion: "", direccion: "", ciudad: "", referencia: "" })
            await cargarDirecciones()
        } catch (err) {
            setError(err?.message || "No se pudo guardar la dirección")
        } finally {
            setSaving(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="direcciones-page">
                <div className="direcciones-content">
                    <div className="direcciones-card">
                        <h2 className="direcciones-title">Debes iniciar sesión</h2>
                        <p className="direcciones-muted">Accede para ver y guardar tus direcciones.</p>
                        <div className="direcciones-actions">
                            <button
                                type="button"
                                className="direcciones-primary"
                                onClick={() => navigate("/login")}
                            >
                                Iniciar sesión
                            </button>
                            <button
                                type="button"
                                className="direcciones-secondary"
                                onClick={() => navigate("/profile")}
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="direcciones-page">
            <div className="direcciones-content">
                <div className="direcciones-card">
                    <div className="direcciones-header">
                        <div>
                            <h2 className="direcciones-title">Direcciones</h2>
                            <p className="direcciones-muted">Guarda varias direcciones para tus compras</p>
                        </div>
                        <button type="button" className="direcciones-secondary" onClick={() => navigate("/profile")}>
                            Volver
                        </button>
                    </div>

                    <form className="direcciones-form" onSubmit={handleSubmit}>
                        <div className="direcciones-grid">
                            <div className="direcciones-field">
                                <label className="direcciones-label" htmlFor="nombre_direccion">
                                    Nombre de la dirección
                                </label>
                                <input
                                    id="nombre_direccion"
                                    type="text"
                                    value={form.nombre_direccion}
                                    onChange={(e) => setForm((prev) => ({ ...prev, nombre_direccion: e.target.value }))}
                                    placeholder="Ej: Casa, Trabajo"
                                    className="direcciones-input"
                                    autoComplete="address-level1"
                                    required
                                />
                            </div>

                            <div className="direcciones-field">
                                <label className="direcciones-label" htmlFor="direccion">
                                    Dirección
                                </label>
                                <input
                                    id="direccion"
                                    type="text"
                                    value={form.direccion}
                                    onChange={(e) => setForm((prev) => ({ ...prev, direccion: e.target.value }))}
                                    placeholder="Ej: Calle 123 #45-67, Apto 301"
                                    className="direcciones-input"
                                    autoComplete="street-address"
                                    required
                                />
                            </div>

                            <div className="direcciones-field">
                                <label className="direcciones-label" htmlFor="ciudad">
                                    Ciudad
                                </label>
                                <input
                                    id="ciudad"
                                    type="text"
                                    value={form.ciudad}
                                    onChange={(e) => setForm((prev) => ({ ...prev, ciudad: e.target.value }))}
                                    placeholder="Ej: Medellín"
                                    className="direcciones-input"
                                    autoComplete="address-level2"
                                    required
                                />
                            </div>

                            <div className="direcciones-field">
                                <label className="direcciones-label" htmlFor="referencia">
                                    Referencia (opcional)
                                </label>
                                <input
                                    id="referencia"
                                    type="text"
                                    value={form.referencia}
                                    onChange={(e) => setForm((prev) => ({ ...prev, referencia: e.target.value }))}
                                    placeholder="Ej: Portería, torre B"
                                    className="direcciones-input"
                                />
                            </div>
                        </div>

                        <div className="direcciones-form-actions">
                            <button
                                type="submit"
                                className="direcciones-primary"
                                disabled={
                                    saving ||
                                    !form.nombre_direccion.trim() ||
                                    !form.direccion.trim() ||
                                    !form.ciudad.trim()
                                }
                            >
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </form>

                    {error ? <p className="direcciones-error">{error}</p> : null}

                    <div className="direcciones-list">
                        <div className="direcciones-list-header">
                            <h3>Mis direcciones</h3>
                            <button
                                type="button"
                                className="direcciones-link"
                                onClick={cargarDirecciones}
                                disabled={loading}
                            >
                                {loading ? "Actualizando..." : "Actualizar"}
                            </button>
                        </div>

                        {loading && direcciones.length === 0 ? (
                            <p className="direcciones-muted">Cargando...</p>
                        ) : direcciones.length === 0 ? (
                            <p className="direcciones-muted">Aún no tienes direcciones guardadas.</p>
                        ) : (
                            <ul className="direcciones-items">
                                {direcciones.map((d, idx) => {
                                    const label = getDireccionLabel(d)
                                    const nombre = pick(d, ["nombre_direccion", "nombreDireccion", "nombre"], `Dirección ${idx + 1}`)
                                    const linea = pick(d, ["direccion", "direccion_completa", "direccionCompleta", "detalle", "descripcion"], "")
                                    const ciudad = pick(d, ["ciudad", "municipio"], "")
                                    const referencia = pick(d, ["referencia", "referenciaDireccion"], "")
                                    return (
                                        <li key={d?.id ?? d?._id ?? `${label}-${idx}`} className="direcciones-item">
                                            <span className="direcciones-item-title">{nombre}</span>
                                            {linea ? <span className="direcciones-item-text">{linea}</span> : null}
                                            {(ciudad || referencia) ? (
                                                <span className="direcciones-item-meta">
                                                    {[ciudad, referencia].filter(Boolean).join(" · ")}
                                                </span>
                                            ) : null}
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Direcciones
