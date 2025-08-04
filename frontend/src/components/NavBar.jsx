import { movieList } from '../api/axiosConfig';
import '../styles/NavBar.css'
import { Link } from 'react-router-dom';

function NavBar() {
    function handleSearch(e) {
        e.preventDefault()

        const movieNames=movieList.map(movie => movie.title.toLowerCase())
        const searchQuery = document.getElementById('searchBar').value.toLowerCase();

        if (movieNames.includes(searchQuery)) {
            const movie = movieList.find(movie => movie.title.toLowerCase() === searchQuery);
            if (movie) {
                return <MoviePage movieName={searchQuery} />
            }
        }
    }

    return (
        <nav id='navBar'>
            <div id="mainDiv">
                <div id='nameDiv'>
                    MovieBridge
                </div>
                <div id='optionsDiv'>
                    <input type='text' id='searchBar' placeholder='Search...' onKeyDown={e=>{if(e.key === 'Enter') handleSearch(e)}} />
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