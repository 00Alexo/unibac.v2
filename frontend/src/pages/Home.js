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
            <div className="relative z-10 container mx-auto px-4 py-12">
                <section className="text-center mb-20">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">
                        Bine ai venit{user && `, ${user.username}`}!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Platforma ta interactivă pentru învățare și colaborare
                    </p>
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => navigate('/subiecte/economie')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Explorează subiecte
                        </button>
                        {user && (
                            <button 
                                onClick={() => navigate('/subiecte/posteaza')}
                                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all"
                            >
                                Creează subiect nou
                            </button>
                        )}
                    </div>
                </section>

                <section className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-bold mb-4">📚 Resurse Educaționale</h3>
                        <p className="text-gray-600">Accesează mii de subiecte și materiale de studiu actualizate</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-bold mb-4">💡 Soluții Interactive</h3>
                        <p className="text-gray-600">Rezolvă exerciții direct pe platformă cu feedback instant</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-bold mb-4">🏆 Clasamente</h3>
                        <p className="text-gray-600">Concurează cu alți utilizatori și urcă în clasament</p>
                    </div>
                </section>

                <section className="bg-blue-100 rounded-2xl p-8 mb-20">
                    <h2 className="text-3xl font-bold text-center mb-8">Platforma noastră în numere</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600">NULL</div>
                            <div className="text-gray-600">Utilizatori activi</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600">NULL</div>
                            <div className="text-gray-600">Subiecte rezolvate</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600">NULL</div>
                            <div className="text-gray-600">Rata de succes</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600">NULL</div>
                            <div className="text-gray-600">Disponibilitate</div>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-8">Accesează rapid</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button onClick={() => navigate(`/minaAi`)}
                        className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                            📝 MinaAi
                        </button>
                        <button onClick={() => navigate(`/subiecteTracker`)}
                        className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                            📈 Progres personal
                        </button>
                        <button onClick={() => navigate(`/profile/${user.username}/achievements`)}
                        className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                            🏅 Achievements
                        </button>
                    </div>
                </section>
            </div>

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
        </div>
    );
}
 
export default Home;