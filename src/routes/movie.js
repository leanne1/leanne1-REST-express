import express from 'express';
import { pick } from 'lodash';
import { validateObjectId, validateMovie } from '../validators';
import { getInvalidErrorMessages } from '../util';
import { Movie, Genre } from '../model';
import { authorize, isAdmin } from '../middleware';

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

router.get('/', async (req, res) => {
  const movies = await Movie.find();
  try {
    return res.send(movies);
  } catch(err) {
    return res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  const { params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  try {
    const movie = await Movie.findById(params.id);
    if (!movie) return res.status(404).send('Movie not found');
    return res.send(movie);
  } catch(err) {
    return res.status(500).send(err.message);
  }
});

router.post('/', authorize, async (req, res) => {
  const { body } = req;

  const invalidMovie = validateMovie(body);
  if (invalidMovie) return res.status(400).send(getInvalidErrorMessages(invalidMovie));

  const invalidGenreId = validateObjectId({ id: body.genreId });
  if (invalidGenreId) return res.status(400).send(getInvalidErrorMessages(invalidGenreId));

  try {
    const genre = await Genre.findById(body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const movie = await createMovie(body, genre);
    return res.send(movie);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.put('/:id', [authorize, isAdmin], async (req, res) => {
  const { body, params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  const invalidMovie = validateMovie(body);
  if (invalidMovie) return res.status(400).send(getInvalidErrorMessages(invalidMovie));

  try {
    const genre = await Genre.findById(body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const movie = await updateMovie(params.id, body, genre);
    return res.send(movie);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete('/:id', [authorize, isAdmin], async (req, res) => {
  const { params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  try {
    const movie = await deleteMovie(params.id);
    if (!movie) return res.status(404).send('Movie not found');
    return res.send(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

export default router;
