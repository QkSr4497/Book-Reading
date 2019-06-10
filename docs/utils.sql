SELECT * FROM "Person";

SELECT * FROM "Supervisor";

SELECT * FROM "Teacher";

SELECT * FROM "Kid";

SELECT * FROM "Admin";

SELECT * FROM "UserSessions";

SELECT * FROM "Book";

SELECT * 
FROM "Person" p INNER JOIN "Kid" k ON p."personID" = k."kidID";

SELECT * 
FROM "Person" p INNER JOIN "Teacher" t ON p."personID" = t."teacherID";

SELECT * 
FROM "Person" p INNER JOIN "Supervisor" s ON p."personID" = s."supervisorID";

SELECT * 
FROM "Person" p INNER JOIN "Admin" a ON p."personID" = a."adminID";

SELECT * FROM "Quiz";

SELECT * FROM "Quiz" qz
WHERE qz."quizID" = 2

SELECT * FROM "Question";

SELECT * FROM "Answer";

SELECT * FROM "WritesQuiz";

SELECT * FROM "TakesQuiz";


SELECT * FROM "Quiz" m
WHERE m."quizID" IN ((SELECT q."quizID" FROM "Quiz" q
						EXCEPT
						SELECT tq."quizID" FROM "TakesQuiz" tq
						WHERE tq."kidID" = 9))

(SELECT q."quizID" FROM "Quiz" q
EXCEPT
SELECT tq."quizID" FROM "TakesQuiz" tq
WHERE tq."kidID" = 9);

SELECT * 
FROM "TakesQuiz" tq INNER JOIN "Quiz" q ON tq."quizID" = q."quizID"
WHERE tq."kidID" = 9


SELECT * 
FROM "WritesQuiz" wq INNER JOIN "Person" p ON wq."personID" = p."personID"
INNER JOIN "Book" b ON wq."bookID" = b."bookID"

SELECT b."bookID", b."bookName", b."authorFirstName", b."authorLastName", "pic", p."personID", p."firstName", p."lastName"
FROM "WritesQuiz" wq INNER JOIN "Person" p ON wq."personID" = p."personID"
INNER JOIN "Book" b ON wq."bookID" = b."bookID" 
WHERE wq."quizID" = 1



SELECT * 
FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID"
INNER JOIN "Answer" ans ON qs."quizID" = ans."quizID" AND qs."questionNum" = ans."questionNum"
WHERE qz."quizID" = 1
ORDER BY ans."quizID", ans."questionNum", ans."answerNum";

SELECT "questionNum", "questionContent", "questionPic", "questType" 
FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID"

SELECT "questionNum", "questionContent", "questionPic", "questType" 
FROM "Quiz" qz INNER JOIN "Question" qs ON qz."quizID" = qs."quizID"
WHERE qz."quizID" = 1

SELECT "answerNum", "answerContent", "answerPic", "isCorrect"
FROM "Answer"
WHERE "quizID" = 1 AND "questionNum" = 1



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


