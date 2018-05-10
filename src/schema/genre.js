import Joi from 'joi';

export const genreSchema = Joi.object({
  name: Joi.string().min(2).required(),
}).unknown(false);
