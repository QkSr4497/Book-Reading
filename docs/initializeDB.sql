-------------- Person table-------------------
ALTER SEQUENCE "Person_personID_seq" RESTART;	-- personID serial will start with 1
-- admins
/*1*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('qksr', 'admin', 'admin', 'qksr72@gmail.com', '$2b$10$BsTKYT4fuzymVtGjNY/opO/TeTDilmO6TjX8dA6v1UhxR/NJhLxAq', 'hebrew');  --qksrPass1
/*2*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('maram', 'admin', 'admin', 'maram.kh711@hotmail.com', '$2b$10$AzYchUve5EnceY5AFkT/I.KbN9/q7fIlKtU1MI.QjSN8mUhU5f6g2', 'arabic');  --maramPass1

-- supervisors
/*3*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('molly43', 'molly', 'jane', 'molly43@gmail.com', '$2b$10$tycwSjrNHebpuk84dwv6qeVvQ.dKnIwA1i30t2z6ARNRywWiQKg0O', 'hebrew');  --molly43Pass1
/*4*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('jack12', 'jack', 'reacher', 'jack12@gmail.com', '$2b$10$8Uqpr2/cVV7KYndvbjZjRemeYIEOTqz7mG3tofebqo3vKRSKPFDlO', 'arabic');  --jack12Pass1

-- teachers
/*5*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('dave33', 'dave', 'york', 'dave33@gmail.com', '$2b$10$zuSgvWKY5JTm37vPyBAySeN1dnV79.QN/f3wdblYOfHOg93/u1aaq', 'hebrew');  --dave33Pass1
/*6*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('milla34', 'milla', 'jovovich', 'milla34@gmail.com', '$2b$10$Q4hgmAXdp6zbOajcyX60..Eg.zGCxhjuWMUWnb3dEg1CdgJhC6OcC', 'arabic');  --milla34Pass1

-- kids
/*7*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('mike22', 'mikey', 'jackson', 'mike22@gmail.com', '$2b$10$VD2vCMgr/4c/TYeauX1Hh.psWgvlhBOG4kYGHOjUu0afKICTFC.ZW', 'hebrew');  --mike22Pass1
/*8*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('danny5', 'danny', 'rubin', 'danny5@gmail.com', '$2b$10$7ISDpNVlFf8Ug1AMrpInpO6MeKZM5MCaMvvVlpsFNVdORlb3lnRW.', 'hebrew');  --danny5Pass1
/*9*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('keren6', 'keren', 'cohen', 'keren6@gmail.com', '$2b$10$gf..8fbBP26rpd8XJfZ7EemZK91tvOhhENS.GoDMSkCWCDY6K1H7.', 'arabic');  --keren6Pass1
/*10*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('nelly15', 'nelly', 'doll', 'nelly15@gmail.com', '$2b$10$8rVXDDq6JAGDK2OSWiDGEePM7VA.COxRAuiZBdBrffPHaiJs0ZIri', 'arabic');  --nelly15Pass1

-- supervisors
/*11*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('sarah29', 'sarah', 'colman', 'sarah29@gmail.com', '$2b$10$xF7I/Yd4qc2CmGNtoGFTfOAJk6Dk6WL2/hskiH87yx2c0Vri.AcQ6', 'hebrew');  --sarah29Pass1
/*12*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('moshe1234', 'moshe', 'levi', 'moshe1234@gmail.com', '$2b$10$LRkfELsj.FwoioksgT25EOU0DlpIKEcTcK8ggPCmieOCfLR20OAhq', 'hebrew');  --moshe1234Pass1

-- kids
/*13*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('jacky11', 'jacky', 'moon', 'jacky11@gmail.com', '$2b$10$L62awdfaTnqq2lBUHeAtreYBWnd8xgQtaR7IEPKyuc.000yDp/jK.', 'hebrew');  --jacky11Pass1
/*14*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('tim9', 'tim', 'trump', 'tim9@gmail.com', '$2b$10$g6ek7JVNcciKGhSdnMAFi.BlTsnh8zjQeY1PmZ7UkMQX9ktm3eUfO', 'hebrew');  --tim9Pass1
/*15*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('dorin23', 'dorin', 'asor', 'dorin23@gmail.com', '$2b$10$t7o7VRZZZK0iF17flHVM1eG1f8AVbcaOz4ZFlKAG3.iu3S9Wh8sPS', 'hebrew');  --dorin23ass1
/*16*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('tali11', 'tali', 'doll', 'tali11@gmail.com', '$2b$10$byzRTlJPMiwQ0OCNWBfwk../c/p3nMHunkqpFU1xkY5jFw3l60FzS', 'hebrew');  --tali11Pass1

-- teachers
/*17*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('mira36', 'mira', 'goldston', 'mira36@gmail.com', '$2b$10$V0STuIQkez2mX.MtgROF2uZkdvQA2DEDcwNm.4513/AdIuCIcFfF6', 'hebrew');  --mira36Pass1
/*18*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang") VALUES('rafi53', 'rafi', 'vice', 'rafi53@gmail.com', '$2b$10$533aMzV9iZYSXL04Gcw1BO4D8B.xVYuS5E7hHCc0hMIhwe2nG6qb2', 'hebrew');  --rafi53Pass1

--**************/Person table ********************************


