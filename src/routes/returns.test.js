import request from 'supertest';
import mongoose from 'mongoose';
import sinon from 'sinon';
import { getUserAuthToken } from '../../test/helpers';
import { Rental, Movie, User } from '../model/index';

describe(colors.yellow.bold('@Integration - api - /returns'), () => {
  let app;
  let authToken;
  let rental;
  let movie;
  let rentalBody;
  const sandbox = sinon.sandbox.create();
  const routeUrl = '/api/returns/';
  const notFoundId = '6afedd42ac367d50924b03d3';
  const invalidId = '12345';
  let threeDaysAgo = 1526987656583;
  let now = 1527246856583;
  const customerId = mongoose.Types.ObjectId();
  const movieId = mongoose.Types.ObjectId();

  beforeEach(async () => {
    app = require('../index').server;

    authToken = await getUserAuthToken();

    sandbox.stub(Date, 'now').returns(now);

    movie = new Movie({
      _id: movieId,
      title: 'Great film!',
      dailyRentalRate: 2,
      numberInStock: 10,
      genre: {
        name: 'Great genre!',
      },
    });
    await movie.save();

    rentalBody = {
      customer: {
        isGold: false,
        _id: customerId,
        name: 'Jo',
        phone: '1234567',
      },
      movie: {
        _id: movieId,
        title: 'Great film!',
        dailyRentalRate: 2
      },
      dateOut: threeDaysAgo,
      dailyRentalRate: 2,
    };

    rental = new Rental(rentalBody);
    await rental.save();
  });

  afterEach(async () => {
    await app.close();
    await Rental.remove({});
    await User.remove({});
    await Movie.remove({});
    authToken = null;
    sandbox.restore();
  });

  describe(colors.cyan.bold('POST'), () => {
    it('should return a 401 if client is not authorized', async () => {
      const res = await request(app)
        .post(routeUrl)
        .send({ customerId, movieId });
      expect(res.status).to.equal(401);
    });

    it('should return a 400 if customer id is not provided', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId: null, movieId });
      expect(res.status).to.equal(400);
    });

    it('should return a 400 if customer id is not valid', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId: invalidId, movieId });
      expect(res.status).to.equal(400);
    });

    it('should return a 400 if movie id is not provided', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId, movieId: null });
      expect(res.status).to.equal(400);
    });

    it('should return a 400 if movie id is not valid', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId, movieId: invalidId });
      expect(res.status).to.equal(400);
    });

    it('should return a 404 if the rental does not exist', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId: notFoundId, movieId: notFoundId });
      expect(res.status).to.equal(404);
    });

    it('should return a 400 if the rental has already been returned', async () => {
      const returnedRental = new Rental({
        customer: {
          _id: mongoose.Types.ObjectId(),
          name: 'Jo',
          phone: '1234567'
        },
        movie: {
          _id: mongoose.Types.ObjectId(),
          title: 'Great film!',
          dailyRentalRate: 2
        },
        dateReturned: Date.now(),
      });
      await returnedRental.save();

      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({
          customerId: returnedRental.customer._id,
          movieId: returnedRental.movie._id,
        });
      expect(res.status).to.equal(400);
    });

    it('should return a 200 if rental is successfully returned', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId, movieId });
      expect(res.status).to.equal(200);
    });

    it('should set the return date', async () => {
      await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId, movieId });

      const rentalInDb = await Rental.findById(rental._id);
      const rentalDateString = String(rentalInDb.dateReturned);
      const nowDateString = String(new Date(now));
      expect(rentalDateString).to.equal(nowDateString);
    });

    it('should set the rental fee', async () => {
      await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId, movieId });

      const rentalInDb = await Rental.findById(rental._id);
      expect(rentalInDb.rentalFee).to.equal(6);
    });

    it('should add the movie back into stock', async () => {
      await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId, movieId });

      const movieInDb = await Movie.findById(movieId);
      expect(movieInDb.numberInStock).to.equal(movie.numberInStock + 1);
    });

    it('should return the updated rental in the response', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ customerId, movieId });

      expect(JSON.stringify(res.body.movie)).to.equal(JSON.stringify(rentalBody.movie));
      expect(JSON.stringify(res.body.customer)).to.equal(JSON.stringify(rentalBody.customer));
      expect(res.body.dateOut).to.equal('2018-05-22T11:14:16.583Z');
      expect(res.body.dateReturned).to.equal('2018-05-25T11:14:16.583Z');
    });
  });
});
