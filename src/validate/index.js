import { objectIdSchema } from './objectId';
import { customerSchema } from './customer';
import { genreSchema } from './genre';
import { movieSchema } from './movie';
import { rentalSchema } from './rental';
import { userSchema } from './user';
import { authSchema } from './auth';
import { validate } from '../util';

export const validateAuth = auth => validate(auth, authSchema);
export const validateCustomer = customer => validate(customer, customerSchema);
export const validateGenre = genre => validate(genre, genreSchema);
export const validateMovie = movie => validate(movie, movieSchema);
export const validateObjectId = objId => validate(objId, objectIdSchema);
export const validateRental = rental => validate(rental, rentalSchema);
export const validateUser = user => validate(user, userSchema);
