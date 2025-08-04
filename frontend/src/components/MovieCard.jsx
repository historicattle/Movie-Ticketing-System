import { useEffect, useState } from 'react';
import { movieList } from '../api/axiosConfig.jsx';
import '../styles/MovieCard.css'

function MovieCard() {
	const [movies, setMovies] = useState([]);

	useEffect(() => {
		movieList().then(
			data => {
				const formattedMovies = data.map(res => ({
					id: res.id,
					title: res.title,
					description: res.description,
					genre: res.genre,
					language: res.language
					// posterUrl: res.posterUrl
				}));
				setMovies(formattedMovies);
			}
		).catch(err => {
			console.log(err);
			setMovies([])
		})

	}, [])

	return (
		<>
			<div id='movieCardContainer'>
				{movies.map(movie => (
					<div key={movie.movieId} className='movieCard'>
						<img src={movie.posterUrl} />
						<h3>{movie.title}</h3>
						<p>{movie.description}</p>
						<p>Genre: {movie.genre}</p>
					</div>
				))}
			</div>
		</>
	)
}
		
export default MovieCard