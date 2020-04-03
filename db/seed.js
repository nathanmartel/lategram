const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');
const chance = require('chance').Chance();

module.exports = async({ 
  usersToCreate = 15, 
  postsToCreate = 30, 
  commentsToCreate = 60 
} = {}) => {
  
  // Add authorized user and related objects for testing
  const authUser = await User.create({
    username: 'testUser',
    password: 'testPass',
    profilePhotoUrl: 'testUrl.jpg'
  });

  const authPost = await Post.create({
    user: authUser._id,
    photoUrl: chance.url(),
    caption: chance.sentence(),
    tags: [chance.word(), chance.word()]
  });

  await Comment.create({
    commentBy: authUser._id,
    post: authPost._id,
    comment: chance.sentence()
  });

  
  // Add randomized users and data for larger database

  const users = await User.create([...Array(usersToCreate)].map(() => ({
    username: chance.name(),
    password: chance.word(),
    profilePhotoUrl: chance.url() + '/test.jpg'
  })));

  const posts = await Post.create([...Array(postsToCreate)].map(() => ({
    user: chance.pickone(users)._id,
    photoUrl: chance.url(),
    caption: chance.sentence(),
    tags: [chance.word(), chance.word()]
  })));

  await Comment.create([...Array(commentsToCreate)].map(() => ({
    commentBy: chance.pickone(users)._id,
    post: chance.pickone(posts)._id,
    comment: chance.sentence()
  })));

};
