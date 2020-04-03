require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('User routes', () => {

  it('gets top ten users with the most total comments on their posts (popular)', async() => {
    return request(app)
      .get('/users/popular')
      .then(res => {
        expect(res.body).toHaveLength(10);
        res.body.forEach((item, i) => {
          expect(item).toEqual({
            _id: expect.any(String),
            numberOfPostsWithComments: expect.any(Number),
            user_id: expect.any(String),
            username: expect.any(String),
            profilePhotoUrl: expect.any(String)
          });
          if(i > 0) expect(item.numberOfPostsWithComments).toBeLessThanOrEqual(res.body[i - 1].numberOfPostsWithComments);
        });
      });
  });

  it('gets top ten users with the most posts (prolific)', async() => {
    return request(app)
      .get('/users/prolific')
      .then(res => {
        expect(res.body).toHaveLength(10);
        res.body.forEach((item, i) => {
          expect(item).toEqual({
            _id: expect.any(String),
            numberOfPosts: expect.any(Number),
            user_id: expect.any(String),
            username: expect.any(String),
            profilePhotoUrl: expect.any(String)
          });
          if(i > 0) expect(item.numberOfPosts).toBeLessThanOrEqual(res.body[i - 1].numberOfPosts);
        });
      });
  });

  it('gets top ten users with the most posts (leader)', async() => {
    return request(app)
      .get('/users/leader')
      .then(res => {
        expect(res.body).toHaveLength(10);
        res.body.forEach((item, i) => {
          expect(item).toEqual({
            _id: expect.any(String),
            numberOfComments: expect.any(Number),
            user_id: expect.any(String),
            username: expect.any(String),
            profilePhotoUrl: expect.any(String)
          });
          if(i > 0) expect(item.numberOfComments).toBeLessThanOrEqual(res.body[i - 1].numberOfComments);
        });
      });
  });

});