------ Admin table ------------------------------
INSERT INTO "Admin"("adminID", "phone") VALUES('1', '0537494363');
INSERT INTO "Admin"("adminID", "phone") VALUES('2', '0548672661');
--*********** /Admin table *******************************


------ Supervisor table ------------------------------
INSERT INTO "Supervisor"("supervisorID", "phone") VALUES('3', '0548994551');
INSERT INTO "Supervisor"("supervisorID", "phone") VALUES('4', '0528454769');
INSERT INTO "Supervisor"("supervisorID", "phone") VALUES('11', '0538455761');
INSERT INTO "Supervisor"("supervisorID", "phone") VALUES('12', '0548454865');
--*********** /Supervisor table *******************************


------ Teacher table ------------------------------
INSERT INTO "Teacher"("teacherID", "phone") VALUES('5', '0528645788');
INSERT INTO "Teacher"("teacherID", "phone") VALUES('6', '0534578875');
INSERT INTO "Teacher"("teacherID", "phone") VALUES('17', '0548645711');
INSERT INTO "Teacher"("teacherID", "phone") VALUES('18', '0534578866');
--*********** /Teacher table *******************************


------ Kid table ------------------------------
INSERT INTO "Kid"("kidID", "birthDate") VALUES('7', '2011-02-08');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('8', '2012-03-25');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('9', '2013-07-26');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('10', '2012-12-27');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('13', '2011-08-26');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('14', '2012-07-25');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('15', '2012-03-05');
INSERT INTO "Kid"("kidID", "birthDate") VALUES('16', '2009-12-01');
--************ /Kid table *************************************


------ Book table ------------------------------
ALTER SEQUENCE "Book_bookID_seq" RESTART;	-- bookID serial will start with 1
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('האיש הקטן', 'אריך', 'קסטנר', '/img/books/the-little-man.png');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('أسكشكش', 'أسكشكان كشكش', 'أسنان كشكش', '/img/books/1.png');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('بيت ميس', 'أسكشكان كشكش','أسكشكان كشكش', '/img/books/2.jpg');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('كريم وفرشاة الأسنان','أسكشكان كشكش','أسكشكان كشكش', '/img/books/3.jpg');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('ملك الفواكه','أسكشكان كشكش','أسكشكان كشكش', '/img/books/4.jpg');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('الفراشات الثلاثة','أسكشكان كشكش','أسكشكان كشكش', '/img/books/5.jpg');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('ماذا تأكل الشّمس؟','أسكشكان كشكش','أسكشكان كشكش', '/img/books/6.png');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('قصة آثار على الثّلج','أسكشكان كشكش','أسكشكان كشكش', '/img/books/7.png');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('رحلة الألوان – اللّون الأخضر','أسكشكان كشكش','أسكشكان كشكش', '/img/books/8.png');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic") VALUES('أسنان كشكش','أسكشكان كشكش','أسكشكان كشكش', '/img/books/9.png');
--************ /Book table *************************************


------ Game table ------------------------------
INSERT INTO "Game"("gameName","pic","price","link") VALUES('HexGL','/funGames/HexGL/hexgl.jpg', '500','/funGames/HexGL/index.html');
INSERT INTO "Game"("gameName","pic","price","link") VALUES('Hextris', '/funGames/Hextris/hextris.png','200','/funGames/Hextris/index.html');
INSERT INTO "Game"("gameName","pic","price","link") VALUES('Pacman','/funGames/Pacman/pacman.png', '150','/funGames/Pacman/index.html');
INSERT INTO "Game"("gameName","pic","price","link") VALUES('Racer','/funGames/Racer/racer.png', '200','/funGames/Racer/index.html');
INSERT INTO "Game"("gameName","pic","price","link") VALUES('Radius','/funGames/Radius/radius.png', '250','/funGames/Radius/index.html');
INSERT INTO "Game"("gameName","pic","price","link") VALUES('Tower Bulding','/funGames/tower_game/towerBuilding.png', '200','/funGames/tower_game/index.html');
--************ /Game table *************************************


