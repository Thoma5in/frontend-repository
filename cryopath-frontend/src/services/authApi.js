export async function loginRequest(email, password) {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo: email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Error al iniciar sesión');
    throw new Error(errorText || 'Error al iniciar sesión');
  }

  return response.json();
}
