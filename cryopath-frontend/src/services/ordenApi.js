const BASE_URL = import.meta.env.VITE_ORDERS_API || "http://localhost:3003";

export async function crearOrdenRequest(data, token) {
    const response = await fetch (`${BASE_URL}/orden`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",   
        },
        body: JSON.stringify(data),
    })

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(payload?.error ||  "Error al crear orden");
    }

    return payload;
}
