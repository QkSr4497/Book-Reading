const express = require('express');
const Router = require('express-promise-router');
var passport = require('passport');
var hbs = require('hbs');
var path = require('path');
var multer = require('multer');
const nodemailer = require('nodemailer'); // sending emails
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // the number of rounds that the module will go through to hash your data
                        // higher means slower

const __ = require('multi-lang')('src/language-server.json'); // Import module with language-server.json file

require('dotenv').config(); // using env file

const db = require('./../db.js'); // postgresql database connection pool

const pool = db.pg_pool;

const router = new Router();

const queries = require('./../queries');

const app = require('./../app');


// // Set Storage Engine
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './../uploads/tmp');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) );
//   }
// });

// // init Upload
// var upload = multer({ storage: storage }).any();


//=============================================================


//=============================================================
router.get('/', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  //console.log('user: ['+ req.user + ']  , isAuthenticated: ' + req.isAuthenticated());

  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    // console.log(userData);

    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      
      client.query('SELECT * FROM "Book"', (error, result) => {
        done();
        if (error) {
          console.log(error.stack);
        } 
        else {
          // res.redirect('/signUp.html');
          if (userData.userType === 'kid') {
            res.render('kid/kid-page', { "Book": result.rows,  userData , errorMsg: req.flash('errorMessage'), infoMsg: req.flash('infoMessage')});
          }
          else if (userData.userType === 'teacher' || userData.userType === 'supervisor' || userData.userType === 'admin') {
            res.render('teacher/home', { userData , errorMsg: req.flash('errorMessage'), infoMsg: req.flash('infoMessage') });
          }
        }
      });

    });
  });
});


//=============================================================
router.get('/home', function (req, res) {
  res.render('home', { });
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
  const langS = req.body.languageSelected;
  const gender = req.body.genderSelected;
  const userRole = req.body.role;
  var profilePicPath;
  var signUpEmailContent;
  var signUpEmailSubject = __('signUpEmailSubject', {userName: userName}, langS);  // translation using 'multi-lang npm

  if (userRole == 'kid') {
    signUpEmailContent = __('signUpEmailContentKid', {userName: userName}, langS);  // translation using 'multi-lang npm
    if (gender == 'M') {
      profilePicPath = '/img/users/defaultProfilePics/kidM.png';
    }
    else if (gender == 'F') {
      profilePicPath = '/img/users/defaultProfilePics/kidF.png';
    }
  }
  else if (userRole == 'supervisor') {
    signUpEmailContent = __('signUpEmailContentSupervisor', {userName: userName}, langS);  // translation using 'multi-lang npm
    if (gender == 'M') {
      profilePicPath = '/img/users/defaultProfilePics/supervisorM.png';
    }
    else if (gender == 'F') {
      profilePicPath = '/img/users/defaultProfilePics/supervisorF.png';
    }
  }
  else if (userRole == 'teacher') {
    signUpEmailContent = __('signUpEmailContentTeacher', {userName: userName}, langS);  // translation using 'multi-lang npm
    if (gender == 'M') {
      profilePicPath = '/img/users/defaultProfilePics/teacherM.jpg';
    }
    else if (gender == 'F') {
      profilePicPath = '/img/users/defaultProfilePics/teacherF.png';
    }
  }
  else if (userRole == 'admin') {
    if (gender == 'M') {
      profilePicPath = '/img/users/defaultProfilePics/adminM.jpg';
    }
    else if (gender == 'F') {
      profilePicPath = '/img/users/defaultProfilePics/adminF.png';
    }
  }



  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err;
    bcrypt.hash(pwd, saltRounds, function (err, hash) { // auto-gen a salt and hash with bcrypt
      client.query('INSERT INTO "Person"("userName", "firstName", "lastName", email, pwd, lang, gender, "profilePic") VALUES($1, $2, $3, $4, $5, $6, $7, $8)',    // inserting into person
        [userName, firstName, lastName, email, hash, langS, gender, profilePicPath], (error) => {
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
                  var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                      user: 'kidsread.appspot@gmail.com',
                      pass: process.env.GMAILPW
                    }
                  });
                  var mailOptions = {
                    to: email,
                    from: 'kidsread.appspot@gmail.com',
                    subject: signUpEmailSubject,
                    text: signUpEmailContent
                  };
                  smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('infoMessage', __('signUpFlashMessage', langS));
                    res.redirect('/');
                  });
                  
                });
              }
            });
          }
        });
    });
    done();
  });
});

//=============================================================
router.post('/login', passport.authenticate('local', {  // LocalStrategy function is defined in app.js file within passport.use
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


//=============================================================
router.get('/logout', function (req, res) {
  console.log(`Logout: User #${req.user}`);
  req.logout(); // logging out the user 
  req.session.destroy();  // deleting the session in the database
  res.redirect('login');
});

//=============================================================
router.get('/forgot', function (req, res) {
  res.render('forgot',  { errorMsg: req.flash('errorMessage'), infoMsg: req.flash('infoMessage') });  
});

//=============================================================
router.post('/forgot', async function (req, res) {
  // Synchronous
  const buf = crypto.randomBytes(20);
  var token = buf.toString('hex');
  // console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
  // console.log(token);
  try {
    
    var userData  = await queries.checkEmailExists(req.body.email); // if email exists then userID is returned, otherwise a error is thrown
    var userID = userData.personID;
    var userEmail = req.body.email;
    var langPreferred = userData.lang;
    var userName = userData.userName;

    var oneHour = 60*60*1000; // in milliseconds
    var expirationTimeMs = Date.now() + oneHour;
    var expirationTime = new Date(expirationTimeMs);

    await queries.updateUserResetPasswordToken(userID, token, expirationTime);

    var smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'kidsread.appspot@gmail.com',
        pass: process.env.GMAILPW
      }
    });
    var mailOptions = {
      to: userEmail,
      from: 'kidsread.appspot@gmail.com',
      subject: __('passwordResetEmailSubject', {userName: userName}, langPreferred),  // translation using 'multi-lang npm
      text: __('passwordResetEmailContent', {host: req.headers.host, token: token}, langPreferred)  // translation using 'multi-lang npm
    };
    smtpTransport.sendMail(mailOptions, function(err) {
      console.log('Reset password request email has been sent to ' + userEmail)
      req.flash('infoMessage', __('passwordResetFlashMessage', {userEmail: userEmail}, langPreferred) );
      res.redirect('/forgot');
    });


  } catch (error) {
    console.error(error);
    req.flash('errorMessage', error);
    return res.redirect('/forgot');
  }
  
});

