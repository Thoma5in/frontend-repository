const BASE_URL = import.meta.env.VITE_MESSAGES_API || "http://localhost:3005";

/** 
 * Crear conversación + enviar primer mensaje (pregunta)
 */
export async function crearConversacionRequest({id_producto, mensaje}, token) {
    const url = `${BASE_URL}/conversaciones`;

    const headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({id_producto, mensaje}),
    })

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const message = payload?.message || payload?.error || 'No se pudo crear la conversación';
        throw new Error(message);
    }

    return payload;
}