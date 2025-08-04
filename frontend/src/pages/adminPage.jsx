import { getMovieByName } from "../api/axiosConfig";
import { useState } from "react";
import "../styles/AdminPage.css";
import axios from "axios";

function AdminPage() {
    const [movieData, setMovieData] = useState({
        title: '',
        description: '',
        genre: '',
        rating: '',
        seats: '',
        cityId: '',
        theatreName: ''
    });

    function getMovieDetails(movieName) {
        if (!movieName.trim()) {
            console.error("Movie name is required");
            return;
        }

        getMovieByName(movieName)
            .then((data) => {
                console.log("Movie Details:", data);
                setMovieData({
                    title: data.title || movieName,
                    description: data.description || '',
                    genre: data.genre || '',
                    rating: data.rating || '',
                    seats: data.seats || '',
                    cityId: data.cityId || '',
                    theatreName: data.theatreName || ''
                });
            })
            .catch((error) => {
                console.error("Error fetching movie details:", error);
                setMovieData({
                    title: movieName,
                    description: '',
                    genre: '',
                    rating: '',
                    seats: '',
                    cityId: '',
                    theatreName: ''
                });
            });
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:3000/api/admin/addMovie', {
            title: movieData.title,
            description: movieData.description,
            genre: movieData.genre,
            rating: movieData.rating,
            seats: movieData.seats,
            cityId: movieData.cityId,
            theatreName: movieData.theatreName
        })
        .then(() => {
            alert("Movie added successfully!");
        })
        .catch((error) => {
            console.error("Error adding movie: ", error);
        });
    }

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-section movie-info-section">
                    <h3>Movie Information</h3>
                    <div className='combine'>
                        <label htmlFor='movieTitle'>Movie Title</label>
                        <input type="text" id="movieTitle" placeholder="Enter movie title" name="movieTitle" value={movieData.title} onChange={(e) => setMovieData(prev => ({ ...prev, title: e.target.value }))} required />
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={() => getMovieDetails(movieData.title)}>Get Movie Details</button>
                    </div>

                    <div className='combine'>
                        <label htmlFor='movieDescription'>Movie Description</label>
                        <textarea id="movieDescription" placeholder="Movie description will be filled automatically" name="movieDescription" value={movieData.description} readOnly rows="4" />
                    </div>

                    <div className='combine'>
                        <label htmlFor='movieGenre'>Genre</label>
                        <input type="text" id="movieGenre" placeholder="Genre will be filled automatically" name="movieGenre" value={movieData.genre} readOnly />
                    </div>

                    <div className='combine'>
                        <label htmlFor='movieRating'>Rating</label>
                        <input type="text" id="movieRating" placeholder="Enter movie rating (e.g., PG-13, R)" name="movieRating" value={movieData.rating} onChange={(e) => setMovieData(prev => ({ ...prev, rating: e.target.value }))} />
                    </div>
                </div>

                <div className="form-section theater-info-section">
                    <h3>Theater Information</h3>
                    <div className='combine'>
                        <label htmlFor="cityId">City ID</label>
                        <input type="number" id="cityId" placeholder="Enter city ID" name="cityId" required />
                    </div>

                    <div className='combine'>
                        <label htmlFor="theatreName">Theatre Name</label>
                        <input type="text" id="theatreName" placeholder="Enter theatre name" name="theatreName" required />
                    </div>

                    <div className='combine'>
                        <label htmlFor="seats">Available Seats</label>
                        <input type="number" id="seats" placeholder="Enter available seats" name="seats" required />
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" name="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default AdminPage;