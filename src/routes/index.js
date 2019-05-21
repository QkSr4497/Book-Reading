const express = require('express');
const router = express.Router();
var passport = require('passport');

const bcrypt = require('bcrypt');
const saltRounds = 10;  // the number of rounds that the module will go through to hash your data
// higher means slower

require('dotenv').config(); // using env file

const pool = require('./../db.js'); // postgresql database connection pool

const queries = require('./../queries');

//=============================================================



router.get('/', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  //console.log('user: ['+ req.user + ']  , isAuthenticated: ' + req.isAuthenticated());

  queries.getUserById(req.user, (userData) => {
    console.log(userData);
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT * FROM "Book"', (error, result) => {
        if (error) {
          console.log(error.stack);
        } else {
          done();
          // res.redirect('/signUp.html');
          res.render('kid-page', { "Book": result.rows, userData });
        }
      });

    });
  });

 

});

router.get('/login', function (req, res) {
  res.render('login', { message: req.flash('loginMessage') });
});

router.get('/signUp/signUpPage', function (req, res) {
  res.render('signUpPage');
});

router.post('/signUp/signUpNewUser', function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


  const userName = req.body.userName;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const pwd = req.body.pwd;


  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err;
    bcrypt.hash(pwd, saltRounds, function (err, hash) { // auto-gen a salt and hash with bcrypt
      client.query('INSERT INTO "Person"("userName", "firstName", "lastName", email, pwd) VALUES($1, $2, $3, $4, $5)',    // inserting into person
        [userName, firstName, lastName, email, hash], (error) => {
          if (error) {
            console.log(error.stack);
          }
          else {
            client.query('SELECT * FROM "Person" p WHERE p."userName" = $1', [userName], (error, result) => {  // getting the id of the new person for the purppose
              // of inserting this id as foriegn key for subtype table
              if (error) {
                console.log(error.stack);
              }
              else {
                const personID = result.rows[0].personID;
                if (req.body.role == 'kid') {
                  const birthdate = req.body.birthdate;
                  client.query('INSERT INTO "Kid"("kidID", "birthDate") VALUES($1, $2)',  // inserting into kid
                    [personID, birthdate]);
                }
                else if (req.body.role == 'teacher') {
                  const phone = req.body.phone;
                  client.query('INSERT INTO "Teacher"("teacherID", "phone") VALUES($1, $2)',  // inserting into teacher
                    [personID, phone]);
                }
                else if (req.body.role == 'supervisor') {
                  const birthdate = req.body.birthdate;
                  client.query('INSERT INTO "Supervisor"("supervisorID", "phone") VALUES($1, $2)',  // inserting into supervisor
                    [personID, birthdate]);
                }
                console.log('new user-id: ' + personID);
                req.login(personID, function (err) {  // storing personID to the session using the function in passport.serializeUser
                  res.redirect('/');
                });
              }
            });
          }
        });
    });
    done();
  });
});

router.post('/login', passport.authenticate('local', {  // LocalStrategy function is defined in app.js file within passport.use
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


router.get('/logout', function (req, res) {
  console.log(`Logout: User #${req.user}`);
  req.logout(); // logging out the user 
  req.session.destroy();  // deleting the session in the database
  res.redirect('login');
});


router.get('/signUp/checkEmailDuplicates/:email', function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Person" p WHERE p.email = $1', [req.params.email], (error, result) => {
      if (error) {
        console.log(error.stack);
      }
      else {
        if (result.rows[0]) {
          res.send({ status: 'taken' });
        }
        else {
          res.send({ status: 'free' });
        }
      }
    });
    done();
  });
});

router.get('/signUp/checkUserDuplicates/:user', function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Person" p WHERE p."userName" = $1', [req.params.user], (error, result) => {
      if (error) {
        console.log(error.stack);
      }
      else {
        if (result.rows[0]) {
          res.send({ status: 'taken' });
        }
        else {
          res.send({ status: 'free' });
        }
      }
    });
    done();
  });
});


