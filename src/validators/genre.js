import { genreSchema } from '../schema';
import { validate } from '../util';

export const validateGenre = customer => validate(customer, genreSchema);
