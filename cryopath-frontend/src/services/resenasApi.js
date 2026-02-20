const BASE_URL = import.meta.env.VITE_PRODUCTS_API || 'http://localhost:3002';

// Obtener reseñas de un producto con estadísticas
export async function obtenerResenasPorProducto(idProducto, { limit = 10, offset = 0 } = {}) {
  if (!idProducto) throw new Error('idProducto es requerido');

  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));

  const url = `${BASE_URL}/resenas/producto/${idProducto}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudieron obtener las reseñas';
    throw new Error(message);
  }

  return payload;
}

// Obtener solo el promedio de un producto
export async function obtenerPromedioProducto(idProducto) {
  if (!idProducto) throw new Error('idProducto es requerido');

  const url = `${BASE_URL}/resenas/producto/${idProducto}/promedio`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo obtener el promedio';
    throw new Error(message);
  }

  return payload;
}

// Crear una reseña
export async function crearResena(token, { id_producto, id_usuario, estrellas, comentario }) {
  if (!token) throw new Error('Token requerido');
  if (!id_producto || !id_usuario || estrellas === undefined) {
    throw new Error('id_producto, id_usuario y estrellas son obligatorios');
  }

  const url = `${BASE_URL}/resenas`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id_producto, id_usuario, estrellas, comentario }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo crear la reseña';
    throw new Error(message);
  }

  return payload;
}

// Editar una reseña
export async function editarResena(token, idResena, { id_usuario, estrellas, comentario }) {
  if (!token) throw new Error('Token requerido');
  if (!idResena || !id_usuario) throw new Error('idResena e id_usuario son obligatorios');

  const url = `${BASE_URL}/resenas/${idResena}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id_usuario, estrellas, comentario }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo editar la reseña';
    throw new Error(message);
  }

  return payload;
}

// Eliminar una reseña
export async function eliminarResena(token, idResena, id_usuario) {
  if (!token) throw new Error('Token requerido');
  if (!idResena || !id_usuario) throw new Error('idResena e id_usuario son obligatorios');

  const url = `${BASE_URL}/resenas/${idResena}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id_usuario }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo eliminar la reseña';
    throw new Error(message);
  }

  return payload;
}
