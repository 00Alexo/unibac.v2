import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/NavBar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <Routes>
          <Route 
            path="/" 
            element={<Home />} 
          />
          <Route 
            path="/home" 
            element={<Home />} 
          />
          <Route 
            path = "/signup"
            element={<SignUp/>}
          />
          <Route 
            path = "/signin"
            element={<SignIn/>}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
