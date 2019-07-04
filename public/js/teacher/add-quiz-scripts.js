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
    var selectedType = $( `#q${numOfQuestions}type` ).val();
    updateCorrectAns(numOfQuestions, ansNum, selectedType);

    $(`#q1totalAnsNum`).val(ansNum);

    // console.log('quizQuestions :' + JSON.stringify(quizQuestions));
    // console.log('quizQuestions[0] :' + JSON.stringify(quizQuestions[0]));

});

// global variables
var booksArray;
var quizQuestions = []; // holds the questions structure of the quiz
var removeAnsBtnElement, removeQuestionBtnElement;


$('#submintBtn').on('click', function () {
    checkAllInputs();
});



//   ==========Check all inputs for valid info ================
function checkAllInputs() {
    var numOfQuestions = quizQuestions.length;
    // var check1 = something();
    
    // if (!check1 || !check2 || !check3 || !check4 || !check5 || !check6 || !check7 || !check8) {
    //     window.alert("Please Correct all Inputs with red comment");
    // }
    // else {
    //     $("#formId").submit();
    // }

    $('#booksList option').val(function(){  // sending the bookID and not the name 
        return $(this).attr('bookID');
     });

     $('#totalQuestionsNum').val(function(){  // sending the bookID and not the name 
        return numOfQuestions;
     });
     $('#quizForm *').prop("disabled", false);

    // $('#quizForm input, #quizForm select').each(   // printing all quizForm inputs for debugging
    //     function (index) {
    //         var input = $(this);
    //         console.log('Type: ' + input.attr('type') + ' Name: ' + input.attr('name') + ' Value: ' + input.val());
    //     }
    // );
    $("#quizForm").submit();
}


