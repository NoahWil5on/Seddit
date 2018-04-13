const mongoose = require('mongoose');
const _ = require('underscore');
mongoose.Promise = global.Promise;

let CommentModel = {};

const convertId = mongoose.Types.ObjectId;
const setText = (textMessage) => {
    return _.escape(textMessage).trim();
    //return text.substring(0, 240);
};

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

CommentSchema.statics.findByPostId = (postId, callback) => {
    const comments = { postId };
    return CommentModel.find(comments, null, { sort: { createdData: -1 } }).limit(100).exec(callback);
};

CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = {
    CommentModel,
    CommentSchema,
};