//=============================================================
router.get('/reset/:token', async function(req, res) {
  var token = req.params.token;

  try {
    userData = await queries.getUserDataByValidToken(token); // if this is a valid token then user's data is returned, otherwise an error is thrown
    // console.log(userData);
    res.render('reset', { token: req.params.token, errorMsg: req.flash('errorMessage'), infoMsg: req.flash('infoMessage') });
  } catch (error) {
    console.error(error);
    req.flash('errorMessage', error);
    return res.redirect('/forgot');
  }
  
});


router.post('/reset/:token', async function (req, res) {
  var token = req.params.token;

  if (req.body.password === req.body.confirm) {
    var newPassword = req.body.password;
    try {
      userData = await queries.getUserDataByValidToken(token); // if this is a valid token then user's data is returned, otherwise an error is thrown

      await queries.ChangeUserPassoword(userData.personID, newPassword);

      console.log(`${userData.userName} - user #${userData.personID} has successfully changed his password`);
      req.login(userData.personID, function (err) {  // storing personID to the session using the function in passport.serializeUser
        var langPreferred = userData.lang;
        var userEmail = userData.email;
        var userName = userData.userName;
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'kidsread.appspot@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: userEmail,
          from: 'kidsread.appspot@gmail.com',
          subject: __('passwordChangedEmailSubject', {userName: userName}, langPreferred),  // translation using 'multi-lang npm
          text: __('passwordChangedEmailContent', {userName: userName}, langPreferred)  // translation using 'multi-lang npm
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('infoMessage', __('passwordChangedFlashMessage', langPreferred));
          res.redirect('/');
        });
      });

    } catch (error) {
      console.error(error);
      req.flash('errorMessage', error);
      return res.redirect('back');
    }
  } else {
    req.flash("errorMessage", "Passwords do not match.");
    return res.redirect('back');
  }

});

//=============================================================
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
      done();
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
  });
});

//=============================================================
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
      done();
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
  });
});

//============================================================
router.post('/changeLangPreferred', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    const lang = req.body.lang;
    
    try {
      await queries.updateLanguagePreferred(req.user, lang);
    } catch (e) {
      console.error(e);
    } 

  });
});


//=============================================================
router.get('/kid/library', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT b.* FROM "Book" b WHERE b."bookID" NOT IN (SELECT kb."bookID" FROM "KidBook" kb WHERE kb."kidID"=$1)',[userData.userID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        // res.redirect('/signUp.html');
        res.render('kid/library', { "Book": result.rows ,userData});
      }
    });

  });
});
});


//===============================================================
router.post('/kid/books/addToList/:bookID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('INSERT INTO "KidBook"("kidID", "bookID","type" ) VALUES($1, $2,$3)',[userData.userID, req.params.bookID, 'intrested'], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        // res.redirect('/signUp.html');
        res.redirect('/kid/books');
        //res.render('kid/books');
      }
    });

     });
    });
});

//===========================================================
// router.get('/kid/single-book-page/:bookID', function (req, res) {
//   // the pool with emit an error on behalf of any idle clients
//   // it contains if a backend error or network partition happens
//   queries.getUserById(req.user, (userData) => {
//     pool.on('error', (err, client) => {
//       console.error('Unexpected error on idle client', err)
//       process.exit(-1)
//     })

//     // callback - checkout a client
//     pool.connect((err, client, done) => {
//       if (err) throw err
//       console.log('req params ' + JSON.stringify(req.params));
//       console.log("req.params.bookID = " + req.params.bookID);
//       client.query(`SELECT * FROM "Book" b WHERE b."bookID" = $1`, [req.params.bookID], (error, result) => {
//         if (error) {
//           console.log(error.stack);
//         }
//         else {
//           done();
//           console.log('book chosen: ' + JSON.stringify(result.rows[0]));
//           res.render('kid/single-book-page', { "bookData": result.rows[0], userData });
//         }
//       });

//     });
//   });
// });


//=============================================================
router.get('/kid/single-book-page/:bookID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  //console.log('req params ' + JSON.stringify(req.params));
  //console.log("req.params.bookID = " + req.params.bookID);
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  //console.log("query = " + req.params.bookID);
  queries.getBookInfoAndReviews(req.params.bookID,(bookInfoAndReviews)=>{
    //console.log('bookInfoAndReviews '+bookInfoAndReviews);
    //res.render('/kid/single-book-page/'+req.params.bookID, { bookDataAndReviews,userData });
     res.render('kid/single-book-page', {bookInfoAndReviews,userData });
    
  })
});
});


//=============================================================
router.get('/kid/hasBook:bookID', authenticationMiddleware(),  function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  //console.log('hasbook'+req.params.bookID);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "KidBook" kb  WHERE kb."kidID" = $1 AND kb."bookID"=$2', [userData.userID,req.params.bookID], (error, result) => {
      done();
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
  });
});
});


//=============================================================
router.get('/kid/hasFinishedBook:bookID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
//console.log('hasFinished book'+req.params.bookID);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT kb."type" FROM "KidBook" kb  WHERE kb."kidID" = $1 AND kb."bookID"=$2 AND kb."type"=$3', [userData.userID,req.params.bookID,'finished'], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      }
      else {
        if (result.rows[0]) {
          res.send({ status: 'finished' });
        }
        else {
          res.send({ status: 'notFinished' });
        }
      }
    });
    
  });
});
});

