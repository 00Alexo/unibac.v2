import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import MinaAi from './pages/MinaAi';
import {useEffect} from 'react';
import PosteazaSubiect from './pages/PosteazaSubiect';
import Cropper from './components/Cropper';
import LineBG from './components/LineBG';
import MouseFollower from './components/MouseFollower';
import WelcomePage from './pages/WelcomePage';
import Subiecte from './pages/Subiecte';
import ViewSubiect from './pages/ViewSubiect';
import ViewProfile from './pages/ViewProfile';
import Search from './pages/Search';
import CreateClass from './pages/CreateClass';
import ViewClass from './pages/ViewClass';
import ClaseList from './pages/ClaseList';
import SubiecteTracker from './pages/SubiecteTracker';
import Trivia from './pages/Trivia';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideNavBar = location.pathname === '/game';
  
  useEffect(() => {
    if (/^\/(minaai|subiectetracker)(\/.*)?$/.test(location.pathname.toLowerCase())) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [location]);

  return (
    <div className="App relative min-h-screen">
      {!hideNavBar && <NavBar />}
      <LineBG/>
      <MouseFollower/>
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route  path="/minaAI" element={<MinaAi/>} />
        <Route path="/minaAI/:convId" element={<MinaAi/>} />

        <Route path="/subiecte/posteaza" element={<PosteazaSubiect/>}/>
        <Route path="/subiecte/:materie" element={<Subiecte/>}/>
        <Route path="/subiecte/:materie/:subiectId" element={<ViewSubiect/>}/>

        <Route path="/profile/:username" element={<ViewProfile/>}/>
        <Route path="/profile/:username/:view" element={<ViewProfile/>}/>

        <Route path="/search/:search"element={<Search/>}/>

        <Route path="/clase/createClass" element={<CreateClass/>} />
        <Route path="/clase/:classId" element={<ViewClass/>}/>
        <Route path="/clase/:classId/:view" element={<ViewClass/>}/>
        <Route path="/clase" element={<ClaseList/>}/>

        <Route path="/subiecteTracker" element={<SubiecteTracker/>}/>

        <Route path="/games/trivia" element={<Trivia/>}/>

        <Route path="/testing/cropper" element={<Cropper />} />
      </Routes>
    </div>
  );
}

export default App;
