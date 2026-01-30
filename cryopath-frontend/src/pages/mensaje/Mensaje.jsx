import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenerConversacionRequest, enviarMensajeRequest } from "../../services/conversacionesApi";
import "./Mensaje.css";

const Mensaje = () => {
  const { id } = useParams(); // id_conversacion
  const { session, user } = useAuth();
  const token = session?.access_token ?? user?.token ?? "";

  const [conversacion, setConversacion] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!id || !token) return;

    const cargarConversacion = async () => {
      try {
        const data = await obtenerConversacionRequest(id, token);
        setConversacion(data.conversacion);
        setMensajes(data.mensajes);
      } catch (error) {
        console.error("Error al cargar conversación:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarConversacion();
  }, [id, token]);

  if (loading) return <p className="mensaje__loading">Cargando conversación...</p>;

  const tituloConversacion =
    conversacion?.titulo || conversacion?.asunto || "Chat con Vendedor";

  const referenciaPropiedad =
    conversacion?.propiedad?.referencia || conversacion?.referencia || "#RE-40291";
  const ubicacionPropiedad =
    conversacion?.propiedad?.ubicacion || conversacion?.ubicacion || "Zona Norte, Ciudad";

    const nombreChat = conversacion?.otro_usuario ?
                `${conversacion.otro_usuario.nombre} ${conversacion.otro_usuario.apellido}`
                : "Usuario";

  return (
    <div className="mensaje">
      <div className="mensaje__grid">
        <section className="chat">
          <header className="chat__header">
            <div className="chat__headerLeft">
              <div className="chat__avatar" aria-hidden="true">
                <span>V</span>
              </div>
              <div className="chat__headerText">
                <h3 className="chat__title">Chat con {nombreChat}</h3>
                <p className="chat__status">
                  <span className="chat__dot" aria-hidden="true" /> En línea
                </p>
              </div>
            </div>

            <div className="chat__headerActions" aria-label="Acciones">
              <button className="chat__iconButton" type="button" aria-label="Modo">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="chat__iconButton" type="button" aria-label="Llamar">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </header>

          <div className="chat__messages" role="log" aria-label="Mensajes">
            {mensajes.length === 0 ? (
              <p className="chat__empty">No hay mensajes aún</p>
            ) : (
              mensajes.map((m) => {
                

                const isOwn = m.id_usuario_emisor === session?.user?.id;
                const fecha = m.created_at
                  ? new Date(m.created_at).toLocaleString()
                  : "";

                return (
                  <div
                    key={m.id_mensaje ?? `${m.created_at}-${Math.random()}`}
                    className={`chat__row ${isOwn ? "chat__row--own" : ""}`}
                  >
                    {!isOwn && (
                      <div className="chat__miniAvatar" aria-hidden="true">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 21a8 8 0 1 0-16 0"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`chat__bubble ${isOwn ? "chat__bubble--own" : ""}`}
                    >
                      <p className="chat__text">{m.contenido}</p>
                      {fecha && <span className="chat__time">{fecha}</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            className="chat__composer"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!draft.trim()) return;

              try {
                const response = await enviarMensajeRequest(id, draft, token);
                setMensajes((prev) => [...prev, {...response.mensaje }]);
                setDraft("");
              } catch (error) {
                console.error("Error al enviar mensaje:", error);
              }
            }}
          >
            <button className="chat__clip" type="button" aria-label="Adjuntar">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 1 1-2.83-2.83l8.49-8.49"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <input
              className="chat__input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="¿Qué te gustaría saber?"
            />
            <button className="chat__send" type="submit">
              Enviar
              <span aria-hidden="true">›</span>
            </button>
          </form>
        </section>

        <aside className="mensaje__side" aria-label="Panel de información">
          <button className="sideCard sideCard--call" type="button">
            <div className="sideCard__icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="sideCard__text">
              <div className="sideCard__title">Llamar al vendedor</div>
              <div className="sideCard__subtitle">RESPUESTA INMEDIATA</div>
            </div>
          </button>

          <button className="sideCard sideCard--schedule" type="button">
            <div className="sideCard__icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 2v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 10h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="sideCard__text">
              <div className="sideCard__title">Consultar disponibilidad</div>
              <div className="sideCard__subtitle">VER FECHAS LIBRES</div>
            </div>
          </button>

          <div className="summary">
            <div className="summary__header">
              <h4 className="summary__title">Resumen de Propiedad</h4>
            </div>
            <div className="summary__grid">
              <div className="summary__item">
                <span className="summary__label">Referencia:</span>
                <span className="summary__value">{referenciaPropiedad}</span>
              </div>
              <div className="summary__item">
                <span className="summary__label">Ubicación:</span>
                <span className="summary__value">{ubicacionPropiedad}</span>
              </div>
            </div>
            <p className="summary__note">
              Nuestros asesores están disponibles de Lunes a Sábado de 9:00 AM a
              7:00 PM para brindarte la mejor atención personalizada.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Mensaje;
