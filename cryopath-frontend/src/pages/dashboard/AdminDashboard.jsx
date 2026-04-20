import { useAuth } from "../../context/AuthContext";
import { formatCOP } from "../../utils/formatters";
import "./AdminDashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProductosRequest } from "../../services/productosApi";
import {
  quoteRates,
  createShipment,
  getShipment,
  getShipmentLabel,
} from "../../services/enviaApi";
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
                          {formatCOP(producto.precio_base)}
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
        {isAdmin && (
          <section className="admin-product-section" style={{ marginTop: 24 }}>
            <h3 className="admin-section-title">Pruebas Envia (solo admin)</h3>
            <EnviaTestPanel authToken={authToken} />
          </section>
        )}
      </main>
    </div>
  );
}

function EnviaTestPanel({ authToken }) {
  const [ratesResp, setRatesResp] = useState(null);
  const [createResp, setCreateResp] = useState(null);
  const [getResp, setGetResp] = useState(null);
  const [labelResp, setLabelResp] = useState(null);
  const [loading, setLoading] = useState(false);

  const sampleRatePayload = {
    origin: { postal_code: "01000", country: "MX" },
    destination: { postal_code: "04510", country: "MX" },
    parcels: [{ weight: 1, dimensions: { height: 10, width: 10, length: 10 } }],
  };

  const sampleShipmentPayload = {
    shipper: { name: "Sender", postal_code: "01000", country: "MX", address: "Calle 1" },
    recipient: { name: "Receiver", postal_code: "04510", country: "MX", address: "Calle 2" },
    parcels: [{ weight: 1, dimensions: { height: 10, width: 10, length: 10 } }],
    service: "express",
    reference: "order-12345",
  };

  async function handleQuote() {
    setLoading(true);
    setRatesResp(null);
    try {
      const res = await quoteRates(sampleRatePayload);
      setRatesResp(res);
    } catch (err) {
      setRatesResp({ ok: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setLoading(true);
    setCreateResp(null);
    try {
      const res = await createShipment(sampleShipmentPayload, "order-12345");
      setCreateResp(res);
    } catch (err) {
      setCreateResp({ ok: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleGet(id) {
    if (!id) return setGetResp({ ok: false, error: 'id required' });
    setLoading(true);
    setGetResp(null);
    try {
      const res = await getShipment(id);
      setGetResp(res);
    } catch (err) {
      setGetResp({ ok: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleLabel(id, format) {
    if (!id) return setLabelResp({ ok: false, error: 'id required' });
    setLoading(true);
    setLabelResp(null);
    try {
      const res = await getShipmentLabel(id, format);
      setLabelResp(res);
    } catch (err) {
      setLabelResp({ ok: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="admin-form-grid" style={{ gap: 12 }}>
        <div className="admin-form-field">
          <span>Cotizar tarifas</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="admin-primary-button" onClick={handleQuote} disabled={loading}>Cotizar</button>
            <small style={{ alignSelf: 'center', color: 'var(--text-secondary)' }}>Payload sample used</small>
          </div>
          <pre style={{ maxHeight: 220, overflow: 'auto', marginTop: 8 }}>{ratesResp ? JSON.stringify(ratesResp, null, 2) : ''}</pre>
        </div>

        <div className="admin-form-field">
          <span>Crear envío</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="admin-primary-button" onClick={handleCreate} disabled={loading}>Crear envío</button>
            <small style={{ alignSelf: 'center', color: 'var(--text-secondary)' }}>Idempotency-Key: order-12345</small>
          </div>
          <pre style={{ maxHeight: 220, overflow: 'auto', marginTop: 8 }}>{createResp ? JSON.stringify(createResp, null, 2) : ''}</pre>
        </div>

        <div className="admin-form-field">
          <span>Obtener envío / rastreo</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input id="envia-get-id" placeholder="shipment id" />
            <button className="admin-secondary-button" onClick={() => handleGet(document.getElementById('envia-get-id').value)} disabled={loading}>Obtener</button>
          </div>
          <pre style={{ maxHeight: 220, overflow: 'auto', marginTop: 8 }}>{getResp ? JSON.stringify(getResp, null, 2) : ''}</pre>
        </div>

        <div className="admin-form-field">
          <span>Obtener etiqueta</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input id="envia-label-id" placeholder="shipment id" />
            <select id="envia-label-format" defaultValue="pdf">
              <option value="pdf">pdf</option>
              <option value="png">png</option>
            </select>
            <button className="admin-secondary-button" onClick={() => handleLabel(document.getElementById('envia-label-id').value, document.getElementById('envia-label-format').value)} disabled={loading}>Label</button>
          </div>
          <pre style={{ maxHeight: 220, overflow: 'auto', marginTop: 8 }}>{labelResp ? JSON.stringify(labelResp, null, 2) : ''}</pre>
        </div>
      </div>
    </div>
  );
}