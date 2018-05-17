/* eslint-disable no-console */
import https from 'https';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import winston from 'winston';
import config from 'config';
import { connectToDb } from './db';
import { handleExceptions } from './log';
import { useRoutes } from './routes';
import { handleError } from './middleware';
import { verifyConfig, httpsOptions } from './config';

const app = express();
const appConfig = [
  { config: httpsOptions, name: 'httpsOptions' },
  { config: config.get('jwtPrivateKey'), name: 'jwtPrivateKey' },
];

handleExceptions();
verifyConfig(appConfig);
connectToDb();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.get('requestLogging')));
useRoutes(app);
app.use(handleError);

const port = process.env.PORT || 3000;
https.createServer(httpsOptions, app).listen(port, () => {
  winston.info(
    `Starting app in env ${process.env.NODE_ENV}, listening on port ${port}, using HTTPS`
  );
});
