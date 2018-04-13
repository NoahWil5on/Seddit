const models = require('../models');
const _ = require('underscore');
const Post = models.Post;
const Comment = models.Comment;

const getPost = (request, response) => {
    const req = request;
    const res = response;

    id = req.query.post;
    return Post.PostModel.findById(id, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        return res.json({ post: doc });
    });
};
const getComments = (request, response) => {
    const req = request;
    const res = response;

    id = req.query.post;
    return Comment.CommentModel.findByPostId(id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        return res.json({ comments: docs });
    });
}
const makeComment = (request, response) => {
    const req = request;
    const res = response;

    let text = `${req.body.text}`;
    const id = `${req.body._postId}`

    text = _.escape(text).trim();

    if ((!text || text === "") || !id) {
        return res.status(400).json({ error: 'All posts must have text' });
    }
    const newComment = new Comment.CommentModel({
        author: req.session.account.username,
        text,
        postId: id,
    });

    return newComment.save().then(() => {
        return res.json({ redirect: '/' });
    }).catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Post already exists' });
        }
        return res.status(400).json({ error: 'An error occurred' });
    });
};

module.exports = {
    getPost,
    getComments,
    makeComment,
};
