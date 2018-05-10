import { customerSchema } from '../schema';
import { validate } from '../util';

export const validateCustomer = customer => validate(customer, customerSchema);
