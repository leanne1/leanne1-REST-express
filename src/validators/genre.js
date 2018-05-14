import { genreSchema } from '../schema';
import { validate } from '../util';

export const validateGenre = genre => validate(genre, genreSchema);
