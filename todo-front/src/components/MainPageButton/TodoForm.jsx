import { useState, useEffect } from 'react';

export default function TodoForm({}){
    const [texto, setTexto] = useState(' ');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!texto.trim()) return;
        onAdd(texto);
        setTexto('');
    }

    return (
        <form onSubmit ={handleSubmit}>
            <input value = {texto}
                onChange = {(e) => setTexto(e.target.value)}
                placeholder = "Email"
            />
        </form>
    )
}