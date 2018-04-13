const models = require('../models');
const _ = require('underscore');
const Post = models.Post;
const Comment = models.Comment;

// get a specific post
const getPost = (request, response) => {
  const req = request;
  const res = response;

  const id = req.query.post;
  return Post.PostModel.findById(id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ post: doc });
  });
};
// get all the comments of a a specific post
const getComments = (request, response) => {
  const req = request;
  const res = response;

  const id = req.query.post;
  return Comment.CommentModel.findByPostId(id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ comments: docs });
  });
};
// make a comment
const makeComment = (request, response) => {
  const req = request;
  const res = response;

  let text = `${req.body.text}`;
  const id = `${req.body._postId}`;

  text = _.escape(text).trim();

    // make sure all the data to make this comment is legit
  if ((!text || text === '') || !id) {
    return res.status(400).json({ error: 'All posts must have text' });
  }
    // make new comment object
  const newComment = new Comment.CommentModel({
    author: req.session.account.username,
    text,
    postId: id,
  });

    // save the new comment to db
  return newComment.save().then(() => res.json({ redirect: '/' })).catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
};
// export  modules
module.exports = {
  getPost,
  getComments,
  makeComment,
};
