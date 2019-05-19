const pool = require('./db'); // postgresql database connection pool

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserTypeById = (userID, callback) => {
    pool.query(`SELECT * 
                FROM "Person" p INNER JOIN "Kid" k ON p."personID" = k."kidID"
                WHERE p."personID" = $1`, [userID], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount === 0) {   // if the user is not a kid
            pool.query(`SELECT * 
            FROM "Person" p INNER JOIN "Teacher" t ON p."personID" = t."teacherID"
            WHERE p."personID" = $1`, [userID], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rowCount === 0) {   // if the user is not a kid or a teacher
                    pool.query(`SELECT * 
                                FROM "Person" p INNER JOIN "Supervisor" s ON p."personID" = s."supervisorID"
                                WHERE p."personID" = $1`, [userID], (error, results) => {
                        if (error) {
                            throw error
                        }
                        if (results.rowCount === 0) {   // if the user is not a kid or a teacher or a supervisor
                            callback({userType: 'admin'});
                        }
                        else {  // user is a teacher
                            callback({userType: 'supervisor'});
                        }
                    });
                    // callback({userType: 'supervisor'});
                }
                else {  // user is a teacher
                    callback({userType: 'teacher'});
                }
            });
        }
        else {  // user is a kid
            callback({userType: 'kid'});
        }
    // console.log('3query result for user: '+userID +', data: ' +JSON.stringify(results.rows) );
    // console.log('4query result for user: '+userID +', data: ' +JSON.stringify(results.rows[0]) ); 
    });
}

const getUserById = (userID, callback) => {
    getUserTypeById(userID, (userData) => {
        var userType = userData.userType;
        if (userType === 'kid') {
            pool.query(`SELECT * 
                FROM "Person" p INNER JOIN "Kid" k ON p."personID" = k."kidID"
                WHERE p."personID" = $1`, [userID], (error, results) => {
                if (error) {
                    throw error
                }
                callback({
                    userID: results.rows[0].personID,
                    userName: results.rows[0].userName,
                    firstName: results.rows[0].firstName,
                    lastName: results.rows[0].lastName,
                    email: results.rows[0].email,
                    points: results.rows[0].points,
                    avatarID: results.rows[0].avatarID,
                    userType
                });
             });
        }
        else if (userType === 'teacher') {
            pool.query(`SELECT * 
                FROM "Person" p INNER JOIN "Teacher" t ON p."personID" = t."teacherID"
                WHERE p."personID" = $1`, [userID], (error, results) => {
                if (error) {
                    throw error
                }
                callback({
                    userID: results.rows[0].personID,
                    userName: results.rows[0].userName,
                    firstName: results.rows[0].firstName,
                    lastName: results.rows[0].lastName,
                    email: results.rows[0].email,
                    phone: results.rows[0].phone,
                    userType
                });
             });
        }
        else if (userType === 'supervisor') {
            pool.query(`SELECT * 
                FROM "Person" p INNER JOIN "Supervisor" s ON p."personID" = s."supervisorID"
                WHERE p."personID" = $1`, [userID], (error, results) => {
                if (error) {
                    throw error
                }
                callback({
                    userID: results.rows[0].personID,
                    userName: results.rows[0].userName,
                    firstName: results.rows[0].firstName,
                    lastName: results.rows[0].lastName,
                    email: results.rows[0].email,
                    phone: results.rows[0].phone,
                    userType
                });
             });
        }
        else if (userType === 'admin') {
            pool.query(`SELECT * 
                FROM "Person" p INNER JOIN "Admin" a ON p."personID" = a."adminID"
                WHERE p."personID" = $1`, [userID], (error, results) => {
                if (error) {
                    throw error
                }
                callback({
                    userID: results.rows[0].personID,
                    userName: results.rows[0].userName,
                    firstName: results.rows[0].firstName,
                    lastName: results.rows[0].lastName,
                    email: results.rows[0].email,
                    phone: results.rows[0].phone,
                    userType
                });
             });
        }
    });

}



const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserTypeById,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}