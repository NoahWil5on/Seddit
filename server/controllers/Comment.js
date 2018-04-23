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
const doVote = (request, response) => {
  const res = response;
  const req = request;

  if (!req.body.value || req.body.value === undefined || Math.abs(req.body.value) !== 1) {
    return res.status(400).json({ error: 'Invalid vote value' });
  }
  return Comment.CommentModel.findById(req.body.id, (err, document) => {
    const doc = document;
    if (err) {
      console.log(`${err}ealk;jdsk`);
      return res.status(400).json({ error: 'An error occurred' });
    }
    let found = false;
    let index = -1;
    for (let i = 0; i < doc.voters.length; i++) {
      if (doc.voters[i].voter === req.session.account.username) {
        found = true;
        index = i;
      }
    }
    if (found) {
      let mult = 1;
      if (Number(doc.voters[index].value) !== 0) {
        mult = 2;
      }
      if (Number(doc.voters[index].value) === Number(req.body.value)) {
        mult = -1;
      }

      doc.voters[index].value = req.body.value;
      doc.rating += Number(req.body.value) * mult;
      return doc.save(e => {
        if (e) {
          console.log(e);
          return res.json({ error: 'An error has occured while saving post' });
        }
        return res.json({ error: 'This post has been added to your liked posts' });
      }).catch(e => {
        console.log(e);
        res.json({ error: 'An error has occured while saving post' });
      });
    }
    doc.voters.push({
      voter: req.session.account.username,
      value: req.body.value,
    });
    doc.rating += Number(req.body.value);
    return doc.save(e => {
      if (e) {
        console.log(e);
        return res.json({ error: 'An error has occured while saving post' });
      }
      return res.json({ error: 'This post has been added to your liked posts' });
    }).catch(e => {
      console.log(e);
      res.json({ error: 'An error has occured while saving post' });
    });
  });
};
// export  modules
module.exports = {
  getPost,
  getComments,
  makeComment,
  doVote,
};
