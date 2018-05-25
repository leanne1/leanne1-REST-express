import express from 'express';
import { pick } from 'lodash';
import { validateGenre } from '../validate';
import { Genre } from '../model';
import {
  authorize,
  isAdmin,
  attemptAsync,
  validObjectIdParam,
  validateBody,
} from '../middleware';

const router = express.Router();

const getGenreInput = genre => ({ ...pick(genre, 'name') });

const createGenre = genre => {
  const newGenre = new Genre(getGenreInput(genre));
  return newGenre.save();
};

const updateGenre = async (id, genre) => {
  return await Genre.findByIdAndUpdate(id, {
    $set: getGenreInput(genre),
  }, { new: true });
};

const deleteGenre = async (id) => {
  return await Genre.findByIdAndRemove(id);
};

router.get('/', attemptAsync(async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
}));

router.get('/:id', validObjectIdParam, attemptAsync(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('Genre not found');

  res.send(genre);
}));

router.post('/', [authorize, validateBody(validateGenre)], attemptAsync(async (req, res) => {
  const genre = await createGenre(req.body);
  return res.send(genre);
}));

router.put('/:id', [
  authorize,
  isAdmin,
  validObjectIdParam,
  validateBody(validateGenre)
], attemptAsync(async (req, res) => {
  const genre = await updateGenre(req.params.id, req.body);
  if (!genre) return res.status(404).send('Genre not found');
  return res.send(genre);
}));

router.delete('/:id', [authorize, isAdmin, validObjectIdParam], attemptAsync(async (req, res) => {
  const genre = await deleteGenre(req.params.id);
  if (!genre) return res.status(404).send('Genre not found');
  return res.send(200);
}));

export default router;
