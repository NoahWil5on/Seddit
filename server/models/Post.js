const mongoose = require('mongoose');
const _ = require('underscore');
mongoose.Promise = global.Promise;

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setTitle = (name) => _.escape(name).trim();
const setText = (textMessage) => {
  const text = _.escape(textMessage).trim();
  return text.substring(0, 240);
};

const PostSchema = new mongoose.Schema({
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
  createdData: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});
PostSchema.statics.findByOwner = (ownerId, callback) => {
  const owner = { owner: convertId(ownerId) };
  return PostModel.find(owner, null, { sort: { createdData: -1 } }).limit(100).exec(callback);
};
PostSchema.statics.findAll = function (callback) {
  return PostModel.find({}, null, { sort: { createdData: -1 } }).limit(100).exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports = {
  PostModel,
  PostSchema,
};
