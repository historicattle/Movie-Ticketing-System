import { getMovieByName } from "../api/axiosConfig"

function MoviePage({ movieName}){
    const {movie}=getMovieByName(movieName)
    if (!movie) {
        return <div>Movie not found</div>
    }
    return (
        <div className="container">
            <img src={movie.posterUrl} />
            <div className="movie-details">
                <h1>{movie.title}</h1>
                <p>{movie.description}</p>
            </div>
        </div>
    );
}

export default MoviePage