//=============================================================
router.get('/kid/hasReview:bookID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens

  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  //console.log('hasReview'+req.params.bookID);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT kb."review" FROM "KidBook" kb  WHERE kb."kidID" = $1 AND kb."bookID"=$2 AND kb."review" IS NOT NULL ', [userData.userID,req.params.bookID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      }
      else {
        if (result.rows[0]) {
          res.send({ status: 'has' });
        }
        else {
          res.send({ status: 'hasnot' });
        }
      }
    });
    
  });
});
});

//=============================================================
router.post('/kid/book/addReview', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    //console.log('req.body.bookID add '+req.body.bookID )
    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('UPDATE "KidBook" SET "review" = $1 WHERE "kidID" = $2 AND "bookID"=$3',[req.body.review,userData.userID,req.body.bookID], (error, result) => {
        done();
        if (error) {
          console.log(error.stack);
        } else {
          
           res.redirect('/kid/single-book-page/'+req.body.bookID);
         // res.render('kid/single-book-page', { "bookData": result.rows,userData });
        }
      });
  
    });

  });
});
//==========================================
router.get('/kid/hasQuiz:bookID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  //console.log('hasbook'+req.params.bookID);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(`SELECT * FROM "TakesQuiz" tq INNER JOIN "Quiz" q 
    on tq."quizID"=q."quizID" INNER JOIN  "WritesQuiz" wq ON tq."quizID" =wq."quizID"  WHERE tq."kidID" = $1 AND wq."bookID"=$2 `, [userData.userID,req.params.bookID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      }
      else {
        if (result.rows[0]) {
          res.send({ status: 'has' });
        }
        else {
          res.send({ status: 'hasNot' });
        }
      }
    });
    
  });
});
});
//=========================================================
// router.get('/kid/single-book-page/getReivews/:bookID', authenticationMiddleware(), function (req, res) {
//   // the pool with emit an error on behalf of any idle clients
//   // it contains if a backend error or network partition happens
//   queries.getUserById(req.user, (userData) => {
//   pool.on('error', (err, client) => {
//     console.error('Unexpected error on idle client', err)
//     process.exit(-1)
//   })
// console.log('review for '+req.params.bookID);
//   // callback - checkout a client
//   pool.connect((err, client, done) => {
//     if (err) throw err
//     client.query('SELECT * FROM "KidBook" kb WHERE kb."bookID"=$1',[req.params.bookID], (error, result) => {
//       if (error) {
//         console.log(error.stack);
//       } else {
//         done();
//        res.redirect('/kid/single-book-page/'+req.params.bookID);
//         res.render('kid/single-book-page/'+req.params.bookID, { "bookReviews": result.rows,userData });
//       }
//     });
//   });
// });
// });


//=============================================================
router.get('/kid/store', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM "Game" g WHERE g."gameID" NOT IN (SELECT hg."gameID" FROM "HasGames" hg WHERE hg."kidID"=$1) AND g."gameID" NOT IN (SELECT c."gameID" FROM "Cart" c WHERE c."kidID"=$1)',[userData.userID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        res.render('kid/store', { "Game": result.rows ,userData});
      }
    });
  });
});
});


//====================== kid add this game from Store =======================================
router.post('/games/addToCart', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('INSERT INTO "Cart" ("kidID", "gameID") VALUES($1, $2)',[userData.userID,req.body.gameID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else { 
       res.redirect('/kid/cart');
      }
    });
  });
});
});


//============================================================
router.get('/kid/profile', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(`SELECT p.*,DATE_TRUNC('day',k."birthDate" ) AS birth, k."points" 
    FROM "Person" p INNER JOIN "Kid" k ON p."personID"=k."kidID" WHERE p."personID"=$1`,[userData.userID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        // res.redirect('/signUp.html');
        res.render('kid/profile', { "kidProfile": result.rows ,userData});
      }
    });

  });
});
});

//============================================================
router.post('/kid/edit-profile', authenticationMiddleware(), function (req, res) {
  app.upload(req, res, async function (err) {
    if (err) {
      console.log('Error-->');
      console.log(err);
      res.json({ "status": "Failure", "message": 'There was a problem uploading your files.' + err });
      return;
    }
    else {
      
      console.log(req.files);
      console.log('****');
      // console.log("fieldname " + req.files);
      

      try {
        await queries.editKidProfile(req.body, req.user, req.files);
      } catch (e) {
        console.error(e);
      }
      res.redirect('/kid/profile');


    }
  });
});


//============================================================
router.get('/kid/books', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    queries.getBooksAccordingToTypes(userData.userID, (bookDataByTypes) => {
      //console.log(bookDataByTypes);
      res.render('kid/books', { bookDataByTypes, userData });

    })
  });
});

//============================================================
router.post('/kid/books/edit', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  var bookID = req.body.bookID;
  var bookType = req.body.bookType;
  //console.log('bookID ' + bookID);
  //console.log('bookType: ' + bookType );


  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  
    // callback - checkout a client
    pool.connect((err, client, done) => {
      
      if (err) throw err
      client.query(' UPDATE "KidBook" SET "type" = $1 WHERE "kidID" = $2 AND "bookID"=$3',[bookType,userData.userID,bookID], (error, result) => {
        done();
        if (error) {
          res.send({ status: 'error' });
          console.log(error.stack);
        } else {
          res.send({ status: 'success' });
          // res.redirect('/kid/books');
        }

      });
  
    });

  });
});


//============================================================
router.get('/kid/games', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  
    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT g.* FROM "Game" g INNER JOIN "HasGames" hg ON g."gameID" = hg."gameID" WHERE hg."kidID"=$1',[userData.userID], (error, result) => {
        done();
        if (error) {
          console.log(error.stack);
        } else {
          
          // res.redirect('/signUp.html');
          res.render('kid/games', { "MyGames": result.rows ,userData});
        }
      });
  
    });

  });
});

//============================================================
router.post('/kid/games/add:gameID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    console.error('gameID '+ req.params.gameID)
    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('INSERT INTO "HasGames" ("kidID", "gameID") VALUES($1, $2)',[userData.userID,req.params.gameID], (error, result) => {
        done();
        if (error) {
          console.log(error.stack);
        } else {
          

         //res.render('kid/games', { "MyGames": result.rows,userData });
         //res.redirect('/kid/games');
        }
      });
  
    });

  });
});
//===========================================================
router.get('/kid/supervisors', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    if (userData.userType == 'kid') {  // only kids can view this page
      // callback - checkout a client
      pool.connect((err, client, done) => {
        if (err) throw err
        client.query(`SELECT * 
                    FROM "Supervise" s INNER JOIN "Person" p ON s."supervisorID" = p."personID"
                    WHERE "kidID" = $1 AND "approved" = $2`, [userData.userID, 'Y'], (error, result) => {
            done();
            if (error) {
              console.log(error.stack);
            } else {
              res.render('kid/supervisors', { "mySupervisorsList": result.rows, userData });
            }
          });
      });
    }
    else {  // other users goto homepage
      res.redirect('/');
    }


  });
});
//============================================================
router.get('/kid/notes', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  queries.getAllAboutNote(userData.userID,(notesData)=>{
    //console.log(bookDataByTypes);
    res.render('kid/notes', { notesData,userData });
    
  })
});
});

//============================================================
router.post('/kid/notes/add', authenticationMiddleware(), function (req, res) {
  app.upload(req, res, function (err) {
  if (err) {
    console.log('Error-->');
    console.log(err);
    res.json({ "status": "Failure", "message": 'There was a problem uploading your files.' + err });
    return;
  }
  else {
    console.log(req.body);
    console.log("req.file"+req.files);
    console.log("fieldname" + req.file);
    if (req.file != 0) {
      console.log('File uploaded!');
      if(req.body.bookID!="-1"){
        queries.insertNote_book(req.body, req.user, req.files);
        res.redirect('/kid/notes');
      }
      if(req.body.bookID=="-1"){
        console.log('without a book');
        queries.insertNote_noBook(req.body, req.user, req.files);
        res.redirect('/kid/notes');
      }
   }
    else {  // has to be a least 1 pic, the pic of the quiz
      console.log("No file uploaded. Ensure file is uploaded.");
      res.json({ "status": "Failure", "message": 'No file uploaded. Ensure file is uploaded.' });
    }
  }
});
});
//===========================================================
router.post('/kid/notes/edit', authenticationMiddleware(), function (req, res) {
  app.upload(req, res, function (err) {
  if (err) {
    console.log('Error-->');
    console.log(err);
    res.json({ "status": "Failure", "message": 'There was a problem uploading your files.' + err });
    return;
  }
  else {
    console.log(req.body);
    console.log("req.file"+req.files);
    console.log("fieldname" + req.file);
    if (req.file != 0) {
      console.log('File uploaded!');
      if(req.body.bookID != "-1"){
        console.log("booook"+req.body.bookID)
        queries.updateNote_book(req.body, req.user, req.files);
        res.redirect('/kid/notes');
      }
      if(req.body.bookID=="-1"){
        console.log('without a book');
        queries.updateNote_noBook(req.body, req.user, req.files);
        res.redirect('/kid/notes');
      }
   }
    else {  // has to be a least 1 pic, the pic of the quiz
      console.log("No file uploaded. Ensure file is uploaded.");
      res.json({ "status": "Failure", "message": 'No file uploaded. Ensure file is uploaded.' });
    }
  }
});
});

//============================================================
router.post('/kid/notes/edit/aa', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
//console.log('req.body.id'+req.body.noteID);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    console.log(req.body);
    if (err) throw err
    client.query('UPDATE "Note" SET "title"=$1, "content"=$2, "type"=$3 WHERE "personID"=$4 AND "noteID"=$5 ',[ req.body.title, req.body.content, 'private',userData.userID,req.body.noteID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        //res.render('/kid/notes', { "myNotes": result.rows ,userData});
        res.redirect('/kid/notes');
      }
    });

     });
    });
});


//============================================================
router.delete('/kid/notes/delete/:noteID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('DELETE FROM "Note" n WHERE n."personID"=$1 AND n."noteID"=$2' ,[userData.userID,req.params.noteID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        // res.redirect('/signUp.html');
        res.render('kid/notes', { "myNotes": result.rows,userData });
      }
    });

  });
});
});

//============================================================
router.get('/kid/groups', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  
    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT g.*,ig.* FROM "Group" g INNER JOIN "InGroup" ig ON g."groupID"=ig."groupID" WHERE ig."personID"=$1 AND ig."approved"= $2',[userData.userID, 'Y'], (error, result) => {
        done();
        if (error) {
          console.log(error.stack);
        } else {
          
          // res.redirect('/signUp.html');
          res.render('kid/groups', { "myGroups": result.rows ,userData});
        }
      });
  
    });

  });
});

//=============================================
// router.get('/kid/single-group-page/:groupID', function (req, res) {
//   // the pool with emit an error on behalf of any idle clients
//   // it contains if a backend error or network partition happens
//   queries.getUserById(req.user, (userData) => {
//     pool.on('error', (err, client) => {
//       console.error('Unexpected error on idle client', err)
//       process.exit(-1)
//     })

//     // callback - checkout a client
//     pool.connect((err, client, done) => {
//       if (err) throw err
//       console.log('req params ' + JSON.stringify(req.params));
//       console.log("req.params.groupID = " + req.params.groupID);
//       client.query(`SELECT * FROM "Group" g INNER JOIN "Person" p 
//       ON g."personID"=p."personID" WHERE g."groupID" = $1`, [req.params.groupID], (error, result) => {
//         if (error) {
//           console.log(error.stack);
//         }
//         else {
//           done();
//           console.log('book chosen: ' + JSON.stringify(result.rows[0]));
//           res.render('kid/single-group-page', { "groupData": result.rows[0], userData });
//         }
//       });

//     });
//   });
// });


//============================================================
router.get('/kid/single-group-page/:groupID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  //console.log('req params ' + JSON.stringify(req.params));
  //console.log("req.params.bookID = " + req.params.groupID);
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  //console.log("query = " + req.params.groupID);
  queries.getAllAboutGroup(req.params.groupID,(allAboutGroup)=>{
    //console.log('GroupInfoAndPosts '+allAboutGroup);
    //res.render('/kid/single-book-page/'+req.params.bookID, { bookDataAndReviews,userData });
     res.render('kid/single-group-page', {allAboutGroup,userData });
    
  })
});
});

