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

export async function asignarRol(token, payload) {
  const res = await fetch(`${BASE_URL}/admin/asignar-rol`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error al asignar rol');
  }

  return data;
}