import { authSchema } from '../schema';
import { validate } from '../util';

export const validateAuth = auth => validate(auth, authSchema);
