import request from 'supertest';
import jwt from 'jsonwebtoken';
import { User, Genre } from '../model/index';
import { authorize } from '../middleware/index';

describe(colors.yellow.bold('@Integration - middleware - auth'), () => {
  let app;
  let authToken;

  beforeEach(async () => {
    app = require('../index').server;
    const user = await new User({
      email: 'user@user.com',
      password: 'Foobarbaz1',
      name: 'foo'
    }).save();
    authToken = user.generateAuthToken('secret');
  });

  afterEach(async () => {
    app.close();
    await User.remove({});
    await Genre.remove({});
    authToken = null;
  });

  it('should return a 401 if no authorization header is present', async () => {
    const res = await request(app)
      .post('/api/genres')
      .send({ name: 'genre1' });

    expect(res.status).to.equal(401);
  });

  it('should return a 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set({ Authorization: '' })
      .send({ name: 'genre1' });

    expect(res.status).to.equal(401);
  });

  it('should continue to the next middleware when valid token is provided', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set({ Authorization: `Bearer ${authToken}` })
      .send({ name: 'genre1' });

    expect(res.status).to.equal(200);
  });

  // Unit test - can't access req object in supertest
  it('should add a valid auth token to the request object', async () => {
    const key = 'secret';
    const validJwt = jwt.sign({
      foo: 'bar',
    }, key);
    const req = {
      headers: {
        'authorization': `Bearer ${validJwt}`
      }
    };
    authorize(req, {}, () => {});
    expect(req.user.foo).to.equal('bar');
    expect(req.user.iat).to.not.be.undefined();
  });
});
