-------------- Person table-------------------
ALTER SEQUENCE "Person_personID_seq" RESTART;	-- personID serial will start with 1
-- admins
/*1*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('qksr', 'admin', 'admin', 'qksr72@gmail.com', '$2b$10$BsTKYT4fuzymVtGjNY/opO/TeTDilmO6TjX8dA6v1UhxR/NJhLxAq', 'hebrew', 'M', '/img/users/defaultProfilePics/adminM.jpg');  --qksrPass1
/*2*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('maram', 'admin', 'admin', 'maram.kh711@hotmail.com', '$2b$10$AzYchUve5EnceY5AFkT/I.KbN9/q7fIlKtU1MI.QjSN8mUhU5f6g2', 'arabic', 'F', '/img/users/defaultProfilePics/adminF.png');  --maramPass1

-- supervisors
/*3*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('molly43', 'molly', 'jane', 'molly43@gmail.com', '$2b$10$tycwSjrNHebpuk84dwv6qeVvQ.dKnIwA1i30t2z6ARNRywWiQKg0O', 'hebrew', 'F', '/img/users/defaultProfilePics/supervisorF.png');  --molly43Pass1
/*4*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('robert12', 'robert', 'reacher', 'robert12@gmail.com', '$2b$10$CIDp47MNcmq0k1cZYyE80uF5JU526sEz.iJH5KSBcnJJJFWCvQwdK', 'arabic', 'M', '/img/users/defaultProfilePics/supervisorM.png');  --robert12Pass1

-- teachers
/*5*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('dave33', 'dave', 'york', 'dave33@gmail.com', '$2b$10$zuSgvWKY5JTm37vPyBAySeN1dnV79.QN/f3wdblYOfHOg93/u1aaq', 'hebrew', 'M', '/img/users/defaultProfilePics/teacherM.jpg');  --dave33Pass1
/*6*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('milla34', 'milla', 'jovovich', 'milla34@gmail.com', '$2b$10$Q4hgmAXdp6zbOajcyX60..Eg.zGCxhjuWMUWnb3dEg1CdgJhC6OcC', 'arabic', 'F', '/img/users/defaultProfilePics/teacherF.png');  --milla34Pass1

-- kids
/*7*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('mike22', 'mikey', 'jackson', 'mike22@gmail.com', '$2b$10$VD2vCMgr/4c/TYeauX1Hh.psWgvlhBOG4kYGHOjUu0afKICTFC.ZW', 'hebrew', 'M', '/img/users/defaultProfilePics/kidM.png');  --mike22Pass1
/*8*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('danny5', 'danny', 'rubin', 'danny5@gmail.com', '$2b$10$7ISDpNVlFf8Ug1AMrpInpO6MeKZM5MCaMvvVlpsFNVdORlb3lnRW.', 'hebrew', 'M', '/img/users/defaultProfilePics/kidM.png');  --danny5Pass1
/*9*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('keren6', 'keren', 'cohen', 'keren6@gmail.com', '$2b$10$gf..8fbBP26rpd8XJfZ7EemZK91tvOhhENS.GoDMSkCWCDY6K1H7.', 'arabic', 'F', '/img/users/defaultProfilePics/kidF.png');  --keren6Pass1
/*10*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('nelly15', 'nelly', 'doll', 'nelly15@gmail.com', '$2b$10$8rVXDDq6JAGDK2OSWiDGEePM7VA.COxRAuiZBdBrffPHaiJs0ZIri', 'arabic', 'F', '/img/users/defaultProfilePics/kidF.png');  --nelly15Pass1

-- supervisors
/*11*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('sarah29', 'sarah', 'colman', 'sarah29@gmail.com', '$2b$10$xF7I/Yd4qc2CmGNtoGFTfOAJk6Dk6WL2/hskiH87yx2c0Vri.AcQ6', 'hebrew', 'F', '/img/users/defaultProfilePics/supervisorF.png');  --sarah29Pass1
/*12*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('moshe1234', 'moshe', 'levi', 'moshe1234@gmail.com', '$2b$10$LRkfELsj.FwoioksgT25EOU0DlpIKEcTcK8ggPCmieOCfLR20OAhq', 'hebrew', 'M', '/img/users/defaultProfilePics/supervisorM.png');  --moshe1234Pass1

-- kids
/*13*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('jacky11', 'jacky', 'moon', 'jacky11@gmail.com', '$2b$10$L62awdfaTnqq2lBUHeAtreYBWnd8xgQtaR7IEPKyuc.000yDp/jK.', 'hebrew', 'M', '/img/users/defaultProfilePics/kidM.png');  --jacky11Pass1
/*14*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('tim9', 'tim', 'trump', 'tim9@gmail.com', '$2b$10$g6ek7JVNcciKGhSdnMAFi.BlTsnh8zjQeY1PmZ7UkMQX9ktm3eUfO', 'hebrew', 'M', '/img/users/defaultProfilePics/kidM.png');  --tim9Pass1
/*15*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('dorin23', 'dorin', 'asor', 'dorin23@gmail.com', '$2b$10$uNU547wQp3cz0CW5zZxrbOszDO7R1KjsYS3Sgh7zHPhpRQvECwmOa', 'hebrew', 'F', '/img/users/defaultProfilePics/kidF.png');  --dorin23Pass1
/*16*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('tali11', 'tali', 'doll', 'tali11@gmail.com', '$2b$10$eUXqRgyxz.5uRRFG5yCgi..oNV6aGkx9JOOh5vhFIk8VJTbwBoim.', 'hebrew', 'F', '/img/users/defaultProfilePics/kidF.png');  --tali11Pass1

-- teachers
/*17*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('mira36', 'mira', 'goldston', 'mira36@gmail.com', '$2b$10$ND5u0irNBYY3AoFiwYiNEeKvfSQcAzvdO/EvIiBdmw4IfiTEKzU7y', 'hebrew', 'F', '/img/users/defaultProfilePics/teacherF.png');  --mira36Pass1
/*18*/ INSERT INTO "Person"("userName", "firstName", "lastName", "email", "pwd", "lang", "gender", "profilePic") VALUES('rafi53', 'rafi', 'vice', 'rafi53@gmail.com', '$2b$10$W7KLxbxrvXIwubSQlWHwQOoV4iVNRAsBqYnrrncDltAObTgZf8ovG', 'hebrew', 'M', '/img/users/defaultProfilePics/teacherM.jpg');  --rafi53Pass1

