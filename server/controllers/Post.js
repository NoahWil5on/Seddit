const models = require('../models');
const Post = models.Post;

const profilePage = (req, res) => {
    Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('profile', { csrfToken: req.csrfToken(), post: docs });
  });
};
const makerPage = (req, res) => {
    Post.PostModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), post: docs });
  });
};
const makePost = (request, response) => {
  const req = request;
  const res = response;

  const title = `${req.body.title}`;
  const text = req.body.text || '';

  if (!title) {
    return res.status(400).json({ error: 'All posts must have a title' });
  }

  const newPost = new Post.PostModel({
    title,
    text,
    owner: req.session.account._id,
  });

  return newPost.save().then(() => res.json({ redirect: '/maker' })).catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
};
//req.session.account._id,
const getMyPosts = (request, response) => {
    const req = request;
    const res = response;

    Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred'});
        }

        return res.json({ posts: docs});
    });
}
const getPosts = (request, response) => {
    const req = request;
    const res = response;

    return Post.PostModel.findAll((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred'});
        }

        return res.json({ posts: docs});
    });
};

module.exports = {
    profilePage,
    getMyPosts,
  makerPage,
  makePost,
  getPosts,
};
