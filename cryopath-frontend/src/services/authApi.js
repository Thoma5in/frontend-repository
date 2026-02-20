export async function loginRequest(email, password) {
  const response = await fetch('http://localhost:3001/auth/login' || import.meta.env.VITE_AUTH_API + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo: email, password }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    const errorMessage = errorJson?.message ;
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function registerRequest(payload) {
  const response = await fetch('http://localhost:3001/auth/register' || import.meta.env.VITE_AUTH_API + '/auth/register', {
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
