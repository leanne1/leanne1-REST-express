import { movieSchema } from '../schema';
import { validate } from '../util';

export const validateMovie = movie => validate(movie, movieSchema);
