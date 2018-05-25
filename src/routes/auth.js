import express from 'express';
import bcrypt from 'bcrypt';
import { validateAuth } from '../validate';
import { User } from '../model';
import { attemptAsync, validateBody } from '../middleware';

const router = express.Router();
const invalidCredentialsMessage = 'Invalid email or password';

router.post('/', validateBody(validateAuth), attemptAsync(async (req, res) => {
  const { body } = req;

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