//==================== kid add this game from Store ========================================
router.post('/post/add', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
    //console.log(date);
    if (err) throw err
    client.query('INSERT INTO "Post" ("postDate", "content","groupID","personID") VALUES($1, $2,$3,$4)',[date,req.body.content,req.body.groupID,userData.userID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        if (userData.userType == 'kid') {
          res.redirect('/kid/single-group-page/'+req.body.groupID);
        }
        else {
          res.redirect('/teacher/single-group/'+req.body.groupID);
        }
        
      }
    });
  });
});
});


//============================================================
router.get('/kid/settings', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(`` , (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        // res.redirect('/signUp.html');
        res.render('kid/settings', { "mySettings": result.rows ,userData});
      }
    });

  });
});
});

//==========================================================

//=======================================================
router.get('/kid/message', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  
    queries.getAllMessages(userData.userID,(userMessages)=>{
      console.log(userMessages);
      res.render('kid/message', { userMessages,userData });
      
    })
  });
});
//=========================================================
router.post('/kid/message/updateChecked:messageID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  console.log('messageID to update '+req.params.messageID);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('UPDATE "GetMessage" SET "checked" = $1 WHERE "personID" = $2 AND "messageID"=$3' ,['Y',userData.userID,req.params.messageID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        res.redirect('/kid/message');
        //res.render('kid/games', { "MyGames": result.rows });
      }
    });

  });
});
});
router.post('/kid/message/updateUnchecked:messageID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  console.log('messageID to update '+req.params.messageID);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('UPDATE "GetMessage" SET "checked" = $1 WHERE "personID" = $2 AND "messageID"=$3' ,['N',userData.userID,req.params.messageID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        res.redirect('/kid/message');
        //res.render('kid/games', { "MyGames": result.rows });
      }
    });

  });
});
});
//============================================================
router.get('/kid/cart', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT g.* FROM "Cart" c INNER JOIN "Game" g ON c."gameID"=g."gameID" WHERE c."kidID"=$1' ,[userData.userID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        // res.redirect('/signUp.html');
        res.render('kid/cart', { "myCart": result.rows,userData });
      }
    });

  });
});
});


