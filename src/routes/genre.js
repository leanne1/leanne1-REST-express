import express from 'express';
import { pick } from 'lodash';
import { validateObjectId, validateGenre } from '../validators';
import { getInvalidErrorMessages } from '../util';
import { Genre } from '../model';
import { authorize, isAdmin } from '../middleware';

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

router.post('/', authorize, async (req, res) => {
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

router.put('/:id', [authorize, isAdmin], async (req, res) => {
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

router.delete('/:id', [authorize, isAdmin], async (req, res) => {
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
