import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/NavBar';

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
