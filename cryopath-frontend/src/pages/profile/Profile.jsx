import "./Profile.css"

const Profile = () => {
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
                            <h2 className="profile-name">Samuel Ospina</h2>
                            <p className="profile-detail">samiospina2006@gmail.com</p>
                            <p className="profile-detail">Tel: 3182261316</p>
                            <p className="profile-detail">Carrera 93 #45-113</p>
                            <span className="profile-status">Activo</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="action-button">
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
                            Guarda Direcciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile