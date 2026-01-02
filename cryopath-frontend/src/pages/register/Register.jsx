import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { loginRequest, registerRequest } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';
import { checkEmail, reactivateAccount } from '../../services/usuarioApi';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    direccion: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const {
      nombre,
      apellido,
      correo,
      telefono,
      password,
      confirmPassword,
      direccion
    } = formData

    //Validaciones
    if (!nombre || !apellido || !correo || !telefono || !password || !confirmPassword || !direccion) {
      return setError('Por favor, complete todos los campos.')
    }

    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.')
    }

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.')
    }

    if (formData.telefono && !/^[0-9+\s-]{7,15}$/.test(formData.telefono)) {
      alert("Teléfono inválido")
      return
    }

    try {
      setLoading(true)

      //Verificar estado del correo
      const status = await checkEmail(correo)

      console.log('Email status:', status)

      //Caso 1 no existe -> registro normal
      if (!status.exists) {
      await registerRequest({
        nombre,
        apellido,
        correo,
        password,
        telefono,
        direccion
      })

      const authResponse = await loginRequest(correo, password)
      login({ session: authResponse.session, user: authResponse.user })
      navigate('/')
    }

    //Caso 2 existe y está activo
    if (status.exists && status.estado === 'activo') {
      setError('Este Correo ya está registrado')
      return
    }

    //Caso 3 existe y está inactivo
    if (status.exists && status.estado === 'inactivo') {
      const confirmReactivate = window.confirm(
        'Esta cuenta está inactiva. ¿Desea reactivarla?'
      )

     if (!confirmReactivate) return

      console.log('Reactivating account for:', formData.correo)

      await reactivateAccount(formData.correo)
      console.log('Cuenta reactivada correctamente.')
      alert('Cuenta reactivada. Por favor, inicie sesión.')
        navigate('/login')
        return
      
    }

    } catch (err) {
      setError(err.message || 'Error en el registro. Por favor, intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>

        <div className="logo">
          <img src={"/img/logo.png"} alt="Cryopath logo" />
        </div>

        <h2>¡Únete a nuestra familia!</h2>
        <p className="subtitle">Solo te tomará un minuto</p>

        <div className="field">
          <label> Nombre Completo <span>*</span></label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label> Apellido <span>*</span></label>
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label> Correo electrónico <span>*</span></label>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label> Telefono <span>*</span></label>
          <input
            type="text"
            name="telefono"
            placeholder="Telefono"
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label> Contraseña <span>*</span></label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
          <small>Usa mayúsculas, números y símbolos para mayor seguridad</small>
        </div>

        <div className="field">
          <label> Confirmar Contraseña <span>*</span></label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              onChange={handleChange}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        <div className="field">
          <label> Dirección <span>*</span></label>
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            onChange={handleChange}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="notice">
          Al registrarte, aceptas que cuidaremos tus datos como si fueran nuestros.
          <a href="#"> Política de privacidad</a>
        </div>

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta? <span>Inicia sesión</span>
        </p>
      </form>
    </div>
  );

}

export default Register