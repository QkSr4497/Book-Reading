const db = require('./db'); // postgresql database connection pool
const path = require('path');
const fse = require('fs-extra');
const validator = require('validator');
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

const getNumOfNewNotificationsOfUser = (userID, callback) => {
    pool.query(`SELECT * 
                FROM "Notification" N INNER JOIN "NotificationType" NT
                ON N."notificationTypeID" = NT."notificationTypeID"
                INNER JOIN "Person" P ON N."senderID" = P."personID"
                WHERE N."recieverID" = $1 AND N."recieverRes" = $2
                ORDER BY N."notificationDate" DESC`, [userID, 'N'], (error, results) => {
            if (error) {
                throw error
            }
            callback({NumOfNewNotifications: results.rowCount});
        });
}

const getUserById = (userID, callback) => {
    getUserTypeById(userID, (userData) => {
        getNumOfNewNotificationsOfUser(userID, (notificationData) => {
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
                            langPreferred: results.rows[0].lang,
                            numOfNewNotifications: notificationData.NumOfNewNotifications,
                            userType,

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
                            langPreferred: results.rows[0].lang,
                            numOfNewNotifications: notificationData.NumOfNewNotifications,
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
                            langPreferred: results.rows[0].lang,
                            numOfNewNotifications: notificationData.NumOfNewNotifications,
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
                            langPreferred: results.rows[0].lang,
                            numOfNewNotifications: notificationData.NumOfNewNotifications,
                            userType
                        });
                    });
            }
        });
    });
}

const getStoragePath = (originalPath, pathInImg, newFileName) => { // getting storage path from original (temp) path and the needed path in image
                                                                   // also updating the file name
    var newPathArr = originalPath.split(path.sep);
    var ImgArr = pathInImg.split(path.sep);
    newPathArr.spliceArray(3, 1, ImgArr); // removing 1 element at index 3 and then concatenating imgArr elements
    var newPathString = newPathArr.join(path.sep);  // array to path string
    var newPathParse = path.parse(newPathString);   // parsing path to fields
    newPathParse.base = newFileName + newPathParse.ext; // changing file name to newFileName
    return path.format(newPathParse);   // returning new path String
}

Array.prototype.spliceArray = function (index, n, array) {  // deleting n elements at index n of Array and then concatenating array at index
    return Array.prototype.splice.apply(this, [index, n].concat(array));
}

const getDbPath = (storagePath) => {    // getting DB path from storagePath
    var newPathArr = storagePath.split(path.sep);
    newPathArr.splice(0, 2);        // Removes the first two element of newPathArr
    var newPathString = newPathArr.join(path.sep);  // array to path string
    newPathString = path.sep + newPathString;
    return newPathString;   // returning new path String
}


