const BASE_URL = import.meta.env.VITE_PRODUCTS_API || 'http://localhost:3002';

/**
 * POST /supercategorias
 * Crear una nueva supercategoría
 */
export const crearSupercategoria = async (nombre, descripcion, estado = true) => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                descripcion,
                estado
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear supercategoría');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en crearSupercategoria:', error);
        throw error;
    }
};

/**
 * GET /supercategorias
 * Listar todas las supercategorías
 */
export const listarSupercategorias = async () => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al listar supercategorías');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en listarSupercategorias:', error);
        throw error;
    }
};

/**
 * GET /supercategorias/:id_super_categoria
 * Obtener una supercategoría por ID
 */
export const obtenerSupercategoria = async (id_super_categoria) => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias/${id_super_categoria}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Supercategoría no encontrada');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en obtenerSupercategoria:', error);
        throw error;
    }
};

/**
 * PUT /supercategorias/:id_super_categoria
 * Actualizar una supercategoría
 */
export const actualizarSupercategoria = async (id_super_categoria, datos) => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias/${id_super_categoria}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar supercategoría');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en actualizarSupercategoria:', error);
        throw error;
    }
};

/**
 * DELETE /supercategorias/:id_super_categoria
 * Eliminar una supercategoría
 */
export const eliminarSupercategoria = async (id_super_categoria) => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias/${id_super_categoria}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar supercategoría');
        }

        return response.status === 204 ? { success: true } : await response.json();
    } catch (error) {
        console.error('Error en eliminarSupercategoria:', error);
        throw error;
    }
};

/**
 * GET /supercategorias/:id_super_categoria/categorias
 * Obtener todas las categorías de una supercategoría
 */
export const obtenerCategoriasDeSupercategoria = async (id_super_categoria) => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias/${id_super_categoria}/categorias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener categorías');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en obtenerCategoriasDeSupercategoria:', error);
        throw error;
    }
};

/**
 * POST /supercategorias/:id_super_categoria/categorias/:id_categoria
 * Asignar una categoría a una supercategoría
 */
export const asignarCategoriaASupercategoria = async (id_super_categoria, id_categoria) => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias/${id_super_categoria}/categorias/${id_categoria}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al asignar categoría');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en asignarCategoriaASupercategoria:', error);
        throw error;
    }
};

/**
 * DELETE /supercategorias/:id_super_categoria/categorias/:id_categoria
 * Desasignar una categoría de una supercategoría
 */
export const desasignarCategoriaDeSupercategoria = async (id_super_categoria, id_categoria) => {
    try {
        const response = await fetch(`${BASE_URL}/supercategorias/${id_super_categoria}/categorias/${id_categoria}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al desasignar categoría');
        }

        return response.status === 204 ? { success: true } : await response.json();
    } catch (error) {
        console.error('Error en desasignarCategoriaDeSupercategoria:', error);
        throw error;
    }
};

/**
 * GET /supercategorias/:id_super_categoria/productos
 * Obtener productos filtrados por supercategoría
 * 
 * @param {number} id_super_categoria - ID de la supercategoría
 * @param {Object} opciones - Opciones de filtrado
 * @param {number} opciones.limit - Número de productos a retornar (default: 100)
 * @param {number} opciones.offset - Número de productos a saltar (default: 0)
 * @param {string} opciones.estado - Filtrar por estado (default: "activo")
 */
export const obtenerProductosPorSupercategoria = async (id_super_categoria, opciones = {}) => {
    try {
        const { limit = 100, offset = 0, estado = "activo" } = opciones;
        
        const params = new URLSearchParams({
            limit,
            offset,
            estado
        });

        const response = await fetch(
            `${BASE_URL}/supercategorias/${id_super_categoria}/productos?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener productos');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en obtenerProductosPorSupercategoria:', error);
        throw error;
    }
};

