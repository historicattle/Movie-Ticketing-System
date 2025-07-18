import express from "express";
import mongoose from "mongoose";//connection incomplete
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config(); //Load local variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Movie Routes
app.use("/api/movies", movieRoutes);

//MongoDB connection left 