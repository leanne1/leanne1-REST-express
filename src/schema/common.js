import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';
import * as common from '../constants/common';
import * as user from '../constants/user';

const passwordComplexity = {
  min: user.passwordMinLength,
  max: user.passwordMaxLength,
  lowerCase: user.passwordLowercase,
  upperCase: user.passwordUppercase,
  numeric: user.passwordNumeric,
  symbol: user.passwordSymbol,
  requirementCount: user.passwordRequirementCount,
};

export const authEmail =
  Joi.string()
    .min(user.emailMinLength)
    .max(common.stringMaxLength)
    .email()
    .required();

export const authPassword = new PasswordComplexity(passwordComplexity).required();