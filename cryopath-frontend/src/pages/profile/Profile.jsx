import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Profile.css"

const Profile = () => {
    const { profile, user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const isLoading = !profile

    if (!isAuthenticated) {
        return (
            <div className="profile-page">
                <div className="profile-content">
                    <div className="profile-card profile-guest-card">
                        <h2 className="profile-guest-title">Debes iniciar sesion</h2>
                        <p className="profile-guest-text">
                            Accede para ver y actualizar tus datos personales.
                        </p>
                        <button
                            type="button"
                            className="profile-guest-button"
                            onClick={() => navigate('/login')}
                        >
                            Iniciar sesion
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const fullName = profile?.nombre && profile?.apellido
        ? `${profile.nombre} ${profile.apellido}`
        : user?.email?.split('@')[0] || 'Perfil sin nombre'

    const email = profile?.correo || user?.email || 'Sin correo registrado'
    const phone = profile?.telefono || 'Sin telefono registrado'
    const address = profile?.direccion || 'Sin direccion registrada'
    const status = profile?.estado || 'Sin estado'
    const userId = profile?.id || user?.id || 'Sin identificador'

    return (
        <div className="profile-page">
            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-top">
                        <div className="profile-avatar">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="35" r="15" />
                                <path d="M 20 70 Q 20 50 50 50 Q 80 50 80 70" />
                            </svg>
                        </div>
                        <div className="profile-info">
                            <h2 className="profile-name">{isLoading ? 'Cargando perfil...' : fullName}</h2>
                            <p className="profile-detail">{email}</p>
                            <p className="profile-detail">Tel: {phone}</p>
                            <p className="profile-detail">Direccion: {address}</p>
                            <p className="profile-detail">Id: {userId}</p>
                            <span className="profile-status">{status}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button
                            type="button"
                            className="action-button"
                            onClick={() => navigate('/edit')}
                        >
                            <span className="button-icon"></span>
                            Actualiza tus datos
                        </button>
                        <button className="action-button">
                            <span className="button-icon"></span>
                            Revisa tus compras
                        </button>
                        <button className="action-button">
                            <span className="button-icon"></span>
                            Elimina la cuenta
                        </button>
                        <button className="action-button">
                            <span className="button-icon"></span>
                            Guarda direcciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile