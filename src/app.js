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
app.set('views', __dirname + '/..' + '/views');

const publicPagesDirectoryPath = path.join(__dirname, '..', 'public');

// Set public Folder
app.use(express.static(publicPagesDirectoryPath));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
        client.query('INSERT INTO "Person"("userName", "firstName", "lastName", email, pwd) VALUES($1, $2, $3, $4, $5)',
            [req.body.userName, req.body.firstName, req.body.lastName, req.body.email, req.body.pwd], (error) => {
                if (error) {
                    console.log(error.stack);
                } 
                else {
                    client.query('SELECT * FROM "Person" p WHERE p."userName" = $1', [req.body.userName], (error, result) => {
                        if (error) {
                            console.log(error.stack);
                        } 
                        else {
                            if (req.body.role == 'kid') {
                                client.query('INSERT INTO "Kid"("kidID", "birthDate") VALUES($1, $2)',
                                    [result.rows[0].personID, req.body.birthdate]);
                            } 
                           else if (req.body.role == 'teacher') {
                                client.query('INSERT INTO "Teacher"("teacherID", "phone") VALUES($1, $2)',
                                    [result.rows[0].personID, req.body.phone]);
                           }
                           else if (req.body.role == 'supervisor') {
                            client.query('INSERT INTO "Supervisor"("supervisorID", "phone") VALUES($1, $2)',
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
