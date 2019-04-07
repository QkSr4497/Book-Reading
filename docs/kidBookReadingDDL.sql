CREATE TABLE Person (
	personID SERIAL PRIMARY KEY,
	userName TEXT NOT NULL,
	firstName TEXT NOT NULL,
	lastName TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	pwd TEXT NOT NULL 
); 

CREATE TABLE Admin (
	adminID INTEGER REFERENCES Person (personID) PRIMARY KEY
); 

CREATE TABLE Avatar (
 	avatarID SERIAL PRIMARY KEY,
 	name TEXT NOT NULL,
	pic TEXT NOT NULL
); 

CREATE TABLE Kid (
	kidID INTEGER REFERENCES Person (personID) PRIMARY KEY,
	birthDate DATE NOT NULL,
	points INTEGER DEFAULT 100,
	avatarID INTEGER REFERENCES Avatar (avatarID)
); 

CREATE TABLE Teacher (
	teacherID INTEGER REFERENCES Person (personID) PRIMARY KEY,
	phone TEXT NOT NULL
); 

CREATE TABLE Supervisor (
	supervisorID INTEGER REFERENCES Person (personID) PRIMARY KEY,
	phone TEXT NOT NULL
); 

CREATE TABLE Post (
 	postID SERIAL PRIMARY KEY,
 	content TEXT NOT NULL
); 

CREATE TABLE Note (
 	noteID SERIAL PRIMARY KEY,
 	content TEXT NOT NULL,
	type TEXT CHECK (type IN ('public','private')) NOT NULL
);

CREATE TABLE Category (
 	categoryID SERIAL PRIMARY KEY,
 	name TEXT NOT NULL
);

CREATE TABLE Book (
 	bookID SERIAL PRIMARY KEY,
 	name TEXT NOT NULL,
	pic TEXT NOT NULL
);
					 
CREATE TABLE Game (
 	gameID SERIAL PRIMARY KEY,
 	name TEXT NOT NULL,
	pic TEXT NOT NULL,
	price INTEGER CHECK (price > 0) NOT NULL,
	link TEXT NOT NULL
);
					 
CREATE TABLE Quiz (
 	quizID SERIAL PRIMARY KEY,
 	language TEXT NOT NULL,
	pic TEXT NOT NULL,
	duration INTEGER NOT NULL,
	enabled CHAR(1) CHECK (enabled IN ('Y','N')) NOT NULL
);
						   
CREATE TABLE Question (
 	quizID INTEGER REFERENCES Quiz (quizID),
 	questionNum Serial NOT NULL,
	content TEXT NOT NULL,
	pic TEXT NOT NULL,
	type TEXT CHECK (type IN ('multi','single')) NOT NULL,
	PRIMARY KEY (quizID, questionNum)
);
					 
CREATE TABLE Answer (
 	quizID INTEGER,
	questionNum INTEGER,
 	answerNum Serial NOT NULL,
	content TEXT NOT NULL,
	pic TEXT NOT NULL,
	isCorrect CHAR(1) CHECK (isCorrect IN ('Y','N')) NOT NULL,
	FOREIGN KEY (quizID, questionNum) REFERENCES Question (quizID, questionNum),
	PRIMARY KEY (quizID, questionNum, answerNum)									   
);
 
CREATE TABLE Friend (
 	personA INTEGER REFERENCES Person (personID),
	friendOfA INTEGER REFERENCES Person (personID),
	approved CHAR(1) CHECK (approved IN ('Y','N')) NOT NULL,
	PRIMARY KEY (personA, friendOfA)									   
);
							
CREATE TABLE Teaches (
 	teacherID INTEGER REFERENCES Teacher (teacherID),
	kidID INTEGER REFERENCES Kid (KidID),
	groupName TEXT NOT NULL,
	PRIMARY KEY (teacherID, kidID)									   
);
							
CREATE TABLE Supervise (
 	supervisorID INTEGER REFERENCES Supervisor (supervisorID),
	kidID INTEGER REFERENCES Kid (KidID),
	PRIMARY KEY (supervisorID, kidID)									   
);
					 
CREATE TABLE Cart (
	kidID INTEGER REFERENCES Kid (KidID),
	gameID INTEGER REFERENCES Game (gameID),
	PRIMARY KEY (kidID, gameID)									   
);					 
						   
CREATE TABLE HasGames (
	kidID INTEGER REFERENCES Kid (KidID),
	gameID INTEGER REFERENCES Game (gameID),
	PRIMARY KEY (kidID, gameID)									   
);							   
					 
CREATE TABLE WritesPost (
	personID INTEGER REFERENCES Person (personID),
	postID INTEGER REFERENCES Post (postID),
	postDate DATE NOT NULL,
	PRIMARY KEY (personID, postID)									   
);

CREATE TABLE WritesComment (
	personID INTEGER REFERENCES Person (personID),
	postID INTEGER REFERENCES Post (postID),
	commentDate DATE NOT NULL,
	PRIMARY KEY (personID, postID)									   
);		
							
CREATE TABLE Likes (
	personID INTEGER REFERENCES Person (personID),
	postID INTEGER REFERENCES Post (postID),
	PRIMARY KEY (personID, postID)									   
);								

CREATE TABLE WritesNote (
	bookID INTEGER REFERENCES Book (bookID),
	noteID INTEGER REFERENCES Note (noteID),
	personID INTEGER REFERENCES Person (personID) UNIQUE,
	PRIMARY KEY (bookID, noteID)									   
);
							
CREATE TABLE BookHas (
	bookID INTEGER REFERENCES Book (bookID),
	categoryID INTEGER REFERENCES Category (categoryID),
	PRIMARY KEY (bookID, categoryID)									   
);							
							
CREATE TABLE WritesQuiz (
	bookID INTEGER REFERENCES Book (bookID),
	quizID INTEGER REFERENCES Quiz (quizID),
	personID INTEGER REFERENCES Person (personID) UNIQUE,
	PRIMARY KEY (bookID, quizID)									   
);								

CREATE TABLE BookAssigned (
	bookID INTEGER REFERENCES Book (bookID),
	teacherID INTEGER REFERENCES Teacher (teacherID),
	kidID INTEGER REFERENCES Kid (kidID),
	PRIMARY KEY (bookID, teacherID, kidID)									   
);
							
CREATE TABLE KidBook (
	kidID INTEGER REFERENCES Kid (KidID),
	bookID INTEGER REFERENCES Book (bookID),
	type TEXT CHECK (type IN ('intrested', 'reading', 'finished')) NOT NULL,
	review TEXT,
	rating INTEGER CHECK ( rating >= 1 && rating <= 5 ),						  
	PRIMARY KEY (kidID, bookID)								   
);							
							