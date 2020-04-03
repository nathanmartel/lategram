const mongoose = require('mongoose');
const { hashSync, compare } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: { 
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profilePhotoUrl: {
    type: String,
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

schema.virtual('password').set(function(password) {
  const hash = hashSync(password, Number(process.env.SALT_ROUNDS) || 14);
  this.passwordHash = hash;
});

schema.statics.authorize = async function({ username, password }) {
  const user = await this.findOne({ username });
  if(!user) {
    const error = new Error('Invalid username / password');
    error.status = 403;
    throw error;
  }

  const matchingPasswords = await compare(password, user.passwordHash);
  if(!matchingPasswords) {
    const error = new Error('Invalid username / password');
    error.status = 403;
    throw error;
  }

  return user;
};

schema.methods.authToken = function() {
  const token = sign({ payload: this.toJSON() }, process.env.APP_SECRET);
  return token;
};

schema.statics.findByToken = function(token) {
  try {
    const { payload } = verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate(payload));
  } catch(e) {
    return Promise.reject(e);
  }
};

schema.statics.popular = function() {
  return this.model('Comment').aggregate(
    [
      {
        '$group': {
          '_id': '$post', 
          'numberOfComments': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'numberOfComments': -1
        }
      }, {
        '$lookup': {
          'from': 'posts', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'posts'
        }
      }, {
        '$unwind': {
          'path': '$posts'
        }
      }, {
        '$project': {
          '_id': true, 
          'numberOfComments': true, 
          'tags': '$posts.tags', 
          'user': '$posts.user', 
          'photoUrl': '$posts.photoUrl', 
          'caption': '$posts.caption'
        }
      }, {
        '$group': {
          '_id': '$user', 
          'numberOfPostsWithComments': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'numberOfPostsWithComments': -1
        }
      }, {
        '$limit': 10
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'user'
        }
      }, {
        '$unwind': {
          'path': '$user'
        }
      }, {
        '$project': {
          '_id': true, 
          'numberOfPostsWithComments': true, 
          'user_id': '$user._id', 
          'username': '$user.username', 
          'profilePhotoUrl': '$user.profilePhotoUrl'
        }
      }
    ]
  );
};

schema.statics.prolific = function() {
  return this.model('Post').aggregate(
    [
      {
        '$group': {
          '_id': '$user', 
          'numberOfPosts': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'numberOfPosts': -1
        }
      }, {
        '$limit': 10
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'user'
        }
      }, {
        '$unwind': {
          'path': '$user'
        }
      }, {
        '$project': {
          '_id': true, 
          'numberOfPosts': true, 
          'user_id': '$user._id', 
          'username': '$user.username', 
          'profilePhotoUrl': '$user.profilePhotoUrl'
        }
      }
    ]
  );
};

schema.statics.leader = function() {
  return this.model('Comment').aggregate(
    [
      {
        '$group': {
          '_id': '$commentBy', 
          'numberOfComments': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'numberOfComments': -1
        }
      }, {
        '$limit': 10
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'user'
        }
      }, {
        '$unwind': {
          'path': '$user'
        }
      }, {
        '$project': {
          '_id': true, 
          'numberOfComments': true, 
          'user_id': '$user._id', 
          'username': '$user.username', 
          'profilePhotoUrl': '$user.profilePhotoUrl'
        }
      }
    ]
  );
};

module.exports = mongoose.model('User', schema);
