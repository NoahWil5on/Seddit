const mongoose = require('mongoose');
const _ = require('underscore');
mongoose.Promise = global.Promise;

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    age: {
        type: Number,
        min: 0,
        required: true,
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
    return PostModel.find(owner, null, { sort: { createdData: -1 } }).select('name age').limit(100).exec(callback);
};
PostSchema.statics.findAll = (ownerId, callback) => {
    const search = { owner: convertId(ownerId) };
    return PostModel.find({}, null, { sort: { createdData: -1 } }).exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports = {
    PostModel,
    PostSchema,
};
