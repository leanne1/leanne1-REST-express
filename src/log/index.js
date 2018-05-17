import winston from 'winston';
import 'winston-mongodb';
import { dbUrl, dbName } from '../db';

export const handleExceptions = () => {
  winston.handleExceptions([
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'logfile.log' }),
    new winston.transports.MongoDB({ db: `mongodb://${dbUrl}/${dbName}` })
  ]);

  process.on('unhandledRejection', (err) => {
    // winston will handle this
    throw err;
  });
};
