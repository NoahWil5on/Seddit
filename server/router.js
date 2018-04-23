const controllers = require('./controllers');
const mid = require('./middleware');

// route traffic to where its gotta be
const router = (app) => {
    // get csrf token
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

    // home page functions
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Post.makePost);

    // comment page functions
  app.get('/getPost', mid.requiresLogin, controllers.Comment.getPost);
  app.get('/getComments', mid.requiresLogin, controllers.Comment.getComments);
  app.post('/postComment', mid.requiresLogin, controllers.Comment.makeComment);

    // profile page functions
  app.get('/getMyPosts', mid.requiresLogin, controllers.Post.getMyPosts);

    // login page functions
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // voting
  app.post('/vote', mid.requiresLogin, controllers.Post.doVote);
  app.post('/voteComment', mid.requiresLogin, controllers.Comment.doVote);

    // empty url
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    // error page
  app.get('*', (req, res) => res.render('error', {}));
};
module.exports = router;
