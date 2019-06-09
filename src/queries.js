const db = require('./db'); // postgresql database connection pool

const pool = db.pg_pool;

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

const insertNewQuiz = async (data, writerID) => { // using async/await
    console.log(data);
    await db.query(`INSERT INTO "Quiz"("quizTitle", "quizLanguage", "quizPic", duration) VALUES($1, $2, $3, $4)`,
      [data.quizTitle, data.quizLang, data.quizPicInput, data.quizTime]);
  
    const { rowCount: quizID} = await db.query(`SELECT * FROM "Quiz"`);
  
    for (var i = 1; i <= data.totalQuestionsNum; i++) {
      await db.query(`INSERT INTO "Question"("quizID", "questionNum", "questionContent", "questionPic", "questType") VALUES($1, $2, $3, $4, $5)`,
        [quizID, i, eval(`data.q${i}content`), eval(`data.q${i}picInput`), eval(`data.q${i}type`)]);
    }
  
    //console.log('in answers total questions num: ' + data.totalQuestionsNum);
    var isCorrect = 'N';
    for (var i = 1; i <= data.totalQuestionsNum; i++) {
        //console.log(`i      ${i} <= ${data.totalQuestionsNum}`)
        isCorrect = 'N';
        for (var j = 1; j <= eval(`data.q${i}totalAnsNum`); j++) {
            //console.log(`j      ${j} <=` +  eval(`data.q${i}totalAnsNum`));
            //console.log(`in q${i} total answer num: ` + eval(`data.q${i}totalAnsNum`))
            if (eval(`data.q${i}type`) == 'single') {
  
                if (eval(`data.q${i}ansRadio`) == j) {
                    isCorrect = 'Y';
                }
                else {
                    isCorrect = 'N';
                }
  
            }
            else if (eval(`data.q${i}type`) == 'multi' ) {
                if (eval(`data.q${i}ans${j}checkbox`)) {
                    isCorrect = 'Y';
                }
                else {
                    isCorrect = 'N';
                }
  
            }
            
            await db.query(`INSERT INTO "Answer"("quizID", "questionNum", "answerNum", "answerContent", "answerPic", "isCorrect") VALUES($1, $2, $3, $4, $5, $6)`,
                [quizID, i, j, eval(`data.q${i}ans${j}content`), eval(`data.q${i}ans${j}picInput`), isCorrect]); 
        }
    }

    await db.query(`INSERT INTO "WritesQuiz"("bookID", "quizID", "personID") VALUES($1, $2, $3)`,
        [data.quizBookID, quizID, writerID]);
  }


const getAllQuizesNotTaken = async (userID) => { // using async/await
    const { rows: result } = await db.query(`SELECT * FROM "Quiz"`);
    // console.log('getWriterAndBookByQuizID, quizID searched: ' + quizID);
    // console.log(result[0]);
    return result;
} 


const getFullQuizDataByQuizID = async (quizID) => { // using async/await
    var Quiz = {};

    const { rows: result} = await db.query(`SELECT * FROM "Quiz" qz
                                            WHERE qz."quizID" = ${quizID}`);

    Quiz.quizID = quizID;
    Quiz.quizTitle = result[0].quizTitle;
    Quiz.quizLang = result[0].quizLanguage;
    Quiz.quizPic = result[0].quizPic;
    Quiz.duration = result[0].duration;
    

    const questionsData =  await getQuestionsByQuizID(quizID);
    Quiz.totalQuestionsNum = questionsData.length;
    const bookAndCreater = await getWriterAndBookByQuizID(quizID);
    Quiz.bookID = bookAndCreater.bookID;
    Quiz.bookName = bookAndCreater.bookName;
    Quiz.bookAuthorFirstName = bookAndCreater.authorFirstName;
    Quiz.bookAuthorLastName = bookAndCreater.authorLastName;
    Quiz.bookPic = bookAndCreater.pic;
    Quiz.quizCreaterID = bookAndCreater.personID;
    Quiz.quizCreaterFirstName = bookAndCreater.firstName;
    Quiz.quizCreaterLastName = bookAndCreater.lastName;

    Quiz.questions = questionsData;
    return Quiz;
}

const getWriterAndBookByQuizID = async (quizID) => { // using async/await
    const { rows: result } = await db.query(`SELECT b."bookID", b."bookName", b."authorFirstName", b."authorLastName", "pic", p."personID", p."firstName", p."lastName"
                                            FROM "WritesQuiz" wq INNER JOIN "Person" p ON wq."personID" = p."personID"
                                            INNER JOIN "Book" b ON wq."bookID" = b."bookID" 
                                            WHERE wq."quizID" = ${quizID}`);
    // console.log('getWriterAndBookByQuizID, quizID searched: ' + quizID);
    // console.log(result[0]);
    return result[0];
}


