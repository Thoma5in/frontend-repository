import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProductosRequest } from "../../services/productosApi";
import EliminarProductodashboard from "../../components/dashboard-components/EliminarProductodashboard";
import { getInventario } from "../../services/inventarioApi";
import {} from "../../services/categoriasApi";


export default function AdminDashboard() {
  const { profile, user, session, isAdmin, isWorker } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEliminarProductos, setShowEliminarProductos] = useState(false);

  const softTone = false;
  const userId = profile?.id ?? user?.id ?? "—";
  const canManageProducts = Boolean(isAdmin || isWorker);

  const authToken = session?.access_token ?? user?.token ?? "";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductosRequest(authToken);

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
  }, [authToken]);

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const data = await getInventario();
        // Crear un mapa de id_producto -> cantidad_disponible
        const inventarioMap = {};
        if (Array.isArray(data)) {
          data.forEach(item => {
            inventarioMap[item.id_producto] = item.cantidad_disponible || 0;
          });
        }
        setInventario(inventarioMap);
      } catch (err) {
        console.error("Error fetching inventario:", err);
      }
    };
    fetchInventario();
  }, []);

  const fullName =
    profile?.nombre && profile?.apellido
      ? `${profile.nombre} ${profile.apellido}`
      : user?.email?.split("@")[0] || "Perfil sin nombre";

  const roleLabel = isAdmin ? "Administrador" : "Trabajador";

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
            <span className="admin-header-role">{roleLabel}</span>
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


            <button
              type="button"
              className="admin-nav-button"
              onClick={() => {
                if (!canManageProducts || !productos.length || !authToken) return;
                setShowEliminarProductos((prev) => !prev);
              }}
              disabled={!canManageProducts || !productos.length || !authToken}
            >
              <span className="admin-button-icon" aria-hidden="true"></span>
              {showEliminarProductos
                ? "Cerrar eliminación"
                : "Eliminar productos"}
            </button>

            {isAdmin && (
              <button
                type="button"
                className="admin-nav-button"
                onClick={() => navigate("/admin/asignar-roles")}
              >
                <span className="admin-button-icon" aria-hidden="true"></span>
                Asignar roles
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                className="admin-nav-button"
                onClick={() => navigate("/admin/cambiar-estado")}
              >
                <span className="admin-button-icon" aria-hidden="true"></span>
                Cambiar estado usuario
              </button>
            )}

            {isAdmin && (
            <button type="button" 
            className="admin-nav-button" 
            onClick={() => navigate("/admin/categorias")}>
              <span className="admin-button-icon" aria-hidden="true"></span>
              Gestionar categorías
            </button>
            )}
            
            { isAdmin && (
            <button type="button" 
            className="admin-nav-button" 
            onClick={() => navigate("/admin/eliminar-usuarios")}>
              <span className="admin-button-icon" aria-hidden="true"></span>
              Eliminar cuentas
            </button>
            )}
          </nav>
        </aside>

        <section className="admin-dashboard-content">
          {showEliminarProductos && (
            <EliminarProductodashboard
              productos={productos}
              token={authToken}
              onClose={() => setShowEliminarProductos(false)}
              onDeleted={(deletedIds) =>
                setProductos((prev) =>
                  prev.filter(
                    (producto) =>
                      !deletedIds.includes(
                        producto.id_producto ?? producto.id
                      )
                  )
                )
              }
            />
          )}
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
                    <th>Disponible</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto, index) => {
                    const productId = producto.id_producto ?? producto.id;
                    const cantidadDisponible = inventario[productId] ?? 0;
                    const enStock = cantidadDisponible > 0;
                    return (
                      <tr key={productId || index}>
                        <td>#{productId}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion}</td>
                        <td>
                          $
                          {typeof producto.precio_base === "number"
                            ? producto.precio_base.toFixed(2)
                            : producto.precio_base}
                        </td>
                        <td>
                          <strong>{cantidadDisponible}</strong> unidades
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              enStock
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {enStock ? "En Stock" : "Agotado"}
                          </span>
                        </td>
                        <td>
                          {canManageProducts && (
                            <>
                              <button
                                className="icon-button"
                                type="button"
                                onClick={() => {
                                  if (!productId) return;
                                  navigate(`/admin/productos/${productId}/editar`, {
                                    state: { producto },
                                  });
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                className="icon-button"
                                type="button"
                                onClick={() => {
                                  if (!productId) return;
                                  navigate(`/admin/productos/${productId}/eliminar`, {
                                    state: { producto },
                                  });
                                }}
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
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