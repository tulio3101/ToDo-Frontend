import React from 'react';

export default function ToDoText({ value, onChange, placeholder = "", type = "text" }) {
    return (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
        />
    );
}