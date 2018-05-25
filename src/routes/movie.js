import express from 'express';
import { pick } from 'lodash';
import { validateObjectId, validateMovie } from '../validate';
import { getInvalidErrorMessages } from '../util';
import { Movie, Genre } from '../model';
import {
  authorize,
  isAdmin,
  attemptAsync,
  validObjectIdParam,
  validateBody,
} from '../middleware';

const router = express.Router();

const getMovieInput = (movie, genre) => ({
  ...pick(movie, ['title', 'numberInStock', 'dailyRentalRate']),
  genre: { ...pick(genre, ['_id', 'name']) }
});

const createMovie = (movie, genre) => {
  const newMovie = new Movie(getMovieInput(movie, genre));
  return newMovie.save();
};

const updateMovie = async (id, movie, genre) => {
  return await Movie.findByIdAndUpdate(id, {
    $set: getMovieInput(movie, genre),
  }, { new: true });
};

const deleteMovie = async id => {
  return await Movie.findByIdAndRemove(id)
};

router.get('/', attemptAsync(async (req, res) => {
  const movies = await Movie.find();
  return res.send(movies);
}));

router.get('/:id', [validObjectIdParam], attemptAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('Movie not found');
  return res.send(movie);
}));

router.post('/', [authorize, validateBody(validateMovie)], attemptAsync(async (req, res) => {
  const { body } = req;

  const invalidGenreId = validateObjectId({ id: body.genreId });
  if (invalidGenreId) return res.status(400).send(getInvalidErrorMessages(invalidGenreId));

  const genre = await Genre.findById(body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await createMovie(body, genre);
  return res.send(movie);
}));

router.put('/:id', [
  authorize,
  isAdmin,
  validObjectIdParam,
  validateBody(validateMovie)
], attemptAsync(async (req, res) => {
  const { body, params } = req;
  const genre = await Genre.findById(body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await updateMovie(params.id, body, genre);
  return res.send(movie);
}));

router.delete('/:id', [authorize, isAdmin, validObjectIdParam], attemptAsync(async (req, res) => {
  const movie = await deleteMovie(req.params.id);
  if (!movie) return res.status(404).send('Movie not found');
  return res.send(200);
}));

export default router;