//============================================================
router.delete('/kid/cart/delete/:gameID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('DELETE FROM "Cart" c WHERE c."kidID"=$1 AND c."gameID"=$2' ,[userData.userID,req.params.gameID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        //res.redirect('/kid/cart');
       res.render('kid/cart', { "myCart": result.rows,userData });
      }
    });

  });
});
});

//============================================================
router.post('/kid/points/edit:points', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  //console.log(req.params.points);
  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('UPDATE "Kid" SET "points" = $1 WHERE "kidID" = $2' ,[req.params.points,userData.userID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        //res.redirect('/kid/games');
        //res.render('kid/games', { "MyGames": result.rows });
      }
    });

  });
});
});



//============================================================
router.get('/kid/quizes', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    const quizes = await queries.getAllQuizesNotTaken(userData.userID);
    res.render('kid/quizes', { "QuizNotTaken": quizes.notTaken , "QuizTaken": quizes.taken , userData});
  });
});

//---------------------------------------------------------------
router.post('/kid/start-quiz', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    var quizID = req.body.quizID;
    const quizData = await queries.getFullQuizDataByQuizID(quizID);
    //console.dir(quizData, { depth: null }); // `depth: null` ensures unlimited recursion
    res.render('kid/quiz-attempt', { quizData, userData });
  });
});


//============================================================
router.post('/kid/quiz/getQuizData', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    const quizID = req.body.quizID;
    const quizData = await queries.getFullQuizDataByQuizID(quizID);
    //console.dir(quizData, { depth: null }); // `depth: null` ensures unlimited recursion

    res.send(quizData);
  });
});

//============================================================
router.post('/kid/quiz/checkQuizStatus', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    const kidID = req.user;
    const quizID = req.body.quizID;
    const quizStatus = await queries.updateQuizStatus(kidID, quizID);
    res.send(quizStatus);
  });
});

//============================================================
router.post('/kid/quiz/updateGradeAndPoints', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    const quizID = req.body.quizID;
    const kidID = req.body.kidID;
    const grade = req.body.quizGrade;
    const points = req.body.pointEarned;
    
    await queries.updateQuizAndPoints(kidID, quizID, grade, points);
    //console.dir(quizData, { depth: null }); // `depth: null` ensures unlimited recursion

    res.sendStatus(200);
  });
});


//============================================================
router.post('/kid/notifyQuizResults', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  // console.log('starting POST notifyQuizResults', req.body);
    try {
      var date = new Date();
      var infoMsg;
      infoMsg = await queries.sendNotification(req.body.senderID, undefined, date, req.body.content, req.body.typeName);
      console.log(infoMsg);
    } catch (e) {
      console.error(e);
    }
    res.sendStatus(200);

  });
});


//============================================================
router.get('/kid/kid-notifications', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    var notifications;
    try {
      notifications = await queries.getNotificationsOfUser(req.user);
    } catch (e) {
      console.error(e);
    } 

    res.render('kid/kid-notifications', { userData, notifications});
  });
});

//============================================================
router.get('/supervisor/supervisor-notifications', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    var notifications;
    try {
      notifications = await queries.getNotificationsOfUser(req.user);
    } catch (e) {
      console.error(e);
    } 

    res.render('supervisor/supervisor-notifications', { userData, notifications});
  });
});


