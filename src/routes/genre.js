import express from 'express';
import { pick } from 'lodash';
import { validateGenre } from '../validate';
import { getInvalidErrorMessages } from '../util';
import { Genre } from '../model';
import {
  authorize,
  isAdmin,
  attemptAsync,
  validObjectId
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

router.get('/:id', [validObjectId], attemptAsync(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('Genre not found');

  res.send(genre);
}));

router.post('/', authorize, attemptAsync(async (req, res) => {
  const { body } = req;

  const invalidGenre = validateGenre(body);
  if (invalidGenre) return res.status(400).send(getInvalidErrorMessages(invalidGenre));

  const genre = await createGenre(body);
  return res.send(genre);
}));

router.put('/:id', [authorize, isAdmin, validObjectId], attemptAsync(async (req, res) => {
  const { body, params } = req;

  const invalidGenre = validateGenre(body);
  if (invalidGenre) return res.status(400).send(getInvalidErrorMessages(invalidGenre));

  const genre = await updateGenre(params.id, body);
  if (!genre) return res.status(404).send('Genre not found');
  return res.send(genre);
}));

router.delete('/:id', [authorize, isAdmin, validObjectId], attemptAsync(async (req, res) => {
  const genre = await deleteGenre(req.params.id);
  if (!genre) return res.status(404).send('Genre not found');
  return res.send(200);
}));

export default router;
