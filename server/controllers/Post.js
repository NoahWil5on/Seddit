const models = require('../models');
const Post = models.Post;
const Account = models.Account;

const makerPage = (req, res) => {
    Post.PostModel.findAll((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.render('app', { csrfToken: req.csrfToken(), post: docs});
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
    return Account.AccountModel.findByUsername(req.session.account.username, (err, account) => {
        req.session.account = Account.AccountModel.toAPI(account);

        let date = new Date(req.session.account.lastPost);
        let wait = Date.now() - date.getTime();
        
        if (wait < 10000) {
            let waitTime = 10 - Math.floor(wait / 1000);
            return res.status(400).json({ 
                error: `You are trying to do this too often, try waiting ${waitTime} second(s)` 
            });
        }

        const newPost = new Post.PostModel({
            author: req.session.account.username,
            title,
            text,
            owner: req.session.account._id,
        });

        return newPost.save().then(() => {
            return Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.json({ redirect: '/maker' })
                }
                doc.lastPost = new Date;
                return doc.save(function (err, updatedDoc) {
                    if (err) {
                        console.log(err);
                    }
                    return res.json({ redirect: '/maker' })
                });
            });
        }).catch((err) => {
            console.log(err);
            if (err.code === 11000) {
                return res.status(400).json({ error: 'Post already exists' });
            }
            return res.status(400).json({ error: 'An error occurred' });
        });
    });

};
// req.session.account._id,
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
const getPosts = (request, response) => {
    const req = request;
    const res = response;

    return Post.PostModel.findAll((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ posts: docs });
    });
};

module.exports = {
    getMyPosts,
    makerPage,
    makePost,
    getPosts,
};
