import { useAuth } from "../../context/AuthContext";
import "../../pages/dashboard/AdminDashboard.css";
import "./AsignarRoles.css";
import { useEffect, useMemo, useState } from "react";

export default function AsignarRoles() {
  const { isAdmin, session } = useAuth();

    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);

    const [idUsuario, setIdUsuario] = useState("");
    const [idRol, setIdRol] = useState("");
    const [mensaje, setMensaje] = useState("");

    const mensajeTipo = useMemo(() => {
      const normalized = (mensaje || "").toLowerCase();
      if (!normalized) return "";
      if (normalized.includes("correct") || normalized.includes("asignado")) return "success";
      if (normalized.includes("error") || normalized.includes("fall") || normalized.includes("deneg")) return "error";
      return "";
    }, [mensaje]);

    useEffect(() => {
        if (!isAdmin) return

        const fetchData = async () => {
            const headers = {
                Authorization: `Bearer ${session?.access_token}`,
            }

            const [usuariosRes, rolesRes] = await Promise.all([
                fetch("http://localhost:3001/admin/usuarios", { headers }),
                fetch("http://localhost:3001/admin/roles", { headers }),
            ])

            const usuariosData = await usuariosRes.json();
            const rolesData = await rolesRes.json();

            setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
            setRoles(Array.isArray(rolesData) ? rolesData : []);
            
        }

        fetchData();
    }, [isAdmin, session]);

    if (!isAdmin) return null;

    const handleAsignarRol = async () => {
        setMensaje("");

        try {
            const res = await fetch("http://localhost:3001/admin/asignar-rol", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    id_rol: idRol,
                }),
            })

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al asignar rol");

            setMensaje("Rol asignado correctamente");
        } catch (error) {
            setMensaje(` ${error.message}`);
        }
    } 

    

    if (!Array.isArray(usuarios) || !Array.isArray(roles)) {
        return <p>Cargando...</p>;
    }

    return (
      <div className="admin-page admin-page--soft">
        <div className="admin-content">
          <div className="admin-product-section assign-roles">
            <h3 className="admin-section-title">Asignar rol a usuario</h3>
            <p className="assign-roles__subtitle">
              Selecciona un usuario y un rol para asignarlo.
            </p>

            <form className="assign-roles__form" onSubmit={(e) => e.preventDefault()}>
              <div className="assign-roles__grid">
                <label className="admin-form-field">
                  <span>Usuario</span>
                  <select
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value)}
                  >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.correo} — {u.nombre} {u.apellido}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-form-field">
                  <span>Rol</span>
                  <select value={idRol} onChange={(e) => setIdRol(e.target.value)}>
                    <option value="">Seleccione un rol</option>
                    {roles.map((r) => (
                      <option key={r.id_rol} value={r.id_rol}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={handleAsignarRol}
                  disabled={!idUsuario || !idRol}
                >
                  Asignar rol
                </button>
              </div>

              {mensaje && (
                <p
                  className={
                    "assign-roles__message" +
                    (mensajeTipo === "success"
                      ? " assign-roles__message--success"
                      : mensajeTipo === "error"
                        ? " assign-roles__message--error"
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