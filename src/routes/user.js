import express from 'express';
import { pick, get } from 'lodash';
import bcrypt from 'bcrypt';
import { validateUser } from '../validate';
import { getInvalidErrorMessages } from '../util';
import { User } from '../model';
import { authorize, attemptAsync } from '../middleware';

const router = express.Router();

const getUserInput = (user, password) => ({
  ...pick(user, ['name', 'email']),
  password
});

const createUser = (user, password) => {
  const newUser = new User(getUserInput(user, password));
  return newUser.save();
};

const getHashedPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

router.get('/me', authorize, attemptAsync(async(req, res) => {
  const currentUser = await User.findById(req.user._id).select('-password');
  return res.send(currentUser)
}));

router.post('/', attemptAsync(async (req, res) => {
  const { body } = req;

  const invalidUser = validateUser(body);
  if (invalidUser) return res.status(400).send(getInvalidErrorMessages(invalidUser));

  const hasUser = await User.findOne({ email: body.email });
  if (hasUser) return res.status(400).send('User already registered');

  const hashedPassword = await getHashedPassword(get(body, 'password'));
  const user = await createUser(body, hashedPassword);
  // Login in newly-registered user
  const authToken = user.generateAuthToken();
  return res.send({
    ...pick(user, ['name', 'email', '_id']),
    access_token: authToken,
  });
}));

export default router;
