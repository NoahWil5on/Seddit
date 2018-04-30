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
  req.body.email = `${req.body.email}`;

    // make sure input is legit
  if (!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.email) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passswords do not match' });
  }

    // get a hash to prevent password from being reverse engineered
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
        // make user object
    const accountData = {
      email: req.body.email,
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
//change/create profile image for user
const changePhoto = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.photo || req.body.photo === '') {
    return res.status(400).json({ error: 'You must enter a URL' });
  }

  //find the correct user
  return Account.AccountModel.findByUsername(req.session.account.username, (err, document) => {
    if (err) {
      console.log(err);
    }
    //set new image and update session information
    const doc = document;
    doc.profilePhoto = req.body.photo;
    req.session.account.image = req.body.photo;

    //save photo
    return doc.save((e) => {
      if (e) {
        console.log(e);
      }
      return res.json({ redirect: '/maker' });
    }).catch(error => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
// get csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  //lazy way of getting user's name and profile image all in one go
  const token = {
    csrfToken: req.csrfToken(),
  };
  let name = '';
  let image = '';
  if (req.session.account && req.session.account !== undefined) {
    if (req.session.account.image && req.session.account.image !== undefined) {
      image = req.session.account.image;
    }
  }
  if (req.session.account !== undefined) {
    name = req.session.account.username;
  }
    // return csrf token + name cuz we might need that
  res.json({ token, name, image });
};
//gets a random security code for resetting the password
//the way its set up it offers little to no security benefit
//but demonstrates how security could be improved had email been set up 
//in this project
const getCode = () => {
    let code = '';
    let index = 0;
    while(index < 6){
        code = `${code}${Math.floor(Math.random() * 10)}`;
        index++;
    }
    return code;
}
//insure username and email match up correctly
const checkEmail = (request, response) => {
    const req = request;
    const res = response;

    req.body.email = `${req.body.email}`;
    req.body.username =`${req.body.username}`;

    if (!req.body.email || req.body.username === '') {
        return res.status(400).json({ error: 'You must fill out all fields' });
    }

    //find an account with both the username and email that user entered
    return Account.AccountModel.findByUsernameEmail(req.body.username, req.body.email, (err, doc) => {
        if (err || !doc || doc === undefined) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        req.session.username = req.body.username;
        req.session.resetCode = getCode();
        return res.json({ doReset: true, code: req.session.resetCode });
    })
}
//actually reset the users password
const resetPassword = (request, response) => {
    const req = request;
    const res = response;

    req.body.pass = `${req.body.pass}`;
    req.body.pass2 =`${req.body.pass2}`;
    req.body.code =`${req.body.code}`;

    //insure data is valid
    if (req.body.pass === '' || req.body.pass2 === '') {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (req.body.pass !== req.body.pass2) {
        return res.status(400).json({ error: 'Passwords must match' });
    }
    //check security code
    if (req.body.code !== `${req.session.resetCode}`) {
        return res.status(400).json({ error: 'Incorrect Code' });
    }
    //generate new hash for user
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
        return Account.AccountModel.findByUsername(req.session.username, (err, document) => {
            const doc = document;
            doc.salt = salt;
            doc.password = hash; 
                // save new user to db
            return doc.save().then(() => {
                req.session.account = Account.AccountModel.toAPI(doc);
                return res.json({ redirect: '/maker' });
            }).catch((err) => {
                console.log(err);
                return res.status(400).json({ error: 'An error occurred' });
            });
        })
    });
}

// export modules.
module.exports = {
  loginPage,
  login,
  logout,
  getToken,
  signup,
  changePhoto,
  checkEmail,
  resetPassword,
};
