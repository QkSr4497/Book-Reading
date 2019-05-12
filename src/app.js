const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    pg = require('pg'),
    app = express();
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

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//==================================================================


app.get('/', function (req, res) {
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
                res.render('kid-page', { "Book": result.rows });
            }
        });
        
    });

});



app.get('/books', function (req, res) {
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

app.get('/games', function (req, res) {
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
//---------------------------------------------------
app.get('/my-books', function (req, res) {
    // the pool with emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    // callback - checkout a client
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT b.* FROM "Book" b INNER JOIN "KidBook" kb ON b."bookID" = kb."bookID" WHERE kb."kidID"=$1 AND kb."type"= $2',[1,'reading'], (error, result) => {
            if (error) {
                console.log(error.stack);
            } else {
                done();
                // res.redirect('/signUp.html');
                res.render('kid-page', { "MyReadingBook": result.rows });
            }
        });
        
    });

});
//--------------------------------


app.get('/my-games', function (req, res) {
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
                res.render('kid-page', { "MyGame": result.rows });
            }
        });
        
    });

});
//========================================


//====================================================


app.get('/my-notes', function (req, res) {
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

//===========================================


//==========================================

app.get('/my-friends', function (req, res) {
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
                res.render('kid-page', { "Friend" : result.rows });
            }
        });
        
    });

});

//=============================================================



app.post('/signUpNewUser', function (req, res) {
    // the pool with emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    // callback - checkout a client
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('INSERT INTO "Person"("userName", "firstName", "lastName", email, pwd) VALUES($1, $2, $3, $4, $5)',    // inserting into person
            [req.body.userName, req.body.firstName, req.body.lastName, req.body.email, req.body.pwd], (error) => {
                if (error) {
                    console.log(error.stack);
                } 
                else {
                    client.query('SELECT * FROM "Person" p WHERE p."userName" = $1', [req.body.userName], (error, result) => {  // getting the id of the new person for the purppose
                                                                                                                                // of inserting this id as foriegn key for subtype table
                        if (error) {
                            console.log(error.stack);
                        } 
                        else {
                            if (req.body.role == 'kid') {
                                client.query('INSERT INTO "Kid"("kidID", "birthDate") VALUES($1, $2)',  // inserting into kid
                                    [result.rows[0].personID, req.body.birthdate]);
                            } 
                           else if (req.body.role == 'teacher') {
                                client.query('INSERT INTO "Teacher"("teacherID", "phone") VALUES($1, $2)',  // inserting into teacher
                                    [result.rows[0].personID, req.body.phone]);
                           }
                           else if (req.body.role == 'supervisor') {
                            client.query('INSERT INTO "Supervisor"("supervisorID", "phone") VALUES($1, $2)',  // inserting into supervisor
                                [result.rows[0].personID, req.body.phone]); 
                            }
                        }
                    });
                }
            });
        done();
        // res.redirect('/');
    });
});

app.get('/checkEmailDplicates/:email', function(req, res) {
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
                    res.send({status: 'taken'});
                }
                else {
                    res.send({status: 'free'});
                }  
            } 
        });
        done();
    });
});

app.get('/checkUserplicates/:user', function(req, res) {
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
                    res.send({status: 'taken'});
                }
                else {
                    res.send({status: 'free'});
                }  
            } 
        });
        done();
    });
});




// Server
app.listen(3000, function () {
    console.log('Server Started On Port 3000')
});