async function moveFile(src, dest) {   // moving file from src to dest
    try {
        await fse.move(src, dest)
        console.log(`success moving file! from ${src} to ${dest}`)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Represents a search trough an array.
 * @function search
 * @param {Array} array - The array you wanna search trough
 * @param {string} key - The key to search for
 * @param {string} [prop] - The property name to find it in
 */
function searchArr(array, key, prop){
    // Optional, but fallback to key['name'] if not selected
    prop = (typeof prop === 'undefined') ? 'name' : prop;   
    // console.log(array, key, prop);
    // console.log(key);
    // console.log(prop);

    for (var i=0; i < array.length; i++) {
        // console.log(array[i][prop] + "    " +  key);
        if (array[i][prop] === key) {
            return array[i];
        }
    }
    return undefined;
}

const insertNewQuiz = async (data, writerID, imgArr) => { // using async/await
    var {rows: [{last_value}]} = await db.query(`SELECT last_value FROM "Quiz_quizID_seq"`);  // getting the last inserted serial number of quizID
    const quizID = ++last_value; // id of the new quiz
    var storagePath = getStoragePath(imgArr[0].path, `quizes\\quiz${quizID}`, imgArr[0].fieldname);
    moveFile(imgArr[0].path, storagePath);
    data.quizPicInput = getDbPath(storagePath);
    console.log(data);
    await db.query(`INSERT INTO "Quiz"("quizTitle", "quizLanguage", "quizPic", duration) VALUES($1, $2, $3, $4)`,
      [data.quizTitle, data.quizLang, data.quizPicInput, data.quizTime]);
    var qPic;
    for (var i = 1; i <= data.totalQuestionsNum; i++) {
        qPic = searchArr(imgArr, `q${i}picInput`, 'fieldname');
        if (qPic) {
            storagePath = getStoragePath(qPic.path, `quizes\\quiz${quizID}`, qPic.fieldname);
            moveFile(qPic.path, storagePath);
            qPic.dbPath = getDbPath(storagePath);
        }
        else {
            qPic = {};
            qPic.dbPath = undefined;
        }
        await db.query(`INSERT INTO "Question"("quizID", "questionNum", "questionContent", "questionPic", "questType") VALUES($1, $2, $3, $4, $5)`,
            [quizID, i, eval(`data.q${i}content`), qPic.dbPath, eval(`data.q${i}type`)]);
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

            qPic = searchArr(imgArr, `q${i}ans${j}picInput`, 'fieldname');
            if (qPic) {
                storagePath = getStoragePath(qPic.path, `quizes\\quiz${quizID}`, qPic.fieldname);
                moveFile(qPic.path, storagePath);
                qPic.dbPath = getDbPath(storagePath);
            }
            else {
                qPic = {};
                qPic.dbPath = undefined;
            }
            await db.query(`INSERT INTO "Answer"("quizID", "questionNum", "answerNum", "answerContent", "answerPic", "isCorrect") VALUES($1, $2, $3, $4, $5, $6)`,
                [quizID, i, j, eval(`data.q${i}ans${j}content`), qPic.dbPath, isCorrect]); 
        }
    }

    await db.query(`INSERT INTO "WritesQuiz"("bookID", "quizID", "personID") VALUES($1, $2, $3)`,
        [data.quizBookID, quizID, writerID]);
  }


  const getAllQuizesNotTaken = async (userID) => { // using async/await
    const { rows: notTaken } = await db.query(`SELECT * FROM "Quiz" m
                                            WHERE m."quizID" IN ((SELECT q."quizID" FROM "Quiz" q
                                                                    EXCEPT
                                                                    SELECT tq."quizID" FROM "TakesQuiz" tq
                                                                    WHERE tq."kidID" = $1))`,
                                                                    [userID]);

    const { rows: taken } = await db.query(`SELECT * 
                                            FROM "TakesQuiz" tq INNER JOIN "Quiz" q ON tq."quizID" = q."quizID"
                                            WHERE tq."kidID" = $1`,
                                                [userID]);
    var quizList = {}
    quizList.notTaken = notTaken;
    quizList.taken = taken;
    // console.log('getWriterAndBookByQuizID, quizID searched: ' + quizID);
    // console.log(result[0]);
    return quizList;
}


const getFullQuizDataByQuizID = async (quizID) => { // using async/await
    var Quiz = {};

    const { rows: result} = await db.query(`SELECT * FROM "Quiz" qz
                                            WHERE qz."quizID" = $1`,
                                            [quizID]);

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
                                            WHERE wq."quizID" = $1`,
                                            [quizID]);
    // console.log('getWriterAndBookByQuizID, quizID searched: ' + quizID);
    // console.log(result[0]);
    return result[0];
}


const getQuestionsByQuizID = async (quizID) => { // using async/await
    var { rows: result} = await db.query(`SELECT "questionNum", "questionContent", "questionPic", "questType" 
                                            FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID"
                                            WHERE qz."quizID" = $1`,
                                            [quizID]);
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
                                            WHERE "quizID" = $1 AND "questionNum" = $2`,
                                            [quizID, questionNum]);
    return result;
}

const updateQuizAndPoints = async (kidID, quizID, grade, score) => { // using async/await
    await db.query(`INSERT INTO "TakesQuiz"("kidID", "quizID", "grade", "pointsEarned") VALUES($1, $2, $3, $4)`,
        [kidID, quizID, grade, score]);
    var { rows: result } = await db.query(`SELECT k."points" From "Kid" k WHERE k."kidID" = $1`, [kidID]);
    var currentPoints = result[0].points;
    var updatedPointsScore = parseInt(currentPoints) + parseInt(score);
    await db.query(`UPDATE "Kid" SET points = $1 WHERE "kidID" = $2`,
        [updatedPointsScore, kidID]);
}