function updateBooksList() {    // update the books select
    requestAllBooks((error, books) => {
        booksArray = books;
        console.log(JSON.stringify(books));
        var $mySelect = $('#booksList');
        $.each(books, function (key, value) {  // each item in books array
            var $option = $("<option/>", {
                value: key,
                text: value.bookName,
                bookID: value.bookID
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
    

    $("#booksList option").each(function () {
        console.log($(this).attr('bookID'))
    });


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

// $("#quizPicInput").change(function () {
//     var select = $("#quizPic");
//     readURL(this, select);
// });

// $("#q1picInput").change(function () {
//     var select = $("#q1pic");
//     readURL(this, select);
// });

// $("#q1ans1picInput").change(function () {
//     var select = $("#q1ans1pic");
//     readURL(this, select);
// });

// $("#q1ans2picInput").change(function () {
//     var select = $("#q1ans2pic");
//     readURL(this, select);
// });


$(document).on('change', '.imgPrevInput', function(event){  // preview of image next to file input
    var input = event.target;   // input type file
    var element = $(this).prev();   // element is the img element
    readURL(input, element);
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
    var selectedType = $( `#q${numOfQuestions}type` ).val();
    updateCorrectAns(numOfQuestions, ansNum, selectedType);
});


$(document.body).on('change','.checkbox', function() { 
    var numOfQuestions = quizQuestions.length;
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;
    updateCorrectAnsChecked(numOfQuestions, ansNum);
});


$('#addAnsBtn').click(function () {
    var numOfQuestions = quizQuestions.length;
    quizQuestions[numOfQuestions - 1].ansNum++;
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;
    var selectedType = $( `#q${numOfQuestions}type` ).val();
    $(`#q${numOfQuestions}totalAnsNum`).val(ansNum);
  
    
    console.log('numOfQuestions ' + numOfQuestions);
    console.log('quizQuestions :' + JSON.stringify(quizQuestions));

    var correctRadioAns =  $(`#q${numOfQuestions} .radio`).detach();    // using detach saves the jQuery data and events associated with the removed elements
    var correctCheckboxAns =  $(`#q${numOfQuestions} .checkbox`).detach();    // using detach saves the jQuery data and events associated with the removed elements

    var myString = `
    <div id="q${numOfQuestions}ans${ansNum}div">
        <p class="pTitles">
            <input name="q${numOfQuestions}ans${ansNum}content" id="q${numOfQuestions}ans${ansNum}content" type="text" class="section" placeholder="תוכן תשובה ${ansNum} " required>
            *:תשובה  ${ansNum}
         </p>

        <p class="pTitles">
            <img class="imgPrev" src="#" alt="" id="q${numOfQuestions}ans${ansNum}pic">
            <input class="imgPrevInput" type="file" id="q${numOfQuestions}ans${ansNum}picInput" name="q${numOfQuestions}ans${ansNum}picInput" class="section" accept="image/*"
                alt="your image" style="width: 50%;" />
            תמונת תשובה: ${ansNum} 
        </p>
    </div>
    `
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

    $(`#q${numOfQuestions}ans${ansNum}div`).remove();  // removing the last option of current Question
    if(ansNum == 3) {
        removeAnsBtnElement = $('#removeAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
        quizQuestions[numOfQuestions - 1].ansNum--;
    }
    else {
        removeAnsBtnElement = $('#removeAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
        removeAnsBtnElement.appendTo('.background:last'); // appending the removeAnsBtn to the bottom the of question

        quizQuestions[numOfQuestions - 1].ansNum--;
    }

    ansNum = quizQuestions[numOfQuestions - 1].ansNum;
    $(`#q${numOfQuestions}totalAnsNum`).val(ansNum);

    var selectedType = $( `#q${numOfQuestions}type` ).val();
    updateCorrectAns(numOfQuestions, ansNum, selectedType);

    console.log('numOfQuestions ' + numOfQuestions);
    console.log('quizQuestions :' + JSON.stringify(quizQuestions));
});

$('#addQuestionBtn').click(function () {
    var question = { questionNum: quizQuestions.length + 1, ansNum: 2 };  // the quiz starts with the first question
    quizQuestions.push(question);   // adding the first question to the quizStructure
    var numOfQuestions = quizQuestions.length;
    
    var ansNum = quizQuestions[numOfQuestions - 1].ansNum;
    $(`#q${numOfQuestions - 1} input, #q${numOfQuestions - 1} select`).prop("disabled", true);  // disable all inputs of the previous question

    var myString = `
    <div class="wrap question" id="q${numOfQuestions}">
                <div class="background">
                    <div class="questionTitle">
                        <h1 class="qTitle" id="q${numOfQuestions}-title">שאלה ${numOfQuestions}</h1>
                    </div>

                    <p class="pTitles">
                        <input id="q${numOfQuestions}content" name="q${numOfQuestions}content" type="text" class="section" placeholder="תוכן השאלה" required>
                        *:תוכן
                    </p>

                    <p class="pTitles">
                        <img class="imgPrev" src="#" alt="" id="q${numOfQuestions}pic">
                        <input class="imgPrevInput" type="file" id="q${numOfQuestions}picInput" name="q${numOfQuestions}picInput" class="section" accept="image/*"
                            alt="your image" style="width: 50%;" />
                       תמונת שאלה: ${numOfQuestions} 
                    </p>

                    <p class="pTitles">
                        <select required id="q${numOfQuestions}type" class="section questionTypeClass" name="q${numOfQuestions}type" form="quizForm">
                            <option selected="selected"  value="single">תשובה יחידה</option>
                            <option value="multi">תשובות מרובות</option>
                        </select>
                        *:סוג השאלה
                    </p>

                    <div id="q${numOfQuestions}ans1div">
                        <p class="pTitles">
                            <input name="q${numOfQuestions}ans1content" id="q${numOfQuestions}ans1content" type="text" class="section" placeholder="תוכן תשובה 1" required>
                            *:תשובה 1
                        </p>

                        <p class="pTitles">
                            <img class="imgPrev" src="#" alt="" id="q${numOfQuestions}ans1pic">
                            <input class="imgPrevInput" type="file" id="q${numOfQuestions}ans1picInput" name="q${numOfQuestions}ans1picInput" class="section"
                                accept="image/*" alt="your image" style="width: 50%;" />
                                :תמונת תשובה 1
                        </p>
                    </div>

                    <div id="q${numOfQuestions}ans2div">
                        <p class="pTitles">
                            <input name="q${numOfQuestions}ans2content" id="q${numOfQuestions}ans2content" type="text" class="section" placeholder="תוכן תשובה 2" required>
                            *:תשובה 2
                        </p>

                        <p class="pTitles">
                            <img class="imgPrev" src="#" alt="" id="q${numOfQuestions}ans2pic">
                            <input class="imgPrevInput" type="file" id="q${numOfQuestions}ans2picInput" name="q${numOfQuestions}ans2picInput" class="section"
                                accept="imacge/*" alt="your image" style="width: 50%;" />
                                :תמונת תשובה 2
                        </p>
                    </div>
                    <input id="q${numOfQuestions}totalAnsNum" name="q${numOfQuestions}totalAnsNum" type="hidden">
                </div>
                 
            </div>
    `;
    $('#quizForm').append(myString);

    $(`#q${numOfQuestions}totalAnsNum`).val(ansNum);

    var selectedType = $( `#q${numOfQuestions}type` ).val();
    console.log('adding question selectedType:' + selectedType);
    updateCorrectAns(numOfQuestions, ansNum, selectedType);

    // console.log(myString);

    var addAnsBtnElement = $('#addAnsBtn').detach();    // using detach saves the jQuery data and events associated with the removed elements
    addAnsBtnElement.appendTo('.background:last'); // appending the addAnsBtn to the bottom the of question

    ansNum = quizQuestions[numOfQuestions - 2].ansNum;
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

    $(`#q${numOfQuestions - 1} input, #q${numOfQuestions - 1} select`).prop("disabled", false);  // enbale all inputs of the last question the remains after the removal


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
        radionString += '*:תשובה נכונה';
        radionString += `</p>`; 
        $(radionString).insertAfter($('.pTitles').last());
    }
    else if (questionType == 'multi') {  // if multiple Type Question then checkbox options
        var checkboxString = `<p class="pTitles checkbox">`;
        var checked = false;
        for(var i = 1; i <= numOfAnswers; i++) {
            checkboxString += `
            <label for="q${questionNum}ans${i}checkbox" style="word-wrap:break-word">
                <input id="q${questionNum}ans${i}checkbox" type="checkbox" name="q${questionNum}ans${i}checkbox" value="${checked}" />${i}
            </label>
            `;
        }
        checkboxString += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Correct Answer:';
        checkboxString += `</p>`; 
        $(checkboxString).insertAfter($('.pTitles').last());
    }
}

function updateCorrectAnsChecked(questionNum, numOfAnswers) {
    var checked = false;
    for(var i = 1; i <= numOfAnswers; i++) {
        if ($(`#q${questionNum}ans${i}checkbox`).is(':checked')) {
            checked = true;
        }
        else {
            checked = false;
        }
        $(`#q${questionNum}ans${i}checkbox`).val(checked);
    }
}


// $('#booksList').on({
//     'click': function(){
//         console.log(JSON.stringify(booksArray));
//         $('#my_image').attr('src','second.jpg');
//     }
// });