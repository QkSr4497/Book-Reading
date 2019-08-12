SELECT * FROM "Person";

SELECT * FROM "Supervisor";

SELECT * FROM "Teacher";

SELECT * FROM "Kid";

SELECT * FROM "Admin";

SELECT * FROM "UserSessions";

SELECT * FROM "Book";

SELECT * FROM "TakesQuiz";



SELECT * 
FROM "Person" p INNER JOIN "Kid" k ON p."personID" = k."kidID";

SELECT * 
FROM "Person" p INNER JOIN "Teacher" t ON p."personID" = t."teacherID";

SELECT * 
FROM "Person" p INNER JOIN "Supervisor" s ON p."personID" = s."supervisorID";

SELECT * 
FROM "Person" p INNER JOIN "Admin" a ON p."personID" = a."adminID";

SELECT * FROM "Quiz";

Select nextval(pg_get_serial_sequence('"Quiz"', 'quizID')) as new_id; -- last value of the serial # of quizID and adding 1 to it without inserting any row into Quiz table
									  
SELECT last_value FROM "Quiz_quizID_seq";	-- last value of the serial # of quizID
									  

SELECT * FROM "Quiz" qz
WHERE qz."quizID" = 2

SELECT * FROM "Question";

SELECT * FROM "Answer";

SELECT * FROM "WritesQuiz";

SELECT * FROM "TakesQuiz";
									  
DELETE FROM "TakesQuiz";

SELECT * FROM "Quiz" m
WHERE m."quizID" IN ((SELECT q."quizID" FROM "Quiz" q
						EXCEPT
						SELECT tq."quizID" FROM "TakesQuiz" tq
						WHERE tq."kidID" = 9));

(SELECT q."quizID" FROM "Quiz" q
EXCEPT
SELECT tq."quizID" FROM "TakesQuiz" tq
WHERE tq."kidID" = 9);

SELECT * 
FROM "TakesQuiz" tq INNER JOIN "Quiz" q ON tq."quizID" = q."quizID"
WHERE tq."kidID" = 9;


SELECT * 
FROM "WritesQuiz" wq INNER JOIN "Person" p ON wq."personID" = p."personID"
INNER JOIN "Book" b ON wq."bookID" = b."bookID";

SELECT b."bookID", b."bookName", b."authorFirstName", b."authorLastName", "pic", p."personID", p."firstName", p."lastName"
FROM "WritesQuiz" wq INNER JOIN "Person" p ON wq."personID" = p."personID"
INNER JOIN "Book" b ON wq."bookID" = b."bookID" 
WHERE wq."quizID" = 1;


SELECT * 
FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID"
INNER JOIN "Answer" ans ON qs."quizID" = ans."quizID" AND qs."questionNum" = ans."questionNum"
WHERE qz."quizID" = 1
ORDER BY ans."quizID", ans."questionNum", ans."answerNum";

SELECT "questionNum", "questionContent", "questionPic", "questType" 
FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID";

SELECT "questionNum", "questionContent", "questionPic", "questType" 
FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID"
WHERE qz."quizID" = 1;

SELECT "answerNum", "answerContent", "answerPic", "isCorrect"
FROM "Answer"
WHERE "quizID" = 1 AND "questionNum" = 1;
									  
SELECT * FROM "Supervise" 
WHERE "kidID" = 13 AND "approved" = 'Y';
									  
UPDATE "Supervise"
SET "approved" = 'N'
WHERE "supervisorID" = 11 AND "kidID" = 13 AND "approved" = 'N';

DELETE FROM "Supervise"
									  
									  
									  
									  
DELETE
FROM "Notification" N
WHERE N."recieverID" = 13;
									  
SELECT * 
FROM "Notification" N INNER JOIN "NotificationType" NT
ON N."notificationTypeID" = NT."notificationTypeID"
INNER JOIN "Person" P ON N."senderID" = P."personID"
WHERE N."recieverID" = 13;
									  
SELECT * FROM "Notification" N INNER JOIN "NotificationType" NT
ON N."notificationTypeID" = NT."notificationTypeID"
WHERE N."recieverID" = 13 AND NT."typeN" = 'supervision' AND N."senderID" = 12 AND N."recieverRes" IN ('N','R','A');									  
									  
UPDATE "Notification"
SET "recieverRes" = 'N'
WHERE "recieverID" = 13;
								  							  
									  
									  
SELECT * FROM "NotificationType"; 
									  
INSERT INTO "Supervise"("supervisorID", "kidID", "approved") VALUES('4', '13', 'Y');
									  
SELECT P."personID" 
FROM "Person" P INNER JOIN "Kid" K ON P."personID" = K."kidID"
WHERE P."email" = 'keren6@gmail.com'

DELETE FROM "WritesQuiz" WHERE "quizID" = 16;
DELETE FROM "Answer" WHERE "quizID" = 16;
DELETE FROM "Question" WHERE "quizID" = 16;
DELETE FROM "Quiz" WHERE "quizID" = 16;

/*
-- be careful this will delete all users sessions and quizes
DELETE FROM "Supervisor";	-- delete all rows from Supervisor
DELETE FROM "Teacher";	-- delete all rows from Teacher
DELETE FROM "Kid";	-- delete all rows from Kid
DELETE FROM "Admin";	-- delete all rows from Admin
DELETE FROM "UserSessions";	-- delete all rows from UserSessions
DELETE FROM "Person";	-- delete all rows from Person

DELETE FROM "TakesQuiz";	-- delete all rows from TakesQuiz
DELETE FROM "WritesQuiz";	-- delete all rows from WritesQuiz
DELETE FROM "Answer";	-- delete all rows from Answer
DELETE FROM "Question";	-- delete all rows from Question
DELETE FROM "Quiz";	-- delete all rows from Quiz

*/


