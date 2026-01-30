import { useState } from "react";
import { eliminarProductoRequest, eliminarImagenesProductoRequest } from "../../services/productosApi";

export default function EliminarProductodashboard({
  productos = [],
  token,
  onClose,
  onDeleted,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSelection = (id) => {
    if (!id || submitting) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (!selectedIds.length) {
      setErrorMessage("Selecciona al menos un producto.");
      return;
    }
    if (!token) {
      setErrorMessage("Falta el token de autenticación.");
      return;
    }
    setSubmitting(true);
    setErrorMessage("");
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          await eliminarImagenesProductoRequest(id, token);
          await eliminarProductoRequest(id, token);
        })
      );
      onDeleted?.(selectedIds);
      setSelectedIds([]);
      onClose?.();
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error al eliminar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!productos.length) return null;

  return (
    <div className="admin-product-section admin-product-section--highlight">
      <div className="admin-section-header">
        <h3 className="admin-section-title">Eliminar productos</h3>
        <button
          type="button"
          className="admin-secondary-button"
          onClick={onClose}
          disabled={submitting}
        >
          Cerrar
        </button>
      </div>
      <p>Selecciona los productos que deseas eliminar desde la lista.</p>
      <div className="admin-table-container" style={{ marginTop: "12px" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio base</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const productId = producto.id_producto ?? producto.id;
              return (
                <tr key={productId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(productId)}
                      onChange={() => toggleSelection(productId)}
                      disabled={submitting}
                    />
                  </td>
                  <td>#{productId}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>
                    {typeof producto.precio_base === "number"
                      ? producto.precio_base.toFixed(2)
                      : producto.precio_base}
                  </td>
                  <td>{producto.estado ?? "Sin estado"}</td>
                </tr>
              );
            })}
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
          {submitting ? "Eliminando..." : "Eliminar seleccionados"}
        </button>
        <button
          type="button"
          className="admin-secondary-button"
          onClick={() => {
            setSelectedIds([]);
            setErrorMessage("");
          }}
          disabled={submitting}
        >
          Limpiar selección
        </button>
      </div>
    </div>
  );
}
