import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { updateUsuario } from "../../services/usuarioApi"

import "./EditarPerfil.css"

const EditProfile = () => {
  const { profile, session, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        nombre: profile.nombre || "",
        apellido: profile.apellido || "",
        direccion: profile.direccion || "",
        telefono: profile.telefono || "",
      })
    }
  }, [profile])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        const updatedUser = await updateUsuario(form, session.access_token)
      
        //Actualizar el contexto con el nuevo perfil
        updateProfile(updatedUser)

        alert("Perfil actualizado con éxito")

        //Navegar de vuelta al perfil
        navigate('/profile')
    } catch (error) {
        alert("Error al actualizar el perfil: " + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-card" onSubmit={handleSubmit}>
        <div className="logo">
          <img src={"/img/logo.png"} alt="Cryopath logo" />
        </div>

        <h2>Actualiza tus datos</h2>
        <p className="subtitle">Mantén tu información al día</p>

        <div className="field">
          <label>
            Nombre <span>*</span>
          </label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>
            Apellido <span>*</span>
          </label>
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>
            Dirección <span>*</span>
          </label>
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>
            Teléfono <span>*</span>
          </label>
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            
          />
        </div>



        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  )
}

export default EditProfile