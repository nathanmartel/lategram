const { getUser, getPost, getComment, getAgent } = require('../db/data-helpers');

describe('Comment routes', () => {
  it('creates a comment', async() => {
    const user = await getUser({ username: 'testUser' });
    const post = await getPost({ user: user._id });

    return getAgent()
      .post('/comments')
      .send({
        commentBy: user._id,
        post: post._id,
        comment: 'test comment'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          commentBy: user._id.toString(),
          post: post._id.toString(),
          comment: 'test comment',
          __v: 0
        });
      });
  });

  it('deletes a comment', async() => {
    const user = await getUser({ username: 'testUser' });
    const comment = await getComment({ commentBy: user._id });

    return getAgent()
      .delete(`/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual(comment);
      });
  });

});
