const models = require('../models');
const Post = models.Post;

const makerPage = (req, res) => {
    Post.PostModel.findAll(req.session.account._id, (err, docs) => {
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

  const age = `${req.body.age}`;
  const name = `${req.body.name}`;

  if (!name || !age) {
    return res.status(400).json({ error: 'RAWR! Domo must have a name and age!' });
  }

  const newPost = new Post.PostModel({
    name,
    age,
    owner: req.session.account._id,
  });

  return newPost.save().then(() => res.json({ redirect: '/maker' })).catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
};
const getPosts = (request, response) => {
    const req = request;
    const res = response;

    return Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred'});
        }

        return res.json({ posts: docs});
    });
};

module.exports = {
  makerPage,
  makePost,
  getPosts,
};
