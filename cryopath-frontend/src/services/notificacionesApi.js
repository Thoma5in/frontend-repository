const BASE_URL = import.meta.env.VITE_MESSAGES_API || "http://localhost:3005";

export async function obtenerNotificacionesRequest(token) {
    

    const headers = {
        'Content-Type': 'application/json',
    } 

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/notificaciones`, {
        method: 'GET',
        headers,
    })

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const message = 
        payload?.message || 
        payload?.error || 
        'Error al obtener las notificaciones';
        throw new Error(message);
    }

    return payload;
}

export async function marcarNotificacionLeidaRequest(id, token) {
    const response = await fetch(`${BASE_URL}/notificaciones/${id}/leida`, 
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,   
            },
        }
    )

    if (!response.ok) throw new Error('Error al marcar la notificación como leída');
}

export async function marcarTodasLeidasRequest(token) {
    const response = await fetch(`${BASE_URL}/notificaciones/marcar-todas`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) throw new Error('Error al marcar todas las notificaciones como leídas');
}