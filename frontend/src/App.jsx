import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'
import AboutPage from './pages/AboutPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './pages/SignUp'
import Login from './pages/Login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><NavBar /><HomePage /></>} />
        <Route path='/About' element={<AboutPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
