import express from "express";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

// CREATE a movie
router.post("/", createMovie);

// GET all movies
router.get("/", getMovies);

// GET single movie by ID
router.get("/:id", getMovieById);

// UPDATE movie by ID
router.put("/:id", updateMovie);

// DELETE movie by ID
router.delete("/:id", deleteMovie);

export default router;
