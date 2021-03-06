import Joi from 'joi';
import objectId from 'joi-objectid';
Joi.objectId = objectId(Joi);

export const returnSchema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
}).unknown(false);
