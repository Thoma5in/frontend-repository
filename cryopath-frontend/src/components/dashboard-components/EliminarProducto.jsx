import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eliminarProductoRequest, eliminarImagenesProductoRequest } from "../../services/productosApi";
import "../../pages/dashboard/AdminDashboard.css";
import { useState } from "react";

export default function EliminarProducto() {
  const { profile, user, canManageProducts, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!profile || !canManageProducts) return null;

  const token = session?.access_token;
  const producto = location.state?.producto;
  const productoId = producto?.id_producto;

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!producto || !productoId) {
    return (
      <div className="admin-page admin-page--soft">
        <div className="admin-content">
          <p>No se encontró el producto a eliminar.</p>
          <button
            type="button"
            className="admin-primary-button"
            onClick={() => navigate("/admin")}
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      await eliminarImagenesProductoRequest(productoId, token);
      await eliminarProductoRequest(productoId, token);
      navigate("/admin");
    } catch (error) {
      setErrorMessage(error.message || "Error al eliminar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="admin-page admin-page--soft">
      <div className="admin-content">
        <div className="admin-product-section">
          <h3 className="admin-section-title">Eliminar producto</h3>
          <p>Revisa la información del producto antes de eliminarlo:</p>

          <div className="admin-table-container" style={{ marginTop: "16px" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio base</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#{productoId}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>
                    {typeof producto.precio_base === "number"
                      ? producto.precio_base.toFixed(2)
                      : producto.precio_base}
                  </td>
                  <td>{producto.estado}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {errorMessage && (
            <p className="admin-error-message" style={{ marginTop: "12px" }}>
              {errorMessage}
            </p>
          )}

          <div className="admin-form-actions" style={{ marginTop: "16px" }}>
            <button
              type="button"
              className="admin-primary-button"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Eliminando..." : "Eliminar producto"}
            </button>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