const updateLanguagePreferred = async (userID, language) => { // using async/await
    await db.query(`UPDATE "Person" SET lang = $1 WHERE "personID" = $2`,
        [language, userID]);
}

const getKidSupervisors = async (kidID) => { // using async/await
    var { rows: supervisors} = await db.query(`SELECT * FROM "Supervise" 
                                          WHERE "kidID" = $1 AND "approved" = 'Y'`,
                                          [kidID]);
    return supervisors;
}

const getNotificationTypeIdByName = async (notificationName) => { // using async/await
    var { rows: id} = await db.query(`SELECT "notificationTypeID" FROM "NotificationType" 
                                          WHERE "typeN" = $1`,
                                          [notificationName]);
    if (id.length > 0) {    // if notification type exists the return it's id
        return id[0].notificationTypeID;
        
    }
    else {
        return undefined;
    }
}

const notifyQuizResultsToSupervisors = async (kidID, notificationDate, content, typeName) => { // using async/await
    var notificationTypeID = await getNotificationTypeIdByName(typeName);
    if (! notificationTypeID) return 'Invalid notification type';
    
    supervisors = await getKidSupervisors(kidID);   // get kid's approved supervisors

    if (supervisors.length > 0) {   // if there are supervisors of the kid
        supervisors.forEach(async function(entry) {
            var recieverResponse = 'N';
            try {
                await db.query(`INSERT INTO "Notification"("notificationDate", "content", "recieverRes", "recieverID", "senderID", "notificationTypeID") VALUES($1, $2, $3, $4, $5, $6)`,
                    [notificationDate, content, recieverResponse, entry.supervisorID, kidID, notificationTypeID]);
            } 
            catch (err) {
                console.log(err);
                return err;
            }
        });
        return 'Notifications sent to supervisors.'
        
    }
    else {
        return 'No supervisors found.';
    }
}

const sendSupervisionNotification = async (supervisorID, kidID, notificationDate, content, typeName) => {
    try {
        var notificationTypeID = await getNotificationTypeIdByName(typeName);
        if (!notificationTypeID) return 'Invalid notification type';

        var checkExistingNotifcation = await checkExistingSupervisionNotification(supervisorID, kidID, typeName);
        if (checkExistingNotifcation) {  // there is a notification to which the kid responded : N(ot read), R(ead), A(approved) ==> no need to send another notification
            return 'There is already an active notification.';
        }    

        var recieverResponse = 'N';
    
        await db.query(`INSERT INTO "Notification"("notificationDate", "content", "recieverRes", "recieverID", "senderID", "notificationTypeID") VALUES($1, $2, $3, $4, $5, $6)`,
            [notificationDate, content, recieverResponse, kidID, supervisorID, notificationTypeID]);
    } 
    catch (err) {
        console.log(err);
        return err;
    }
    return 'Supervision request sent successfully to the kid';
}

const respondToSupervisionReq = async (supervisorID, kidID, notificationResponse, notificationID) => {  // updating the response to supervision request in the "Supervise" table and in "Notification" table
    try {
        var supervisionResponse = (notificationResponse == 'A') ? 'Y' : 'N';
        await db.query(`UPDATE "Supervise"
                        SET "approved" = $1
                        WHERE "supervisorID" = $2 AND "kidID" = $3`, [supervisionResponse, supervisorID, kidID]);  // updating approval of supervision according to kid's decision
        
        await db.query(`UPDATE "Notification"
                        SET "recieverRes" = $1
                        WHERE "recieverID" = $2 AND "notificationID" = $3 
                        AND "recieverRes" IN ($4, $5)`, [notificationResponse, kidID, notificationID, 'N', 'R']);   // updating notification's status according to kid's response
    } 
    catch (err) {
        console.log(err);
        return err;
    }
    return `kid #${kidID} responded ${supervisionResponse} to supervision request from supervisor #${supervisorID}`;
}

