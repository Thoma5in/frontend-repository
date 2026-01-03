const BASE_URL = import.meta.env.VITE_PRODUCTOS_API_URL || 'http://localhost:3002';

export async function crearProductoRequest(producto, token) {
  const url = `${BASE_URL}/productos`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(producto),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo crear el producto';
    throw new Error(message);
  }

  return payload;
}



export async function obtenerProductosRequest(token) {
  const url = `${BASE_URL}/productos`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo obtener la lista de productos';
    throw new Error(message);
  }

  return payload;
}

