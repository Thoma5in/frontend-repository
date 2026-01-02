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
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-avatar-small" aria-hidden="true">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="35" r="15" />
              <path d="M 20 70 Q 20 50 50 50 Q 80 50 80 70" />
            </svg>
          </div>
          <div>
            <h2 className="admin-header-name">{fullName}</h2>
            <span className="admin-header-role">Administrador</span>
          </div>
        </div>
        <div className="admin-header-right">
          <p className="admin-header-id">ID: {userId}</p>
        </div>
      </header>

      <main className="admin-main-grid">
        <aside className="admin-sidebar">
          <h3 className="admin-sidebar-title">Acciones Rápidas</h3>
          <nav className="admin-nav">
            <button
              type="button"
              className="admin-nav-button admin-nav-button--primary"
              onClick={() => navigate("/admin/productos/nuevo")}
            >
              <span className="admin-button-icon" aria-hidden="true"></span>
              Agregar producto
            </button>
            <button type="button" className="admin-nav-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Editar productos
            </button>
            <button type="button" className="admin-nav-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Eliminar productos
            </button>
            <button type="button" className="admin-nav-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Asignar roles
            </button>
            <button type="button" className="admin-nav-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Cambiar estado usuarios
            </button>
            <button type="button" className="admin-nav-button">
              <span className="admin-button-icon" aria-hidden="true"></span>
              Eliminar cuentas
            </button>
          </nav>
        </aside>

        <section className="admin-dashboard-content">
          <h3 className="admin-section-title">Gestión de Productos</h3>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock Data for Design */}
                <tr>
                  <td>#001</td>
                  <td>Producto Ejemplo 1</td>
                  <td>Descripción breve del producto...</td>
                  <td>$25.00</td>
                  <td><span className="status-badge status-active">Activo</span></td>
                  <td>
                    <button className="icon-button">✏️</button>
                    <button className="icon-button">🗑️</button>
                  </td>
                </tr>
                <tr>
                  <td>#002</td>
                  <td>Producto Ejemplo 2</td>
                  <td>Otra descripción de ejemplo...</td>
                  <td>$40.50</td>
                  <td><span className="status-badge status-inactive">Inactivo</span></td>
                  <td>
                    <button className="icon-button">✏️</button>
                    <button className="icon-button">🗑️</button>
                  </td>
                </tr>
                <tr>
                  <td>#003</td>
                  <td>Producto Ejemplo 3</td>
                  <td>Descripción del tercer producto...</td>
                  <td>$15.00</td>
                  <td><span className="status-badge status-active">Activo</span></td>
                  <td>
                    <button className="icon-button">✏️</button>
                    <button className="icon-button">🗑️</button>
                  </td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}