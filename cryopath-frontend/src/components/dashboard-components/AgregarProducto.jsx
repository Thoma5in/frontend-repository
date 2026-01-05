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
    id_usuario: userId || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const payload = {
      ...productForm,
      precio_base: Number(productForm.precio_base),
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
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
