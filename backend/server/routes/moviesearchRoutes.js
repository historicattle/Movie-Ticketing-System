import express from 'express';
import { getMovieByTitle } from '../controllers/movieSearch';

const router = express.Router();

router.get('/',getMovieByTitle);

export default router;