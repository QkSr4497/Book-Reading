const express = require('express');
const Router = require('express-promise-router');
var passport = require('passport');
var hbs = require('hbs');
var path = require('path');
var multer = require('multer');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // the number of rounds that the module will go through to hash your data
                        // higher means slower

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
    // console.log(userData);
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

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
            res.render('kid-page', { "Book": result.rows,  userData });
          }
          else if (userData.userType === 'teacher' || userData.userType === 'supervisor' || userData.userType === 'admin') {
            res.render('teacher/home', { userData });
          }  
        }
      });

    });
  });
});


//=============================================================
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


  // callback - checkout a client
  pool.connect((err, client, done) => {
    if (err) throw err;
    bcrypt.hash(pwd, saltRounds, function (err, hash) { // auto-gen a salt and hash with bcrypt
      client.query('INSERT INTO "Person"("userName", "firstName", "lastName", email, pwd, lang) VALUES($1, $2, $3, $4, $5, $6)',    // inserting into person
        [userName, firstName, lastName, email, hash, langS], (error) => {
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

    res.redirect(req.originalUrl)
  });
});


//=============================================================
router.get('/books', authenticationMiddleware(), function (req, res) {
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
        res.render('books', { "Book": result.rows ,userData});
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
router.get('/games', authenticationMiddleware(), function (req, res) {
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
        res.render('games', { "Game": result.rows ,userData});
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
router.post('/kid/profile/edit', authenticationMiddleware(), function (req, res) {
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
    client.query('UPDATE "Person"  SET "userName" = $1, "firstName" = $2 WHERE "peronID" = $3 ',[body.req.userName,body.req.firstName,userData.userID], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
      }
    });

  });
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

  queries.getBooksAccordingToTypes(userData.userID,(bookDataByTypes)=>{
    //console.log(bookDataByTypes);
    res.render('kid/books', { bookDataByTypes,userData });
    
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
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, (userData) => {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  var nowDate = new Date(); 
  var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
  // callback - checkout a client
  console.log("bookID"+req.body.bookID);
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('INSERT INTO "Note" ("date","personID", "title", "content","type","pic" ) VALUES($1, $2,$3,$4,$5,$6)',[date,userData.userID,req.body.title, req.body.content, 'private',req.body.pic], (error, result) => {
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
router.post('/kid/notes/edit', authenticationMiddleware(), function (req, res) {
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
      client.query('SELECT g.*,ig.* FROM "Group" g INNER JOIN "InGroup" ig ON g."groupID"=ig."groupID" WHERE ig."personID"=$1 ',[userData.userID], (error, result) => {
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
        
        res.redirect('/kid/single-group-page/'+req.body.groupID);
      }
    });
  });
});
});


//============================================================
router.get('/kid/friends', authenticationMiddleware(), function (req, res) {
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
    client.query(`SELECT p.*, a."pic" 
    FROM "Friend" f INNER JOIN "Person" p ON f."friendOfA" = p."personID" INNER JOIN "Kid" k ON p."personID" = k."kidID"  INNER JOIN "Avatar" a
    ON k."avatarID" =a."avatarID"  WHERE f."personA" = $1 AND f."approved"=$2` , [userData.userID,'Y'], (error, result) => {
      done();
      if (error) {
        console.log(error.stack);
      } else {
        
        // res.redirect('/signUp.html');
        res.render('kid/friends', { "myFriend": result.rows ,userData});
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
router.post('/kid/quiz/updateGradeAndPoints', authenticationMiddleware(), function (req, res) {
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  queries.getUserById(req.user, async (userData) => {
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    console.log(req.body);
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
        } catch (e) {
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
*/
