const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  multer = require('multer'), // for uploading files
  hbs = require('hbs'),
  cookieParser = require('cookie-parser'),
  flash = require('connect-flash'),
  helpers = require('handlebars-helpers')(),  // More than 130 Handlebars helpers in ~20 categories. Helpers can be used with Assemble, Generate, Verb, Ghost, gulp-handlebars, grunt-handlebars, consolidate, or any node.js/Handlebars project.
  app = express();

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');

// Authentication Packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pgSession = require('connect-pg-simple')(session);
var bcrypt = require('bcrypt');

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

hbs.registerHelper('json', function(context) {  // helper function which returns JSON string (use example - used for loading language preference of the user)
  return JSON.stringify(context);
});

hbs.registerHelper(helpers);  // Getting all helpers

app.use(express.static(publicDirectoryPath));  // use is a way to customize our server to serve up the folder
// static takes a path to the folder we want to serve up
// here the server serves the static assets which are in public directory
// static means no matter how many times we refresh the page, the assets won't change (for example the picture)
// now when visiting the root of our website we will get index.html


require('dotenv').config(); // using env file

const {  // default values if they are not provided in process.env
  PORT = 3000,
  NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';  // true if in production

const db = require('./db.js');    // postgresql database connection pool

const pool = db.pg_pool;


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

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//==================================================================
app.use( function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated(); // this data will be passed to every view automatically
                                                      // guide on how to use: https://www.youtube.com/watch?v=mFVqL5aIjSE&t=1s
  next();
});


passport.use(new LocalStrategy({passReqToCallback : true}, function (req, username, password, done) { // we can access username and password because the inputs in the front end page have exactly the same name
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
          done(null, false, req.flash('loginMessage', 'User Name does not exist.'));
        }
        else {
          const hash = result.rows[0].pwd  // the hashed password of the user that is trying to login
          const userID = result.rows[0].personID;
          //console.log('hash: ' + hash);

          bcrypt.compare(password, hash, function (err, response) {
            if (response === true) {
              console.log(`Login: User #${userID}`);
              return done(null, userID, req.flash('loginMessage', 'You are now logged in.'));
            }
            else {
              return done(null, false, req.flash('loginMessage', 'Incorrect password.')); // Authentication request failed (the password is incorrect)
            }

          });
        }

      });
      poolDone();
    });
  }
));

if (IN_PROD) {
  // Instantiate a storage client
  const storage = new Storage();

  // init Upload (as global variable)
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
  }).any();

  // A bucket is a container for objects (files).
  const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
}
else {
  // Set Storage Engine
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img/uploads_tmp');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  // init Upload (as global variable)
  upload = multer({ storage: storage }).any();

}


app.use('/', index);


// Server
app.listen(PORT, function () {
  if (IN_PROD) {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  }
  else {
    console.log(`Server Started On Port ${PORT}`);
  }


});


module.exports.upload = upload;

