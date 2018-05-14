import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { debug as _debug } from 'debug';
import config from 'config';
import mongoose from 'mongoose';
import genre from './routes/genre';
import customer from './routes/customer';
import movie from './routes/movie';
import rental from './routes/rental';

const debug = _debug('app:index');
const app = express();
const dbUrl = config.get('db.url');
const dbName = config.get('db.name');

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.get('requestLogging')));
app.use('/api/genres', genre);
app.use('/api/customers', customer);
app.use('/api/movies', movie);
app.use('/api/rentals', rental);

mongoose.connect(`mongodb://${dbUrl}/${dbName}`)
  .then(() => console.log(`Connected to Database ${dbName} at ${dbUrl}`))
  .catch(err => debug(err.message));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting app in env ${process.env.NODE_ENV}`);
  console.log(`Listening on port ${port}`);
});