const getQuestionsByQuizID = async (quizID) => { // using async/await
    var { rows: result} = await db.query(`SELECT "questionNum", "questionContent", "questionPic", "questType" 
                                            FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID"
                                            WHERE qz."quizID" = ${quizID}`);
    var answers = [];
    for (var i = 0; i < result.length; i++) {
        answers[i] = await getAnswersBy_QuizID_QstNum(quizID, i + 1);
        result[i].answersNum = answers[i].length;
        result[i].answers = answers[i];
    }
    //console.dir(result, { depth: null }); // `depth: null` ensures unlimited recursion
    return result;
}

const getAnswersBy_QuizID_QstNum = async (quizID, questionNum) => { // using async/await
    var { rows: result} = await db.query(`SELECT "answerNum", "answerContent", "answerPic", "isCorrect"
                                            FROM "Answer"
                                            WHERE "quizID" = ${quizID} AND "questionNum" = ${questionNum}`);
    return result;
}


// const insertNewQuizDetails = (data, callback) => {
//     console.log('in quiz total questions num: ' + data.totalQuestionsNum);
//     pool.query(`SELECT * FROM "Quiz"`, (error, results) => {
//         if (error) {
//             throw error
//         }
//         else {
//             pool.query(`INSERT INTO "Quiz"("quizTitle", "quizLanguage", "pic", duration) VALUES($1, $2, $3, $4)`,
//                 [data.quizTitle, data.quizLang, data.quizPicInput, data.quizTime], (error) => {
//                     if (error) {
//                         throw error
//                     }
//                     else {
//                         callback({
//                             quizID: results.rowCount
//                         });
//                     }
//             });
//         }
//     });
// }

// const insertQuestionsToQuiz = (data, quizID, callback) => {
//     console.log('in questions total questions num: ' + data.totalQuestionsNum);
//     for (var i = 1; i <= data.totalQuestionsNum; i++) {
//         pool.query(`INSERT INTO "Question"("quizID", "questionNum", "content", "pic", "questType") VALUES($1, $2, $3, $4, $5)`,
//             [quizID, i, eval(`data.q${i}content`), eval(`data.q${i}picInput`), eval(`data.q${i}type`)], (error) => {
//                 if (error) {
//                     throw error
//                 }
//         });
//     }
//     callback();
// }

// const insertAnswersToQuiz = (data, quizID, callback) => {
//     console.log('in answers total questions num: ' + data.totalQuestionsNum);
//     var isCorrect = 'N';
//     for (var i = 1; i <= data.totalQuestionsNum; i++) {
//         console.log(`i      ${i} <= ${data.totalQuestionsNum}`)
//         isCorrect = 'N';
//         for (var j = 1; j <= eval(`data.q${i}totalAnsNum`); j++) {
//             console.log(`j      ${j} <=` +  eval(`data.q${i}totalAnsNum`));
//             console.log(`in q${i} total answer num: ` + eval(`data.q${i}totalAnsNum`))
//             if (eval(`data.q${i}type`) == 'single') {

//                 if (eval(`data.q${i}ansRadio`) == j) {
//                     isCorrect = 'Y';
//                 }
//                 else {
//                     isCorrect = 'N';
//                 }

//             }
//             else if (eval(`data.q${i}type`) == 'multi' ) {
//                 if (eval(`data.q${i}ans${j}checkbox`)) {
//                     isCorrect = 'Y';
//                 }
//                 else {
//                     isCorrect = 'N';
//                 }

//             }
            
//             pool.query(`INSERT INTO "Answer"("quizID", "questionNum", "answerNum", "content", "pic", "isCorrect") VALUES($1, $2, $3, $4, $5, $6)`,
//                 [quizID, i, j, eval(`data.q${i}ans${j}content`), eval(`data.q${i}ans${j}picInput`), isCorrect], (error) => {
//                     if (error) {
//                         console.log(`${quizID} ${i} ${j}`)
//                         throw error
//                     }
//                 });
//         }

//     }
//     callback();
// }


