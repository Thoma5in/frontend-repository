import {useAuth} from '../../context/AuthContext';
import {useEffect, useState} from 'react';
import "../../pages/dashboard/AdminDashboard.css";
import {useNavigate} from 'react-router-dom';

export default function EliminarUsuario() {
    const {session, isAdmin} = useAuth();  
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");

    const token = session?.access_token;
    

    useEffect(() => {
        if (!isAdmin || !token) return;

        const fetchUsuarios = async () => {
            try {
                const res = await fetch("http://localhost:3001/admin/usuarios", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                setUsuarios(Array.isArray(data) ? data : []);
            } catch (error) {
                setMensaje(error.message || "Error al cargar usuarios");
            } finally {
                setLoading(false);
            }
        }

        fetchUsuarios();
    }, [isAdmin, token]);

    if (!isAdmin) return null;

    const handleEliminar = async (id_usuario) => {
        const confirm = window.confirm(
            "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.");

        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:3001/admin/usuarios/${id_usuario}`, 
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al eliminar usuario");

            setUsuarios((prev) => prev.filter((u) => u.id !== id_usuario));
        } catch (error) {
            setMensaje(error.message || "Error al eliminar usuario");
        }
    }

    return (
        <div className="admin-dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Eliminar cuentas de usuario</h3>
            <button 
                type="button"
                onClick={() => navigate('/admin')}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.5rem', 
                    cursor: 'pointer',
                    padding: '0.5rem',
                    color: 'var(--text-primary)',
                    opacity: 0.7,
                    transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                title="Volver al dashboard"
            >
                ✕
            </button>
        </div>

      {loading && <p>Cargando usuarios...</p>}
      {mensaje && <p className="error-message">{mensaje}</p>}
      {!loading && usuarios.length === 0 && (
        <p>No hay usuarios registrados.</p>
      )}

      {!loading && usuarios.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.correo}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>
                    <span
                      className={`status-badge ${
                            u.estado === 'activo'
                            ? 'status-active'
                            : 'status-inactive'
                        }`}>
                          {u.estado}      
                    </span>
                </td>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => handleEliminar(u.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}