const sendNotification = async (senderID, recieverID, notificationDate, content, typeName) => { // using async/await
    var res;
    if (typeName == 'quiz') {
        try {
            res = await notifyQuizResultsToSupervisors(senderID, notificationDate, content, typeName);
        } 
        catch (err) {
            console.log(err);
            return err;
        } 
    }
    else if (typeName == 'supervision') {
        try {
            res = await sendSupervisionNotification(senderID, recieverID, notificationDate, content, typeName);
        } 
        catch (err) {
            console.log(err);
            return err;
        }  
    }
    else if (typeName == 'group') {
        
    }
    return res;
    
}

const getNotificationsOfUser = async (userID) => { // using async/await
    try {
         var { rows: notifications} = await db.query(`SELECT * 
                                                        FROM "Notification" N INNER JOIN "NotificationType" NT
                                                        ON N."notificationTypeID" = NT."notificationTypeID"
                                                        INNER JOIN "Person" P ON N."senderID" = P."personID"
                                                        WHERE N."recieverID" = $1
                                                        ORDER BY N."notificationDate" DESC`, [userID]);
    } 
    catch (err) {
        console.log(err);
        return err;
    }
    return notifications;
}



const setAllUserNotificationsAsRead = async (userID) => { // using async/await setting all new notifications as Read
    try {
        await db.query(`UPDATE "Notification"
                        SET "recieverRes" = $1
                        WHERE "recieverID" = $2 AND "recieverRes" = $3`, ['R', userID, 'N']);
    } 
    catch (err) {
        console.log(err);
        return err;
    }
    return `All Notifications of user #${userID} marked as read.`;
}

const removeAllUserNotifications = async (userID) => { // using async/await
    try {
        await db.query(`DELETE
                        FROM "Notification" N
                        WHERE N."recieverID" = $1`, [userID]);
    } 
    catch (err) {
        console.log(err);
        return err;
    }
    return `All Notifications of user #${userID} removed.`;
}

const getUserIdbyEmail = async (userEmail) => { // using async/await setting all new notifications as Read
    try {
        var { rows: userID } = await db.query(`SELECT P."personID" 
                                            FROM "Person" P INNER JOIN "Kid" K ON P."personID" = K."kidID"
                                            WHERE P."email" = $1`,  // checking if there is a kid with this email
                                            [userEmail]);
        if (userID.length > 0) {    // if there is a kid with this email return his ID
            return userID[0].personID;
        }
        else {  // no kid with this email return undefined
            return undefined;  
        }
        
    }

    catch (err) {
        console.log(err);
        return err;
    }
}


const getSupervisionReqInfo = async (supervisorID, kidID) => {
    var { rows: res} = await db.query(`SELECT * FROM "Supervise" 
                                          WHERE "supervisorID" = $1 AND "kidID" = $2`,
                                          [supervisorID, kidID]);
    if (res.length > 0) {
        return res[0];  // only one row should exist with the same supervisor and kid
    }
    else {
        return undefined;
    }
    

}

const addSupervisionReq = async (supervisorID, kidEmail, langPreferred) => {
    // console.log(supervisorID, kidEmail);
    var infoMsg;
    var isEmail = validator.isEmail(kidEmail);  // checking email format
    if (!isEmail) {    // if email is invalid
        infoMsg = `האימייל שנשלח ${kidEmail} איננו תקין. אנא הכנס אימייל תקין ונסה שנית.`;
        return infoMsg;
    }
    try {
        kidID = await getUserIdbyEmail(kidEmail);
        if (kidID == undefined) {    // if there is no kid with this email
            
            infoMsg = `לא קיים ילד במערכת עם האימייל שהוכנס ${kidEmail} אנא נסה שנית עם האימייל שעמו הילד רשום במערכת.`;
            return infoMsg;
        }
        else {  // if there is a kid with this email
            supervisionInfo = await getSupervisionReqInfo(supervisorID, kidID);
            console.log(supervisionInfo);
            var date = new Date();
            var content = `Supervision request`;
            if (langPreferred == 'hebrew') {
                content = 'בקשת פיקוח'
            }
            
            var type = 'supervision';
            if (supervisionInfo == undefined) {
                var approved = 'N';
                await db.query(`INSERT INTO "Supervise"("supervisorID", "kidID", "approved") VALUES($1, $2, $3)`,
                    [supervisorID, kidID, approved]);
                var res = await sendNotification(supervisorID, kidID, date, content, type);
                console.log(res);
                return `בקשת פיקוח נשלחה בהצלחה וממתינה לאישור הילד/ה.`;
            }
            else if(supervisionInfo.approved == 'N') {
                var res = await sendNotification(supervisorID, kidID, date, content, type);
                console.log(res);
                return `בקשת פיקוח נשלחה בהצלחה וממתינה לאישור הילד/ה.`;
            }
            else if (supervisionInfo.approved == 'Y') {
                return `הילדה/ה כבר נמצאים ברשימת הפיקוח שלך.`;
            }
        }
    }
    catch (err) {
        infoMsg = `אירעה שגיאה`;
        console.log(err);
        return infoMsg;
    }

}

