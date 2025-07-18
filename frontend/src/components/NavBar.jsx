import './NavBar.css'
import { Link } from 'react-router-dom';

function NavBar(){
    return (
        <nav id='navBar'>
            <div id="mainDiv">
                <div id='nameDiv'>
                    Movies!
                </div>
                <div id='optionsDiv'>
                    <input type='text' id='searchBar' placeholder='Search...' />
                    <Link id='homeLnk' to='/'>Home</Link>
                    <Link id='aboutLnk' to='/about'>About</Link>
                </div>
                <div id='authDiv'>
                    <Link id='signupLnk' to='/signup'>SignUp</Link>
                    <Link id='loginLnk' to='/login'>Login</Link>
                </div>

            </div>
        </nav>
    );
}

export default NavBar