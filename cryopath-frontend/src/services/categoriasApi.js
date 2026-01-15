const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const listarCategorias = async () => {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
        throw new Error('Error al listar categorías');
    }
    return response.json();
};

export const obtenerCategoriaDeProducto = async (idProducto) => {
    const response = await fetch(`${API_URL}/producto/${idProducto}/categoria`);
    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Error al obtener la categoría del producto');
    }
    return response.json();
};

export const obtenerCategoria = async (id) => {
    const response = await fetch(`${API_URL}/categorias/${id}`);
    if (!response.ok) {
        throw new Error('Error al obtener categoría');
    }
    return response.json();
};

export const crearCategoria = async (data, token) => {
    const response = await fetch(`${API_URL}/categorias`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear categoría');
    }
    return response.json();
};

export const actualizarCategoria = async (id, data, token) => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar categoría');
    }
    return response.json();
};

export const eliminarCategoria = async (id, token) => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar categoría');
    }
    return true;
};