//============================================================
router.get('/grown-up/notifications', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    if (userData.userType == 'supervisor' || userData.userType == 'teacher' || userData.userType == 'admin') {  // only supervisors and teachers can view this page

      var notifications;
      try {
        notifications = await queries.getNotificationsOfUser(req.user);
      } catch (e) {
        console.error(e);
      }

      res.render('grown-up/notifications', { userData, notifications });
    }
    else {  // other users goto homepage
      res.redirect('/');
    } 
  });
});

//============================================================
router.post('/notificationsMarkRead', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    try {
      await queries.setAllUserNotificationsAsRead(req.user);
    } catch (e) {
      console.error(e);
    }

    res.sendStatus(200);
  });
});

//============================================================
router.post('/kid/respondToSupervisionReq', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    try {
      console.log(req.body);
      var supervisorID = req.body.supervisorID; 
      var kidID = req.body.kidID;
      var kidResponse = req.body.notificationResponse;
      var notificationID = req.body.notificationID;
      await queries.respondToSupervisionReq(supervisorID, kidID, kidResponse, notificationID);
    } catch (e) {
      console.error(e);
    }
    res.status(200).send(kidResponse);
  });
});


//============================================================
router.post('/removeAllUserNotifications', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    try {
      await queries.removeAllUserNotifications(req.user);
    } catch (e) {
      console.error(e);
    }
    res.sendStatus(200);
  });
});


//============================================================
router.get('/teacher/books', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query(`SELECT * FROM "Book"`, (error, result) => {
        done();
        if (error) {
          console.log(error.stack);
        } else {
          
          // res.redirect('/signUp.html');
          // console.log("json: "+ JSON.stringify(result.rows));
          // console.log("regular: "+result.rows);
          res.render('teacher/books', { "books": result.rows, userData });
        }
      });
    });
  });
});


//============================================================
router.get('/teacher/single-book-page/:bookID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    // callback - checkout a client
    pool.connect((err, client, done) => {
      if (err) throw err
      //console.log('req params ' + JSON.stringify(req.params));
      //console.log("req.params.bookID = " + req.params.bookID);
      client.query(`SELECT * FROM "Book" b WHERE b."bookID" = $1`, [req.params.bookID], (error, result) => {
        done();
        if (error) {
          console.log(error.stack);
        }
        else {
          
          //console.log('book chosen: ' + JSON.stringify(result.rows[0]));
          res.render('teacher/single-book-page', { "bookData": result.rows[0], userData });
        }
      });

    });
  });
});

//============================================================
router.get('/supervisor/add-kid', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    if (userData.userType == 'supervisor' || userData.userType == 'admin') {  // only supervisors can view this page
      res.render('supervisor/add-kid', { userData, message: req.flash('info') });
    }
    else {  // other users goto homepage
      res.redirect('/');
    } 
  });
});


//============================================================
router.get('/supervisor/my-kids', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    if (userData.userType == 'supervisor' || userData.userType == 'admin') {  // only supervisors can view this page
      // callback - checkout a client
      pool.connect((err, client, done) => {
        if (err) throw err
        client.query(`SELECT * 
                    FROM "Supervise" s INNER JOIN "Person" p ON s."kidID" = p."personID"
                    WHERE "supervisorID" = $1 AND "approved" = $2`, [req.user, 'Y'], (error, result) => {
            done();
            if (error) {
              console.log(error.stack);
            } else {
              res.render('supervisor/my-kids', { "myKidsList": result.rows, userData });
            }
          });
      });
    }
    else {  // other users goto homepage
      res.redirect('/');
    }


  });
});


//============================================================
router.get('/supervisor/kid-quizes/:kidID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {

    try {
      var isAuthorizedQuery = false;  // this query is possible only if the kid is in supervisor's list of kids
      const kidsSupervised = await queries.getSupervisorKids(req.user);
      // console.log(kidsSupervised);
      kidsSupervised.forEach(function (item) {
        if (item.kidID == req.params.kidID) {
          isAuthorizedQuery = true;
        }
      });
      if (isAuthorizedQuery) {
        // console.log(req.params);
        const quizes = await queries.getAllQuizesNotTaken(req.params.kidID);

        queries.getUserById(req.params.kidID, async (kidData) => {
          res.render('supervisor/kid-quizes', { "QuizNotTaken": quizes.notTaken, "QuizTaken": quizes.taken, userData, kidData });
        });

        
      }
      else {
        req.flash('errorMessage', 'מידע על בחנים ניתן לראות רק עבור ילדים שנמצאים ברשימת הפיקוח שלך!');
        res.redirect('/');
      }
    } catch (e) {
      console.error(e);
      req.flash('errorMessage', e)
      res.redirect('/');
    }
  });
});

//============================================================
router.post('/supervisor/addSupervisionReq', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    if (userData.userType == 'supervisor' || userData.userType == 'admin') {  // only supervisors can make this request
      try {
        var kidEmail = req.body.kidEmail;
        var infoMsg;
        infoMsg = await queries.addSupervisionReq(req.user, kidEmail);
        console.log(infoMsg);
      } catch (e) {
        console.error(e);
      }
      req.flash('info', infoMsg)
      res.redirect('/supervisor/add-kid');
    }
    else {  // not authorized to make this request
      res.sendStatus(203);
    }
  });
});


//============================================================
router.get('/teacher/add-quiz', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    res.render('teacher/add-quiz', { userData });
  });
});

//============================================================
router.get('/query/getAllBooks', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getAllBooks( (books) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    res.status(200).send(books);
  });
});


