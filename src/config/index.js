import config from 'config';

export const verifyConfig = () => {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('jwtPrivateKey is not defined');
  }
};
