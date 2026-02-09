const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const obtenerPromociones = async () => {
	try {
		const response = await fetch(`${API_URL}/promociones`);
		if (!response.ok) {
			throw new Error('Error al obtener promociones');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en obtenerPromociones:', error);
		throw error;
	}
};

export const obtenerPromocionesConCategorias = async () => {
	try {
		const response = await fetch(`${API_URL}/promociones/con-categorias`);
		if (!response.ok) {
			throw new Error('Error al obtener promociones con categorías');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en obtenerPromocionesConCategorias:', error);
		throw error;
	}
};

export const obtenerPromocionesConProductos = async () => {
	try {
		const response = await fetch(`${API_URL}/promociones/con-productos`);
		if (!response.ok) {
			throw new Error('Error al obtener promociones con productos');
		}
		return await response.json();
	} catch (error) {
		console.error('Error en obtenerPromocionesConProductos:', error);
		throw error;
	}
};

export const crearPromocion = async (data, token) => {
	try {
		const response = await fetch(`${API_URL}/promociones`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { 'Authorization': `Bearer ${token}` })
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(errorData?.error || 'Error al crear la promoción');
		}

		return await response.json();
	} catch (error) {
		console.error('Error en crearPromocion:', error);
		throw error;
	}
};

export const crearPromocionProductos = async (data, token) => {
	try {
		const response = await fetch(`${API_URL}/promociones/productos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { 'Authorization': `Bearer ${token}` })
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(errorData?.error || 'Error al crear la promoción por productos');
		}

		return await response.json();
	} catch (error) {
		console.error('Error en crearPromocionProductos:', error);
		throw error;
	}
};