const getAllBooks = (callback) => {
    pool.query(`SELECT * FROM "Book" b`, (error, results) => {
        if (error) {
            throw error
        }
        else {
            callback(results.rows);
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

const getMyIntrestedBooks = (userID, callback) => {
    pool.query(`SELECT * 
    FROM "KidBook" kb INNER JOIN "Book" b ON kb."bookID" = b."bookID"
    WHERE kb."kidID" = $1 AND kb."type"='intrested'`, [userID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getMyReadingBooks = (userID, callback) => {
    pool.query(`SELECT * 
    FROM "KidBook" kb INNER JOIN "Book" b ON kb."bookID" = b."bookID"
    WHERE kb."kidID" = $1 AND kb."type"='reading'`, [userID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getMyFinishedBooks = (userID, callback) => {
    pool.query(`SELECT * 
    FROM "KidBook" kb INNER JOIN "Book" b ON kb."bookID" = b."bookID"
    WHERE kb."kidID" = $1 AND kb."type"='finished'`, [userID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getBooksAccordingToTypes= (userID, callback) => {
    getMyIntrestedBooks(userID,(intrestedBooks)=>{ 
        getMyReadingBooks(userID,(readingBooks)=>{ 
            getMyFinishedBooks(userID,(finishedBooks)=>{ 
                callback({
                    intrestedBooks,
                    readingBooks,
                    finishedBooks

                });
            });
          });  
    });
}
//==========================================
const getBookReviews = (bookID, callback) => {
    console.log('bookID '+bookID);
    pool.query(`SELECT kb.* ,p.*
    FROM "KidBook" kb INNER JOIN "Person" p ON kb."kidID"=p."personID"
    WHERE kb."bookID" = $1 AND kb."review" IS NOT NULL`, [bookID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
//==========================================
const BookByID = (bookID, callback) => {
    console.log('bookID '+bookID);
    pool.query(`SELECT b.* 
    FROM "Book" b 
    WHERE b."bookID" = $1 `, [bookID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getBookInfoAndReviews= (bookID, callback) => { 
        getBookReviews(bookID,(bookReviews)=>{ 
            BookByID(bookID,(bookInfo)=>{ 
                callback({
                    bookReviews,
                    bookInfo

 
                });
            }); 
    });
}

//===========================================
const getGroupData = (groupID, callback) => {
    console.log('groupID Info '+groupID);
    pool.query(`SELECT g.*, p.*
    FROM "Group" g INNER JOIN "Person" p ON g."personID"=p."personID"
    WHERE g."groupID" = $1 `, [groupID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getGroupAdminMembers = (groupID, callback) => {
    console.log('groupID Admin '+groupID);
    pool.query(`SELECT ig.*, p.*
    FROM "InGroup" ig INNER JOIN "Person" p ON ig."personID"=p."personID"
    WHERE ig."groupID" = $1 AND ig."type"=$2`, [groupID,'admin'], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getGroupKidMembers = (groupID, callback) => {
    console.log('groupID member '+groupID);
    pool.query(`SELECT ig.*, p.*
    FROM "InGroup" ig INNER JOIN "Person" p ON ig."personID"=p."personID"
    WHERE ig."groupID" = $1 AND ig."type"=$2`, [groupID,'kid'], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getGroupPosts = (groupID, callback) => {
    console.log('groupID Post '+groupID);
    pool.query(`SELECT po.*, p.*
    FROM "Post" po INNER JOIN "Person" p ON po."personID"=p."personID"
    WHERE po."groupID" = $1 `, [groupID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
// const getGroupPostComments = (groupID, callback) => {
//     console.log('groupID '+groupID);
//     pool.query(`SELECT c.*, p.*
//     FROM "Comment" c INNER JOIN "Person" p ON c."personID"=p."personID"
//     WHERE c."groupID" = $1 `, [groupID], (error, results) => {
//     if (error) {
//         throw error
//     }
//     callback(results.rows);
//  });
// }

const getAllAboutGroup= (groupID, callback) => { 
    getGroupData(groupID,(groupData)=>{ 
        getGroupAdminMembers(groupID,(groupAdminMembers)=>{ 
            getGroupKidMembers(groupID,(groupKidMembers)=>{ 
                getGroupPosts(groupID,(groupPosts)=>{ 
                   // getGroupPostComments(groupPostComments,(bookInfo)=>{  
                          callback({
                            groupData,
                            groupAdminMembers,
                            groupKidMembers,
                            groupPosts
                        //    GroupPostComments
                        });
                     //}); 
                 });
            });
        }); 
    });
}

//========================================
const getCheckedMessages = (personID, callback) => {
    pool.query(`SELECT m.*,gm.*,p.*
    FROM "GetMessage" gm INNER JOIN "Message" m  ON gm."messageID"=m."messageID" INNER JOIN "Person" p ON m."personID"=p."personID"
    WHERE gm."personID" = $1 AND gm."checked"=$2`, [personID,'Y'], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getUncheckedMessages = (personID, callback) => {
    pool.query(`SELECT m.*,gm.*,p.*
    FROM "GetMessage" gm INNER JOIN "Message" m  ON gm."messageID"=m."messageID" INNER JOIN "Person" p ON m."personID"=p."personID"
    WHERE gm."personID" = $1 AND gm."checked"=$2`, [personID,'N'], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getAllMessages= (personID, callback) => { 
    getCheckedMessages(personID,(checkedMessage)=>{ 
		getUncheckedMessages(personID,(uncheckedMessage)=>{  
		  callback({
			checkedMessage,
			uncheckedMessage
				});
		}); 
	});
}

module.exports = {
    getUsers,
    getUserTypeById,
    getUserById,
    getAllBooks,
    createUser,
    updateUser,
    deleteUser,
    getMyIntrestedBooks,
    getMyReadingBooks,
    getMyFinishedBooks,
    getBooksAccordingToTypes,
    getBookReviews,
    BookByID,
    getBookInfoAndReviews,
    getGroupData,
    getGroupAdminMembers,
    getGroupKidMembers,
    getGroupPosts,
    getAllAboutGroup,
    insertNewQuiz,
    getFullQuizDataByQuizID,
    getAllQuizesNotTaken,
    getCheckedMessages,
    getUncheckedMessages,
    getAllMessages
}