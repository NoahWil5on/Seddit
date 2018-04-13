const mongoose = require('mongoose');
const _ = require('underscore');
mongoose.Promise = global.Promise;

let CommentModel = {};

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
  createdData: {
    type: Date,
    default: Date.now,
  },
});
// find all comments by postId
CommentSchema.statics.findByPostId = (postId, callback) => {
  const comments = { postId };
  return CommentModel.find(comments, null, { sort: { createdData: -1 } }).limit(100).exec(callback);
};
// model comment based on commentSchema
CommentModel = mongoose.model('Comment', CommentSchema);

// export modules
module.exports = {
  CommentModel,
  CommentSchema,
};
