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

export async function obtenerProductoPorIdRequest(id, token) {
  const url = `${BASE_URL}/productos/${id}`;

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
    const message = payload?.message || payload?.error || 'No se pudo obtener el producto';
    throw new Error(message);
  }

  return payload;
}

export async function actualizarProductoRequest(id, producto, token) {
  const url = `${BASE_URL}/productos/${id}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(producto),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo actualizar el producto';
    throw new Error(message);
  }

  return payload;
}

export async function eliminarProductoRequest(id, token) {
  const url = `${BASE_URL}/productos/${id}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo eliminar el producto';
    throw new Error(message);
  }

  return payload;
}

async function uploadImagenRequest(relativePath, file, token) {
  const url = `${BASE_URL}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;

  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'No se pudo subir la imagen';
    throw new Error(message);
  }

  return payload;
}

export async function uploadImagenProductoRequest(idProducto, file, token) {
  return uploadImagenRequest(`/productos/${idProducto}/imagen`, file, token);
}

export async function obtenerImagenProductoRequest(idProducto, token) {
  const url = `${BASE_URL}/productos/${idProducto}/imagen`;

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
    const message =
      payload?.message ||
      payload?.error ||
      'No se pudo obtener la imagen del producto';
    throw new Error(message);
  }

  return payload; // { url: string }
}

export async function obtenerImagenesProductoRequest(idProducto, token) {
  const url = `${BASE_URL}/productos/${idProducto}/imagenes`;

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
    const message =
      payload?.message ||
      payload?.error ||
      'No se pudo obtener las imágenes del producto';
    throw new Error(message);
  }

  // Handle various response formats from backend
  // Could be: [{ url: string }], { imagenes: [...] }, { data: [...] }, etc.
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload?.imagenes && Array.isArray(payload.imagenes)) {
    return payload.imagenes;
  }
  if (payload?.data && Array.isArray(payload.data)) {
    return payload.data;
  }
  
  return [];
}

export async function eliminarImagenesProductoRequest(idProducto, token) {
  const url = `${BASE_URL}/productos/${idProducto}/imagenes`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      'No se pudieron eliminar las imágenes del producto';
    throw new Error(message);
  }

  return payload;
}

export async function buscarProductosRequest(query) {
  if (!query || query.trim().length < 2) return []

  const url = `${BASE_URL}/productos/buscar?q=${encodeURIComponent(query)}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = 
    payload?.message || payload?.error || 'No se pudo buscar los productos'
    throw new Error(message)
  }

  return payload
}

export async function obtenerProductosRelacionadosRequest(idProducto, { limit = 10 } = {}, token) {
  if (!idProducto) throw new Error('idProducto es requerido para obtener relacionados');

  const params = new URLSearchParams();
  if (limit && Number.isFinite(limit)) {
    params.set('limit', String(limit));
  }

  const url = `${BASE_URL}/productos/${idProducto}/relacionados${params.toString() ? `?${params.toString()}` : ''}`;

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
    const message = payload?.message || payload?.error || 'No se pudo obtener los productos relacionados';
    throw new Error(message);
  }

  // Manejar la estructura del backend: { productos: [...] }
  if (Array.isArray(payload)) return payload;
  if (payload?.productos && Array.isArray(payload.productos)) return payload.productos;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;

  return [];
}

// Deprecado: mantener compatibilidad temporal con nombre anterior
export const obtenerProductosRecomendadosRequest = obtenerProductosRelacionadosRequest;