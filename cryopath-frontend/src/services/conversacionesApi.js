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

  /**
   * Listar conversaciones del usuario autenticado
   */
  export async function listarConversacionesRequest(token) {
    const url = `${BASE_URL}/conversaciones`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.error ||
        'No se pudieron obtener las conversaciones';
      throw new Error(message);
    }

    return payload;
  }

export async function obtenerConversacionRequest(id_conversacion, token) {
  const response = await fetch(
    `${BASE_URL}/conversaciones/${id_conversacion}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      'No se pudo obtener la conversación';
    throw new Error(message);
  }

  return payload;
}

export async function enviarMensajeRequest(id_conversacion, contenido, token) {
    const url = `${BASE_URL}/conversaciones/${id_conversacion}/mensajes`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido }),
    })

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const message = payload?.error || 'No se pudo enviar el mensaje';
        throw new Error(message);
    }

    return payload;
}