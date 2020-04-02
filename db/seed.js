const { getUser } = require('./data-helpers');

const User = require('../lib/models/User');
const chance = require('chance').Chance();

module.exports = async({ usersToCreate = 1 } = {}) => {
  
  await User.create({
    username: 'testUser',
    password: 'testPass'
  });

  // const reviewers = await Reviewer.create([...Array(reviewersToCreate)].map(() => ({
  //   name: chance.name(),
  //   company: chance.company()
  // })));

};