router.get('/books', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Book"', (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('books', { "Book": result.rows });
      }
    });

  });

});
//===========================================================

router.get('/games', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Game"', (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();

        res.render('games', { "Game": result.rows });
      }
    });
  });
});

//--------------------------------------------
router.get('/my-profile', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Friend" ', (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('my-profile', { "": result.rows });
      }
    });

  });

});

//---------------------------------------------------
router.get('/my-books', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT b.* FROM "Book" b INNER JOIN "KidBook" kb ON b."bookID" = kb."bookID" WHERE kb."kidID"=$1 AND kb."type"= $2', [userData.getUserById, 'reading'], (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('my-books', { "MyReadingBook": result.rows });
      }
    });

  });

});
//--------------------------------


router.get('/my-games', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT g.* FROM "Game" g INNER JOIN "HasGames" hg ON g."gameID" = hg."gameID" WHERE "kidID"=1', (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('my-games', { "MyGame": result.rows });
      }
    });

  });

});
//========================================


//====================================================


router.get('/my-notes', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Book"', (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('my-notes', { "Book": result.rows });
      }
    });

  });

});
//================================================
router.get('/sttings', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT b.* FROM "Book" b INNER JOIN "KidBook" kb ON b."bookID" = kb."bookID" WHERE kb."kidID"=$1 AND kb."type"= $2', [1, 'reading'], (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('settings', { "MyReadingBook": result.rows });
      }
    });

  });

});
//===========================================




router.get('/my-friends', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Friend" ', (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('my-games', { "Friend": result.rows });
      }
    });

  });

});

router.get('/my-groups', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Friend" ', (error, result) => {
      if (error) {
        console.log(error.stack);
      } else {
        done();
        // res.redirect('/signUp.html');
        res.render('my-groups', { "Friend": result.rows });
      }
    });

  });

});




passport.serializeUser(function (personID, done) { // for writing user data to user session
  done(null, personID);
});

passport.deserializeUser(function (personID, done) { // for retriving data from user session
  done(null, personID);
});

function authenticationMiddleware() { // this function will be used to restrict page access to unlogged users
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}, trying to access restricted page`);

    if (req.isAuthenticated()) return next(); // only if the user is authenticated we will go to the next function which will render the wanted page 
    res.redirect('/login'); // if not authenticated then redirect to login page  
  }
}

module.exports = router;




/*
// quickly check hashed passwords for generating info for initializeDB.sql
bcrypt.hash('qksrPass1', saltRounds, function (err, hash) { console.log(`password:[qksrPass1], hash:[${hash}]`) });
bcrypt.hash('maramPass1', saltRounds, function (err, hash) { console.log(`password:[maramPass1], hash:[${hash}]`) });
bcrypt.hash('molly43Pass1', saltRounds, function (err, hash) { console.log(`password:[molly43Pass1], hash:[${hash}]`) });
bcrypt.hash('jack12Pass1', saltRounds, function (err, hash) { console.log(`password:[jack12Pass1], hash:[${hash}]`) });
bcrypt.hash('dave33Pass1', saltRounds, function (err, hash) { console.log(`password:[dave33Pass1], hash:[${hash}]`) });
bcrypt.hash('milla34Pass1', saltRounds, function (err, hash) { console.log(`password:[milla34Pass1], hash:[${hash}]`) });
bcrypt.hash('mike22Pass1', saltRounds, function (err, hash) { console.log(`password:[mike22Pass1], hash:[${hash}]`) });
bcrypt.hash('danny5Pass1', saltRounds, function (err, hash) { console.log(`password:[danny5Pass1], hash:[${hash}]`) });
bcrypt.hash('keren6Pass1', saltRounds, function (err, hash) { console.log(`password:[keren6Pass1], hash:[${hash}]`) });
bcrypt.hash('nelly15Pass1', saltRounds, function (err, hash) { console.log(`password:[nelly15Pass1], hash:[${hash}]`) });
*/
