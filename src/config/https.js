import fs from 'fs';
import { isDev } from '../util';

const devHttpsOptions = {
  key: fs.readFileSync('vidly.pem'),
  cert: fs.readFileSync('vidly.crt'),
};

export const httpsOptions = isDev() ? devHttpsOptions : null;
