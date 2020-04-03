const { getUser, getPost, getPosts, getComments, getAgent } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

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

  it('gets all posts', async() => {
    const posts = await getPosts();

    return request(app)
      .get('/posts')
      .then(res => {
        expect(res.body).toEqual(posts);
      });
  });

  it('gets a specific post', async() => {
    const post = await getPost();
    const user = await getUser({ _id: post.user });
    const comments = await getComments({ post: post._id });

    return request(app)
      .get(`/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          ...post,
          user: user,
          comments: comments
        });
      });
  });

  it('gets top ten posts with the most comments (popular)', async() => {
    return request(app)
      .get('/posts/popular')
      .then(res => {
        expect(res.body).toHaveLength(10);
        res.body.forEach((item, i) => {
          expect(item).toEqual({
            _id: expect.any(String),
            numberOfComments: expect.any(Number),
            user: expect.any(String),
            photoUrl: expect.any(String),
            caption: expect.any(String),
            tags: expect.any(Array)
          });
          if(i > 0) expect(item.numberOfComments).toBeLessThanOrEqual(res.body[i - 1].numberOfComments);
        });
      });
  });

  it('updates a post', async() => {
    const user = await getUser({ username: 'testUser' });
    const post = await getPost({ user: user._id });

    return getAgent()
      .patch(`/posts/${post._id}`)
      .send({ caption: 'lorem ipsum dolor' })
      .then(res => {
        expect(res.body).toEqual({
          ...post,
          caption: 'lorem ipsum dolor'
        });
      });
  });

  it('deletes a post', async() => {
    const user = await getUser({ username: 'testUser' });
    const post = await getPost({ user: user._id });

    return getAgent()
      .delete(`/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual(post);
      });
  });

});
