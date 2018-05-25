import { User } from '../../src/model/index';

export const getUserAuthToken = async () => {
  const user = await new User({
    email: 'user@user.com',
    password: 'Foobarbaz1',
    name: 'foo'
  }).save();
  return user.generateAuthToken('secret');
};

export const getAdminAuthToken = async () => {
  const adminUser = await new User({
    email: 'admin@admin.com',
    password: 'Foobarbaz1',
    name: 'foo',
    roles: ['admin']
  }).save();
  return adminUser.generateAuthToken('secret');
};
