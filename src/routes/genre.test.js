import request from 'supertest';
import { Genre, User } from '../model/index';
import { genres, genre } from './fixtures/input/genre';

describe(colors.yellow.bold('@Integration - api - /genres'), () => {
  let app;
  let authToken;
  let adminAuthToken;
  const routeUrl = '/api/genres/';
  const notFoundId = '6afedd42ac367d50924b03d3';
  const invalidId = '12345';

  beforeEach(async () => {
    app = require('../index').server;
    const user = await new User({
      email: 'user@user.com',
      password: 'Foobarbaz1',
      name: 'foo'
    }).save();
    authToken = user.generateAuthToken('secret');

    const adminUser = await new User({
      email: 'admin@admin.com',
      password: 'Foobarbaz1',
      name: 'foo',
      roles: ['admin']
    }).save();
    adminAuthToken = adminUser.generateAuthToken('secret');
  });

  afterEach(async () => {
    app.close();
    await Genre.remove({});
    await User.remove({});
    authToken = null;
    adminAuthToken = null;
  });

  describe(colors.cyan.bold('GET'), () => {
    it('should return all genres', async () => {
      Genre.collection.insertMany(genres);
      const res = await request(app).get(routeUrl);

      expect(res.status).to.equal(200);
      expect(res.body[0].name).to.equal(genres[0].name);
      expect(res.body[1].name).to.equal(genres[1].name);
    });
  });

  describe(colors.cyan.bold('GET /:id'), () => {
    it('should return a specified genre', async () => {
      const newGenre = await new Genre(genre).save();
      const res = await request(app).get(routeUrl + newGenre._id);
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('genre1');
    });

    it('should return a 400 if an invalid id is provided', async () => {
      const res = await request(app).get(routeUrl + invalidId);
      expect(res.status).to.equal(400);
    });

    it('should return a 404 if the genre does not exist', async () => {
      const res = await request(app).get(routeUrl + notFoundId);
      expect(res.status).to.equal(404);
    });
  });

  describe(colors.cyan.bold('POST'),() => {
    it('should return a 401 if client is not authorized', async () => {
      const res = await request(app)
        .post(routeUrl)
        .send({ name: 'genre1' });
      expect(res.status).to.equal(401);
    });

    it('should return a 400 if genre name is less than 2 chars', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ name: 'a' });
      expect(res.status).to.equal(400);
    });

    it('should return a 400 if genre name is more than 255 chars', async () => {
      const longString = new Array(257).join('x');
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ name: longString });
      expect(res.status).to.equal(400);
    });

    it('should save a new valid genre', async () => {
      await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ name: 'genreAbc' });
      const savedGenre = await Genre.findOne({ name: 'genreAbc' });
      expect(savedGenre).to.not.equal(null);
    });

    it('should return a new valid genre', async () => {
      const res = await request(app)
        .post(routeUrl)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ name: 'genreAbc' });
      expect(res.body._id).to.not.be.undefined();
      expect(res.body.name).to.equal('genreAbc');
    });
  });

  describe(colors.cyan.bold('PUT /:id'),() => {
    it('should return a 403 if client is not authorized with role admin', async () => {
      const newGenre = await new Genre(genre).save();
      const res = await request(app)
        .put(routeUrl + newGenre._id)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ _id: newGenre._id, name: 'genre2' });
      expect(res.status).to.equal(403);
    });

    it('should return a 400 if invalid genre is provided', async () => {
      const newGenre = await new Genre(genre).save();
      const res = await request(app)
        .put(routeUrl + invalidId)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send({ _id: newGenre._id, name: 'genre2' });
      expect(res.status).to.equal(400);
    });

    it('should return a 400 if invalid genre body provided', async () => {
      const newGenre = await new Genre(genre).save();
      const res = await request(app)
        .put(routeUrl + newGenre._id)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send({ foo: 'genre2' });
      expect(res.status).to.equal(400);
    });

    it('should return a 404 if the genre does not exist', async () => {
      const res = await request(app)
        .put(routeUrl + notFoundId)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send({ name: 'genre2' });
      expect(res.status).to.equal(404);
    });

    it('should save an updated valid genre', async () => {
      const newGenre = await new Genre(genre).save();
      await request(app)
        .put(routeUrl + newGenre._id)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send({ name: 'genre2' });

      const savedGenre = await Genre.findOne({ name: 'genre2' });
      expect(savedGenre).to.not.equal(null);
    });

    it('should return an updated valid genre', async () => {
      const newGenre = await new Genre(genre).save();
      const res = await request(app)
        .put(routeUrl + newGenre._id)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send({ name: 'genre2' });

      expect(res.body.name).to.equal('genre2');
    });
  });

  describe(colors.cyan.bold('DELETE /:id'),() => {
    it('should return a 403 if client is not authorized with role admin', async () => {
      const newGenre = await new Genre(genre).save();
      const res = await request(app)
        .delete(routeUrl + newGenre._id)
        .set({ Authorization: `Bearer ${authToken}` })
        .send();
      expect(res.status).to.equal(403);
    });

    it('should return a 400 if invalid genre is provided', async () => {
      const res = await request(app)
        .delete(routeUrl + invalidId)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send();
      expect(res.status).to.equal(400);
    });

    it('should return a 404 if the genre does not exist', async () => {
      const res = await request(app)
        .delete(routeUrl + notFoundId)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send();
      expect(res.status).to.equal(404);
    });

    it('should delete a valid genre', async () => {
      const newGenre = await new Genre({ name: 'deleteMe' }).save();
      const hasNewGenre = await Genre.findOne({ name: 'deleteMe' });

      await request(app)
        .delete(routeUrl + newGenre._id)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send();

      const deletedGenre = await Genre.findOne({ name: 'deleteMe' });
      expect(hasNewGenre).to.not.equal(null);
      expect(deletedGenre).to.equal(null);
    });

    it('should return an empty 200', async () => {
      const newGenre = await new Genre({ name: 'deleteMe' }).save();
      const res = await request(app)
        .delete(routeUrl + newGenre._id)
        .set({ Authorization: `Bearer ${adminAuthToken}` })
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.empty();
    });
  });
});
