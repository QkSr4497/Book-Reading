$(document).ready(function () {
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#myModal').modal('show');
    $('#quizContainer').hide();
    $('#quizResults').hide();

    const quizID = $('#inputQuizID').val();
    getQuizData(quizID);

});


// globals
var quizData = {};
var quizMarked = {};
var quizGrade = 0;
var pointEarned = 0;


$('#startQuiz').on('click', function () {
    checkQuizStatus(quizData.quizID);
    $('#quizContainer').show();
    
    
    buildQuiz();
    translateThePage();    // function from language.js
    jQuery(function ($) {
        var quizTime = quizData.timeLeft ,
            display = $('#time');
        startTimer(quizTime, display);
    });
});

$('#quitQuiz').on('click', function () {
    $(location).attr('href', '/kid/quizes')
});


const checkQuizStatus = (quizID) => {
    var url = '/kid/quiz/checkQuizStatus';
    $.ajax({
        url: url,
        type: 'POST',
        data: { quizID: quizID },
        async: false,
        success: function (result) {
            quizData.quizStatus = result.quizStatus;
            quizData.quizFinished = result.quizFinished;
            quizData.timeLeft = result.timeLeft;
        },
        error: function (err) {

        }
    });
}


const getQuizData = (quizID) => {
    $("#startQuiz").attr("disabled", true);
    var url = '/kid/quiz/getQuizData';
    $.ajax({
        url: url,
        type: 'POST',
        data: { quizID: quizID },
        success: function (result) {
            quizData = result;
            $("#startQuiz").attr("disabled", false);
            $("#rollerStartQuiz").hide();
        },
        error: function (err) {

        }
    });
}

function buildQuiz() {    // update the books select
    var numOfQuestions = quizData.totalQuestionsNum;
    //console.log(numOfQuestions);

    var myString;
    for (var qNum = 1; qNum <= numOfQuestions; qNum++) {
        var currQst = quizData.questions[qNum - 1];
        //console.log(currQst);
        myString = `
                <div class="wrap question" id="q${qNum}">
                    <div class="background">
                        <div class="questionTitle">   
                            <h1 class="qTitle" id="q${qNum}-title"><span class="lang" key="question">שאלה </span> ${qNum}</h1>
                        </div>

                        <p class="pTitles" id="q${qNum}content">
                            <span><img src="${currQst.questionPic}" alt="" id="q${qNum}pic"></span>
                            <span dir="rtl">${currQst.questionContent}</span>
                        </p>
                `;
        var numOfAnswers = currQst.answersNum;


        for (var aNum = 1; aNum <= numOfAnswers; aNum++) {

            currAns = currQst.answers[aNum - 1];
            if (currQst.questType == 'single') { // if single Type Question then radio options
                myString += `
                        <div class="mainDivAns" id="q${qNum}ans${aNum}div">
                            <div class="divAns"><img src="${currAns.answerPic}" alt="" id="q${qNum}ans${aNum}pic"></div>
                            <div class="divAns">
                                <p> <span><span class="lang" key="answer">תשובה </span> ${aNum}:</span> ${currAns.answerContent}</p>
                            </div>
                            <div class="divAns"><input type="radio" id="q${qNum}ans${aNum}radio" name="q${qNum}ansRadio" value="${aNum}" /></div>
                        </div>
            `;
            }
            else if (currQst.questType == 'multi') {  // if multiple Type Question then checkbox options
                var checked = false;
                myString += `
                        <div class="mainDivAns" id="q${qNum}ans${aNum}div">
                            <div class="divAns"><img src="${currAns.answerPic}" alt="" id="q${qNum}ans${aNum}pic"></div>
                            <div class="divAns">
                                <p> <span><span class="lang" key="answer">תשובה </span> ${aNum}:</span> ${currAns.answerContent}</p>
                            </div>
                            <div class="divAns"><input id="q${qNum}ans${aNum}checkbox" type="checkbox" name="q${qNum}ans${aNum}checkbox" value="${checked}" /></div>
                        </div>
                `;
            }
        }
        $('#quizForm').append(myString);
    }
}


$('#submintBtn').on('click', function () {
    //checkAllInputs();
    finishQuiz();

    
    //console.log(quizData);
});


$(document.body).on('change','input[type=checkbox]', function(event) { // update checkbox value
    var targetID = event.target.id;
    //alert($(`#${targetID}`).is(":checked"));
    var newState = $(`#${targetID}`).is(":checked");
    $(`#${targetID}`).val(newState);
    //alert($(`#${targetID}`).val());
});

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            finishQuiz();
            timer = 10000;
        }
    }, 1000);
}

