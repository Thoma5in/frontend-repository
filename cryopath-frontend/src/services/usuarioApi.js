const BASE_URL = 'http://localhost:3001'

export async function getCurrentUsuario(token) {
  if (!token) {
    throw new Error('Token requerido para obtener los datos del usuario')
  }

  try {
    const response = await fetch(`${BASE_URL}/usuario/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const message = payload?.message || payload?.error || 'No se pudo obtener el perfil'
      throw new Error(message)
    }

    return payload?.usuario ?? null
  } catch (error) {
    throw new Error(error.message || 'Error al cargar el perfil del usuario')
  }
}