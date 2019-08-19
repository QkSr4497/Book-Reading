CREATE TABLE "Person" (
	"personID" SERIAL PRIMARY KEY,
	"userName" TEXT NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"gender" CHAR(1) CHECK ("gender" IN ('M','F')) NOT NULL,
	email TEXT UNIQUE NOT NULL,
	pwd TEXT NOT NULL,
	lang TEXT NOT NULL,
	"profilePic" TEXT NOT NULL
); 

CREATE TABLE "Admin" (
	"adminID" INTEGER REFERENCES "Person" ("personID") PRIMARY KEY,
	phone TEXT NOT NULL
); 

CREATE TABLE "Avatar" (
 	"avatarID" SERIAL PRIMARY KEY,
 	name TEXT NOT NULL,
	pic TEXT NOT NULL
); 

CREATE TABLE "Kid" (
	"kidID" INTEGER REFERENCES "Person" ("personID") PRIMARY KEY,
	"birthDate" DATE NOT NULL,
	"points" INTEGER DEFAULT 100,
	"avatarID" INTEGER REFERENCES "Avatar" ("avatarID")
); 

CREATE TABLE "Teacher" (
	"teacherID" INTEGER REFERENCES "Person" ("personID") PRIMARY KEY,
	phone TEXT NOT NULL
); 

CREATE TABLE "Supervisor" (
	"supervisorID" INTEGER REFERENCES "Person" ("personID") PRIMARY KEY,
	phone TEXT NOT NULL
); 

CREATE TABLE "Category" (
 	"categoryID" SERIAL PRIMARY KEY,
 	name TEXT NOT NULL
);

CREATE TABLE "Book" (
 	"bookID" SERIAL PRIMARY KEY,
 	"bookName" TEXT NOT NULL,
	"authorFirstName" TEXT NOT NULL,
	"authorLastName" TEXT NOT NULL,
	lang TEXT NOT NULL,
	pic TEXT UNIQUE NOT NULL
);
					 
CREATE TABLE "Game" (
 	"gameID" SERIAL PRIMARY KEY,
 	"gameName" TEXT NOT NULL,
	pic TEXT NOT NULL,
	price INTEGER CHECK (price > 0) NOT NULL,
	link TEXT NOT NULL
);
					 
CREATE TABLE "Quiz" (
	"quizID" SERIAL PRIMARY KEY,
	"quizTitle" TEXT NOT NULL,
	"quizLanguage" TEXT NOT NULL,
	"quizPic" TEXT NOT NULL,
	duration INTEGER NOT NULL
);
						   
CREATE TABLE "Question" (
 	"quizID" INTEGER REFERENCES "Quiz" ("quizID"),
 	"questionNum" INTEGER NOT NULL,
	"questionContent" TEXT NOT NULL,
	"questionPic" TEXT,
	"questType" TEXT CHECK ("questType" IN ('multi','single')) NOT NULL,
	PRIMARY KEY ("quizID", "questionNum")
);
					 
CREATE TABLE "Answer" (
 	"quizID" INTEGER NOT NULL,
	"questionNum" INTEGER NOT NULL,
 	"answerNum" INTEGER NOT NULL,
	"answerContent" TEXT NOT NULL,
	"answerPic" TEXT,
	"isCorrect" CHAR(1) CHECK ("isCorrect" IN ('Y','N')) NOT NULL,
	FOREIGN KEY ("quizID", "questionNum") REFERENCES "Question" ("quizID", "questionNum"),
	PRIMARY KEY ("quizID", "questionNum", "answerNum")									   
);
 
-- CREATE TABLE "Friend" (
--  	"personA" INTEGER REFERENCES "Person" ("personID"),
-- 	"friendOfA" INTEGER REFERENCES "Person" ("personID"),
-- 	approved CHAR(1) CHECK (approved IN ('Y','N')) NOT NULL,
-- 	PRIMARY KEY ("personA", "friendOfA")									   
-- );
							
CREATE TABLE "Group" (
	"groupID" SERIAL NOT NULL PRIMARY KEY,
	"groupName" varchar NOT NULL ,
	"pic"  TEXT,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL					  							   
);	
							
CREATE TABLE "Post" (
 	"postID" SERIAL PRIMARY KEY,
	"postDate" DATE NOT NULL,
 	content TEXT NOT NULL,
	"groupID" INTEGER REFERENCES "Group" ("groupID") NOT NULL,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL
); 

CREATE TABLE "Comment" (
	"commentID" SERIAL PRIMARY KEY,
	"postID" INTEGER REFERENCES "Post" ("postID") NOT NULL,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL,
	"commentDate" DATE NOT NULL,
	content TEXT NOT NULL
);	

CREATE TABLE "NotificationType" (
	"notificationTypeID" SERIAL PRIMARY KEY,
	"typeN" TEXT NOT NULL
);	

CREATE TABLE "Notification" (
	"notificationID" SERIAL PRIMARY KEY,
	"notificationDate" TIMESTAMP NOT NULL,
	"content" TEXT NOT NULL,
	"notificationTypeID" INTEGER REFERENCES "NotificationType" ("notificationTypeID") NOT NULL,
	"recieverRes" CHAR(1) CHECK ("recieverRes" IN ('R','N', 'A', 'D')) NOT NULL,	-- reciver response: (R)ead, (N)ot Read, (A)pproved, (D)eclined
	"recieverID" INTEGER REFERENCES "Person" ("personID") NOT NULL,
	"senderID" INTEGER REFERENCES "Person" ("personID") NOT NULL
);	