const checkExistingSupervisionNotification = async (supervisorID, kidID, typeName) => {
    var { rows: res} = await db.query(`SELECT * FROM "Notification" N INNER JOIN "NotificationType" NT
                                        ON N."notificationTypeID" = NT."notificationTypeID"
                                        WHERE N."recieverID" = $1 AND NT."typeN" = $2 AND N."senderID" = $3 AND N."recieverRes" IN ($4, $5, $6)`,
                                          [kidID, typeName, supervisorID, 'N','R','A']);
    if (res.length > 0) {   // there is a notification to which the kid responded : N(ot read), R(ead), A(approved)
        return true;
    }
    else {
        return false;
    }

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
    console.log('groupID Admin ' + groupID);
    pool.query(`SELECT ig.*, p.*
    FROM "InGroup" ig INNER JOIN "Person" p ON ig."personID"=p."personID"
    WHERE ig."groupID" = $1 AND ig."type"=$2 AND ig."approved"= $3`, [groupID, 'admin', 'Y'], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getGroupKidMembers = (groupID, callback) => {
    console.log('groupID member ' + groupID);
    pool.query(`SELECT ig.*, p.*
    FROM "InGroup" ig INNER JOIN "Person" p ON ig."personID"=p."personID"
    WHERE ig."groupID" = $1 AND ig."type"=$2 AND ig."approved"= $3`, [groupID, 'kid', 'Y'], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getGroupPosts = (groupID, callback) => {
    console.log('groupID Post ' + groupID);
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
    WHERE gm."personID" = $1 AND gm."checked"=$2`, [personID, 'Y'], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getUncheckedMessages = (personID, callback) => {
    pool.query(`SELECT m.*,gm.*,p.*
    FROM "GetMessage" gm INNER JOIN "Message" m  ON gm."messageID"=m."messageID" INNER JOIN "Person" p ON m."personID"=p."personID"
    WHERE gm."personID" = $1 AND gm."checked"=$2`, [personID, 'N'], (error, results) => {
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
//==========================================
// const getNotes = (personID, callback) => {
//     pool.query(`SELECT n.*,b."bookID", b."bookName"
//     FROM "Note" n INNER JOIN "Book" b ON n."bookID"=b."bookID"
//     WHERE n."personID" = $1`, [personID], (error, results) => {
//     if (error) {
//         throw error
//     }
//     callback(results.rows);
//  });
// }
const getNotes = (personID, callback) => {
    pool.query(`SELECT n.*
    FROM "Note" n
    WHERE n."personID" = $1`, [personID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getKidBooksForNotes = (personID, callback) => {
    pool.query(`SELECT kb.*, b.*
    FROM "KidBook" kb INNER JOIN "Book" b ON kb."bookID"=b."bookID"
    WHERE "kidID" = $1`, [personID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getAllAboutNote= (personID, callback) => { 
    getNotes(personID,(getNoteData)=>{ 
		getKidBooksForNotes(personID,(getbBooksForNote)=>{  
		  callback({
			getNoteData,
			getbBooksForNote
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
    getAllMessages,
    getNotes,
    getKidBooksForNotes,
    getAllAboutNote,
    updateQuizAndPoints,
    updateLanguagePreferred,
    sendNotification,
    getNotificationsOfUser,
    setAllUserNotificationsAsRead,
    removeAllUserNotifications,
    respondToSupervisionReq,
    addSupervisionReq

}