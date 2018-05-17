import genre from './genre';
import customer from './customer';
import movie from './movie';
import rental from './rental';
import user from './user';
import auth from './auth';

export const useRoutes = app => {
  app.use('/api/genres', genre);
  app.use('/api/customers', customer);
  app.use('/api/movies', movie);
  app.use('/api/rentals', rental);
  app.use('/api/users', user);
  app.use('/api/auth', auth);
};
