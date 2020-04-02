const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const chance = require('chance').Chance();

module.exports = async({ postsToCreate = 5 } = {}) => {
  
  const user = await User.create({
    username: 'testUser',
    password: 'testPass'
  });

  const posts = await Post.create([...Array(postsToCreate)].map(() => ({
    user: user._id,
    photoUrl: chance.url(),
    caption: chance.sentence(),
    tags: [chance.word(), chance.word()]
  })));

};
