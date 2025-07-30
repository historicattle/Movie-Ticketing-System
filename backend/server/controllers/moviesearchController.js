import Movie from "../models/Movie.js";

//get movie by title for search 
export const getMovieByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const movie = await Movie.findOne({ title: title });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};