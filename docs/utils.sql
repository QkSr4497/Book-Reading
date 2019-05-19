SELECT * FROM "Person";

SELECT * FROM "Supervisor";

SELECT * FROM "Teacher";

SELECT * FROM "Kid";

SELECT * FROM "Admin";

SELECT * FROM "UserSessions";

SELECT * 
FROM "Person" p INNER JOIN "Kid" k ON p."personID" = k."kidID";

SELECT * 
FROM "Person" p INNER JOIN "Teacher" t ON p."personID" = t."teacherID";

SELECT * 
FROM "Person" p INNER JOIN "Supervisor" s ON p."personID" = s."supervisorID";

SELECT * 
FROM "Person" p INNER JOIN "Admin" a ON p."personID" = a."adminID";

/*
-- be careful this will delete entire DB
DELETE FROM "Supervisor";	-- delete all rows from Supervisor
DELETE FROM "Teacher";	-- delete all rows from Teacher
DELETE FROM "Kid";	-- delete all rows from Kid
DELETE FROM "Admin";	-- delete all rows from Admin
DELETE FROM "Person";	-- delete all rows from Person
*/


