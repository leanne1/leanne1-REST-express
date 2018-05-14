import { objectIdSchema } from '../schema';
import { validate } from '../util';

export const validateObjectId = idObj => validate(idObj, objectIdSchema);
