import { useLocation, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import checkmark from '../assets/blue-checkmark.png'
import VantaGlobe from '../components/VantaGlobe';
import LineBG from '../components/LineBG';
import WelcomeHome from '../components/WelcomeHome';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [successfullyLoggedIn, setSuccessfullyLoggedIn] = useState(false);

    useEffect(() => {
        if (location.state?.fromSignup) {
            setSuccessfullyLoggedIn(true);
            navigate('.', { state: { fromSignup: false }, replace: true });
            setTimeout(() =>{
                setSuccessfullyLoggedIn(false);
            }, 5000)
        }
    }, [location]);

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
                <p className='text-center scslogin'> Successfully logged in! </p>
            </div>
            }
            <VantaGlobe/>
            <WelcomeHome/>
        </div>
    );
}
 
export default Home;