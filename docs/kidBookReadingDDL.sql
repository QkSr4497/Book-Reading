CREATE TABLE "Person" (
	"personID" SERIAL PRIMARY KEY,
	"userName" TEXT NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	pwd TEXT NOT NULL 
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

CREATE TABLE "Post" (
 	"postID" SERIAL PRIMARY KEY,
 	content TEXT NOT NULL
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
	pic TEXT NOT NULL,
	duration INTEGER NOT NULL,
	"quizEnabled" CHAR(1) CHECK ("quizEnabled" IN ('Y','N')) NOT NULL
);
						   
CREATE TABLE "Question" (
 	"quizID" INTEGER REFERENCES "Quiz" ("quizID"),
 	"questionNum" Serial NOT NULL,
	content TEXT NOT NULL,
	pic TEXT NOT NULL,
	"questType" TEXT CHECK ("questType" IN ('multi','single')) NOT NULL,
	PRIMARY KEY ("quizID", "questionNum")
);
					 
CREATE TABLE "Answer" (
 	"quizID" INTEGER,
	"questionNum" INTEGER,
 	"answerNum" Serial NOT NULL,
	content TEXT NOT NULL,
	pic TEXT NOT NULL,
	"isCorrect" CHAR(1) CHECK ("isCorrect" IN ('Y','N')) NOT NULL,
	FOREIGN KEY ("quizID", "questionNum") REFERENCES "Question" ("quizID", "questionNum"),
	PRIMARY KEY ("quizID", "questionNum", "answerNum")									   
);
 
CREATE TABLE "Friend" (
 	"personA" INTEGER REFERENCES "Person" ("personID"),
	"friendOfA" INTEGER REFERENCES "Person" ("personID"),
	approved CHAR(1) CHECK (approved IN ('Y','N')) NOT NULL,
	PRIMARY KEY ("personA", "friendOfA")									   
);
							
CREATE TABLE "Teaches" (
 	"teacherID" INTEGER REFERENCES "Teacher" ("teacherID"),
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"groupName" TEXT NOT NULL,
	PRIMARY KEY ("teacherID", "kidID")									   
);
							
CREATE TABLE "Supervise" (
 	"supervisorID" INTEGER REFERENCES "Supervisor" ("supervisorID"),
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	PRIMARY KEY ("supervisorID", "kidID")									   
);
					 
CREATE TABLE "Cart" (
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"gameID" INTEGER REFERENCES "Game" ("gameID"),
	PRIMARY KEY ("kidID", "gameID")									   
);					 
	

CREATE TABLE "Account" (
	"operationID" SERIAL PRIMARY KEY,
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"gameID" INTEGER REFERENCES "Game" ("gameID"),
	"quizID" INTEGER REFERENCES "Quiz" ("quizID"),
	type TEXT CHECK (type IN ('in', 'out')) NOT NULL							   
);	

CREATE TABLE "HasGames" (
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"gameID" INTEGER REFERENCES "Game" ("gameID"),
	PRIMARY KEY ("kidID", "gameID")									   
);							   
CREATE TABLE "Note" (
 	"noteID" SERIAL PRIMARY KEY,
	"date" DATE NOT NULL,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL,
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	title TEXT NOT NULL,
 	content TEXT NOT NULL,
	type TEXT CHECK (type IN ('public','private')) NOT NULL
);
	CREATE TABLE "Image" (
	"imageID" SERIAL PRIMARY KEY
);
	
	CREATE TABLE "ImageNote" (
	"noteID" INTEGER REFERENCES "Note" ("noteID") NOT NULL,
	"imageID" INTEGER REFERENCES "Image" ("imageID")NOT NULL,
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
							
CREATE TABLE "Likes" (
	"personID" INTEGER REFERENCES "Person" ("personID"),
	"postID" INTEGER REFERENCES "Post" ("postID"),
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
	"personID" INTEGER REFERENCES "Person" ("personID") UNIQUE,
	PRIMARY KEY ("bookID", "quizID")									   
);								

CREATE TABLE "BookAssigned" (
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	"teacherID" INTEGER REFERENCES "Teacher" ("teacherID"),
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	PRIMARY KEY ("bookID", "teacherID", "kidID")									   
);
							
CREATE TABLE "KidBook" (
	"kidID" INTEGER REFERENCES "Kid" ("kidID"),
	"bookID" INTEGER REFERENCES "Book" ("bookID"),
	type TEXT CHECK (type IN ('intrested', 'reading', 'finished')) NOT NULL,
	review TEXT,
	rating INTEGER ,						  
	PRIMARY KEY ("kidID", "bookID")								   
);		

-- a table for session to store sessions persistently
CREATE TABLE "UserSessions" ( 
  	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "UserSessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

	CREATE TABLE "Group" (
	"groupID" SERIAL NOT NULL PRIMARY KEY,
	"groupName" varchar NOT NULL ,
	"pic"  TEXT,
	"personID" INTEGER REFERENCES "Person" ("personID") NOT NULL					  							   
);	
	CREATE TABLE "InGroup" (
	"groupID" INTEGER REFERENCES "Group" ("groupID"),
	"personID" INTEGER REFERENCES "Person" ("personID"),
	type TEXT CHECK (type IN ('kid', 'admin')) NOT NULL,
	PRIMARY KEY ("groupID", "personID")								   
);							