SELECT * FROM "Person";

SELECT * FROM "Supervisor";

SELECT * FROM "Teacher";

SELECT * FROM "Kid";

SELECT * FROM "Admin";

SELECT * FROM "UserSessions";

SELECT * FROM "Book";

SELECT * FROM "Group";

SELECT * FROM "InGroup";

DELETE FROM "InGroup" WHERE "personID" = 13

SELECT * FROM "Notification";

DELETE FROM "Notification" WHERE "recieverID" = 13

UPDATE "Group"
SET "pic" = '/img/groups/default-group-1.gif' WHERE "groupID" = 1

SELECT 
* FROM "Group" g INNER JOIN "Person" p ON g."personID" = p."personID"

SELECT * FROM "TakesQuiz";

UPDATE "Person" p INNER JOIN "Kid" k ON p."personID" = k."kidID" 
SET k."firstName" = 'try' WHERE p."personID" = 13

SELECT last_value FROM "Book_bookID_seq"

UPDATE "Person" 
SET "pic" = '/img/users/defaultProfilePics/kidF.png'
WHERE "personID" = 13

UPDATE "Kid" 
SET "birthDate" = '2011-01-01'
WHERE "kidID" = 13

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
									  
SELECT * 
FROM "Supervise" s INNER JOIN "Person" p ON s."kidID" = p."personID"
WHERE "supervisorID" = 11 AND "approved" = 'Y';
									  
SELECT s."supervisorID", p2."userName" as "su UN", s."kidID", p1."userName" as "kid UN" 
FROM "Supervise" s INNER JOIN "Person" p1 ON s."kidID" = p1."personID"
	INNER JOIN "Person" p2 ON s."supervisorID" = p2."personID"
									  
UPDATE "Supervise"
SET "approved" = 'N'
WHERE "supervisorID" = 11 AND "kidID" = 13 AND "approved" = 'N';

DELETE FROM "Supervise" WHERE "supervisorID" = 11 AND "kidID" = 16

									

SELECT * 
FROM "Quiz" m INNER JOIN "WritesQuiz" wq ON m."quizID" = wq."quizID"
	INNER JOIN "Book" b ON wq."bookID" = b."bookID"
WHERE m."quizID" IN ((SELECT q."quizID" FROM "Quiz" q
						EXCEPT
						SELECT tq."quizID"
						FROM "TakesQuiz" tq
						WHERE tq."kidID" = 13))									  
	
SELECT * 
FROM "TakesQuiz" tq INNER JOIN "Quiz" q ON tq."quizID" = q."quizID"
	INNER JOIN "WritesQuiz" wq ON tq."quizID" = wq."quizID"
	INNER JOIN "Book" b ON wq."bookID" = b."bookID"								  
WHERE tq."kidID" = 13
									  
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


