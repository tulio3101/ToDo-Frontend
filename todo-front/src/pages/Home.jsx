import { useNavigate } from 'react-router-dom';
import MainPageButton from '../components/MainPageButton/MainPageButton';
import './Home.css'

function Home() {
    const navigate = useNavigate();

    return (
        <div className='home' >
            <img src="/to-do_icon.png" className='imagenPrincipal' alt="To Do icon" />
            <h1>To Do</h1>
            <div className='buttons'>
                <MainPageButton text='Sign in' onClick={() => navigate('/SignIn')} />
                <MainPageButton text='Sign up' onClick={() => navigate('/signup')} />
            </div>
        </div>
    );
}

export default Home;