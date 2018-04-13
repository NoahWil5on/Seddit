const models = require('../models');
const Account = models.Account;

// get login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};
// log user out
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
// log user in
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // make sure input is legit
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // authenticate the user
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // remember the user so we know they're logged in
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};
// signup new user
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // make sure input is legit
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passswords do not match' });
  }

  // get a hash to prevent password from being reverse engineered
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    // make user object
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    // save new user to db
    return newAccount.save().then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);

      // log user in
      res.json({ redirect: '/maker' });
    }).catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
// get csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const token = {
    csrfToken: req.csrfToken(),
  };
  let name = '';
  if (req.session.account !== undefined) {
    name = req.session.account.username;
  }
  // return csrf token + name cuz we might need that
  res.json({ token, name });
};

// export modules.
module.exports = {
  loginPage,
  login,
  logout,
  getToken,
  signup,
};
