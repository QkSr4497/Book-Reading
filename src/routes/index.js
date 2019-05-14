const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;  // the number of rounds that the module will go through to hash your data
// higher means slower

require('dotenv').config(); // using env file

const pool = require('./../db.js'); // postgresql database connection pool

/* GET home page. */
router.get('/hi', function (req, res, next) {
  res.send('hello there');
});


//=============================================================


router.post('/signUpNewUser', function (req, res) {
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
    if (err) throw err
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
                if (req.body.role == 'kid') {
                  const birthdate = req.body.birthdate;
                  client.query('INSERT INTO "Kid"("kidID", "birthDate") VALUES($1, $2)',  // inserting into kid
                    [result.rows[0].personID, birthdate]);
                }
                else if (req.body.role == 'teacher') {
                  const phone = req.body.phone;
                  client.query('INSERT INTO "Teacher"("teacherID", "phone") VALUES($1, $2)',  // inserting into teacher
                    [result.rows[0].personID, phone]);
                }
                else if (req.body.role == 'supervisor') {
                  const birthdate = req.body.birthdate;
                  client.query('INSERT INTO "Supervisor"("supervisorID", "phone") VALUES($1, $2)',  // inserting into supervisor
                    [result.rows[0].personID, birthdate]);
                }
              }
            });
          }
        });
    });
    done();
    // res.redirect('/');
  });
});

router.get('/checkEmailDplicates/:email', function (req, res) {
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

router.get('/checkUserplicates/:user', function (req, res) {
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

module.exports = router;
