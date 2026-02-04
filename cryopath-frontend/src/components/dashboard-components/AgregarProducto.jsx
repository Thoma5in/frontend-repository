import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { crearProductoRequest, uploadImagenProductoRequest } from "../../services/productosApi";
import { listarCategorias } from "../../services/categoriasApi";
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
    id_categoria: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [categorias, setCategorias] = useState([]);

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

  useEffect(() => {
    let mounted = true;

    listarCategorias()
      .then((data) => {
        if (!mounted) return;
        const maybeList = data?.categorias ?? data;
        setCategorias(Array.isArray(maybeList) ? maybeList : []);
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
        if (mounted) setCategorias([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  
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
    const files = Array.from(event.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
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
    const files = Array.from(event.dataTransfer.files || []);
    setImageFiles(prev => [...prev, ...files]);
    setIsDragging(false);
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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
      id_categoria: Number(productForm.id_categoria),
    };

    crearProductoRequest(payload, token)
      .then(async (created) => {
        try {
          const newId = created?.producto?.id_producto ?? created?.id_producto;
          if (imageFiles.length > 0 && newId) {
            // Upload all images sequentially
            for (const file of imageFiles) {
              await uploadImagenProductoRequest(newId, file, token);
            }
          }
        } catch (error) {
          console.error("Error al subir las imágenes del producto:", error);
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
                <span>Categoría</span>
                <select
                  name="id_categoria"
                  value={productForm.id_categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id_categoria ?? categoria.id}
                      value={categoria.id_categoria ?? categoria.id}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
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
                <span>Imágenes del producto</span>
                <div
                  style={dropzoneStyles}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={submitting}
                    style={{ width: "100%" }}
                  />
                  <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                    Arrastra y suelta las imágenes o haz clic para seleccionarlas.
                  </p>
                  <small style={{ display: "block", marginTop: "4px", color: "#64748b" }}>
                    {imageFiles.length > 0 ? `${imageFiles.length} imagen(es) seleccionada(s)` : "Sin imágenes seleccionadas"}
                  </small>
                </div>

                {/* Image Preview Grid */}
                {imageFiles.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "12px",
                    marginTop: "16px"
                  }}>
                    {imageFiles.map((file, index) => (
                      <div key={index} style={{
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid var(--admin-border-color, #e5e7eb)",
                        aspectRatio: "1"
                      }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          disabled={submitting}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            background: "rgba(239, 68, 68, 0.9)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "bold"
                          }}
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
