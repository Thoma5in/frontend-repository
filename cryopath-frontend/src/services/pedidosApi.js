const BASE_URL = import.meta.env.VITE_ORDERS_API || 'http://localhost:3003';

async function parsePayload(response) {
	return response.json().catch(() => null);
}

function buildHeaders(token) {
	const headers = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
}

function resolveErrorMessage(payload, fallbackMessage) {
	return payload?.message || payload?.error || fallbackMessage;
}

export async function crearPedidoRequest(data, token) {
	const response = await fetch(`${BASE_URL}/pedidos`, {
		method: 'POST',
		headers: buildHeaders(token),
		body: JSON.stringify(data),
	});

	const payload = await parsePayload(response);

	if (!response.ok) {
		throw new Error(resolveErrorMessage(payload, 'No se pudo crear el pedido'));
	}

	return payload;
}

export async function obtenerPedidosPorUsuarioRequest(userId, token) {
	if (!userId) throw new Error('userId es requerido');

	const response = await fetch(`${BASE_URL}/pedidos/usuario/${userId}`, {
		method: 'GET',
		headers: buildHeaders(token),
	});

	const payload = await parsePayload(response);

	if (!response.ok) {
		throw new Error(resolveErrorMessage(payload, 'No se pudo obtener los pedidos del usuario'));
	}

	return payload;
}

export async function obtenerPedidoRequest(id, token) {
	if (!id) throw new Error('id del pedido es requerido');

	const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
		method: 'GET',
		headers: buildHeaders(token),
	});

	const payload = await parsePayload(response);

	if (!response.ok) {
		throw new Error(resolveErrorMessage(payload, 'No se pudo obtener el pedido'));
	}

	return payload;
}

export async function actualizarEstadoPedidoRequest(id, estado, token) {
	if (!id) throw new Error('id del pedido es requerido');
	if (!estado) throw new Error('estado es requerido');

	const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
		method: 'PUT',
		headers: buildHeaders(token),
		body: JSON.stringify({ estado }),
	});

	const payload = await parsePayload(response);

	if (!response.ok) {
		throw new Error(resolveErrorMessage(payload, 'No se pudo actualizar el estado del pedido'));
	}

	return payload;
}

export async function eliminarPedidoRequest(id, token) {
	if (!id) throw new Error('id del pedido es requerido');

	const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
		method: 'DELETE',
		headers: buildHeaders(token),
	});

	const payload = await parsePayload(response);

	if (!response.ok) {
		throw new Error(resolveErrorMessage(payload, 'No se pudo eliminar el pedido'));
	}

	return payload;
}

export async function listarTodosPedidosRequest(params = {}, token) {
	const { estado, limit = 50, offset = 0 } = params;

	const query = new URLSearchParams();

	if (estado) query.set('estado', estado);
	if (Number.isFinite(Number(limit))) query.set('limit', String(limit));
	if (Number.isFinite(Number(offset))) query.set('offset', String(offset));

	const queryString = query.toString();
	const url = `${BASE_URL}/pedidos${queryString ? `?${queryString}` : ''}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: buildHeaders(token),
	});

	const payload = await parsePayload(response);

	if (!response.ok) {
		throw new Error(resolveErrorMessage(payload, 'No se pudo listar los pedidos'));
	}

	return payload;
}
