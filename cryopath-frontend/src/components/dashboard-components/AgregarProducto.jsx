import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { crearProductoRequest, uploadImagenProductoRequest } from "../../services/productosApi";
import "../../pages/dashboard/AdminDashboard.css";

export default function AgregarProducto() {
  const { profile, user, canManageProducts, session } = useAuth();
  const navigate = useNavigate();

  if (!profile || !canManageProducts) return null;

  const userId = profile?.id || user?.id || "";
  const token = session?.access_token;

  const [productForm, setProductForm] = useState({
    nombre: "",
    descripcion: "",
    precio_base: "",
    cantidad_disponible: 1,
    id_usuario: userId || "",
  });

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
      ? "rgba(59,130,246,0.08)"
      : "rgba(148,163,184,0.08)",
    transition: "background-color 0.2s ease",
  };

  
  const handleChange = (event) => {
    const { name, value } = event.target;

    setProductForm((prev) => ({
      ...prev,
      [name]:
        name === "cantidad_disponible"
          ? value === ""
            ? ""
            : Math.max(1, parseInt(value, 10) || 1)
          : value,
    }));
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

    const cantidadDisponible =
      productForm.cantidad_disponible === ""
        ? 1
        : Number(productForm.cantidad_disponible);

    if (!Number.isFinite(cantidadDisponible) || cantidadDisponible < 1) {
      setErrorMessage("El inventario inicial debe ser un número mayor o igual a 1.");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...productForm,
      precio_base: Number(productForm.precio_base),
      cantidad_disponible: cantidadDisponible,
    };

    crearProductoRequest(payload, token)
      .then(async (created) => {
        try {
          const newId = created?.producto?.id_producto ?? created?.id_producto;
          if (imageFile && newId) {
            await uploadImagenProductoRequest(newId, imageFile, token);
          }
        } catch (error) {
          console.error("Error al subir la imagen del producto:", error);
          // Opcional: mantener el mensaje de error en pantalla sin bloquear la creación del producto
        }
        navigate("/admin");
      })
      .catch((error) => {
        setErrorMessage(error.message || "Error al crear el producto");
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
          <h3 className="admin-section-title">Agregar producto</h3>
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
                <span>Inventario inicial</span>
                <input
                  type="number"
                  name="cantidad_disponible"
                  value={productForm.cantidad_disponible}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
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
                    Arrastra y suelta la imagen o haz clic para seleccionarla.
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
                {submitting ? "Guardando..." : "Guardar producto"}
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
