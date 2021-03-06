import express from 'express';
import mongoose from 'mongoose';
import Fawn from 'fawn';
import { pick } from 'lodash';
import { validateRental } from '../validate';
import { Rental, Customer, Movie } from '../model';
import { authorize, attemptAsync, validateBody } from '../middleware';

const router = express.Router();
Fawn.init(mongoose);

const createRental = (customer, movie) => {
  return new Rental({
    customer: { ...pick(customer, ['_id', 'name', 'phone', 'isGold']) },
    movie: { ...pick(movie, ['_id', 'title', 'dailyRentalRate']) }
  });
};

router.get('/', attemptAsync(async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  return res.send(rentals);
}));

router.post('/', [authorize, validateBody(validateRental)], attemptAsync(async (req, res) => {
  const { body } = req;

  const customer = await Customer.findById(body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

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
}));

export default router;
