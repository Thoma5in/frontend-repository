import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { actualizarProductoRequest, uploadImagenProductoRequest, obtenerImagenesProductoRequest, eliminarImagenesProductoRequest } from "../../services/productosApi";
import { getInventarioByProducto, updateInventario } from "../../services/inventarioApi";
import { listarCategorias, obtenerCategoriaDeProducto } from "../../services/categoriasApi";
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
    id_categoria: "",
  });

  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [shouldDeleteExistingImages, setShouldDeleteExistingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [categorias, setCategorias] = useState([]);

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

  useEffect(() => {
    if (!productoId || !token) {
      console.log('No se puede cargar imágenes: productoId o token no disponibles');
      return;
    }
    
    console.log('Cargando imágenes para producto:', productoId);
    obtenerImagenesProductoRequest(productoId, token)
      .then((data) => {
        console.log('Imágenes recibidas del backend:', data);
        // Backend returns array of objects with url property
        const images = Array.isArray(data) 
          ? data.map(img => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
          : [];
        console.log('Imágenes procesadas:', images);
        setExistingImages(images);
      })
      .catch((error) => {
        console.error("Error al cargar imágenes existentes:", error);
        setExistingImages([]);
      });
  }, [productoId, token]);

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

  useEffect(() => {
    let mounted = true;

    obtenerCategoriaDeProducto(productoId)
      .then((data) => {
        if (!mounted) return;
        const idCategoria = data?.categoria?.id_categoria;
        if (idCategoria !== null && idCategoria !== undefined) {
          setProductForm((prev) => ({ ...prev, id_categoria: String(idCategoria) }));
        }
      })
      .catch(() => {
        // Si no tiene categoría asignada o falla el endpoint, no bloqueamos la edición.
      });

    return () => {
      mounted = false;
    };
  }, [productoId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
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

  const handleRemoveNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setShouldDeleteExistingImages(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const payload = {
      ...productForm,
      precio_base: Number(productForm.precio_base),
      ...(productForm.id_categoria !== "" && productForm.id_categoria !== null && productForm.id_categoria !== undefined
        ? { id_categoria: Number(productForm.id_categoria) }
        : {}),
    };

    actualizarProductoRequest(productoId, payload, token)
      .then(async () => {
        try {
          
          await updateInventario(productoId, cantidadDisponible, token);

          if (shouldDeleteExistingImages) {
            await eliminarImagenesProductoRequest(productoId, token);
          }

          if (imageFiles.length > 0) {
            // Upload all new images sequentially
            for (const file of imageFiles) {
              await uploadImagenProductoRequest(productoId, file, token);
            }
          }
        } catch (error) {
          console.error("Error al actualizar imágenes del producto:", error);
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
                <span>Categoría</span>
                <select
                  name="id_categoria"
                  value={productForm.id_categoria}
                  onChange={handleChange}
                >
                  <option value="">Sin categoría</option>
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
                
                {/* Existing Images */}
                {existingImages.length > 0 ? (
                  <div style={{ marginBottom: "16px" }}>
                    <small style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "500" }}>
                      Imágenes actuales ({existingImages.length}):
                    </small>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "12px"
                    }}>
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} style={{
                          position: "relative",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "2px solid var(--admin-border-color, #e5e7eb)",
                          aspectRatio: "1"
                        }}>
                          <img
                            src={url}
                            alt={`Imagen existente ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
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
                  </div>
                ) : (
                  <div style={{ marginBottom: "16px" }}>
                    <small style={{ display: "block", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", color: "#64748b" }}>
                      Este producto aún no tiene imágenes. Agrega nuevas imágenes abajo.
                    </small>
                  </div>
                )}

                {/* New Images Upload */}
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
                    Arrastra y suelta nuevas imágenes o haz clic para elegirlas.
                  </p>
                  <small style={{ display: "block", marginTop: "4px", color: "#64748b" }}>
                    {imageFiles.length > 0 ? `${imageFiles.length} imagen(es) nueva(s) seleccionada(s)` : "Sin imágenes nuevas seleccionadas"}
                  </small>
                </div>

                {/* New Images Preview */}
                {imageFiles.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <small style={{ display: "block", marginBottom: "8px", color: "#64748b", fontWeight: "500" }}>
                      Nuevas imágenes a subir:
                    </small>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "12px"
                    }}>
                      {imageFiles.map((file, index) => (
                        <div key={`new-${index}`} style={{
                          position: "relative",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "2px solid #10b981",
                          aspectRatio: "1"
                        }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Nueva imagen ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
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
