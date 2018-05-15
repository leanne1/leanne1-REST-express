import { userSchema } from '../schema';
import { validate } from '../util';

export const validateUser = user => validate(user, userSchema);
