const BASE_URL = import.meta.env.VITE_AUTH_API || 'http://localhost:3001';

export async function checkWorker(token) {
  const response = await fetch(`${BASE_URL}/trabajador/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No es trabajador');
  }

  return true;
}