import Joi from 'joi';
import * as customer from '../constants/customer';

export const customerSchema = Joi.object({
  name: Joi.string().min(customer.nameMinLength).max(customer.nameMaxLength).required(),
  isGold: Joi.boolean().required(),
  phone: Joi.string().min(customer.phoneMinLength).max(customer.phoneMaxLength).required(),
}).unknown(false);
