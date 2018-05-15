import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';
import * as user from '../constants/user';
import * as common from '../constants/common';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: user.nameMinLength,
    maxlength: user.nameMaxLength
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: common.emailMinLength,
    maxlength: common.stringMaxLength,
  },
  password: {
    type: String,
    required: true,
    minlength: user.passwordMinLength,
    maxlength: user.passwordHashedMaxLength
  },
  roles: {
    type: Array,
  }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({
    _id: this._id,
    roles: this.roles,
  }, config.get('jwtPrivateKey'));
};

export const User = mongoose.model('User', userSchema);
