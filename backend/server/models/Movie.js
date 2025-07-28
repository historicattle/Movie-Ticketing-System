import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    availableseats: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
