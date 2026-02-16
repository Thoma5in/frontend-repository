const BASE_URL = import.meta.env.VITE_ORDERS_API || "http://localhost:3003";

export async function crearPedidoYPagoRequest(idOrden, token) {
    const response = await fetch (`${BASE_URL}/pagos/crear-paypal/${idOrden}`, {
        method: "POST",
        headers: { 
            Authorization: token ? `Bearer ${token}` : "",   
        },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Error al crear orden en Paypal");    
    }

    return payload;

}
