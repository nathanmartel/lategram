const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
// const User = require('../models/User');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post
      .create(req.body)
      .then(film => res.send(film))
      .catch(next);
  });
