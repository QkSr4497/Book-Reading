$(document).ready(function () {
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#myModal').modal('show');
    $('#quizContainer').hide();

    const quizID = $('#inputQuizID').val();
    getQuizData(quizID);


});


// globals
var quizData = {};
var quizMarked = {};


$('#startQuiz').on('click', function () {
    $('#quizContainer').show();
    buildQuiz();

    jQuery(function ($) {
        var quizTime = 60 * quizData.duration,
            display = $('#time');
        startTimer(quizTime, display);
    });
});

$('#quitQuiz').on('click', function () {
    $(location).attr('href', '/kid/quizes')
});




const getQuizData = (quizID) => {
    var url = '/kid/quiz/getQuizData';
    $.ajax({
        url: url,
        type: 'POST',
        data: { quizID: quizID },
        success: function (result) {
            quizData = result;
        },
        error: function (err) {

        }
    });
}

function buildQuiz() {    // update the books select
    //console.log(quizData);
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
                            <h1 class="qTitle" id="q${qNum}-title">שאלה ${qNum}</h1>
                        </div>

                        <p class="pTitles" id="q${qNum}content">
                            <span><img src="${currQst.questionPic}" alt="" id="q${qNum}pic"></span>
                            ${currQst.questionContent}
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
                                <p> <span>תשובה ${aNum}:</span> ${currAns.answerContent}</p>
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
                                <p> <span>תשובה ${aNum}:</span> ${currAns.answerContent}</p>
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
    markResults();
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
        }
    }, 1000);
}

function finishQuiz() {
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
}

function markResults() {
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
        }
    }
}


