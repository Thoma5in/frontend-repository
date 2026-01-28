import { useState } from 'react';
import './DetalleProductoParte4.css';
import {useAuth} from "../../context/AuthContext.jsx";
import { crearConversacionRequest } from '../../services/conversacionesApi.js';

const DetalleProductoParte4 = ({idProducto}) => {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const {session, user, profile} = useAuth();

    const authToken = session?.access_token ?? user?.token ?? ""


    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = question.trim();
        if (!value) return;

        try {
            setLoading(true);

            console.log({
            idProducto,
            mensaje: value,
            });

            await crearConversacionRequest(
                {
                    id_producto: idProducto,
                    mensaje: value,
                },
                authToken
            )

            setQuestion('');
        } catch (error) {
            console.error(error);
            alert((error.message))
        } finally {
            setLoading(false);
        }

    };

    return (
        <section className="dp4" aria-labelledby="dp4-title">
            <h2 id="dp4-title" className="dp4__title">
                Preguntas
            </h2>

            <form className="dp4__form" onSubmit={handleSubmit}>
                <label className="dp4__srOnly" htmlFor="dp4-question">
                    Escribe tu pregunta
                </label>
                <input
                    
                    className="dp4__input"
                    type="text"
                    placeholder="Escribe tu pregunta..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                />
                <button className="dp4__button" type="submit" disabled={!question.trim() || loading}>
                    {loading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </section>
    );
};

export default DetalleProductoParte4;