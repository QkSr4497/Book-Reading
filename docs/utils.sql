SELECT * FROM "Person";

SELECT * FROM "Supervisor";

SELECT * FROM "Teacher";

SELECT * FROM "Kid";

SELECT * 
FROM "Person" p INNER JOIN "Kid" k ON p."personID" = k."kidID";

SELECT * 
FROM "Person" p INNER JOIN "Teacher" t ON p."personID" = t."teacherID";

SELECT * 
FROM "Person" p INNER JOIN "Supervisor" s ON p."personID" = s."supervisorID";

