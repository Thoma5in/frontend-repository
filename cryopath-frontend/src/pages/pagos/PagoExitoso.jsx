import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PagoExitoso() {
    const navigate = useNavigate();
    const VITE_ORDERS_API = import.meta.env.VITE_ORDERS_API || 'http://localhost:3003';

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if(token) {
            fetch (`${VITE_ORDERS_API}/pagos/capturar/${token}`, {
                method: "POST",
            })
            .then (async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text);
                }
                return res.json();
                })
            .then(data => {
                console.log("CAPTURA", data);
                navigate("/home")
            })
            .catch(err => console.error(err))
        }
    }, [])

    return (
        <h2>Procesando pago...</h2>
    )
}

export default PagoExitoso;