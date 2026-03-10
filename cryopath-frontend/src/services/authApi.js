const BASE_URL = import.meta.env.VITE_AUTH_API || 'http://localhost:3001';


export async function loginRequest(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo: email, password }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    const errorMessage = errorJson?.message || errorJson?.error || 'Error al iniciar sesión';
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function registerRequest(payload) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null)
    const errorMessage = errorJson?.message || errorJson?.error || 'Error en el registro'
    throw new Error(errorMessage)
  }

  return response.json()
}
