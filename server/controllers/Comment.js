const models = require('../models');
// const _ = require('underscore');
const Post = models.Post;
const Comment = models.Comment;
const Account = models.Account;

// get a specific post
const getPost = (request, response) => {
  const req = request;
  const res = response;

  const id = req.query.post;
  return Post.PostModel.findById(id, (err, document) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const doc = document;
    // return profile image with the post to save a request
    return Account.AccountModel.findByUsername(doc.author, (e, data) => {
      doc._doc.photoUrl = data.profilePhoto;
      return res.json({ post: doc });
    });
  });
};
// promise to get photo of any given comment/post
const getPhoto = (dat, callback) => Account.AccountModel.
    findByUsername(dat.author, () => {
    }).then(obj => {
      const data = dat;
      data._doc.photoUrl = obj.profilePhoto;
      return callback(data);
    });
// get all the comments of a a specific post
const getComments = (request, response) => {
  const req = request;
  const res = response;

  const id = req.query.post;
  // look at all comments related to a specific post
  return Comment.CommentModel.findByPostId(id, (err, docList) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const docs = [];
    // make promise to get all profile images before returning
    const photoPromise = new Promise(resolve => {
      let promiseCounter = 0;
      docList.forEach(element => {
        getPhoto(element, (obj) => {
          docs.push(obj);

          // after each promise is 100% complete we increment
          // our counter, when the counter is full we know all our promises
          // our resolved and we're ready to return
          promiseCounter++;
          if (promiseCounter >= docList.length) {
            resolve();
          }
        });
      });
    });
// return our comments with their appropriate photos
    return photoPromise.then(() => {
      res.json({ comments: docs });
    });
  });
};

// make a comment
const makeComment = (request, response) => {
  const req = request;
  const res = response;

  const text = `${req.body.text}`;
  const id = `${req.body._postId}`;
  let parentId = `${req.body.parentId}`;

    // make sure all the data to make this comment is legit
  if ((!text || text === '') || !id) {
    return res.status(400).json({ error: 'All posts must have text' });
  }
  if (!parentId || parentId === 'undefined') {
    parentId = '';
  }
    // make new comment object
  const newComment = new Comment.CommentModel({
    author: req.session.account.username,
    text,
    postId: id,
    parentId,
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
// cast a vote
const doVote = (request, response) => {
  const res = response;
  const req = request;

  // make sure data is valid
  if (!req.body.value || req.body.value === undefined || Math.abs(req.body.value) !== 1) {
    return res.status(400).json({ error: 'Invalid vote value' });
  }
  return Comment.CommentModel.findById(req.body.id, (err, document) => {
    const doc = document;
    if (err) {
      console.log(`${err}`);
      return res.status(400).json({ error: 'An error occurred' });
    }
    let found = false;
    let index = -1;
    // find specific user to see what they have voted
    for (let i = 0; i < doc.voters.length; i++) {
      if (doc.voters[i].voter === req.session.account.username) {
        found = true;
        index = i;
      }
    }
    // solve for the correct weight this specific vote will have on the post
    if (found) {
      let mult = 1;
      if (Number(doc.voters[index].value) !== 0) {
        mult = 2;
      }
      if (Number(doc.voters[index].value) === Number(req.body.value)) {
        mult = -1;
      }

      // set and save the new value for the vote and post
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
    // update the list of people who have voted on this post
    doc.voters.push({
      voter: req.session.account.username,
      value: req.body.value,
    });
    // save this information
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
