import { useLocation, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import checkmark from '../assets/blue-checkmark.png'
import VantaGlobe from '../components/VantaGlobe';
import LineBG from '../components/LineBG';
import WelcomeHome from '../components/WelcomeHome';
import WelcomePage from './WelcomePage';
import { StarsComponent } from '../components/StarComponent';
import { useAuthContext } from '../hooks/useAuthContext';
import { useGetProfile } from '../hooks/useGetProfile';
import { useViewClass } from '../hooks/useViewClass';

const Home = () => {
    const {user} = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [successfullyLoggedIn, setSuccessfullyLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [mesaj, setMesaj] = useState('');
    const {viewUser: userData, error, isLoading, refetchProfile} = useGetProfile(user?.username);
    const {classData, refetchClass} = useViewClass(userData?.clase[0]?.classId, user?.username);

    useEffect(() => {
        console.log('Class ID:', userData?.clase[0]?.classId);
        console.log('Username:', user?.username);
        if(userData?.clase[0]?.classId) {
            refetchClass();
        }
      }, [userData, user]);

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
                <div className="min-h-[100vh-72px] p-8 bg-gray-50">
                <div className="max-w-6xl mx-auto relative z-10">
                  <h1 className="text-3xl font-bold text-gray-800 mb-8">Bun venit, {user?.username}!</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-700">Progresul tău</h2>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {userData?.subiecte?.length || 0} subiecte
                          </span>
                        </div>
                        <div className="h-48 bg-[#181e1c] rounded-lg mb-4">
                          <StarsComponent particleAmount={userData?.subiecte?.length} />
                        </div>
                        <button 
                          onClick={() => navigate('/subiecteTracker')}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Vezi constelația completă
                        </button>
                      </div>
            
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Continuă ultimul subiect</h2>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-gray-800">{userData?.subiecte?.reverse()[0]?._id}</h3>
                            <p className="text-sm text-gray-500">Ultima accesare:  Ieri</p>
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md">
                                <span className={
                                    34 < 50 
                                    ? 'text-red-600' 
                                    : 34 >= 50 && 34< 90 
                                        ? 'text-yellow-400' 
                                        : 'text-green-600'
                                }> 34 </span> 
                          </div>
                        </div>
                        <button onClick={() => navigate(`/subiecte/economie/${userData?.subiecte.reverse()[0]._id}`)}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Continuă acum
                        </button>
                      </div>
                    </div>
            
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Clasa ta</h2>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="bg-indigo-100 p-3 rounded-xl">
                            <span className="text-2xl">🏫</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{classData?.className}</h3>
                            <p className="text-sm text-gray-500">{classData?.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Profesor coordonator:</span>
                            <span className="text-gray-700">{classData?.creator}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Elevi în clasă:</span>
                            <span className="text-gray-700">{classData?.students?.length}</span>
                          </div>
                        </div>
                      </div>
            
                      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Clasament {userData?.judet || 'Bucuresti'}</h2>
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((position) => (
                            <div key={position} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm 
                                  ${position === 1 ? 'bg-yellow-500 text-white' : 
                                    position === 2 ? 'bg-gray-400 text-white' : 
                                    position === 3 ? 'bg-amber-700 text-white' : 'bg-gray-100'}`}>
                                  {position}
                                </span>
                                <span onClick={() => navigate(`/profile/${classData?.students[position-1]}`)} 
                                className="cursor-pointer text-gray-700">{classData?.students?.length > 0 && classData?.students[position-1]}</span>
                              </div>
                              <span className="text-gray-600">{37 - position*7} subiecte</span>
                            </div>
                          ))}
                          <button className="w-full text-blue-600 hover:text-blue-800 text-sm mt-4">
                            Vezi clasamentul complet →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            {!user && <WelcomePage/>}
            <div className='flex justify-center items-center fixed bottom-0 w-[100vw] bg-slate-300 z-10 pt-1 pb-1 p-2'> 
                <p className='text-md'> Istorie si Societate in Dimensiune Virtuala | Sectiunea Softuri educationale - Ştiinţe socio-umane | Creator: Suciu Alex, Clasa a XI-a A, Liceul  Teoretic Carei | Profesori coordonatori: Laslo Ion si Madaras Monica. <br/></p>
            </div>
        </div>
    );
}
 
export default Home;