import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import UnityGame from './pages/UnityGame';
import MinaAi from './pages/MinaAi';
import {useEffect} from 'react';

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
    if (location.pathname.toLowerCase() === '/minaai' || location.pathname.toLowerCase() === '/minaai/:convId') {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [location]);

  return (
    <div className="App">
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/game" element={<UnityGame />} />
        <Route  path="/minaAI" element={<MinaAi/>} />
        <Route path="/minaAI/:convId" element={<MinaAi/>} />
      </Routes>
    </div>
  );
}

export default App;
