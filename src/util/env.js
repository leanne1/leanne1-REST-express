import config from 'config';
import { ENV_DEVELOPMENT } from '../constants/env';

export const isDev = () => config.get('APP_ENV') === ENV_DEVELOPMENT;
