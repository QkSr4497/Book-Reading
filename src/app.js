const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();
 
const pool = new pg.Pool({
    user: "mk",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "kidBookReadingDB"
});

// Assign Dust Enging to .dust Files
app.engine('dust', cons.dust);

//  Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public Folder
app.use(express.static(path.join(__dirname, 'public')));


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
                res.render('book', { "Book": result.rows });
            }
        });
    });
    /*
    // games
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT * FROM Game', (error, result) => {
            if (error) {
                console.log(error.stack);
            } else { 
                done();  
                res.render('game', { Game: result.rows });
            }
        });
    });

// kid's book by status
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT * FROM Game', (error, result) => {
            if (error) {
                console.log(error.stack);
            } else { 
                done();  
                res.render('game', { Game: result.rows });
            }
        });
    });
    */
});


// Server
app.listen(3000, function () {
    console.log('Server Started On Port 3000')
});
