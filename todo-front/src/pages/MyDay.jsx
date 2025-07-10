import GroupsSideBar from '../components/GroupsSideBar/GroupsSideBar'
import backgroundImage from '../../public/muralla_china.png'
import './MyDay.css'
import { TaskProvider } from '../components/Context/TaskContext';
import MainContent from '../components/MainContent/MainContent';

export default function MyDay(){
    return (
        <TaskProvider>
            <div className="MyDay" 
                style ={{ 
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh',
                    width: '100vw',
                    display: 'flex'
                }}
            >
                <GroupsSideBar/>
                <MainContent/>
            </div>
       </TaskProvider> 
    );
}