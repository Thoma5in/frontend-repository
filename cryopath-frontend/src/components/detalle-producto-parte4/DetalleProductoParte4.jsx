import { useState } from 'react';
import './DetalleProductoParte4.css';

const DetalleProductoParte4 = () => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const value = question.trim();
        if (!value) return;

        //Conectar con API/estado global cuando esté definido.
       
        setQuestion('');
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
                    id="dp4-question"
                    className="dp4__input"
                    type="text"
                    placeholder="Escribe tu pregunta..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button className="dp4__button" type="submit" disabled={!question.trim()}>
                    Enviar
                </button>
            </form>
        </section>
    );
};

export default DetalleProductoParte4;