--**************/Person table *******************************

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
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('האיש הקטן', 'אריך', 'קסטנר', '/img/books/the-little-man.png', 'hebrew');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('القرد العجيب', 'نعمان', 'إسماعيل عبد القادر', '/img/books/wonder-monkey.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('من يُلاعبني..؟', 'نبيهة', 'راشد جبارين', '/img/books/who-plays-with-me.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الشمس والقمر', 'وفاء', 'عياش', '/img/books/theSun-and-theMoon.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الشبح', 'حياة', 'بلحة أبو شمس', '/img/books/the-ghost.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أبي صاروخ وجدي قمر صناعي', 'هديل', 'ناشف', '/img/books/space.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أميرة الفصول', 'محمد علي', 'طه', '/img/books/seasons-princes.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('نسرين زهرة من بلدي', 'سليم', 'نفاع', '/img/books/nisreen-flower.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('قطتي لوسي', 'غادة', 'ابراهيم عيساوي', '/img/books/myCat-lucy.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('بيت ميس', 'جهاد', 'غوشة عراقي', '/img/books/mais-house.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الهدية السحرية','نبيهة', 'راشد جبارين','/img/books/magic-gift.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أمي الحبيبة', 'بشارة', 'مرجية', '/img/books/lovely-mother.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أين أختفت الشمس؟', 'غادة', 'ابراهيم عيساوي','/img/books/lost-sun.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الكوكب الضائع', 'سهيل', 'عيساوي', '/img/books/lost-star.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('خروف العيد السعيد', 'مصطفى', 'مرار', '/img/books/lamb-of-eid.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('كرم والصف الأول', 'أسرار', 'غبس', '/img/books/karam-and-fist-class.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('المكواة', 'نبيهة', 'راشد جبارين', '/img/books/iron.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أنا لست فراشة', 'هديل', 'ناشف', '/img/books/i-am-not-a-butterfly.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أحب أن أغني', 'رافع ', 'يحيى', '/img/books/i_like_to_sing.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('جدي', 'أيمان', 'أيو فارس', '/img/books/grandpa.png', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('هدية لأمي في عيدها', 'نادية', 'صالح', '/img/books/gift.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('ملك الفواكه', 'محمد علي', 'طه', '/img/books/fruits-king.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('اكتشفتُ شيئًا', 'ميساء', 'الصَّح', '/img/books/found-something.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الطاووس الناري', 'لبنى', 'صفدي', '/img/books/fire-bird.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الريشة التي كبرت', 'غينيا', 'مصري', '/img/books/feather.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('للشهرة ثمن', 'ليلى', 'حجة', '/img/books/fame-price.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('مفارة الديناصور العجيبة ', 'سهيل', 'عيساوي', '/img/books/dinasor.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أبي يشخر', 'نادر', 'أبو تامر', '/img/books/dad_snozing.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الأرنب الفطين', 'محمد علي', 'طه', '/img/books/cleaver-rabbit.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('القطة نونو', 'ريم', 'عوّاد', '/img/books/cat-nunu.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('حكاية فراشة', 'ملكة', 'ناطور سلامة', '/img/books/buterfly_story.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('المقلاع', 'نبيهة', ' راشد حبارين', '/img/books/al_meqlaa.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أمير طالب مثالي', 'محمد علي', ' فقرا', '/img/books/ameer.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('التفاحة وأمها الشجرة', 'أمال', ' شعبي بشارة', '/img/books/apple.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الكرة الشائكة', 'نبيهة ', ' راشد حبارين', '/img/books/ball.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('باسل يتفاجأ', 'سامية', ' شاهين ياسين', '/img/books/basel.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الخرزة الزرقاء', 'هديل', ' ناشف', '/img/books/blue.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('زنار جدتي', 'محمد علي', ' فقرا', '/img/books/zonar.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('زحزوحة وشمس', 'دافناه', ' بن تسفي', '/img/books/zahzuha.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أنا رائع', 'نيفين', ' عز الدين عثامنة', '/img/books/wonderful.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('وليمة عند الملكة', 'روتو', ' مودان', '/img/books/waleema.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('طبعًا...أنا أحب الحياة', 'حياة', ' بلحة أبو شميس', '/img/books/sure_i_love_life.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('القرد بعين أمه غزال', 'ميسون', ' أسدي', '/img/books/monkey.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('رسالة من طائر مجهول', 'رحاب', ' زريق', '/img/books/message_from_unknown_bird.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('الشجرة الساحرة', 'ناجي ظاهر وعمر أبو نصرة', ' ', '/img/books/magic-tree.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('ما أحلاه..!', 'نبيهة', ' راشد جبارين', '/img/books/ma_ahlah.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('خيال', 'نبيهة', 'راشد جبارين', '/img/books/khayal.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('سمكة جاد', 'ناجي', 'ظاهر', '/img/books/jad_fish.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('جحا يطعم ثيابه', 'فاطمة', ' كيوان', '/img/books/juha.jpg', 'arabic');
INSERT INTO "Book"("bookName", "authorFirstName", "authorLastName", "pic", "lang") VALUES('أنا أفهم', 'نعيم', ' عرايدي', '/img/books/i_understand.jpg', 'arabic');
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
INSERT INTO "Group" ("groupName","personID", "pic") VALUES ('Lions','5', '/img/groups/default-group-1.gif');
--************ /Group table *************************************

-----------------InGroup table----------------------------------------------
INSERT INTO "InGroup" ("groupID","personID","type", "approved") VALUES ('1','5','admin', 'Y');
INSERT INTO "InGroup" ("groupID","personID","type", "approved") VALUES ('1','7','kid', 'Y');
INSERT INTO "InGroup" ("groupID","personID","type", "approved") VALUES ('1','8','kid', 'Y');
INSERT INTO "InGroup" ("groupID","personID","type", "approved") VALUES ('1','9','kid', 'Y');
INSERT INTO "InGroup" ("groupID","personID","type", "approved") VALUES ('1','10','kid', 'Y');
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

------ NotificationType table ------------------------------
INSERT INTO "NotificationType"("typeN") VALUES('supervision');
INSERT INTO "NotificationType"("typeN") VALUES('group');
INSERT INTO "NotificationType"("typeN") VALUES('quiz');
--************ /NotificationType table *************************************


------ Note table ------------------------------
--INSERT INTO "Note"("personID","title","content","type") VALUES('7','أول تجربة لي في القراءة','عندما بدأت بقراءة الكتاب, لم افهم في البداية عما تدور القصة لكت كلما تقدمت احببت القصة أكثر فأكثر','private');
--************ /Note table *************************************
