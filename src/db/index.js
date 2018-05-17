import mongoose from 'mongoose';
import winston from 'winston';
import config from 'config';

export const dbUrl = config.get('db.url');
export const dbName = config.get('db.name');

export const connectToDb = () => {
  mongoose.connect(`mongodb://${dbUrl}/${dbName}`)
    .then(() => winston.info(`Connected to Database ${dbName} at ${dbUrl}`));
};
