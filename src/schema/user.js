import Joi from 'joi';
import * as user from '../constants/user';
import { authEmail, authPassword } from './common';

export const userSchema = Joi.object({
  name: Joi.string().min(user.nameMinLength).max(user.nameMaxLength).required(),
  email: authEmail,
  password: authPassword,
  roles: Joi.array().items(Joi.string().required()),
}).unknown(false);