//=======================================================
router.post('/query/addNewQuiz', authenticationMiddleware(), function (req, res) {
    app.upload(req, res, async function (err) {
    if (err) {
      console.log('Error-->');
      console.log(err);
      res.json({ "status": "Failure", "message": 'There was a problem uploading your files.' + err });
      return;
    }
    else {
      // console.log("fieldname " + req.files);
      if (req.files.length != 0) {
        console.log('Files uploaded!');

        try {
          await queries.insertNewQuiz(req.body, req.user, req.files);
          req.flash('infoMessage', 'בוחן חדש נוסף בהצלחה!');
        } catch (e) {
          req.flash('errorMessage', '.היתה שגיאה בעת נסיון יצירת בוחן חדש');
          console.error(e);
        } 
        res.redirect('/');
      }
      else {  // has to be at least 1 pic, the pic of the quiz
        console.log("No file uploaded. Ensure at least 1 pic is uploaded, the pic of the quiz");
        res.json({ "status": "Failure", "message": 'No file uploaded. Ensure at least 1 pic is uploaded, the pic of the quiz' });

      }
    }
  });
});


//============================================================
router.get('/teacher/my-groups', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    if (userData.userType == 'teacher' || userData.userType == 'admin') {  // only teachers can view this page

      try {
        var myGroupsList = await queries.getGroupsCreatedAndAdminedByUser(req.user);
      } catch (e) {
        console.error(e);
        req.flash('errorMessage', 'אירעה שגיאה בעת נסיון כניסה לדף הקבוצות.');
        res.redirect('/');
        
      }
      res.render('teacher/my-groups', { userData, myGroupsList });
    }
    else {  // not authorized to make this request
      req.flash('errorMessage', 'רק למורים יש גישה לקבוצות.');
      res.redirect('/');
    }
   
  });
});


//============================================================
router.get('/teacher/single-group/:groupID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens

  queries.getUserById(req.user, async (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  if (userData.userType == 'teacher' || userData.userType == 'admin') {  // only teachers can view this page

    try {
      var checkPermission = await queries.checkUserAccessToGroup(req.user, req.params.groupID);
      if (checkPermission || userData.userType == 'admin') {
        queries.getAllAboutGroup(req.params.groupID, (allAboutGroup)=>{

          res.render('teacher/single-group', {allAboutGroup,userData });
         
       });

      }
      else {
        req.flash('errorMessage', 'אין לך גישה לקבוצה זו.');
        res.redirect('/');
      }
    } catch (e) {
      console.error(e);
      req.flash('errorMessage', 'אירעה שגיאה בעת נסיון כניסה לדף הקבוצות.');
      res.redirect('/');   
    }
  }
  else {  // not authorized to make this request
    req.flash('errorMessage', 'רק למורים יש גישה לקבוצות.');
    res.redirect('/');
  }
});
});
//=============================================================
router.get('/teacher/group-status/:groupID', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens

  queries.getUserById(req.user, async (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  if (userData.userType == 'teacher' || userData.userType == 'admin') {  // only teachers can view this page
    try {
      var checkPermission = await queries.checkUserAccessToGroup(req.user, req.params.groupID);
      if (checkPermission || userData.userType == 'admin') {
        queries.getGroupStatusQuiz(req.params.groupID, (getGroupStatusQuiz)=>{
          res.render('teacher/group-status', {getGroupStatusQuiz,userData });
         
       });

      }
      else {
        req.flash('errorMessage', 'אין לך גישה לקבוצה זו.');
        res.redirect('/');
      }
    } catch (e) {
      console.error(e);
      req.flash('errorMessage', 'אירעה שגיאה בעת נסיון כניסה לדף הקבוצות.');
      res.redirect('/');   
    }
  }
  else {  // not authorized to make this request
    req.flash('errorMessage', 'רק למורים יש גישה לקבוצות.');
    res.redirect('/');
  }
});
});


//============================================================
router.get('/grown-up/add-book', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    if (userData.userType == 'supervisor' || userData.userType == 'teacher' || userData.userType == 'admin') {  // only supervisors and teachers can view this page
      res.render('grown-up/add-book', { userData });
    }
    else {  // other users goto homepage
      req.flash('errorMessage', 'אין לך גישה לדף זה.');
      res.redirect('/');
    } 
  });
});

//=======================================================
router.post('/grown-up/addNewBook', authenticationMiddleware(), function (req, res) {
  app.upload(req, res, async function (err) {
    if (err) {
      console.log('Error-->');
      console.log(err);
      res.json({ "status": "Failure", "message": 'There was a problem uploading your files.' + err });
      return;
    }
    else {
      // console.log("fieldname " + req.files);
      if (req.files.length != 0) {
        console.log('Files uploaded!');

        try {
          await queries.insertNewBook(req.body, req.files);
          req.flash('infoMessage', 'ספר חדש נוסף בהצלחה!');
        } catch (e) {
          req.flash('errorMessage', '.היתה שגיאה בעת נסיון הוספת ספר חדש');
          console.error(e);
        }
        res.redirect('/');
      }
      else {  // has to be at least 1 pic, the pic of the book
        console.log("No file uploaded. Ensure at least 1 pic is uploaded, the pic of the book");
        res.json({ "status": "Failure", "message": 'No file uploaded. Ensure at least 1 pic is uploaded, the pic of the book' });

      }
    }
  });
});


//============================================================
router.get('/teacher/add-group', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    if (userData.userType == 'teacher' || userData.userType == 'admin') {  // only teachers can view this page
      res.render('teacher/add-group', { userData });
    }
    else {  // not authorized to make this request
      req.flash('errorMessage', 'רק למורים יש גישה לקבוצות.');
      res.redirect('/');
    }
  });
});


//=======================================================
router.post('/teacher/addNewGroup', authenticationMiddleware(), function (req, res) {
  app.upload(req, res, async function (err) {
    if (err) {
      console.log('Error-->');
      console.log(err);
      res.json({ "status": "Failure", "message": 'There was a problem uploading your files.' + err });
      return;
    }
    else {
      // console.log("fieldname " + req.files);
      if (req.files.length != 0) {
        console.log('Files uploaded!');

        try {
          await queries.insertNewGroup(req.body, req.user, req.files);
          req.flash('infoMessage', 'קבוצה חדשה נוספה בהצלחה!');
        } catch (e) {
          req.flash('errorMessage', '.היתה שגיאה בעת נסיון הוספת קבוצה חדשה');
          console.error(e);
        }
        res.redirect('/');
      }
      else {  // has to be at least 1 pic, the pic of the group
        console.log("No file uploaded. Ensure at least 1 pic is uploaded, the pic of the group");
        res.json({ "status": "Failure", "message": 'No file uploaded. Ensure at least 1 pic is uploaded, the pic of the group' });
      }
    }
  });
});

