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
            <div class="after-loggin-animation fixed top-0 left-0 right-0 origin-left z-50">
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

            {user &&
                <>
                    testhome
                </>
            }

            {/* Footer */}
            {/* <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="mb-4">© 2024 EduPlatform. Toate drepturile rezervate.</p>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="hover:text-blue-400">Termeni și condiții</a>
                        <a href="#" className="hover:text-blue-400">Politică de confidențialitate</a>
                        <a href="#" className="hover:text-blue-400">Contact</a>
                    </div>
                </div>
            </footer> */}

            {!user && <WelcomePage/>}
            <div style={{backgroundColor:'#222222', width:'100%', height:'25px', position:'fixed', bottom: 0}} className='flex justify-center items-center'> 
                <p style={{marginBottom: 0, color:'white', fontSize:'0.8rem'}}> Istorie si Societate in Dimensiune Virtuala | Sectiunea Softuri educationale - Ştiinţe socio-umane | Creator: Suciu Alex, Clasa a XI-a A, Liceul  Teoretic Carei | Profesori coordonatori: Laslo Ion si Madaras Monica. <br/></p>
            </div>
        </div>
    );
}
 
export default Home;