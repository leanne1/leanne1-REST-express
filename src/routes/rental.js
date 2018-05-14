import express from 'express';
import mongoose from 'mongoose';
import Fawn from 'fawn';
import { pick } from 'lodash';
import { debug as _debug } from 'debug';
import { validateRental } from '../validators';
import { getInvalidErrorMessages } from '../util';
import { Rental, Customer, Movie } from '../model';

const router = express.Router();
Fawn.init(mongoose);

const createRental = async (customer, movie) => {
  return await new Rental({
    customer: { ...pick(customer, ['_id', 'name', 'phone', 'isGold']) },
    movie: { ...pick(movie, ['_id', 'title', 'dailyRentalRate']) }
  });
};

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  return res.send(rentals);
});

router.post('/', async (req, res) => {
  const { body } = req;

  const invalidRental = validateRental(body);
  if (invalidRental) return res.status(400).send(getInvalidErrorMessages(invalidRental));

  const customer = await Customer.findById(body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

  try {
    const rental = await createRental(customer, movie);
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: {
          numberInStock: -1
        }
      })
      .run();
    return res.send(rental);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
