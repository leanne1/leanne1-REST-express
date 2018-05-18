import Joi from 'joi';
import { authEmail, authPassword } from './common';

export const authSchema = Joi.object({
  email: authEmail.required(),
  password: authPassword.required(),
}).unknown(false);
