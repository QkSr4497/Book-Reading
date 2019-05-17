const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  hbs = require('hbs'),
  cookieParser = require('cookie-parser'),
  app = express();

// Authentication Packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pgSession = require('connect-pg-simple')(session);
var bycrypt = require('bcrypt');

// importing my files
var index = require('./routes/index');


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); // absolute path to the new templates/views folder (which is instead the previous default folder called views)
const partialsPath = path.join(__dirname, '../templates/partials');


// Setup handlebars engine and views location
app.set('view engine', 'hbs');  // telling express which templating engine we installed
// 2 arguments: the key is the setting name and the value we want to set for the setting
// express expects all the views (here the handlebars views) in a "views" folder in the root of the project
// to use view pages we need to setup a route

app.set('views', viewsPath);    //changing the path for views
hbs.registerPartials(partialsPath); // changing the path to the partials

app.use(express.static(publicDirectoryPath));  // use is a way to customize our server to serve up the folder
// static takes a path to the folder we want to serve up
// here the server serves the static assets which are in public directory
// static means no matter how many times we refresh the page, the assets won't change (for example the picture)
// now when visiting the root of our website we will get index.html


require('dotenv').config(); // using env file

const pool = require('./db.js');    // postgresql database connection pool

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// authentication middleware
app.use(cookieParser());
app.use(session({
  store: new pgSession({
    pool: pool,                // Connection pool
    tableName: 'UserSessions'   // Use another table-name than the default "session" one
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,   // when true a cookie and a session will be created whenever a user visits the page even when not logged in
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  // cookie: { secure: true } // enable to true when using https
}));
app.use(passport.initialize());
app.use(passport.session());


//==================================================================
app.use( function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated(); // this data will be passed to every view automatically
                                                      // guide on how to use: https://www.youtube.com/watch?v=mFVqL5aIjSE&t=1s
  next();
});

app.use('/', index);

passport.use(new LocalStrategy(
  function (username, password, done) { // we can access username and password because the inputs in the front end page have exactly the same name

    // console.log('username: ' + username);
    // console.log('passowrd: ' + password);

    // callback - checkout a client
    pool.connect((err, client, poolDone) => {
      if (err) throw err;

      client.query('SELECT * FROM "Person" p WHERE p."userName" = $1', [username], (error, result) => {  // getting the id of the person trying to login
        if (error) {  // error on connecting to the database
          done(error);
        }
        // const personID = result.rows[0].personID;
        if (result.rowCount === 0) {
          done(null, false, { message: 'User Name does not exist' });
        }
        else {
          const hash = result.rows[0].pwd  // the hashed password of the user that is trying to login
          const userID = result.rows[0].personID;
          //console.log('hash: ' + hash);

          bycrypt.compare(password, hash, function (err, response) {
            if (response === true) {
              console.log(`Login: User #${userID}`);
              return done(null, userID);
            }
            else {
              return done(null, false, { message: 'Incorrect password.' }); // Authentication request failed (the password is incorrect)
            }

          });
        }

      });
      poolDone();
    });
  }
));


// Server
app.listen(3000, function () {
  console.log('Server Started On Port 3000')
});
