import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'
import AboutPage from './pages/AboutPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/App.css'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import MovieCard from './components/MovieCard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><NavBar /><MovieCard /></>} />
        <Route path='/About' element={<AboutPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
