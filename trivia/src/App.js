import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Trivia from './pages/Trivia';
import NavBar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const params = new URLSearchParams(window.location.search);

  const user = params.get('user'); 
  const id = params.get('id');
  
  const userData = {
    username: user,
    token: id
  };
  
  // Salvează ca șir JSON sub cheia 'user'
  localStorage.setItem('user', JSON.stringify(userData));
  return (
    <div className="App relative min-h-screen">
      {/* <LineBG/>
      <MouseFollower/> */}
      <NavBar/>
      <Routes>
        <Route path="/" element={<Trivia />} />
      </Routes>
    </div>
  );
}

export default App;
