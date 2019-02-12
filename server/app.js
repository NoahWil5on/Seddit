// all the crazy toolz we'll be using in this project
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');

// pull in our routes
const router = require('./router.js');

// setup environment information
const port = process.env.PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/Seddit';

// connect to our database
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// get redis variables
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};
let redisPASS;
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}
// create express app
const app = express();
// get all static files from hosted files
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
// setup favicon
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// setup redis session
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Seddit Secret Sauce',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
// render engine is using handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
// use cookies
app.use(cookieParser());
// use csrf security code
app.use(csrf());

// make sure csrf code is legit
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

// do routeing
router(app);

// listen on server
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
