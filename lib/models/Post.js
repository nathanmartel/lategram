const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: { 
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }, 
  toObject: {
    virtuals: true
  }
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

schema.statics.popularPosts = function() {
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
        '$limit': 10
      }, {
        '$lookup': {
          'from': 'posts', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'post'
        }
      }, {
        '$unwind': {
          'path': '$post'
        }
      }, {
        '$project': {
          '_id': true, 
          'numberOfComments': true, 
          'tags': '$post.tags', 
          'user': '$post.user', 
          'photoUrl': '$post.photoUrl', 
          'caption': '$post.caption'
        }
      }
    ]
  );
};

module.exports = mongoose.model('Post', schema);
