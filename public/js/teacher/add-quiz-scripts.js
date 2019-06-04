$(document).ready(function () {
    updateBooksList();   // update the books select
    populateDurationSelect();   // update the duration select
    $("#bookPic").hide();

    var question = { questionNum: 1, ansNum: 2 };  // the quiz starts with the first question
    quizQuestions.push(question);   // adding the first question to the quizStructure

    removeAnsBtnElement = $('#removeAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    removeQuestionBtnElement = $('#removeQuestionBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements

    var numOfQuestions = quizQuestions.length;
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;
    var selectedType = $( `#q${numOfQuestions}Type` ).val();
    updateCorrectAns(numOfQuestions, ansNum, selectedType);

    // console.log('quizQuestions :' + JSON.stringify(quizQuestions));
    // console.log('quizQuestions[0] :' + JSON.stringify(quizQuestions[0]));

});

// global variables
var booksArray;
var quizQuestions = []; // holds the questions structure of the quiz
var removeAnsBtnElement, removeQuestionBtnElement;


function updateBooksList() {    // update the books select
    requestAllBooks((error, books) => {
        booksArray = books;
        var $mySelect = $('#booksList');
        $.each(books, function (key, value) {  // each item in books array
            var $option = $("<option/>", {
                value: key,
                text: value.bookName
            });
            $mySelect.append($option);  //  appending option to the select
        });
        // console.log('books recieved: ' + JSON.stringify(books)); 
    });
}

const requestAllBooks = (callback) => {
    var url = '/query/getAllBooks';
    $.ajax({
        url: url,
        type: 'GET',
        success: function (result) {
            callback(undefined, result);
        },
        error: function (err) {
            callback('error requsting the Book List!', undefined);
        }
    });
}

$('#booksList').on('change', function () {
    var chosenBookName = booksArray[this.value].bookName;;
    var picPath = booksArray[this.value].pic;
    console.log(picPath);
    // console.log(JSON.stringify(booksArray[this.value]));
    $('#bookPic').attr('src', picPath);
    $("#booksList option[value='title']").remove();
    $('#bookPic').show();
    $("#formTitle").text("Creating Quiz for: " + chosenBookName);
});

$('#bookPic').on('error', function (e) {
    $(this).attr('src', '/img/books/default-book.gif');
});


function readURL(input, element) { // allow preview of uploaded pic
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            element.attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#quizPicInput").change(function () {
    var select = $("#quizPic");
    readURL(this, select);
});

$("#q1PicInput").change(function () {
    var select = $("#q1Pic");
    readURL(this, select);
});

$("#q1Ans1PicInput").change(function () {
    var select = $("#q1Ans1Pic");
    readURL(this, select);
});

$("#q1Ans2PicInput").change(function () {
    var select = $("#q1Ans2Pic");
    readURL(this, select);
});


function populateDurationSelect() { // input minutes options to the duration select
    var minutes = [];
    for (var i = 1; i <= 20; i++) {
        minutes.push(i);
    }

    var list = $("#timeMinSelect");
    $.each(minutes, function (index, item) {
        list.append(new Option(item, item.value));
    });
}

$('#timeMinSelect').on('change', function () {
    $("#timeMinSelect option[value='title']").remove();
});

$('#langSelect').on('change', function () {
    $("#langSelect option[value='title']").remove();
});



$(document.body).on('change','.questionTypeClass', function() { 
    console.log('clicked');
    var numOfQuestions = quizQuestions.length;
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;
    var selectedType = $( `#q${numOfQuestions}Type` ).val();
    updateCorrectAns(numOfQuestions, ansNum, selectedType);
});


