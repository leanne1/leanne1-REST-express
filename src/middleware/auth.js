import jwt from 'jsonwebtoken';
import config from 'config';
import { get, includes } from 'lodash';
import * as auth from '../constants/auth';

export const authorize = (req, res, next) => {
  const { headers } = req;
  const hasAuthToken = get(headers, 'authorization', '').split(' ')[0] === 'Bearer';
  const authToken = hasAuthToken
    ? headers.authorization.split(' ')[1]
    : null;

  if (!authToken) return res.status(401).send('Access denied. No access token provided');

  try {
    req.user = jwt.verify(authToken, config.get('jwtPrivateKey'));
    next();
  } catch (err) {
    return res.status(401).send('Access denied. Invalid access token');
  }
};

export const isAdmin = (req, res, next) => {
  if (!includes(req.user.roles, auth.ADMIN)) return res.status(403).send('Access denied');
  next();
};
