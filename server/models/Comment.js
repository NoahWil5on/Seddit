const mongoose = require('mongoose');
const _ = require('underscore');
mongoose.Promise = global.Promise;

let CommentModel = {};

const convertId = mongoose.Types.ObjectId;

// clean input
const setText = (textMessage) => _.escape(textMessage).trim()
    // return text.substring(0, 240);
;

// comment data model
const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
    set: setText,
  },
  postId: {
    type: String,
    required: true,
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
}, { usePushEach: true });
// find all comments by postId
CommentSchema.statics.findByPostId = (postId, callback) => {
  const comments = { postId };
  return CommentModel.find(comments, null, { sort: { createdData: -1 } }).limit(100).exec(callback);
};
// find a single post by the comment's id
CommentSchema.statics.findById = (id, callback) => {
  const commentId = { _id: convertId(id) };
  return CommentModel.findOne(commentId, callback);
};
// model comment based on commentSchema
CommentModel = mongoose.model('Comment', CommentSchema);

// export modules
module.exports = {
  CommentModel,
  CommentSchema,
};
