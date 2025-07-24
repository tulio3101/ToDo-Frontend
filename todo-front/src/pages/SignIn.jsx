import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SignIn.css";
import MainPageButton from "../components/MainPageButton/MainPageButton";
import ToDoText from "../components/ToDoText/ToDoText";
import validator from 'validator';
import axios from 'axios';

export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async() => {
    if (!email || !password) {
        alert("Please complete all fields");
        setEmail('');
        setPassword('');
        return;
    }

    if (!validator.isEmail(email)) {
        alert("Please enter a valid email");
        setEmail('');
        return;
    }

    try{
        const response = await axios.post('http://localhost:8080/auth/validate/login', { 
        correoElectronico: email,
        contrasena: password
        });
        const userData = response.data; 
        localStorage.setItem('usuario', JSON.stringify(userData));

        alert("Login successful");
        navigate("/MyDay");

    } catch (error) {
        console.error("Sign Up error:", error); 
        if (error.response) {
            console.error("Response data:", error.response.data);       
            console.error("Status code:", error.response.status);        
            console.error("Headers:", error.response.headers);           
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error message:", error.message);
        }        
        alert("El usuario o la contraseña son incorrectos");
        setEmail('');
        setPassword('');
    }    
}


    const handleBack = () => {
        navigate('/')
        }
    

    return (
        <div className='SignIn'>
            <h1>Sign In</h1>
            <div className='data'>
                <h3 className = 'emailColor'>Email</h3>
                <ToDoText
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="Email"
                />

                <h3 className = 'passwordColor'>Password</h3>
                <ToDoText
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                />

                <MainPageButton text="Sign In" onClick= {handleSignIn} />
                <MainPageButton text ="Back" onClick = {handleBack} />

            </div>
        </div>
    );
}
