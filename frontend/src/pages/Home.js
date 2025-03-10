import { useLocation, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import checkmark from '../assets/blue-checkmark.png'
import VantaGlobe from '../components/VantaGlobe';
import LineBG from '../components/LineBG';
import WelcomeHome from '../components/WelcomeHome';
import WelcomePage from './WelcomePage';
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
    const {user} = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [successfullyLoggedIn, setSuccessfullyLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [mesaj, setMesaj] = useState('');

    useEffect(() => {
        setLoading(false);
    }, [user]);


    useEffect(() => {
        if (location.state?.fromSignup) {
            setSuccessfullyLoggedIn(true);
            navigate('.', { state: { fromSignup: false }, replace: true });
            setMesaj('Successfully logged in!');
            setTimeout(() =>{
                setSuccessfullyLoggedIn(false);
            }, 5000)
        }
        if (location.state?.fromPostareSubiect) {
            setSuccessfullyLoggedIn(true);
            navigate('.', { state: { fromPostareSubiect: false }, replace: true });
            setMesaj('Subiectul a fost postat cu succes!');
            setTimeout(() =>{
                setSuccessfullyLoggedIn(false);
            }, 5000)
        }
    }, [location]);

    if (loading) {
        return null; 
    }
    return (
        <div>
            {successfullyLoggedIn &&
            <div class="after-loggin-animation">
                <div class="center">
                    <img src={checkmark} class="thumb"/>
                    <div class="circle-wrap">
                    <div class="circle-lg"></div>
                    </div>
                    <div class="dots-wrap">
                    <div class="dot dot--t"></div>
                    <div class="dot dot--tr"></div>
                    <div class="dot dot--br"></div>
                    <div class="dot dot--b"></div>
                    <div class="dot dot--bl"></div>
                    <div class="dot dot--tl"></div>
                    </div>
                </div>
                <p className='text-center scslogin'> {mesaj} </p>
            </div>
            }
            {!user && <WelcomePage/>}
        </div>
    );
}
 
export default Home;