function finishQuiz() {
    $('#quizResults').show();
    $('#timeDiv').hide();
    $('#submintBtn').hide();
    quizMarked.totalQuestionsNum = quizData.totalQuestionsNum;
    var numOfQuestions = quizData.totalQuestionsNum;
    for (var qNum = 1; qNum <= numOfQuestions; qNum++) {
        currQst = quizData.questions[qNum - 1];
        var numOfAnswers = currQst.answersNum;
        for (var aNum = 1; aNum <= numOfAnswers; aNum++) {
            currAns = currQst.answers[aNum - 1];
            if (currQst.questType == 'single') {
                var isChecked = $(`#q${qNum}ans${aNum}radio`).is(":checked");
                currAns = currQst.answers[aNum - 1];
                
                currAns.isMarked = (isChecked) ? 'Y' : 'N';
                currAns.grade = (currAns.isCorrect == currAns.isMarked);
            }
            else if (currQst.questType == 'multi') {
                var isChecked = $(`#q${qNum}ans${aNum}checkbox`).is(":checked");
                currAns = currQst.answers[aNum - 1];
                currAns.isMarked = (isChecked) ? 'Y' : 'N';
                currAns.grade = (currAns.isCorrect == currAns.isMarked);
            }
        }
    }
    markResults();
    $('#quizForm *').prop("disabled", true);
}

function markResults() {
    var score = 0;
    quizMarked.totalQuestionsNum = quizData.totalQuestionsNum;
    var numOfQuestions = quizData.totalQuestionsNum;
    for (var qNum = 1; qNum <= numOfQuestions; qNum++) {
        currQst = quizData.questions[qNum - 1];
        var numOfAnswers = currQst.answersNum;
        for (var aNum = 1; aNum <= numOfAnswers; aNum++) {
            currAns = currQst.answers[aNum - 1];
            if (currAns.isMarked == 'Y' && currAns.grade == true) {
                $(`#q${qNum}ans${aNum}div`).addClass("divCorrectAns");
            }
            else if (currAns.isMarked == 'Y' && currAns.grade == false) {
                $(`#q${qNum}ans${aNum}div`).addClass("divWrongAns");
            }
            else if (currAns.isMarked == 'N' && currAns.grade == false) {
                $(`#q${qNum}ans${aNum}div`).addClass("divUnmarkedAns");
            }

            if (currAns.grade == true && currAns.isMarked == 'Y' && currQst.questType == 'single') {
                score += (1/(numOfQuestions) ) * 100;
            }
            // else if (currAns.grade == false && currAns.isMarked == 'Y' && currQst.questType == 'single') {
                
 
            // }
            else if (currAns.grade == true && currQst.questType == 'multi') {
                score += (1/(numOfQuestions*numOfAnswers) ) * 100;
                //alert(`${currQst.questType} q${qNum}ans${aNum} scored ${(1/(numOfQuestions*numOfAnswers) ) * 100}`);
            }
            // else if (currAns.grade == false && currQst.questType == 'multi') {
                
            // }
        }
    }
    gradeTheQuiz(score);
}

function gradeTheQuiz(score) {
    score = Math.floor(score);
    quizGrade = score;
    var numOfQuestions = quizData.totalQuestionsNum;
    $('#quizGrade').text(score);
    pointEarned = numOfQuestions * score;
   // $('#quizPointsEarned').text(pointEarned + ' נקודות');
    $('#quizPointsEarned').text(pointEarned);
    updateGradeAndPointsDB();
    sendNotificationToSupervisors();
    $(window).scrollTop(0);
    
}

const updateGradeAndPointsDB = () => {
    var kidID = $('#inputKidID').val();
    var quizID = quizData.quizID;
    var url = '/kid/quiz/updateGradeAndPoints';
    $.ajax({
        url: url,
        type: 'POST',
        data: { kidID: kidID, quizID: quizID, quizGrade: quizGrade, pointEarned: pointEarned },
        success: function (result) {
        },
        error: function (err) {
        }
    });
}

const sendNotificationToSupervisors = () => {
    var kidID = $('#inputKidID').val();
    var typeName = 'quiz';
    var userName = kidData.userName;
    var content = ` ${userName} קיבל/ה ${quizGrade} במבחן "${quizData.quizTitle}" על הספר "${quizData.bookName}". במבחן זה ${userName} צבר/ה ${pointEarned} נקודות.`
    var url = '/kid/notifyQuizResults';
    $.ajax({
        url: url,
        type: 'POST',
        data: { senderID: kidID, content: content, typeName: typeName },
        success: function (result) {
        },
        error: function (err) {
        }
    });
}


