const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    app = express();

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

app.use('/signUp', index);




// Server
app.listen(3000, function () {
    console.log('Server Started On Port 3000')
});
