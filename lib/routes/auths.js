const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        const token = user.authToken();
        res.cookie('session', token, {
          maxAge: ONE_DAY_IN_MS,
          httpOnly: true
        });
        res.send(user);
      })
      .catch(next);
  })
 
  .post('/signin', (req, res, next) => {
    User
      .authorize(req.body)
      .then(user => {
        const token = user.authToken();
        res.cookie('session', token, {
          maxAge: ONE_DAY_IN_MS,
          httpOnly: true
        });
        res.send(user);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    // *** send an error if the person is NOT logged in (handled by ensureAuth middleware)    
    res.send(req.user);
  });
