
const BASE_URL = 'http://localhost:3003';




async function handleResponse(res) {
  const data = await res.json();

  
  if (!res.ok){
    throw new Error(data.message || 'Error en la operación del carrito');
  }
  return data;
}

export async function obtenerCarrito(token, userId) {
  if (!token) throw new Error('Token requerido');
  if (!userId) throw new Error('userId requerido');

  const res = await fetch(`${BASE_URL}/cart/${userId}`, {
    method: 'GET',
    headers:{"Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  });

  return handleResponse(res); // luis estuvo aqui
}

export async function actualizarCantidad(token, userId, itemId, cantidad) {
  const res = await fetch(`${BASE_URL}/cart/${userId}/items/${itemId}`, 
  {
    method: 'PUT',
    headers:{"Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
    body: JSON.stringify({ cantidad }),
  });
return handleResponse(res);
}



export async function eliminarItem(token, userId, itemId) {
  const res = await fetch(`${BASE_URL}/cart/${userId}/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );
  return handleResponse(res);
}

export async function vaciarCarrito(token, userId) {
  const res = await fetch(`${BASE_URL}/cart/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}


export async function agregarAlCarrito(token, userId, payload) {
  if (!token) throw new Error("Token requerido");
  if (!userId) throw new Error("userId requerido");
  if (!payload) throw new Error("payload requerido");

  const res = await fetch(`${BASE_URL}/cart/${userId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al agregar al carrito");
  }

  return data;
}