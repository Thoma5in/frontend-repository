const BASE_URL = 'http://localhost:3001'

export async function getCurrentUsuario(token) {
  if (!token) {
    throw new Error('Token requerido para obtener los datos del usuario')
  }

  try {
    const response = await fetch(`${BASE_URL}/usuarios/me`, {
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

export async function updateUsuario(data, token) {
  const response = await fetch(`${BASE_URL}/usuarios/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,

    },
    body: JSON.stringify(data),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.message || 'No se pudo actualizar el usuario')
  }

  return payload
}

export async function deleteMyAccount(token) {
  if (!token) {
    throw new Error('Token requerido para eliminar la cuenta')
  }

  const response = await fetch(`${BASE_URL}/usuarios/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = 
    payload?.message || payload?.error || 'No se pudo eliminar la cuenta'
    throw new Error(message)
  }

  return payload
}

export async function checkEmail(correo) {
  if (!correo) {
    throw new Error('Correo requerido')
  }

  const response = await fetch(`${BASE_URL}/usuarios/check-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo }), 
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.message || payload?.error || 'Error al validar el correo'
    throw new Error(message)
  }

  return payload
}

export async function reactivateAccount(correo) {
  const response = await fetch(`${BASE_URL}/usuarios/reactivate`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo }),
  })

  if (!response.ok) {
    const payload = await response.json()
    throw new Error(payload.message)
  }

  return response.json()
}
