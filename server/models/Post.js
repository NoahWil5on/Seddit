const mongoose = require('mongoose');
const _ = require('underscore');
mongoose.Promise = global.Promise;

let PostModel = {};

const convertId = mongoose.Types.ObjectId;

// clean data
const setTitle = (name) => _.escape(name).trim();
const setText = (textMessage) => _.escape(textMessage).trim()
    // return text.substring(0, 240);
;

// PostSchema data structure model
const PostSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  text: {
    type: String,
    required: false,
    set: setText,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  voters: [{
    voter: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
  }],
  rating: {
    type: Number,
    default: 0,
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
},
{ usePushEach: true }
);
// make post object that can be used by session
PostSchema.statics.toAPI = (doc) => ({
  author: doc.author,
  title: doc.title,
  text: doc.text,
});
// find all posts by owner
PostSchema.statics.findByOwner = (ownerId, callback) => {
  const owner = { owner: convertId(ownerId) };
  return PostModel.find(owner, null, { sort: { createdData: -1 } }).limit(100).exec(callback);
};
// find a single post by the post's id
PostSchema.statics.findById = (id, callback) => {
  const postId = { _id: convertId(id) };
  return PostModel.findOne(postId, callback);
};
// find all posts
PostSchema.statics.findAll = function (callback) {
  return PostModel.find({}, null, { sort: { createdData: -1 } }).limit(100).exec(callback);
};
// find a single post by the post's id
// PostSchema.statics.findVoter = (id, username, callback) => {
//     const voter = { '$and' : [
//         {voters: { '$in' : [{voter: username}] } },
//         {_id: convertId(id) },
//     ]};
//     return PostModel.findOne(voter, callback);
// };
// model post based on PostSchema
PostModel = mongoose.model('Post', PostSchema);

// export modules
module.exports = {
  PostModel,
  PostSchema,
};
