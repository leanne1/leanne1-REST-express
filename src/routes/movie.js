import express from 'express';
import { omit, pick } from 'lodash';
import { debug as _debug } from 'debug';
import { validateObjectId, validateMovie } from '../validators';
import { getInvalidErrorMessages } from '../util';
import { Movie, Genre } from '../model';

const router = express.Router();

const createMovie = async (movie, genre) => {
  const movieData = omit(movie, 'genreId');
  const genreData = pick(genre, ['_id', 'name']);

  const newMovie = await new Movie({
    ...movieData,
    genre: { ...genreData },
  });
  return newMovie.save();
};

const updateMovie = async (id, nextMovieValues, genre) => {
  const movieData = omit(nextMovieValues, 'genre');
  const genreData = pick(genre, ['_id', 'name']);

  return await Movie.findByIdAndUpdate(id, {
    $set: {
      ...movieData,
      genre: { ... genreData }
    },
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

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