------ Quiz table ------------------------------
ALTER SEQUENCE "Quiz_quizID_seq" RESTART;	-- personID serial will start with 1
INSERT INTO "Quiz"("quizTitle","quizLanguage","quizPic", "duration") VALUES('האיש הקטן במבחן קצר','hebrew','/img/quizes/quiz1/quiz1pic.png','7'); -- quiz 1
--************ /Quiz table *************************************


------ Question table ------------------------------
INSERT INTO "Question"("quizID","questionNum","questionContent", "questionPic", "questType") VALUES('1','1','מה שמו של גיבור הספר?','/img/quizes/quiz1/q1pic.png','single'); -- quiz1 q1
INSERT INTO "Question"("quizID","questionNum","questionContent", "questionPic", "questType") VALUES('1','2','מהו גובהו של גיבור הספר?','/img/quizes/quiz1/q2pic.png','single'); -- quiz1 q2
INSERT INTO "Question"("quizID","questionNum","questionContent", "questionPic", "questType") VALUES('1','3','איך השפיע גובהו של גיבור הספר על חייו?','','multi'); -- quiz1 q3
--************ /Question table *************************************


------ Answer table ------------------------------
INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','1','1','דודי קליינר','','N');  -- quiz1 q1ans1
INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','1','2','מקסי פיכלשטיינר','','Y');  -- quiz1 q1ans2
INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','1','3','פיטר פן','','N');  -- quiz1 q1ans3

INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','2','1','5 ס"מ','','Y');  -- quiz1 q2ans1
INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','2','2','7 ס"מ','','N');  -- quiz1 q2ans2
INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','2','3','12 ס"מ','','N');  -- quiz1 q2ans3

INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','3','1','הגובה לא השפיע עליו כלל','','N');  -- quiz1 q3ans1
INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','3','2','בשל גובהו הילדים האחרים הציקו לו','','Y');  -- quiz1 q3ans2
INSERT INTO "Answer"("quizID","questionNum", "answerNum","answerContent", "answerPic", "isCorrect") VALUES('1','3','3','כדי להפוך דף בספר עליו לרדת בסולם ושוב לעלות כדי לקרוא ממרחק סביר','','Y');  -- quiz1 q3ans3
--************ /Answer table *************************************


------ WritesQuiz table ------------------------------
INSERT INTO "WritesQuiz"("bookID", "quizID", "personID") VALUES('1','1','5'); -- quiz1
--************ /WritesQuiz table *************************************


-----------------Group table---------------------------------------
INSERT INTO "Group" ("groupName","personID") VALUES ('Lions','5');
--************ /Group table *************************************

-----------------InGroup table----------------------------------------------
INSERT INTO "InGroup" ("groupID","personID","type") VALUES ('1','5','admin');
INSERT INTO "InGroup" ("groupID","personID","type") VALUES ('1','7','kid');
INSERT INTO "InGroup" ("groupID","personID","type") VALUES ('1','8','kid');
INSERT INTO "InGroup" ("groupID","personID","type") VALUES ('1','9','kid');
INSERT INTO "InGroup" ("groupID","personID","type") VALUES ('1','10','kid');
--************ /InGroup table ***********************************************

----------------------Message tablle-------------------------------------
INSERT INTO "Message" ("date","personID","subject","content") VALUES ('10/6/2019','5','Reading new book','Hi,I hope you all fine kids, I just wanted telling you that I have added new book in the library list, enjoy reading the new book  ^-^');
INSERT INTO "Message" ("date","personID","subject","content") VALUES ('10/6/2019','5','New Quiz','Hi,I hope you all fine kids, I just wanted telling you that I have added new quiz for the new book.');
--************ /Message table *************************************

----------------------GetMessage tablle-------------------------------------
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('1','7','N');
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('2','7','N');
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('1','8','N');
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('2','8','N');
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('1','9','N');
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('2','9','N');
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('1','10','N');
INSERT INTO "GetMessage"("messageID","personID","checked")VALUES('2','10','N');
--************ /GetMessage table *************************************


------ Supervise table ------------------------------
INSERT INTO "Supervise"("supervisorID", "kidID", "approved") VALUES('11', '14', 'Y');
INSERT INTO "Supervise"("supervisorID", "kidID", "approved") VALUES('4', '13', 'Y');
INSERT INTO "Supervise"("supervisorID", "kidID", "approved") VALUES('11', '13', 'Y');
--************ /Supervise table *************************************


------ Note table ------------------------------
--INSERT INTO "Note"("personID","title","content","type") VALUES('7','أول تجربة لي في القراءة','عندما بدأت بقراءة الكتاب, لم افهم في البداية عما تدور القصة لكت كلما تقدمت احببت القصة أكثر فأكثر','private');
--************ /Note table *************************************
