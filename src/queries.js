const db = require('./db'); // postgresql database connection pool
const path = require('path');
const fse = require('fs-extra');
const validator = require('validator');
const __ = require('multi-lang')('src/language-server.json'); // Import module with language-server.json file
const bcrypt = require('bcrypt');
const saltRounds = 10;  // the number of rounds that the module will go through to hash your data
                        // higher means slower
const pool = db.pg_pool;

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

const app = require('./app');

const IN_PROD =  process.env.NODE_ENV === 'production';  // true if in production

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const checkEmailExists = async (emailChecked) => {
    try {

        var infoMsg;
        var isEmail = validator.isEmail(emailChecked);  // checking email format
        if (!isEmail) {    // if email is invalid
            infoMsg = `האימייל שנשלח ${emailChecked} איננו תקין. אנא הכנס אימייל תקין ונסה שנית.`;
            throw infoMsg;
        }



        var { rows: res} = await db.query(`SELECT "personID", lang, "userName" 
                                            FROM "Person" p WHERE p.email = $1`, [emailChecked]); // check there is a user registered with this email
        if (res.length == 0) { // no user registered with this email
            throw `האימייל שנשלח ${emailChecked} איננו רשום באתר. אנא נסה/י אימייל אחר.`;
        }
        return res[0];
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const updateUserResetPasswordToken = async (userID ,token, expirationTime) => {

    try {
        await db.query(`UPDATE "Person" 
                        SET "resetPasswordToken" = $1, "resetPasswordExpires" = $2
                        WHERE "personID" = $3`, [token, expirationTime, userID]);
        
    }
    catch (err) {
        console.error(err);
        throw `אירעה שגיאה: ${err}`;
    }
}

const getUserDataByValidToken = async (token) => {

    try {

        var currentTime = new Date();

        var { rows: res} = await db.query(`SELECT "personID", lang, "userName", "resetPasswordExpires", email 
                                            FROM "Person" p 
                                            WHERE p."resetPasswordToken" = $1 `, [token]);

        var currentTime = new Date();
        
        if (res.length > 0) {
            var langPreferred = res[0].lang;
            if ( ( res[0].resetPasswordExpires > currentTime) ) {
                return res[0];
            }
            else {
                throw __('invalidTokenFlashMessage', langPreferred);  // translation using 'multi-lang npm;
            }  
        }
        else {
            throw __('illegalTokenFlashMessage', 'hebrew');  // translation using 'multi-lang npm;
        }
        
    }
    catch (err) {
        console.error(err);
        throw `אירעה שגיאה: ${err}`;
    }
}

const ChangeUserPassoword = async (userID, newPassword) => {
    try {
        bcrypt.hash(newPassword, saltRounds, async function (error, hash) { // auto-gen a salt and hash with bcrypt
            if (error) throw error;
            else {
                await db.query(`UPDATE "Person" 
                        SET "resetPasswordToken" = $1, "resetPasswordExpires" = $2, pwd = $3
                        WHERE "personID" = $4`, [null, null, hash, userID]);
            }
            
          });
    }
    catch (err) {
        console.error(err);
        throw `אירעה שגיאה: ${err}`;
    }
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
                            birthDate: results.rows[0].birthDate,
                            langPreferred: results.rows[0].lang,
                            numOfNewNotifications: notificationData.NumOfNewNotifications,
                            gender: results.rows[0].gender,
                            profilePic: results.rows[0].profilePic,
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
                            gender: results.rows[0].gender,
                            profilePic: results.rows[0].profilePic,
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
                            gender: results.rows[0].gender,
                            profilePic: results.rows[0].profilePic,
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
                            gender: results.rows[0].gender,
                            profilePic: results.rows[0].profilePic,
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
    console.log(newPathArr);
    newPathArr.spliceArray(2, 1, ImgArr); // removing 1 element at index 2 and then concatenating imgArr elements
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
    newPathArr.splice(0, 1);        // Removes the first element of newPathArr
    var newPathString = newPathArr.join(path.sep);  // array to path string
    newPathString = path.sep + newPathString;
    return newPathString;   // returning new path String
}


async function moveFile(src, dest, isOverWrite) {   // moving file from src to dest
    try {

        await fse.move(src, dest, { overwrite: isOverWrite });
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

const editKidProfile = async (data, userID, imgArr) => { // using async/await
    // console.log(data);
    // console.log(userID);
    // console.log(imgArr);
    // console.log(imgArr.length);
    try {
        if (imgArr.length == 0) {    // no new profile pic
            await db.query(`UPDATE "Person" 
                            SET "firstName" = $1, "lastName" = $2
                            WHERE "personID" = $3`,   // updating Person's first name and last name
                [data.new_firstName, data.new_lastName, userID]);
                

        }
        else {  // new profile pic

            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                data.profilePicDbPath = await uploadToCloud(imgArr[0], `users/user${userID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                var storagePath = getStoragePath(imgArr[0].path, `users\\user${userID}`, imgArr[0].fieldname);
                var isOverWrite = true;
                await moveFile(imgArr[0].path, storagePath, isOverWrite);
                data.profilePicDbPath = getDbPath(storagePath);
            }
            
            await db.query(`UPDATE "Person" 
                            SET "firstName" = $1, "lastName" = $2, "profilePic" = $3
                            WHERE "personID" = $4`,   // updating kid's first name, last name and profile picture
                [data.new_firstName, data.new_lastName, data.profilePicDbPath, userID]);
        }

        await db.query(`UPDATE "Kid" 
                        SET "birthDate" = $1
                        WHERE "kidID" = $2`,  // updating kid's birth date
                [data.new_birthDate, userID]);

      } catch (err) {
        console.error(err) 
        return err;
      }
}

const insertNewQuiz = async (data, writerID, imgArr) => { // using async/await
    var {rows: [{last_value}]} = await db.query(`SELECT last_value FROM "Quiz_quizID_seq"`);  // getting the last inserted serial number of quizID
    const quizID = ++last_value; // id of the new quiz

    if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
        data.quizPicInput = await uploadToCloud(imgArr[0], `quizes/quiz${quizID}`);   
    }
    else {  // uploading files locally when in DEVELOPMENT mode
        var storagePath = getStoragePath(imgArr[0].path, `quizes\\quiz${quizID}`, imgArr[0].fieldname);
        var isOverWrite = false;
        // console.log("storagePath: " + storagePath);
        // console.log("imgArr[0].path: " + imgArr[0].path);
        await moveFile(imgArr[0].path, storagePath, isOverWrite);
        data.quizPicInput = getDbPath(storagePath);
    }
    console.log(data);


    await db.query(`INSERT INTO "Quiz"("quizTitle", "quizLanguage", "quizPic", duration) VALUES($1, $2, $3, $4)`,
      [data.quizTitle, data.quizLang, data.quizPicInput, data.quizTime]);
    var qPic;
    for (var i = 1; i <= data.totalQuestionsNum; i++) {
        qPic = searchArr(imgArr, `q${i}picInput`, 'fieldname');
        if (qPic) {

            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                qPic.dbPath = await uploadToCloud(qPic, `quizes/quiz${quizID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                storagePath = getStoragePath(qPic.path, `quizes\\quiz${quizID}`, qPic.fieldname);
                var isOverWrite = false;
                await moveFile(qPic.path, storagePath, isOverWrite);
                qPic.dbPath = getDbPath(storagePath);
            }

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

                if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                    qPic.dbPath = await uploadToCloud(qPic, `quizes/quiz${quizID}`);   
                }
                else {  // uploading files locally when in DEVELOPMENT mode
                    storagePath = getStoragePath(qPic.path, `quizes\\quiz${quizID}`, qPic.fieldname);
                    var isOverWrite = false;
                    await moveFile(qPic.path, storagePath, isOverWrite);
                    qPic.dbPath = getDbPath(storagePath);
                }

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
    const { rows: notTaken } = await db.query(`SELECT * 
                                                FROM "Quiz" m INNER JOIN "WritesQuiz" wq ON m."quizID" = wq."quizID"
                                                    INNER JOIN "Book" b ON wq."bookID" = b."bookID"
                                                WHERE m."quizID" IN ((SELECT q."quizID" FROM "Quiz" q
                                                                        EXCEPT
                                                                        SELECT tq."quizID"
                                                                        FROM "TakesQuiz" tq
                                                                        WHERE tq."kidID" = $1 AND tq."quizFinished" = $2))`,
                                                                    [userID, 'Y']);


                                                                    

    const { rows: taken } = await db.query(`SELECT * 
                                            FROM "TakesQuiz" tq INNER JOIN "Quiz" q ON tq."quizID" = q."quizID"
                                                INNER JOIN "WritesQuiz" wq ON tq."quizID" = wq."quizID"
                                                INNER JOIN "Book" b ON wq."bookID" = b."bookID"								  
                                            WHERE tq."kidID" = $1 AND tq."quizFinished" = $2`,
                                [userID, 'Y']);
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
    Quiz.quizStartTime = result[0].quizStartTime;
    Quiz.quizFinished = result[0].quizFinished;
    

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
    await db.query(`UPDATE "TakesQuiz"
                    SET "grade" = $1, "pointsEarned" = $2, "quizFinished" = $3
                    WHERE "kidID" = $4 AND "quizID" = $5`, [grade, score, 'Y', kidID, quizID]);
    
  
    var { rows: result } = await db.query(`SELECT k."points" From "Kid" k WHERE k."kidID" = $1`, [kidID]);
    var currentPoints = result[0].points;
    var updatedPointsScore = parseInt(currentPoints) + parseInt(score);
    await db.query(`UPDATE "Kid" SET points = $1 WHERE "kidID" = $2`,
        [updatedPointsScore, kidID]);
}


const updateQuizStatus = async (kidID, quizID) => { // using async/await
    var result = {};
    var currentTime = new Date();
    var { rows: checkQuiz} = await db.query(`SELECT * 
                                            FROM "TakesQuiz" tq INNER JOIN "Quiz" q ON tq."quizID" = q."quizID"
                                            WHERE tq."kidID" = $1 AND tq."quizID" = $2`, [kidID, quizID]);
    
    if (checkQuiz.length > 0 && checkQuiz[0].quizFinished == 'N') {    // if the quiz has been started
        console.log(checkQuiz[0].duration);
        console.log(currentTime);
        console.log(checkQuiz[0].quizStartTime);
        console.log((currentTime - checkQuiz[0].quizStartTime)/1000);
        const timeLeft = 60 * (checkQuiz[0].duration) - (currentTime - checkQuiz[0].quizStartTime)/1000;
        if (timeLeft > 0) { // there is still time for the quiz
            result.quizStatus = 'active';
            result.quizFinished = "N";
            result.timeLeft = timeLeft;
        }
        else { // there is no remaining time for the quiz
            await db.query(`UPDATE "TakesQuiz"
                            SET "quizFinished" = $1
                            WHERE "kidID" = $2 AND "quizID" = $3`, ['Y', kidID, quizID]);
            result.quizStatus = 'finished';
            result.quizFinished = 'Y';
            result.timeLeft = timeLeft;
        }
    }
    else if (checkQuiz.length > 0 && checkQuiz[0].quizFinished == 'Y') {    // if the quiz has finished
        result.quizStatus = 'finished';
        result.quizFinished = 'Y';
        result.timeLeft = timeLeft;

    }
    else {  // first time starting the quiz ==> update start time
        await db.query(`INSERT INTO "TakesQuiz"("kidID", "quizID", "grade", "pointsEarned", "quizStartTime", "quizFinished") VALUES($1, $2, $3, $4, $5, $6)`,
            [kidID, quizID, -1, -1, currentTime, 'N']);

        var { rows: quizDuration} = await db.query(`SELECT duration FROM "Quiz"
                                                    WHERE "quizID" = $1`, [quizID]);
        result.quizStatus = 'started';
        result.quizFinished = 'N';    
        result.timeLeft = 60 * (quizDuration[0].duration);
    }
    return result; 
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

const getSupervisorKids = async (supervisorID) => { // using async/await
    var { rows: kids} = await db.query(`SELECT "kidID" FROM "Supervise" 
                                                WHERE "supervisorID" = $1 AND "approved" = 'Y'`,
                                    [supervisorID]);
    return kids;
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
        try {
            res = await sendGroupInvantationNotification(senderID, recieverID, notificationDate, content, typeName);
        } 
        catch (err) {
            console.log(err);
            return err;
        }  
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

const addSupervisionReq = async (supervisorID, kidEmail) => {
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
            // console.log(supervisionInfo);
            var date = new Date();
            var content = `Supervision request`;
            var langPreferred = await getLanguatgePreferredByUserID(kidID);
            content = __('SupervisionRequest', langPreferred);  // translation using 'multi-lang npm
            var type = 'supervision';
            if (supervisionInfo == undefined) {
                var approved = 'N';
                await db.query(`INSERT INTO "Supervise"("supervisorID", "kidID", "approved") VALUES($1, $2, $3)`,
                    [supervisorID, kidID, approved]);
                var res = await sendNotification(supervisorID, kidID, date, content, type); 
                if (res == undefined) {
                    return `בקשת פיקוח נשלחה בהצלחה וממתינה לאישור הילד/ה.`;
                } 
                return res;
            }
            else if(supervisionInfo.approved == 'N') {
                var res = await sendNotification(supervisorID, kidID, date, content, type); 
                if (res == undefined) {
                    return `בקשת פיקוח נשלחה בהצלחה וממתינה לאישור הילד/ה.`;
                } 
                return res;


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
    // console.log('bookID '+bookID);
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
    // console.log('bookID '+bookID);
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
    // console.log('groupID Info '+groupID);
    pool.query(`SELECT g.*, p.*
    FROM "Group" g INNER JOIN "Person" p ON g."personID"=p."personID"
    WHERE g."groupID" = $1 `, [groupID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows[0]);
 });
}
const getGroupAdminMembers = (groupID, callback) => {
    // console.log('groupID Admin ' + groupID);
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
    // console.log('groupID member ' + groupID);
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
    // console.log('groupID Post ' + groupID);
    pool.query(`SELECT po.*, p.*
    FROM "Post" po INNER JOIN "Person" p ON po."personID"=p."personID"
    WHERE po."groupID" = $1 
    ORDER BY po."postID" DESC`, [groupID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getGroupsCreatedAndAdminedByUser = async (userID) => {
    try {
        
        var { rows: groupList} = await db.query(`   SELECT * 
                                                    FROM "Group" gr
                                                    WHERE gr."personID" = $1
                                                UNION
                                                    SELECT gr.* 
                                                    FROM "InGroup" ig INNER JOIN "Group" gr ON ig."groupID" = gr."groupID"
                                                    WHERE  ig."type" = $2  AND ig."personID" = $3`, [userID, 'admin', userID]); // get all groups that user has created or is an admin in them
    } 
    catch (err) {
        console.log(err);
        throw err;
    }
    return groupList;

}

const checkUserAccessToGroup = async (userID, groupID) => {
    try {
        
        var { rowCount: check} = await db.query(`   SELECT * 
                                                    FROM "Group" gr
                                                    WHERE gr."personID" = $1 AND gr."groupID" = $2
                                                UNION
                                                    SELECT gr.* 
                                                    FROM "InGroup" ig INNER JOIN "Group" gr ON ig."groupID" = gr."groupID"
                                                    WHERE  ig."type" = $3  AND ig."personID" = $4 AND gr."groupID" = $5`, [userID, groupID, 'admin', userID, groupID]); // check if user can access the group
    } 
    catch (err) {
        console.log(err);
        throw err;
    }
    if (check >= 1) {   // if any rows return then access is allowed
        return true;
    }
    else {   // if no rows return then access is denied
        return false;
    }
    return groupList;

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
    pool.query(`SELECT n.*,b.*
    FROM "Note" n,"Book" b
    WHERE n."personID" = $1 AND n."bookID" IS NULL`, [personID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}
const getNotesAboutBook = (personID, callback) => {
    pool.query(`SELECT n.*, b.*
    FROM "Note" n INNER JOIN "Book" b on n."bookID"=b."bookID"
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

const getAllAboutNote = (personID, callback) => {
    getNotes(personID, (getNoteData) => {
        getKidBooksForNotes(personID, (getbBooksForNote) => {
            getNotesAboutBook(personID, (getNoteAboutBook) => {
                callback({
                    getNoteData,
                    getbBooksForNote,
                    getNoteAboutBook
                });
            });
        });
    });
}



const insertNewBook = async (data, imgArr) => { // using async/await
    // console.log(data);
    // console.log(imgArr);
    // console.log(imgArr.length);
    try {
        if (imgArr.length == 0) {    // inserting a book with a default image
            defualtImgDbPath = '/img/books/default-book.gif';
            await db.query(`INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "lang", "pic") VALUES($1, $2, $3, $4, $5)`,
                [data.bookName, data.authorFirstName, data.authorLastName, data.bookLang, defualtImgDbPath]);

        }
        else {    // inserting a book with an image uploaded by user
            var {rows: [{last_value}]} = await db.query(`SELECT last_value FROM "Book_bookID_seq"`);  // getting the last inserted serial number of bookID
            const bookID = ++last_value; // id of the new book

            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                data.bookPicDbPath = await uploadToCloud(imgArr[0], `books/book${bookID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                var storagePath = getStoragePath(imgArr[0].path, `books\\book${bookID}`, imgArr[0].fieldname);
                var isOverWrite = true;
                await moveFile(imgArr[0].path, storagePath, isOverWrite);
                data.bookPicDbPath = getDbPath(storagePath);
            }
            
            await db.query(`INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "lang", "pic") VALUES($1, $2, $3, $4, $5)`,
                [data.bookName, data.authorFirstName, data.authorLastName, data.bookLang, data.bookPicDbPath]);
        }
      } catch (err) {
        console.error(err) 
        throw err;
      }
}


const insertNewGroup = async (data, creatorID, imgArr) => { // using async/await
    // console.log(data);
    // console.log(creatorID);
    // console.log(imgArr);
    // console.log(imgArr.length);
    try {
        var {rows: [{last_value}]} = await db.query(`SELECT last_value FROM "Group_groupID_seq"`);  // getting the last inserted serial number of groupID
        const groupID = ++last_value; // id of the new group

        if (imgArr.length == 0) {    // inserting a group with a default image
            defualtImgDbPath = '/img/groups/default-group-pic.png';
            await db.query(`INSERT INTO "Group"("groupName", "pic", "personID") VALUES($1, $2, $3)`,
                [data.groupName, defualtImgDbPath, creatorID]);

        }
        else {    // inserting a group with an image uploaded by user



            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                data.groupPicDbPath = await uploadToCloud(imgArr[0], `groups/group${groupID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                var storagePath = getStoragePath(imgArr[0].path, `groups\\group${groupID}`, imgArr[0].fieldname);
                var isOverWrite = true;
                await moveFile(imgArr[0].path, storagePath, isOverWrite);
                data.groupPicDbPath = getDbPath(storagePath);
            }
            
            await db.query(`INSERT INTO "Group"("groupName", "pic", "personID") VALUES($1, $2, $3)`,
                [data.groupName, data.groupPicDbPath, creatorID]);
        }


        await db.query(`INSERT INTO "InGroup"("groupID", "type", "approved", "personID") VALUES($1, $2, $3, $4)`,
                [groupID, 'admin', 'Y', creatorID]);

      } catch (err) {
        console.error(err) 
        throw err;
      }
}

const getDataOfMyGroups = async (userID) => { // using async/await
    try {
        var myGroupsList = await getGroupsCreatedAndAdminedByUser(userID);
        // console.log(myGroupsList);
        var groupsData = [];
        
            for(var i = 0; i < myGroupsList.length; i++) {
                var curr = await getAllAboutGroupPromise(myGroupsList[i].groupID);
                groupsData.push(curr);
             }
            return groupsData;
      } catch (e) {
        console.error(e);
        throw e;
      }
}

function getAllAboutGroupPromise(groupID){
    return new Promise((resolve, reject) => {
        getAllAboutGroup(groupID, (allAboutGroup) => {
            resolve(allAboutGroup);
           //  console.dir(groupsData, { depth: null }); // `depth: null` ensures unlimited recursion 
         });
    })
  }


const getAllRegisteredUsersEmail = async () => { // using async/await getting a list of emails of all registered users
    try {
        var { rows: userList } = await db.query(`SELECT P."email" 
                                                FROM "Person" P`);  // checking if there is a kid with this email
        return userList;
    }

    catch (err) {
        console.log(err);
        throw err;
    }
}


const addUserToGroupReq = async (teacherID, groupID, kidEmail, permissionType) => {
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
            var inGroupInfo = await getInGroupReqInfo(groupID, kidID);
            var date = new Date();
            var groupName = await getGroupNameByGroupID(groupID);
            var content = `Invitation to Group: ${groupName}`;
            var langPreferred = await getLanguatgePreferredByUserID(kidID);

                content = __('groupInvitation', {groupName: groupName, groupID: groupID}, langPreferred);  // translation using 'multi-lang npm
                                                                                                           // square brackets are crucial for retrieving group information from the notification

            
            var type = 'group';
            if (inGroupInfo == undefined) {
                var approved = 'N';
                await db.query(`INSERT INTO "InGroup"("groupID", "personID", "approved", "type") VALUES($1, $2, $3, $4)`,
                    [groupID, kidID, approved, permissionType]);
                var res = await sendNotification(teacherID, kidID, date, content, type);
                if (res == undefined) {
                    return `הזמנת הצטרפות לקבוצת: ${groupName}, נשלחה בהצלחה וממתינה לאישור הילד/ה`;
                }
                return res;
            }
            else if(inGroupInfo.approved == 'N') {
                var res = await sendNotification(teacherID, kidID, date, content, type);
                if (res == undefined) {
                    return `הזמנת הצטרפות לקבוצת: ${groupName}, נשלחה בהצלחה וממתינה לאישור הילד/ה`;
                }
                return res;
            }
            else if (inGroupInfo.approved == 'Y') {
                return `הילד/ה כבר נמצאים בקבוצת: ${groupName}`;
            }
        }
    }
    catch (err) {
        infoMsg = `אירעה שגיאה`;
        console.log(err);
        return infoMsg;
    }

}

const getInGroupReqInfo = async (groupID, kidID) => {
    var { rows: res} = await db.query(`SELECT * FROM "InGroup" ig 
                                        WHERE ig."groupID" = $1 AND ig."personID" = $2`,
        [groupID, kidID]);
    if (res.length > 0) {
        return res[0];  // only one row should exist with the same supervisor and kid
    }
    else {
        return undefined;
    }
}

const getGroupNameByGroupID = async (groupID) => { // using async/await
    try {
        var { rows: groupData } = await db.query(`SELECT G."groupName" 
                                                FROM "Group" G
                                                WHERE G."groupID" = $1`,
            [groupID]);
        return groupData[0].groupName;
    }

    catch (err) {
        console.log(err);
        throw err;
    }
}

const getLanguatgePreferredByUserID = async (userID) => { // using async/await
    try {
        var { rows: UserData } = await db.query(`SELECT P."lang" 
                                                FROM "Person" P
                                                WHERE P."personID" = $1`,
            [userID]);
        return UserData[0].lang;
    }

    catch (err) {
        console.log(err);
        throw err;
    }
}


const sendGroupInvantationNotification = async (teacherID, kidID, notificationDate, content, typeName) => {
    try {
        var notificationTypeID = await getNotificationTypeIdByName(typeName);
        if (!notificationTypeID) return 'Invalid notification type';

        var checkExistingNotifcation = await checkExistingGroupInvantationNotification(teacherID, kidID, typeName, content);
        if (checkExistingNotifcation) {  // there is a notification to which the kid responded : N(ot read), R(ead), A(approved) ==> no need to send another notification
            return 'There is already an active notification.';
        }    

        var recieverResponse = 'N';
    
        await db.query(`INSERT INTO "Notification"("notificationDate", "content", "recieverRes", "recieverID", "senderID", "notificationTypeID") VALUES($1, $2, $3, $4, $5, $6)`,
            [notificationDate, content, recieverResponse, kidID, teacherID, notificationTypeID]);
    } 
    catch (err) {
        console.log(err);
        return err;
    }
    return undefined;
}


const checkExistingGroupInvantationNotification = async (supervisorID, kidID, typeName, content) => {
    var { rows: res} = await db.query(`SELECT * FROM "Notification" N INNER JOIN "NotificationType" NT
                                        ON N."notificationTypeID" = NT."notificationTypeID"
                                        WHERE N."recieverID" = $1 AND NT."typeN" = $2 AND N."senderID" = $3 AND N."recieverRes" IN ($4, $5, $6)
                                            AND N."content" = $7`,
        [kidID, typeName, supervisorID, 'N','R','A', content]);
    if (res.length > 0) {   // there is a notification to which the kid responded : N(ot read), R(ead), A(approved)
        return true;
    }
    else {
        return false;
    }

}

const respondToAddGroupReq = async (teacherID, kidID, groupID, notificationResponse, notificationID, content) => {  // updating the response to Group invitation in the "InGroup" table and in "Notification" table
    try {
        var invitationResponse = (notificationResponse == 'A') ? 'Y' : 'N';
        await db.query(`UPDATE "InGroup"
                        SET "approved" = $1
                        WHERE "personID" = $2 AND "groupID" = $3`, [invitationResponse, kidID, groupID]);  // updating approval of group invitation according to kid's decision
        
        await db.query(`UPDATE "Notification"
                        SET "recieverRes" = $1
                        WHERE "recieverID" = $2 AND "notificationID" = $3 
                        AND "recieverRes" IN ($4, $5)
                        AND "content" = $6`, [notificationResponse, kidID, notificationID, 'N', 'R', content]);   // updating notification's status according to kid's response
    } 
    catch (err) {
        console.log(err);
        return err;
    }
    return `kid #${kidID} responded ${invitationResponse} to group invitation from teacher #${teacherID}`;
}


  //=============================== group status ===================
  
  const getGroupStatus=(groupID,callback) => {
    pool.query(`SELECT  q."quizTitle",p."firstName",p."lastName",ig."groupID", tq."grade"
    FROM "Person" p  INNER JOIN  "InGroup" ig  on ig."personID"=p."personID" 
    LEFT OUTER JOIN  "TakesQuiz" tq on p."personID"=tq."kidID" 
    LEFT OUTER JOIN "Quiz" q on tq."quizID" = q."quizID"
    WHERE ig."approved"=$1 AND ig."groupID"=$2
	ORDER BY  tq."grade" ASC`
    ,['Y',groupID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getGroupQuizes = (groupID,callback) => {
    pool.query(`SELECT  DISTINCT q."quizTitle"
    FROM "InGroup" ig INNER JOIN "Person" p on ig."personID"=p."personID" 
    INNER JOIN "TakesQuiz" tq on p."personID"=tq."kidID" 
    INNER JOIN "Quiz" q on tq."quizID" = q."quizID"
    WHERE ig."approved"=$1 AND ig."groupID"=$2 `,['Y',groupID], (error, results) => {
    if (error) {
        throw error
    }
    callback(results.rows);
 });
}

const getGroupStatusQuiz = (groupID, callback) => {
    getGroupStatus(groupID, (getGroupStatus) => {
            getGroupQuizes(groupID,(getGroupQuizes) => {
                callback({
                    getGroupStatus,
                    getGroupQuizes
                });
            });
});
}
//==============================Insert kid notes=====================

const insertNote_book = async (data,userID,imgArr) => { // using async/await
    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
    try{
        if (imgArr.length == 0) {    // no new pic
            await db.query(`INSERT INTO "Note"("date","personID", "bookID","title","content","type") VALUES($1, $2, $3,$4,$5,$6)`,
              [date,userID,data.bookID,data.title,data.content,'private']);
                
    
        }
        else{
            var { rowCount: currNoteCount} = await db.query(`SELECT * FROM "Note"`);
            const noteID = ++currNoteCount; // id of the new quiz


            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                data.notePicInput = await uploadToCloud(imgArr[0], `users/user${userID}/notes/note${noteID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                var storagePath = getStoragePath(imgArr[0].path, `users\\user${userID}\\notes\\note${noteID}`, imgArr[0].fieldname);
                var isOverWrite = true;
                moveFile(imgArr[0].path, storagePath);
                data.notePicInput = getDbPath(storagePath);
            }
            // console.log(data);
            var nowDate = new Date(); 
            var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
            await db.query(`INSERT INTO "Note"("date","personID", "bookID","title","content","type","notePic") VALUES($1, $2, $3,$4,$5,$6,$7)`,
              [date,userID,data.bookID,data.title,data.content,'private',data.notePicInput]);
        }
    } catch (err) {
        console.error(err) 
        return err;
      }
}

const insertNote_noBook = async (data,userID,imgArr) => { // using async/await
    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
    try{
        if (imgArr.length == 0) {    // no new pic
            await db.query(`INSERT INTO "Note"("date","personID","title","content","type") VALUES($1, $2, $3,$4,$5)`,
              [date,userID,data.title,data.content,'private']);
                
    
        }
        else{
            var { rowCount: currNoteCount} = await db.query(`SELECT * FROM "Note"`);
            const noteID = ++currNoteCount; // id of the new quiz


            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                data.notePicInput = await uploadToCloud(imgArr[0], `users/user${userID}/notes/note${noteID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                var storagePath = getStoragePath(imgArr[0].path, `users\\user${userID}\\notes\\note${noteID}`, imgArr[0].fieldname);
                var isOverWrite = true;
                moveFile(imgArr[0].path, storagePath);
                data.notePicInput = getDbPath(storagePath);
            }
            // console.log(data);
            var nowDate = new Date(); 
            var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
            await db.query(`INSERT INTO "Note"("date","personID","title","content","type","notePic") VALUES($1, $2, $3,$4,$5,$6)`,
              [date,userID,data.title,data.content,'private',data.notePicInput]);
        }
    } catch (err) {
        console.error(err) 
        return err;
      }
}
//=========================================================
const updateNote_book = async (data,userID,imgArr) => { // using async/await
    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
    try{
        if (imgArr.length == 0) {    // no new pic
            await db.query(`UPDATE "Note" SET "date"=$1,"bookID"=$2, "title"=$3, "content"=$4, "type"=$5   WHERE "personID"=$6 AND "noteID"=$7`,
              [date,data.bookID,data.title,data.content,'private',userID,data.noteID]);
                
    
        }
        else{
            const noteID = data.noteID
            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                data.notePicInput = await uploadToCloud(imgArr[0], `users/user${userID}/notes/note${noteID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                var storagePath = getStoragePath(imgArr[0].path, `users\\user${userID}\\notes\\note${noteID}`, imgArr[0].fieldname);
                var isOverWrite = true;
                moveFile(imgArr[0].path, storagePath);
                data.notePicInput = getDbPath(storagePath);
            }
            // console.log(data);
            var nowDate = new Date(); 
            var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
            await db.query(`UPDATE "Note" SET "date"=$1,"bookID"=$2, "title"=$3, "content"=$4, "type"=$5,"notePic"=$6   WHERE "personID"=$7 AND "noteID"=$8`,
              [date,data.bookID,data.title,data.content,'private',data.notePic,userID,data.noteID]);
        }
    } catch (err) {
        console.error(err) 
        return err;
      }
}


const updateNote_noBook = async (data,userID,imgArr) => { // using async/await
    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
    try{
        if (imgArr.length == 0) {    // no new pic
            await db.query(`UPDATE "Note" SET "date"=$1, "title"=$2, "content"=$3, "type"=$4   WHERE "personID"=$5 AND "noteID"=$6`,
              [date,data.title,data.content,'private',userID,data.noteID]);
                
    
        }
        else{
            const noteID = data.noteID
            if (IN_PROD) {  // uploading files to the cloud when in PRODUCTION mode
                data.notePicInput = await uploadToCloud(imgArr[0], `users/user${userID}/notes/note${noteID}`);   
            }
            else {  // uploading files locally when in DEVELOPMENT mode
                var storagePath = getStoragePath(imgArr[0].path, `users\\user${userID}\\notes\\note${noteID}`, imgArr[0].fieldname);
                var isOverWrite = true;
                moveFile(imgArr[0].path, storagePath);
                data.notePicInput = getDbPath(storagePath);
            }
            // console.log(data);
            var nowDate = new Date(); 
            var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
            await db.query(`UPDATE "Note" SET "date"=$1,"bookID"=$2, "title"=$3, "content"=$4, "type"=$5,"notePic"=$6   WHERE "personID"=$7 AND "noteID"=$8`,
              [date,data.bookID,data.title,data.content,'private',data.notePic,userID,data.noteID]);
        }
    } catch (err) {
        console.error(err) 
        return err;
      }
}
//=========================================================

const uploadToCloud = async (imgData, pathInImg) => {

    return new Promise((resolve, reject) => {
        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(imgData.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', err => {
            next(err);
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const bucketName = bucket.name;
            const srcFilename = blob.name;
            const newFileName = imgData.fieldname + '.' + imgData.originalname.slice((imgData.originalname.lastIndexOf(".") - 1 >>> 0) + 2);    // changing file name and adding the same extension name as the original name
            const destFilename = `public/img/${pathInImg}/${newFileName}`;
            const publicUrl = `https://storage.cloud.google.com/${bucket.name}/${destFilename}`;

            // Moves the file within the bucket
            storage
                .bucket(bucketName)
                .file(srcFilename)
                .move(destFilename)
                .then(() => {
                    console.log(
                        `gs://${bucketName}/${srcFilename} moved to gs://${bucketName}/${destFilename}.`
                    );
                })
                .catch(err => {
                    console.error('ERROR:', err);
                });


            resolve(publicUrl);
        });
        blobStream.end(imgData.buffer);
    })

}


module.exports = {
    checkEmailExists,
    updateUserResetPasswordToken,
    getUserDataByValidToken,
    ChangeUserPassoword,
    getUserTypeById,
    getUserById,
    getAllBooks,
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
    getNotesAboutBook,
    updateQuizStatus,
    updateQuizAndPoints,
    updateLanguagePreferred,
    sendNotification,
    getNotificationsOfUser,
    setAllUserNotificationsAsRead,
    removeAllUserNotifications,
    respondToSupervisionReq,
    addSupervisionReq,
    editKidProfile,
    getSupervisorKids,
    getGroupsCreatedAndAdminedByUser,
    checkUserAccessToGroup,
    insertNewBook,
    insertNewGroup,
    getDataOfMyGroups,
    getAllRegisteredUsersEmail,
    addUserToGroupReq,
    respondToAddGroupReq,
    getGroupStatus,
    getGroupQuizes,
    getGroupStatusQuiz,
    insertNote_book,
    insertNote_noBook,
    updateNote_book,
    updateNote_noBook

}