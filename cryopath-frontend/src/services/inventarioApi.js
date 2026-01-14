

const BASE_URL = import.meta.env.VITE_PRODUCTOS_API_URL || 'http://localhost:3002';

// Público o autenticado
export const getInventario = async () => {
    const res = await fetch(`${BASE_URL}/inventario`);
    if (!res.ok) throw new Error('Error obteniendo inventario');
    return res.json();
};

export const getInventarioByProducto = async (id_producto) => {
    const res = await fetch(`${BASE_URL}/inventario/producto/${id_producto}`);
    if (!res.ok) throw new Error('Inventario no encontrado');
    return res.json();
};

/** 
// SOLO PANEL ADMIN
export const createInventario = async (inventarioData, token) => {
    const res = await fetch(`${BASE_URL}/inventario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(inventarioData)
    });

    if (!res.ok) throw new Error('Error creando inventario');
    return res.json();
};
*/

export const updateInventario = async (id_producto, cantidad_disponible, token) => {
    const res = await fetch(`${BASE_URL}/inventario/producto/${id_producto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad_disponible })
    });

    if (!res.ok) throw new Error('Error actualizando inventario');
    return res.json();
};
