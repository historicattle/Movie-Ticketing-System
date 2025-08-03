import express from 'express';
import { getMovieByTitle } from '../controllers/moviesearchController.js';

const router = express.Router();

router.get('/',getMovieByTitle);

export default router;