$('#addAnsBtn').click(function () {
    var numOfQuestions = quizQuestions.length;
    quizQuestions[numOfQuestions - 1].ansNum++;
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;
    var selectedType = $( `#q${numOfQuestions}Type` ).val();
    
    console.log('numOfQuestions ' + numOfQuestions);
    console.log('quizQuestions :' + JSON.stringify(quizQuestions));

    var correctRadioAns =  $(`#q${numOfQuestions} .radio`).detach();    // using detach saves the jQuery data and events associated with the removed elements
    var correctCheckboxAns =  $(`#q${numOfQuestions} .checkbox`).detach();    // using detach saves the jQuery data and events associated with the removed elements

    var myString = `<div id="q${numOfQuestions}ans${ansNum}">
    <p class="pTitles">
    <input name="q${numOfQuestions}ans${ansNum}" type="text" class="section" placeholder="Answer ${ansNum} Content" required>
    *Answer ${ansNum}:
</p>

<p class="pTitles">
    <img src="#" alt="" id="q${numOfQuestions}Ans${ansNum}Pic">
    <input type="file" id="q${numOfQuestions}Ans${ansNum}PicInput" name="q${numOfQuestions}Ans${ansNum}PicInput" class="section" accept="image/*"
        alt="your image" style="width: 50%;" />
    Answer ${ansNum} Picture:
</p>
</div>`
    $('.background:last').append(myString);

    // console.log(myString);

    correctRadioAns.appendTo('.background:last'); // appending the correctRadioAns to the bottom the of question
    correctCheckboxAns.appendTo('.background:last'); // appending the correctCheckboxAns to the bottom the of question
    updateCorrectAns(numOfQuestions, ansNum, selectedType);

    var addAnsBtnElement = $('#addAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    addAnsBtnElement.appendTo('.background:last'); // appending the addAnsBtn to the bottom the of question

    removeAnsBtnElement.appendTo('.background:last'); // appending the removeAnsBtn to the bottom the of question
});

$('#removeAnsBtn').click(function () {
    var numOfQuestions = quizQuestions.length;
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;

    


    $(`#q${numOfQuestions}ans${ansNum}`).remove();  // removing the last option of current Question
    if(ansNum == 3) {
        removeAnsBtnElement = $('#removeAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
        quizQuestions[numOfQuestions - 1].ansNum--;
    }
    else {
        removeAnsBtnElement = $('#removeAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
        removeAnsBtnElement.appendTo('.background:last'); // appending the removeAnsBtn to the bottom the of question

        quizQuestions[numOfQuestions - 1].ansNum--;
    }
    var selectedType = $( `#q${numOfQuestions}Type` ).val();
    updateCorrectAns(numOfQuestions, ansNum - 1, selectedType);

    console.log('numOfQuestions ' + numOfQuestions);
    console.log('quizQuestions :' + JSON.stringify(quizQuestions));
});

$('#addQuestionBtn').click(function () {
    var question = { questionNum: quizQuestions.length + 1, ansNum: 2 };  // the quiz starts with the first question
    quizQuestions.push(question);   // adding the first question to the quizStructure
    var numOfQuestions = quizQuestions.length;
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;

    $(`#q${numOfQuestions - 1} input`).prop("disabled", true);  // disable all inputs of the previous question

    var myString = `
    <div class="wrap question" id="q${numOfQuestions}">
                <div class="background">
                    <div class="questionTitle">
                        <h1 class="qTitle" id="q${numOfQuestions}-title">Question ${numOfQuestions}</h1>
                    </div>

                    <p class="pTitles">
                        <input name="q${numOfQuestions}" type="text" class="section" placeholder="Question Content" required>
                        *Content:
                    </p>

                    <p class="pTitles">
                        <img src="#" alt="" id="q${numOfQuestions}Pic">
                        <input type="file" id="q${numOfQuestions}PicInput" name="q${numOfQuestions}PicInput" class="section" accept="image/*"
                            alt="your image" style="width: 50%;" />
                        Q${numOfQuestions} Picture:
                    </p>

                    <p class="pTitles">
                        <select required id="q${numOfQuestions}Type" class="section questionTypeClass">
                            <option selected="selected"  value="single">Single Choice Question</option>
                            <option value="multi">Multiple Choice Question</option>
                        </select>
                        *Question Type:
                    </p>

                    <div id="q${numOfQuestions}ans1">
                        <p class="pTitles">
                            <input name="q${numOfQuestions}ans1" type="text" class="section" placeholder="Answer 1 Content" required>
                            *Answer 1:
                        </p>

                        <p class="pTitles">
                            <img src="#" alt="" id="q${numOfQuestions}Ans1Pic">
                            <input type="file" id="q${numOfQuestions}Ans1PicInput" name="q${numOfQuestions}Ans1PicInput" class="section"
                                accept="image/*" alt="your image" style="width: 50%;" />
                            Answer 1 Picture:
                        </p>
                    </div>

                    <div id="q${numOfQuestions}ans2">
                        <p class="pTitles">
                            <input name="q${numOfQuestions}ans2" type="text" class="section" placeholder="Answer 2 Content" required>
                            *Answer 2:
                        </p>

                        <p class="pTitles">
                            <img src="#" alt="" id="q${numOfQuestions}Ans2Pic">
                            <input type="file" id="q${numOfQuestions}Ans2PicInput" name="q${numOfQuestions}Ans2PicInput" class="section"
                                accept="image/*" alt="your image" style="width: 50%;" />
                            Answer 2 Picture:
                        </p>
                    </div>
                </div>
                 
            </div>
    `;
    $('#quizForm').append(myString);

    var selectedType = $( `#q${numOfQuestions}Type` ).val();
    console.log('adding question selectedType:' + selectedType)
    updateCorrectAns(numOfQuestions, ansNum, selectedType);

    // console.log(myString);

    var addAnsBtnElement = $('#addAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    addAnsBtnElement.appendTo('.background:last'); // appending the addAnsBtn to the bottom the of question

    var ansNum = quizQuestions[numOfQuestions - 2].ansNum;
    if (ansNum > 2) {


        removeAnsBtnElement = $('#removeAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    }
    // removeAnsBtnElement.appendTo('.background:last'); // appending the removeAnsBtn to the bottom the of question

    

    var addQuestionBtnElement = $('#addQuestionBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    addQuestionBtnElement.appendTo('#quizForm'); // appending the addAnsBtn to the bottom the of question

    removeQuestionBtnElement.appendTo('#quizForm'); // appending the addAnsBtn to the bottom the of question

    var submintBtnElement = $('#submintBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    submintBtnElement.appendTo('#quizContainer'); // appending the addAnsBtn to the bottom the of question
});


$('#removeQuestionBtn').click(function () {
    var addAnsBtnElement = $('#addAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    var addQuestionBtnElement = $('#addQuestionBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    var submintBtnElement = $('#submintBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    removeQuestionBtnElement =  $('#removeQuestionBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements

    var numOfQuestions = quizQuestions.length;
    $(`#q${numOfQuestions}`).remove();  // removing the last Question from the quiz
    quizQuestions.pop();
    numOfQuestions--;

    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;

    $(`#q${numOfQuestions} input`).prop("disabled", false);  // enbale all inputs of the last question the remains after the removal


    addAnsBtnElement.appendTo('.background:last'); // appending the addAnsBtn to the bottom the of question
    if (ansNum > 2) { 
        removeAnsBtnElement.appendTo('.background:last'); // appending the removeAnsBtn to the bottom the of question
   }
    addQuestionBtnElement.appendTo('#quizForm'); // appending the addQuestionBtn to the bottom of form
    if (numOfQuestions > 1) {
        removeQuestionBtnElement.appendTo('#quizForm'); // appending the removeQuestionBtnElement to the bottom of form
    
    }
    
    
    submintBtnElement.appendTo('#quizContainer'); // appending the submintBtn to the bottom the of quizContainer
});

function updateCorrectAns(questionNum, numOfAnswers, questionType) {
    console.log('questionNum: ' +questionNum,' numOfAnswers: '+ numOfAnswers,' questionType: '+  questionType);
    $(`#q${questionNum} .checkbox`).empty();   // clearing the content of <p class="pTitles checkbox">
    $(`#q${questionNum} .radio`).empty();   // clearing the content of <p class="pTitles radio">
  

    if (questionType == 'single') { // if single Type Question then radio options
        var radionString = `<p class="pTitles radio">`;
        for(var i = 1; i <= numOfAnswers; i++) {
            radionString += `
            <label for="q${questionNum}ans${i}radio">${i}</label>
            <input type="radio" id="q${questionNum}ans${i}radio" name="q${questionNum}ansRadio" value="${i}" />
            `;
        }
        radionString += '*Correct Answer:';
        radionString += `</p>`; 
        $(radionString).insertAfter($('.pTitles').last());
    }
    else if (questionType == 'multi') {  // if multiple Type Question then checkbox options
        var checkboxString = `<p class="pTitles checkbox">`;
        for(var i = 1; i <= numOfAnswers; i++) {
            checkboxString += `
            <label for="q${questionNum}ans${i}checkbox" style="word-wrap:break-word">
                <input id="q${questionNum}ans${i}checkbox" type="checkbox" name="q${questionNum}ans${i}checkbox" value="${i}" />${i}
            </label>
            `;
        }
        checkboxString += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Correct Answer:';
        checkboxString += `</p>`; 
        $(checkboxString).insertAfter($('.pTitles').last());
    }
}


// $('#booksList').on({
//     'click': function(){
//         console.log(JSON.stringify(booksArray));
//         $('#my_image').attr('src','second.jpg');
//     }
// });