const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    User
      .popular()
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/prolific', (req, res, next) => {
    User
      .prolific()
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/leader', (req, res, next) => {
    User
      .leader()
      .then(post => res.send(post))
      .catch(next);
  });
