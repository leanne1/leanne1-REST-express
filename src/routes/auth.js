import express from 'express';
import bcrypt from 'bcrypt';
import { validateAuth } from '../validators';
import { getInvalidErrorMessages } from '../util';
import { User } from '../model';
import { attemptAsync } from '../middleware';

const router = express.Router();
const invalidCredentialsMessage = 'Invalid email or password';

router.post('/', attemptAsync(async (req, res) => {
  const { body } = req;

  const invalidAuth = validateAuth(body);
  if (invalidAuth) return res.status(400).send(getInvalidErrorMessages(invalidAuth));

  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(400).send(invalidCredentialsMessage);

  const isValidPassword = await bcrypt.compare(body.password, user.password);
  if (!isValidPassword) return res.status(400).send(invalidCredentialsMessage);

  const authToken = user.generateAuthToken();

  return res.send({
    access_token: authToken
  });
}));

export default router;
