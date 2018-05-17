import Joi from 'joi';
import objectId from 'joi-objectid';

Joi.objectId = objectId(Joi);

export const objectIdSchema = {
  id: Joi.objectId().required(),
};
