const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies.session;
  User
    .findByToken(token)
    .then(user => {
      req.use = user;
      next();      
    })
    .catch(next);
};
