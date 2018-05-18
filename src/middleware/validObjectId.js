import { validateObjectId } from '../validate';
import { getInvalidErrorMessages } from '../util';

export const validObjectId = (req, res, next) => {
  const invalidId = validateObjectId(req.params);
  if (invalidId) return res.status(400).send(getInvalidErrorMessages(invalidId));
  next();
};
