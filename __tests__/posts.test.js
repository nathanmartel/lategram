const { getUser, getPost, getAgent } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

describe('Post routes', () => {
  it('creates a post', async() => {
    const user = await getUser({ username: 'testUser' });
    
    return getAgent()
      .post('/posts')
      .send({
        user: user._id,
        photoUrl: 'www.notarealurl.com/img/test.jpg',
        caption: 'test post',
        tags: ['test', 'hello']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          user: user._id.toString(),
          photoUrl: 'www.notarealurl.com/img/test.jpg',
          caption: 'test post',
          tags: ['test', 'hello'],
          __v: 0
        });
      });
  });

  // it('gets a film by id', async() => {
  //   const film = await getFilm();

  //   return request(app)
  //     .get(`/api/v1/films/${film._id}`)
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         ...film
  //       });
  //     });
  // });

  // it('gets all films', async() => {
  //   const films = await getFilms();

  //   return request(app)
  //     .get('/api/v1/films')
  //     .then(res => {
  //       expect(res.body).toEqual(films);
  //     });
  // });

  // it('updates a film by id', async() => {
  //   const film = await getFilm();

  //   return request(app)
  //     .patch(`/api/v1/films/${film._id}`)
  //     .send({ title: '1234 test' })
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         ...film,
  //         title: '1234 test'
  //       });
  //     });
  // });

  // it('deletes a film by id', async() => {
  //   const film = await getFilm();
    
  //   return request(app)
  //     .delete(`/api/v1/films/${film._id}`)
  //     .then(res => {
  //       expect(res.body).toEqual(film);
  //     });
  // });
});
