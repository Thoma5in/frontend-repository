const BASE_URL = 'http://localhost:3001';

export async function checkAdmin(token) {
  if (!token) {
    throw new Error('Token requerido');
  }

  const response = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No es administrador');
  }

  return true;
}