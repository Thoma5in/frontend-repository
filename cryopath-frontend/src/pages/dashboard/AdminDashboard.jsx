import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { profile, user, isAdmin } = useAuth();

  if (!profile || !isAdmin) return null;

  const [softTone, setSoftTone] = useState(false);
  const userId = profile?.id || user?.id || "";
  const navigate = useNavigate();

  const fullName =
    profile?.nombre && profile?.apellido
      ? `${profile.nombre} ${profile.apellido}`
      : user?.email?.split("@")[0] || "Perfil sin nombre";

  return (
    <div className={softTone ? "admin-page admin-page--soft" : "admin-page"}>
      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-top">
            <div className="admin-avatar" aria-hidden="true">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="35" r="15" />
                <path d="M 20 70 Q 20 50 50 50 Q 80 50 80 70" />
              </svg>
            </div>

            <div className="admin-info">
              <h2 className="admin-name">{fullName}</h2>
              <p className="admin-detail">Administrador del sistema</p>
              <p className="admin-detail">ID: {userId}</p>
              <span className="admin-role">Administrador</span>
            </div>
          </div>

          <div className="admin-actions">
            <button
              type="button"
              className="admin-action-button admin-action-button--primary"
              onClick={() => navigate("/admin/productos/nuevo")}
            >
              <span className="admin-button-icon" aria-hidden="true"></span>
              Agregar producto
            </button>
            <button type="button" className="admin-action-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Editar productos
            </button>
            <button type="button" className="admin-action-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Eliminar productos
            </button>
            <button type="button" className="admin-action-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Asignar roles
            </button>
            <button type="button" className="admin-action-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Cambiar estado usuarios
            </button>
            <button type="button" className="admin-action-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Eliminar cuentas
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="admin-tone-toggle"
        onClick={() => setSoftTone((current) => !current)}
        aria-pressed={softTone}
        aria-label="Cambiar tono"
        title="Cambiar tono"
      >
        <img
          className="admin-tone-icon"
          src="/img/theme-logo.png"
          alt=""
          aria-hidden="true"
        />
      </button>
    </div>
  );
}