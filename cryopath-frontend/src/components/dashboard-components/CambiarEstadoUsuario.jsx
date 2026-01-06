import { useAuth } from "../../context/AuthContext";
import "../../pages/dashboard/AdminDashboard.css";
import { cambiarEstadoUsuario } from "../../services/adminApi";
import "./CambiarEstadoUsuario.css";
import { useEffect, useMemo, useState } from "react";

export default function CambiarEstadoUsuario() {
  const { isAdmin, session } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [idUsuario, setIdUsuario] = useState("");
  const [estado, setEstado] = useState("");
  const [mensaje, setMensaje] = useState("");

  const mensajeTipo = useMemo(() => {
    const normalized = (mensaje || "").toLowerCase();
    if (!normalized) return "";
    if (normalized.includes("correct") || normalized.includes("cambiado") || normalized.includes("actualizado")) return "success";
    if (normalized.includes("error") || normalized.includes("fall") || normalized.includes("deneg")) return "error";
    return "";
  }, [mensaje]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      const headers = {
        Authorization: `Bearer ${session?.access_token}`,
      };

      try {
        const usuariosRes = await fetch("http://localhost:3001/admin/usuarios", { headers });
        const usuariosData = await usuariosRes.json();
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
      } catch (error) {
        console.error("Error fetching usuarios:", error);
        setUsuarios([]);
      }
    };

    fetchData();
  }, [isAdmin, session]);

  if (!isAdmin) return null;

const handleCambiarEstado = async () => {
  setMensaje("");

  try {
    await cambiarEstadoUsuario(session?.access_token, {
      id_usuario: idUsuario,
      estado: estado,
    });

    setMensaje("Estado del usuario cambiado correctamente");
    setIdUsuario("");
    setEstado("");
  } catch (error) {
    setMensaje(`Error: ${error.message}`);
  }
};

  if (!Array.isArray(usuarios)) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="admin-page admin-page--soft">
      <div className="admin-content">
        <div className="admin-product-section change-user-status">
          <h3 className="admin-section-title">Cambiar estado de usuario</h3>
          <p className="change-user-status__subtitle">
            Selecciona un usuario y un nuevo estado para actualizarlo.
          </p>

          <form className="change-user-status__form" onSubmit={(e) => e.preventDefault()}>
            <div className="change-user-status__grid">
              <label className="admin-form-field">
                <span>Usuario</span>
                <select
                  value={idUsuario}
                  onChange={(e) => setIdUsuario(e.target.value)}
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.correo} — {u.nombre} {u.apellido} (Estado actual: {u.estado || 'N/A'})
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-form-field">
                <span>Nuevo estado</span>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option value="">Seleccione un estado</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </label>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-primary-button"
                onClick={handleCambiarEstado}
                disabled={!idUsuario || !estado}
              >
                Cambiar estado
              </button>
            </div>

            {mensaje && (
              <p
                className={
                  "change-user-status__message" +
                  (mensajeTipo === "success"
                    ? " change-user-status__message--success"
                    : mensajeTipo === "error"
                      ? " change-user-status__message--error"
                      : "")
                }
              >
                {mensaje}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}