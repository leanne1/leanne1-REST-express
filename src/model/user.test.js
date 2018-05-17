import config from 'config';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from './user';

describe('Model - User - generateAuthToken()', () => {
  it('generates a valid signed auth token', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      roles: ['admin']
    };
    const user = new User(payload);
    const token = jwt.verify(user.generateAuthToken(), config.get('jwtPrivateKey'));

    expect(token._id).to.equal(String(payload._id));
    expect(token.iat).to.not.equal(undefined);
    expect(token.roles).to.deep.equal(payload.roles);
  });
});
