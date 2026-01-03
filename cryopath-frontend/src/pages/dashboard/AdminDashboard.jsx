import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProductosRequest } from "../../services/productosApi";

export default function AdminDashboard() {
  const { profile, user, isAdmin } = useAuth();

  if (!profile || !isAdmin) return null;

  const [softTone, setSoftTone] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = profile?.id || user?.id || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductosRequest(user?.token);

        if (data && Array.isArray(data.productos)) {
          setProductos(data.productos);
        } else if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("API response unexpected structure:", data);
          setError("Error: Estructura de datos inesperada.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [user]);

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

          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
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
                  {productos.map((producto, index) => (
                    <tr key={producto.id_producto || index}>
                      <td>#{producto.id_producto}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.descripcion}</td>
                      <td>${typeof producto.precio_base === 'number' ? producto.precio_base.toFixed(2) : producto.precio_base}</td>
                      <td>
                        <span
                          className={`status-badge ${producto.stock > 0 ? "status-active" : "status-inactive"
                            }`}
                        >
                          {producto.stock > 0 ? "En Stock" : "Agotado"}
                        </span>
                      </td>
                      <td>
                        <button className="icon-button">✏️</button>
                        <button className="icon-button">🗑️</button>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No hay productos registrados via API.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}