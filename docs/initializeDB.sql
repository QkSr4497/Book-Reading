-------------- Person table-------------------
ALTER SEQUENCE "Person_personID_seq" RESTART;	-- personID serial will start with 1
-- admins
/*1*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('qksr', 'admin', 'admin', 'qksr72@gmail.com', '$2b$10$BsTKYT4fuzymVtGjNY/opO/TeTDilmO6TjX8dA6v1UhxR/NJhLxAq');  --qksrPass1
/*2*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('maram', 'admin', 'admin', 'maram.kh711@hotmail.com', '$2b$10$AzYchUve5EnceY5AFkT/I.KbN9/q7fIlKtU1MI.QjSN8mUhU5f6g2');  --maramPass1

-- supervisors
/*3*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('molly43', 'molly', 'jane', 'molly43@gmail.com', '$2b$10$tycwSjrNHebpuk84dwv6qeVvQ.dKnIwA1i30t2z6ARNRywWiQKg0O');  --molly43Pass1
/*4*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('jack12', 'jack', 'reacher', 'jack12@gmail.com', '$2b$10$8Uqpr2/cVV7KYndvbjZjRemeYIEOTqz7mG3tofebqo3vKRSKPFDlO');  --jack12Pass1

-- teachers
/*5*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('dave33', 'dave', 'york', 'dave33@gmail.com', '$2b$10$zuSgvWKY5JTm37vPyBAySeN1dnV79.QN/f3wdblYOfHOg93/u1aaq');  --dave33Pass1
/*6*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('milla34', 'milla', 'jovovich', 'milla34@gmail.com', '$2b$10$Q4hgmAXdp6zbOajcyX60..Eg.zGCxhjuWMUWnb3dEg1CdgJhC6OcC');  --milla34Pass1

-- kids
/*7*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('mike22', 'mikey', 'jackson', 'mike22@gmail.com', '$2b$10$VD2vCMgr/4c/TYeauX1Hh.psWgvlhBOG4kYGHOjUu0afKICTFC.ZW');  --mike22Pass1
/*8*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('danny5', 'danny', 'rubin', 'danny5@gmail.com', '$2b$10$7ISDpNVlFf8Ug1AMrpInpO6MeKZM5MCaMvvVlpsFNVdORlb3lnRW.');  --danny5Pass1
/*9*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('keren6', 'keren', 'cohen', 'keren6@gmail.com', '$2b$10$gf..8fbBP26rpd8XJfZ7EemZK91tvOhhENS.GoDMSkCWCDY6K1H7.');  --keren6Pass1
/*10*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd") VALUES('nelly15', 'nelly', 'doll', 'nelly15@gmail.com', '$2b$10$8rVXDDq6JAGDK2OSWiDGEePM7VA.COxRAuiZBdBrffPHaiJs0ZIri');  --nelly15Pass1

--**************/Person table ********************************

------ Admin table ------------------------------
INSERT INTO "Admin"("adminID", "phone") VALUES('1', '0537494363');
INSERT INTO "Admin"("adminID", "phone") VALUES('2', '0537494363');
--*********** /Admin table *******************************

------ Supervisor table ------------------------------
INSERT INTO "Supervisor"("supervisorID", "phone") VALUES('3', '0548994551');
INSERT INTO "Supervisor"("supervisorID", "phone") VALUES('4', '0528454769');
--*********** /Supervisor table *******************************

------ Teacher table ------------------------------
INSERT INTO "Teacher"("teacherID", "phone") VALUES('5', '0528645788');
INSERT INTO "Teacher"("teacherID", "phone") VALUES('6', '0534578875');
--*********** /Teacher table *******************************

------ Kid table ------------------------------
INSERT INTO "Kid"("kidID", "birthDate") VALUES('7', '2011-02-08');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('8', '2012-03-25');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('9', '2013-07-26');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('10', '2012-12-27');
--************ /Kid table *************************************

------ Book table ------------------------------
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('האיש הקטן', 'אריך', 'קסטנר', '/img/books/the-little-man.png');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('ماذا تأكل الشّمس؟', 'ل الشّ', 'تأكل', 'aa1aaaaaaaaa');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('قصة آثار على الثّلج', 'ل الشّ', 'تأكل', 'a2aaaaaaaaaa');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('رحلة الألوان – اللّون الأخضر', 'ل الشّ', 'تأكل', '/img/books/colorsStory.jpg');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('قخضى الثّلج', 'ل الشّ', 'تأكل', 'aaaaaa3aaaaa');
--************ /Book table *************************************




INSERT INTO "Game"("gameName","pic","price","link") VALUES('Jewel Mahjongg','aaaaaaaaaa', '3000','aaaaaaaaa');

--*********************/Kid notes ****************
INSERT INTO "Note"("personID","title","content","type") VALUES('7','أول تجربة لي في القراءة','عندما بدأت بقراءة الكتاب, لم افهم في البداية عما تدور القصة لكت كلما تقدمت احببت القصة أكثر فأكثر','private');
