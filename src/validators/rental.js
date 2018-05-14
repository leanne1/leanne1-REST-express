import { rentalSchema } from '../schema';
import { validate } from '../util';

export const validateRental = rental => validate(rental, rentalSchema);
