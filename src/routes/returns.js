import express from 'express';
import Fawn from 'fawn';
import moment from 'moment';
import { validateReturn } from '../validate';
import { Rental } from '../model';
import {
  authorize,
  attemptAsync,
  validateBody,
} from '../middleware';

const router = express.Router();

router.post('/', [authorize, validateBody(validateReturn)], attemptAsync(async (req, res) => {
  const { body } = req;
  const rental = await Rental.lookup(body.customerId, body.movieId);
  if (!rental) return res.status(404).send('Rental not found');
  if (rental.dateReturned) return res.status(400).send('Rental already returned');

  const returnDate = Date.now();
  const rentalDuration = moment(returnDate).diff(moment(rental.dateOut), 'days');
  const rentalFee = rentalDuration * rental.movie.dailyRentalRate;
  rental.dateReturned = returnDate;
  rental.rentalFee = rentalFee;

  await new Fawn.Task()
    .update('rentals', { _id: rental._id }, {
      $set: {
        dateReturned: returnDate,
        rentalFee: rentalFee,
      }
    })
    .update('movies', { _id: rental.movie._id }, {
      $inc: {
        numberInStock: +1
      }
    })
    .run();

  res.send(rental);
}));

export default router;
