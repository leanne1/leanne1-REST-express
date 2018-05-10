import express from 'express';
import { debug as _debug} from 'debug';
import { validateObjectId, validateGenre } from '../validators';
import { getInvalidErrorMessages } from '../util';

import { Genre } from '../model/genre';

const router = express.Router();

const createGenre = async (genre) => {
  const newGenre = new Genre(genre);
  return await newGenre.save();
};

const updateGenre = async (id, nextValues) => {
  return await Genre.findByIdAndUpdate(id, {
    $set: nextValues,
  }, { new: true });
};

const deleteGenre = async (id) => {
  return await Genre.findByIdAndRemove(id);
};

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  const { params } = req;
  const invalidId = validateObjectId(params);

  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  try {
    const genre = await Genre.findById(params.id);
    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { body } = req;
  const invalidGenre = validateGenre(body);
  if (invalidGenre) return res.status(400).send(getInvalidErrorMessages(invalidGenre));

  try {
    const genre = await createGenre(body);
    return res.send(genre);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  const { body, params } = req;

  const invalidId = validateObjectId(params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  const invalidGenre = validateGenre(body);
  if (invalidGenre) return res.status(400).send(getInvalidErrorMessages(invalidGenre));

  try {
    const genre = await updateGenre(params.id, body);
    if (!genre) return res.status(404).send('Genre not found');
    return res.send(genre);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  const { params } = req;
  const invalidId = validateObjectId(params);

  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));

  try {
    const genre = await deleteGenre(params.id);
    if (!genre) return res.status(404).send('Genre not found');
    return res.send(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

export default router;
