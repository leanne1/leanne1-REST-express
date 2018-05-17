import Joi from 'joi';
import * as genre from '../constants/genre';

export const genreSchema = Joi.object({
  name: Joi.string().min(genre.nameMinLength).required(),
}).unknown(false);
