import Joi from 'joi';
import * as genre from '../constants/genre';
import * as common from '../constants/common';

export const genreSchema = Joi.object({
  name: Joi.string().min(genre.nameMinLength).max(common.stringMaxLength).required(),
}).unknown(false);
