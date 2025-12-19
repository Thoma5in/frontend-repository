import {useState} from 'react';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        confirmPassword: '',
        direccion: ''
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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
            password,
            confirmPassword,
            direccion
        } = formData

        //Validaciones
        if (!nombre || !apellido || !correo || !password || !confirmPassword || !direccion) {
            return setError('Por favor, complete todos los campos.')
        }

        if (password.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres.')
        }

        if (password !== confirmPassword) {
            return setError('Las contraseñas no coinciden.')
        }

        try {
            setLoading(true)

            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    correo,
                    password,
                    direccion
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Error en el registro.')
            }

            alert('Registro exitoso. Ahora puede iniciar sesión.')

        } catch (err) {
            setError(err.message)
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
        
        <div className = "field">
        <label> Nombre Completo <span>*</span></label>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
        />
        </div>

        <div className = "field">
        <label> Apellido <span>*</span></label>    
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          onChange={handleChange}
        />
        </div>

        <div className = "field">
        <label> Correo electrónico <span>*</span></label>    
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          onChange={handleChange}
        />
        </div>

        <div className = "field">
        <label> Contraseña <span>*</span></label>   
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />
        <small>Usa mayúsculas, números y símbolos para mayor seguridad</small> 
        </div>

        <div className = "field">
        <label> Confirmar Contraseña <span>*</span></label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          onChange={handleChange}
        />
        </div>

        <div className = "field">
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