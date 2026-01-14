import { useState, useEffect, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { actualizarProductoRequest, uploadImagenProductoRequest } from "../../services/productosApi";
import { getInventarioByProducto, updateInventario } from "../../services/inventarioApi";
import "../../pages/dashboard/AdminDashboard.css";

export default function EditarProducto() {
  const { profile, user, canManageProducts, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!profile || !canManageProducts) return null;
  const userId = profile?.id || user?.id || "";
  const token = session?.access_token;

  const producto = location.state?.producto;
  const productoId = producto?.id_producto;

  if (!producto || !productoId) {
    return (
      <div className="admin-page admin-page--soft">
        <div className="admin-content">
          <p>No se encontró el producto a editar.</p>
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

  const [productForm, setProductForm] = useState({
    nombre: producto.nombre || "",
    descripcion: producto.descripcion || "",
    precio_base: producto.precio_base ?? "",
    id_usuario: userId || "",
  });

  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const dropzoneStyles = {
    border: "2px dashed var(--admin-border-color, #d1d5db)",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    backgroundColor: isDragging
      ? "rgba(34,197,94,0.08)"
      : "rgba(148,163,184,0.08)",
    transition: "background-color 0.2s ease",
  };

  useEffect(() => {
    getInventarioByProducto(productoId)
    .then((data) => {
      setCantidadDisponible(data.cantidad_disponible);
    })
    .catch(() =>{
      setCantidadDisponible(0);
    })
  }, [productoId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (submitting) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (submitting) return;
    const file = event.dataTransfer.files?.[0] || null;
    setImageFile(file);
    setIsDragging(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const payload = {
      ...productForm,
      precio_base: Number(productForm.precio_base),
    };

    actualizarProductoRequest(productoId, payload, token)
      .then(async () => {
        try {
          
          await updateInventario(productoId, cantidadDisponible, token);

          if (imageFile) {
            await uploadImagenProductoRequest(productoId, imageFile, token);
          }
        } catch (error) {
          console.error("Error al subir la imagen del producto:", error);
          // Opcional: mostrar mensaje pero seguir con la actualización
        }
        navigate("/admin");
      })
      .catch((error) => {
        setErrorMessage(error.message || "Error al actualizar el producto");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="admin-page admin-page--soft">
      <div className="admin-content">
        <div className="admin-product-section">
          <h3 className="admin-section-title">Editar producto</h3>
          <form className="admin-product-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <label className="admin-form-field">
                <span>Nombre</span>
                <input
                  type="text"
                  name="nombre"
                  value={productForm.nombre}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="admin-form-field">
                <span>Descripción</span>
                <textarea
                  name="descripcion"
                  value={productForm.descripcion}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </label>

              <label className="admin-form-field">
                <span>Editar Inventario</span>
                <input
                type="number"
                min="0"
                step="1"
                value={cantidadDisponible}
                name="cantidad_disponible"
                onChange={(e) => setCantidadDisponible(Number(e.target.value))}
                required/>
              </label>

              <label className="admin-form-field">
                <span>Precio base</span>
                <input
                  type="number"
                  name="precio_base"
                  value={productForm.precio_base}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </label>

              <label className="admin-form-field">
                <span>Imagen del producto</span>
                <div
                  style={dropzoneStyles}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting}
                    style={{ width: "100%" }}
                  />
                  <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                    Arrastra y suelta la nueva imagen o haz clic para elegirla.
                  </p>
                  {imageFile && (
                    <small style={{ display: "block", marginTop: "4px" }}>
                      Archivo: {imageFile.name}
                    </small>
                  )}
                </div>
              </label>
            </div>

            {errorMessage && (
              <p className="admin-error-message">{errorMessage}</p>
            )}

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Guardar cambios"}
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
          </form>
        </div>
      </div>
    </div>
  );
}
