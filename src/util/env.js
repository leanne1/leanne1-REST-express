import config from 'config';
import { ENV_DEVELOPMENT } from '../constants/env';

export const isDev = () => config.get('app_env') === ENV_DEVELOPMENT;
