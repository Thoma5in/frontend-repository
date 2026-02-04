import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarConversacionesRequest } from "../../services/conversacionesApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ChatList.css";

const ChatList = () => {
    const { user, session, profile, isAuthenticated } = useAuth();
    const token = session?.access_token ?? user?.token ?? "";

    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);

    const myUserId = useMemo(() => {
        return session?.user?.id ?? profile?.id ?? user?.id ?? null;
    }, [profile?.id, session?.user?.id, user?.id]);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setChats([]);
            setError(null);
            setLoading(false);
            return;
        }

        let active = true;

        const cargarChats = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listarConversacionesRequest(token);
                if (!active) return;
                setChats(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!active) return;
                setChats([]);
                setError(e?.message || "No se pudieron cargar las conversaciones");
            } finally {
                if (!active) return;
                setLoading(false);
            }
        };

        cargarChats();

        return () => {
            active = false;
        };
    }, [isAuthenticated, token]);

    useEffect(() => {
        if (!isOpen) return;

        const onMouseDown = (e) => {
            const root = rootRef.current;
            if (!root) return;
            if (root.contains(e.target)) return;
            setIsOpen(false);
        };

        const onKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="chatDock" ref={rootRef}>
            <button
                type="button"
                className="chatDock__fab"
                onClick={() => setIsOpen((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls="chatDock-panel"
                title="Chats"
            >
                <span className="chatDock__fabIcon" aria-hidden="true">💬</span>
                <span className="chatDock__fabText">Chats</span>
            </button>

            {isOpen && (
                <aside
                    id="chatDock-panel"
                    className="chats"
                    role="dialog"
                    aria-label="Ventana de chats"
                >
                    <header className="chats__header">
                        <h4 className="chats__title">Chats</h4>
                        <button
                            type="button"
                            className="chats__close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Cerrar"
                            title="Cerrar"
                        >
                            ×
                        </button>
                    </header>

                    <div className="chats__body">
                        {!isAuthenticated ? (
                            <p className="chats__empty">Inicia sesión para ver tus conversaciones</p>
                        ) : loading ? (
                            <p className="chats__empty">Cargando...</p>
                        ) : error ? (
                            <p className="chats__empty chats__empty--error">{error}</p>
                        ) : chats.length === 0 ? (
                            <p className="chats__empty">No tienes conversaciones</p>
                        ) : (
                            chats.map((chat) => {
                                const other = chat?.otro_usuario;
                                const fullName = [other?.nombre, other?.apellido].filter(Boolean).join(" ") || "Usuario";
                                const initial = (other?.nombre?.[0] || other?.apellido?.[0] || "U").toUpperCase();

                                const rawDate = chat?.fecha_ultimo_mensaje;
                                const dateLabel = rawDate ? new Date(rawDate).toLocaleDateString() : "";

                                const isOwnLast = myUserId && chat?.ultimo_mensaje_emisor_id
                                    ? String(chat.ultimo_mensaje_emisor_id) === String(myUserId)
                                    : false;

                                const lastPrefix = isOwnLast ? "Tú: " : "";

                                return (
                                    <div
                                        key={chat.id_conversacion}
                                        className="chats__item"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate(`/mensajes/${chat.id_conversacion}`);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setIsOpen(false);
                                                navigate(`/mensajes/${chat.id_conversacion}`);
                                            }
                                        }}
                                    >
                                        <div className="chats__avatar" aria-hidden="true">
                                            {initial}
                                        </div>

                                        <div className="chats__content">
                                            <div className="chats__name">{fullName}</div>
                                            <div className="chats__last">
                                                {lastPrefix}{chat?.ultimo_mensaje || "Sin mensajes"}
                                            </div>
                                        </div>

                                        <div className="chats__time">{dateLabel}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>
            )}
        </div>
    );
    
}

export default ChatList;