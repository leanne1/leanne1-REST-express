import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from './user';

describe(colors.yellow.bold('@Model - User'), () => {
  describe('generateAuthToken', () => {
    it('generates a valid signed auth token', () => {
      const payload = {
        _id: new mongoose.Types.ObjectId(),
        roles: ['admin']
      };
      const privateKey = 'foobarbaz';
      const user = new User(payload);
      const token = jwt.verify(user.generateAuthToken(privateKey), privateKey);

      expect(token._id).to.equal(String(payload._id));
      expect(token.iat).to.not.be.undefined();
      expect(token.roles).to.deep.equal(payload.roles);
    });
  });
});

