const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post
      .create(req.body)
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Post
      .find({})
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/popular', (req, res, next) => {
    Post
      .popularPosts()
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Post
      .findById(req.params.id)
      .populate('user')
      .populate('comments')
      .then(post => res.send(post))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true })
      .then(post => res.send(post))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOneAndDelete({ _id: req.params.id, user: req.user._id })
      .then(post => res.send(post))
      .catch(next);
  });
