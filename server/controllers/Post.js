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

    if (req.session.account.lastPost !== req.session.account.createdData) {
            // make sure the user didnt JUST make a post
      if (wait < 10000) {
        const waitTime = 10 - Math.floor(wait / 1000);
        return res.status(400).json({
          error: `You are trying to do this too often, try waiting ${waitTime} second(s)`,
        });
      }
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

const doVote = (request, response) => {
  const res = response;
  const req = request;

  if (!req.body.value || req.body.value === undefined || Math.abs(req.body.value) !== 1) {
    return res.status(400).json({ error: 'Invalid vote value' });
  }
  return Post.PostModel.findById(req.body.id, (err, document) => {
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

// export modules
module.exports = {
  getMyPosts,
  makerPage,
  makePost,
  getPosts,
  doVote,
};