CREATE TABLE "Note" (
 	"noteID" SERIAL PRIMARY KEY,
	"date" DATE NOT NULL,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL,
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	"title" TEXT NOT NULL,
 	"content" TEXT NOT NULL,
	"type" TEXT CHECK (type IN ('public','private')) NOT NULL,
	"pic"  TEXT
);

CREATE TABLE "Image" (
	"imageID" SERIAL PRIMARY KEY,
	"img" Text NOT NULL
);							
							
-- CREATE TABLE "Teaches" (
--  	"teacherID" INTEGER REFERENCES "Teacher" ("teacherID"),
-- 	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
-- 	"groupName" TEXT NOT NULL,
-- 	PRIMARY KEY ("teacherID", "kidID")									   
-- );
							
CREATE TABLE "Supervise" (
 	"supervisorID" INTEGER REFERENCES "Supervisor" ("supervisorID"),
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	approved CHAR(1) CHECK (approved IN ('Y','N')) NOT NULL,
	PRIMARY KEY ("supervisorID", "kidID")									   
);
					 
CREATE TABLE "Cart" (
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"gameID" INTEGER REFERENCES "Game" ("gameID"),
	PRIMARY KEY ("kidID", "gameID")									   
);
					 
CREATE TABLE "InGroup" (
	"groupID" INTEGER REFERENCES "Group" ("groupID"),
	"personID" INTEGER REFERENCES "Person" ("personID"),
	type TEXT CHECK (type IN ('kid', 'admin')) NOT NULL,
	approved CHAR(1) CHECK (approved IN ('Y','N')) NOT NULL,
	PRIMARY KEY ("groupID", "personID")								   
);	
	
	
CREATE TABLE "ImageNote" (
	"noteID" INTEGER REFERENCES "Note" ("noteID") NOT NULL,
	"imageID" INTEGER REFERENCES "Image" ("imageID")NOT NULL
);	

CREATE TABLE "HasGames" (
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"gameID" INTEGER REFERENCES "Game" ("gameID"),
	PRIMARY KEY ("kidID", "gameID")									   
);							   
								
CREATE TABLE "Likes" (
	"personID" INTEGER REFERENCES "Person" ("personID"),
	"postID" INTEGER REFERENCES "Post" ("postID"),
	PRIMARY KEY ("personID", "postID")									   
);								
CREATE TABLE "WritesPost" (
	"personID" INTEGER REFERENCES "Person" ("personID"),
	"postID" INTEGER REFERENCES "Post" ("postID"),
	"postDate" DATE NOT NULL,
	PRIMARY KEY ("personID", "postID")									   
);

CREATE TABLE "WritesComment" (
	"personID" INTEGER REFERENCES "Person" ("personID"),
	"postID" INTEGER REFERENCES "Post" ("postID"),
	"commentDate" DATE NOT NULL,
	PRIMARY KEY ("personID", "postID")									   
);	

CREATE TABLE "WritesNote" (
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	"noteID" INTEGER REFERENCES "Note" ("noteID"),
	"personID" INTEGER REFERENCES "Person" ("personID") UNIQUE,
	PRIMARY KEY ("personID", "noteID")									   
);

							
CREATE TABLE "BookHas" (
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	"categoryID" INTEGER REFERENCES "Category" ("categoryID"),
	PRIMARY KEY ("bookID", "categoryID")									   
);							
							
CREATE TABLE "WritesQuiz" (
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	"quizID" INTEGER REFERENCES "Quiz" ("quizID"),
	"personID" INTEGER REFERENCES "Person" ("personID"),
	PRIMARY KEY ("quizID", "personID")									   
);	

CREATE TABLE "TakesQuiz" (
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"quizID" INTEGER REFERENCES "Quiz" ("quizID"),
	"grade" INTEGER NOT NULL,
	"pointsEarned" INTEGER NOT NULL,
	PRIMARY KEY ("kidID", "quizID")									   
);

-- CREATE TABLE "BookAssigned" (
-- 	"bookID" INTEGER REFERENCES "Book" ("bookID"),
-- 	"teacherID" INTEGER REFERENCES "Teacher" ("teacherID"),
-- 	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
-- 	PRIMARY KEY ("bookID", "teacherID", "kidID")									   
-- );
							
CREATE TABLE "KidBook" (
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	type TEXT CHECK (type IN ('intrested', 'reading', 'finished')) NOT NULL,
	review TEXT,
	rating INTEGER ,						  
	PRIMARY KEY ("kidID", "bookID")								   
);		

		CREATE TABLE "Message" (
 	"messageID" SERIAL PRIMARY KEY,
	"date" DATE NOT NULL,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL,
	subject TEXT NOT NULL,
 	content TEXT NOT NULL
);
	CREATE TABLE "GetMessage" (
 	"messageID" INTEGER REFERENCES "Message" ("messageID") NOT NULL ,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL,
	checked CHAR(1) CHECK (checked IN ('Y','N')) NOT NULL,
		PRIMARY KEY ("messageID", "personID")	
);					 
-- a table for session to store sessions persistently
CREATE TABLE "UserSessions" ( 
  	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "UserSessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

						