//============================================================
router.get('/teacher/config-group', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    if (userData.userType == 'teacher' || userData.userType == 'admin') {  // only teachers can view this page

      try {
        var allMyGroupData = await queries.getDataOfMyGroups(userData.userID);
        var emailsList = await queries.getAllRegisteredUsersEmail();
        res.render('teacher/config-group', { userData, allMyGroupData, emailsList, errorMsg: req.flash('errorMessage'), infoMsg: req.flash('infoMessage') });
      } catch (e) {
        console.error(e);
        req.flash('errorMessage', 'אירעה שגיאה בעת נסיון כניסה לדף הגדרות הקבוצות.');
        res.redirect('/');
        
      }
      // res.json({allMyGroupData});
    }
    else {  // not authorized to make this request
      req.flash('errorMessage', 'רק למורים יש גישה לדף הגדרות הקבוצות.');
      res.redirect('/');
    }
  });
});


//============================================================
router.post('/teacher/addUserToGroupReq', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    if (userData.userType == 'teacher' || userData.userType == 'admin') {  // only teachers can make this request
      try {
        console.log(req.body);
        var groupID = req.body.selectedGroupID;
        var kidEmail = req.body.userEmailChosen;
        var permissionType = req.body.permissionType;
        var infoMsg;
        infoMsg = await queries.addUserToGroupReq(req.user, groupID, kidEmail, permissionType );
        console.log(infoMsg);
      } catch (e) {
        console.error(e);
      }
      req.flash('infoMessage', infoMsg)
      res.redirect('/teacher/config-group');
    }
    else {  // not authorized to make this request
      res.sendStatus(203);
    }
  });
});


//============================================================
router.post('/kid/respondToAddGroupReq', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    try {
      console.log(req.body);
      var teacherID = req.body.teacherID; 
      var kidID = req.body.kidID;
      var kidResponse = req.body.notificationResponse;
      var kidID = req.body.kidID;
      var groupID = req.body.groupID;
      var notificationID = req.body.notificationID;
      var content = req.body.content;
      await queries.respondToAddGroupReq(teacherID, kidID, groupID, kidResponse, notificationID, content);
    } catch (e) {
      console.error(e);
    }
    res.status(200).send(kidResponse);
  });
});


//=============  404 page -  this route must be the last one! ===============================
router.get('*', function (req, res) {
  res.render('404');
});




/**/////////////////// Passport ////////////////////////////////////////////// */

passport.serializeUser(function (personID, done) { // for writing user data to user session
  done(null, personID);
});

passport.deserializeUser(function (personID, done) { // for retriving data from user session
  done(null, personID);
});

function authenticationMiddleware() { // this function will be used to restrict page access to unlogged users
  return (req, res, next) => {
    //console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}, trying to access restricted page`);

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
bcrypt.hash('sarah29Pass1', saltRounds, function (err, hash) { console.log(`password:[sarah29Pass1], hash:[${hash}]`) });
bcrypt.hash('moshe1234Pass1', saltRounds, function (err, hash) { console.log(`password:[moshe1234Pass1], hash:[${hash}]`) });
bcrypt.hash('jacky11Pass1', saltRounds, function (err, hash) { console.log(`password:[jacky11Pass1], hash:[${hash}]`) });
bcrypt.hash('tim9Pass1', saltRounds, function (err, hash) { console.log(`password:[tim9Pass1], hash:[${hash}]`) });
bcrypt.hash('dorin23Pass1', saltRounds, function (err, hash) { console.log(`password:[dorin23Pass1], hash:[${hash}]`) });
bcrypt.hash('tali11Pass1', saltRounds, function (err, hash) { console.log(`password:[tali11Pass1], hash:[${hash}]`) });
bcrypt.hash('mira36Pass1', saltRounds, function (err, hash) { console.log(`password:[mira36Pass1], hash:[${hash}]`) });
bcrypt.hash('rafi53Pass1', saltRounds, function (err, hash) { console.log(`password:[rafi53Pass1], hash:[${hash}]`) });
bcrypt.hash('robert12Pass1', saltRounds, function (err, hash) { console.log(`password:[robert12Pass1], hash:[${hash}]`) });
*/




async function f() {
  
  var supervisorID = 12;
  var kidID = 13;
  
  var date = new Date();
  console.log(date);
  var msg;
  var content = `supervisor ${supervisorID} sends request to kid#${kidID}`;
  var type = 'supervision';
  try {
    msg = await queries.sendNotification(supervisorID, kidID, date, content, type);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  console.log(msg);
}

// f();

async function gg() {
  var data = await queries.getDataOfMyGroups(5);
  console.dir(data, { depth: null }); // `depth: null` ensures unlimited recursion 

}
// gg();

async function gg2() {
  var data = await queries.getGroupNameByGroupID(1);
  console.dir(data, { depth: null }); // `depth: null` ensures unlimited recursion 
}
// gg2();

async function gg3() {
  var data = await queries.getLanguatgePreferredByUserID(7);
  console.dir(data, { depth: null }); // `depth: null` ensures unlimited recursion 
}

// gg3();


async function gg4() {
  var oneHour = 60 * 60 * 1000; // in milliseconds
  var expirationTimeMs = Date.now() + oneHour;
  var expirationTime = new Date(expirationTimeMs);
  console.log(expirationTimeMs)
  console.log(expirationTime)

  try {
    var data = await queries.getUserDataByValidToken('2220153d9e999c1d899af7cebe0789f4b4917c76');
    var currentTime = new Date();
    console.log(data);
    console.log(typeof data.resetPasswordExpires);
    console.log(currentTime);
    console.log(typeof currentTime);
    console.log( data.resetPasswordExpires < currentTime)
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
}
  
  // gg4();
