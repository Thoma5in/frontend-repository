const BASE_URL = import.meta.env.VITE_AUTH_API || 'http://localhost:3001';

function normalizeDireccionesPayload(payload) {
    if (!payload) return []
    if (Array.isArray(payload)) return payload

    const candidates = [
        payload?.direcciones,
        payload?.data?.direcciones,
        payload?.data,
        payload?.rows,
        payload?.result,
    ]

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate
    }

    return []
}

export async function getDirecciones(token) {
    if (!token) {
        throw new Error('Token requerido para obtener las direcciones')
    }

    try {
        const response = await fetch(`${BASE_URL}/usuarios/direcciones`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const payload = await response.json().catch(() => null)

        if (!response.ok) {
            const message = payload?.message || payload?.error || 'No se pudo obtener las direcciones'
            throw new Error(message)
        }

        return normalizeDireccionesPayload(payload)
    } catch (error) {
        throw new Error(error.message || 'Error al cargar las direcciones del usuario')
    }
}

export async function agregarDireccion(data, token) {
    if (!token) {
        throw new Error('Token requerido para agregar una dirección')
    }

    const response = await fetch(`${BASE_URL}/usuarios/direcciones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    const payload = await response.json().catch(() => null)
    
    if (!response.ok) {
        const message = payload?.message || payload?.error || 'No se pudo agregar la dirección'
        throw new Error(message)
    }

    return payload
}