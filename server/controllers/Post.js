const models = require('../models');
const Post = models.Post;
const Account = models.Account;

// get the makerPage
const makerPage = (req, res) => {
  Post.PostModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), post: docs });
  });
};
// make a post
const makePost = (request, response) => {
  const req = request;
  const res = response;

  const title = `${req.body.title}`;
  const text = req.body.text || '';

    // make sure data is all good
  if (!title) {
    return res.status(400).json({ error: 'All posts must have a title' });
  }
    // get user making the post
  return Account.AccountModel.findByUsername(req.session.account.username, (error, account) => {
    req.session.account = Account.AccountModel.toAPI(account);

    const date = new Date(req.session.account.lastPost);
    const wait = Date.now() - date.getTime();

        // make sure the user didnt JUST make a post
    if (wait < 10000) {
      const waitTime = 10 - Math.floor(wait / 1000);
      return res.status(400).json({
        error: `You are trying to do this too often, try waiting ${waitTime} second(s)`,
      });
    }

        // make a post object
    const newPost = new Post.PostModel({
      author: req.session.account.username,
      title,
      text,
      owner: req.session.account._id,
    });

        // save the post to db
    return newPost.save().then(() => Account.AccountModel
    .findByUsername(req.session.account.username, (err, document) => {
      const doc = document;
      if (err) {
        console.log(err);
        return res.json({ redirect: '/maker' });
      }
        // update the last time a user posted a post
      doc.lastPost = new Date;
      return doc.save((e) => {
        if (e) {
          console.log(e);
        }
        return res.json({ redirect: '/maker' });
      });
    })).catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Post already exists' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
// req.session.account._id,
// get all posts from single user
const getMyPosts = (request, response) => {
  const req = request;
  const res = response;

  Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ posts: docs });
  });
};
// get all posts
const getPosts = (request, response) => {
  const res = response;

  return Post.PostModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ posts: docs });
  });
};
// export modules
module.exports = {
  getMyPosts,
  makerPage,
  makePost,
  getPosts,
};
