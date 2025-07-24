import './SignUp.css'
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import Home from "../pages/Home"
import MainPageButton from "../components/MainPageButton/MainPageButton";
import ToDoText from "../components/ToDoText/ToDoText";
import validator from 'validator';
import axios from 'axios';


export default function SignUp(){
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async() => {
        if(!email || !password || !name){
            setEmail('');
            setName('');
            setPassword('');
            alert("Please complete all fields");
            return;
        }
        if (!validator.isEmail(email)) {
            setEmail('');
            setName('');
            setPassword('');
            alert("Please enter a valid email");
            return;
        }

        try{
            const response = await axios.post('http://localhost:8080/auth/validate/register', {
            correoElectronico: email,
            nombre: name,
            contrasena: password
            });
            
            const userData = response.data;
            localStorage.setItem('usuario', JSON.stringify(userData));
            alert("Registro exitoso");
            navigate("/MyDay");
             
        } catch (error) {
            console.error("Sign Up error:", error);
            alert("An error occurred during sign up");
            setEmail('');
            setName('');
            setPassword('');
        }
        
    }

    const handleBack = () => {
        navigate('/')
    }

    return (
        <div className = 'SignUp'>
            <h1>Sign Up</h1>
            <div className = 'data'>
                <h3 className = 'nameColor'>Name</h3>
                <ToDoText value ={name} onChange ={e => setName(e.target.value)} placeholder = "Name" type = "text" />
                <h3 className = 'emailColor'>Email</h3>
                <ToDoText value = {email} onChange ={e => setEmail(e.target.value)} placeholder = "Email" type = "email" />
                <h3 className = 'passwordColor'>Password</h3>
                <ToDoText value = {password} onChange = {e => setPassword(e.target.value)} placeholder = "Password" type = "password" />
                <MainPageButton text = "Sign Up" onClick = {handleSignUp} />
                <MainPageButton text = "Back" onClick = {handleBack} />
                 {
    
                 }
            </div>
        </div>
    );
}