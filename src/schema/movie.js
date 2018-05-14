import Joi from 'joi';
import objectId from 'joi-objectid';
import * as common from '../constants/common';
Joi.objectId = objectId(Joi);

export const movieSchema = Joi.object({
  title: Joi.string().max(common.stringMaxLength).required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().min(common.numMin).max(common.numMax).required(),
  dailyRentalRate: Joi.number().min(common.numMin).max(common.numMax).required(),
}).unknown(false);
