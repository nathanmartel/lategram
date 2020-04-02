require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });


  it('signs up a user', () => {
    return request(app)
      .post('/auth/signup')
      .send({ username: 'testUser', password: 'testPass' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'testUser',
          __v: 0
        });
      });
  });

  it('logs in a user', async() => {
    await User.create({ username: 'testUser', password: 'testPass' });
    return request(app)
      .post('/auth/signin')
      .send({ username: 'testUser', password: 'testPass' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'testUser',
          __v: 0
        });
      });   
  });

  it('fails to login a user due to a bad password', async() => {
    await User.create({ username: 'testUser', password: 'testPass' });
    return request(app)
      .post('/auth/signin')
      .send({ username: 'testUser', password: 'nope' })
      .then(res => {
        expect(res.body).toEqual({
          status: 403,
          message: 'Invalid username / password'
        });
      });
  });

});
