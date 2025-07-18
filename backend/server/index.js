import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

const app = express();
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

mongoose.connect("mongodb://localhost:27017/movieapp", {//temporary
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
