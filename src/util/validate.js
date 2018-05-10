import Joi from 'joi';

export const validate = (object, schema) =>
  Joi.validate(object, schema, { abortEarly: false }).error;

export const getInvalidErrorMessages = error => error.details.map(d => d.message).join('\n');
