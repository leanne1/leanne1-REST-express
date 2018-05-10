import { objectIdSchema } from '../schema';
import { validate } from '../util';

export const validateObjectId = id => validate(id, objectIdSchema);
