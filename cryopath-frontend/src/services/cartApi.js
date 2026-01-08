
const BASE_URL = 'http://localhost:3003';

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en la operación del carrito');
  return data;
}

export async function obtenerCarrito(token, userId) {
  if (!token) throw new Error('Token requerido');
  if (!userId) throw new Error('userId requerido');

  const res = await fetch(`${BASE_URL}/cart/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res); // { success, data: [...] }
}

export async function agregarAlCarrito(token, userId, payload) {
  if (!token) throw new Error('Token requerido');
  if (!userId) throw new Error('userId requerido');

  const res = await fetch(`${BASE_URL}/cart/${userId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function actualizarCantidad(token, userId, itemId, cantidad) {
  if (!token) throw new Error('Token requerido');
  if (!userId || !itemId) throw new Error('userId e itemId requeridos');

  const res = await fetch(`${BASE_URL}/cart/${userId}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ cantidad }),
  });
  return handle(res);
}

export async function eliminarItem(token, userId, itemId) {
  if (!token) throw new Error('Token requerido');
  if (!userId || !itemId) throw new Error('userId e itemId requeridos');

  const res = await fetch(`${BASE_URL}/cart/${userId}/items/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function vaciarCarrito(token, userId) {
  if (!token) throw new Error('Token requerido');
  if (!userId) throw new Error('userId requerido');

  const res = await fetch(`${BASE_URL}/cart/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}