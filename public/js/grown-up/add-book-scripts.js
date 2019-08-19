$(document).ready(function () {
    
    $("#bookPic").hide();

    


});




$('#submintBtn').on('click', function () {
    checkAllInputs();
});



//   ==========Check all inputs for valid info ================
function checkAllInputs() {
    var numOfQuestions = quizQuestions.length;
    var check1, check2, check3, check4, check5, check6, allClear;
    check1 = checkQuizPicInput();
    check2 = checkBooksList();
    check3 = checkQuizTitle();
    check4 = checkLangSelected();
    check5 = checkTimeMinSelected();
    check6 = checkQustionInputs(numOfQuestions);
    allClear = (check1 && check2 && check3 && check4 && check5 && check6);
    if (!allClear) {
        showSnackbar('יש למלא את כל השדות שממוסגרים באדום.');
        return;  // if any of the checks fails then don't continue
    } 
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
 
function checkQuizPicInput() {  // checking that quizPicInput is not empty
    input = $('#quizPicInput');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == '') {    // if no picture for the quiz was chosen
        input.attr('title', `.תמונת הבוחן הינה הכרחית`);
        input.addClass('invalid');  // invalid class has a unique style 
        input.tooltip('show');  // showing the tooltip
        return false;
    }
    else {
        return true;
    }
}


function checkBooksList() {  // checking that a book for the quiz was selected
    input = $('#booksList');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == 'title') {    // if no book was chosen
        input.attr('title', `יש לבחור ספר מתוך הרשימה.`);
        input.addClass('invalid');  // invalid class has a unique style 
        input.tooltip('show');  // showing the tooltip
        return false;
    }
    else {
        input.removeClass('invalid');  // invalid class has a unique style 
        input.tooltip('dispose');  // disabling the tooltip
        return true;
    }
}

function checkQuizTitle() {  // checking that a title for the quiz was entered
    input = $('#quizTitle');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == '') {    // if no quiz title was given
        input.attr('title', `יש להעניק כותרת לבוחן.`);
        input.addClass('invalid');  // invalid class has a unique style 
        input.tooltip('show');  // showing the tooltip
        return false;
    }
    else {
        input.removeClass('invalid');  // invalid class has a unique style 
        input.tooltip('dispose');  // disabling the tooltip
        return true;
    }
}

function checkLangSelected() {  // checking that a languege for the quiz was selected
    input = $('#langSelect');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == 'title') {    // if no language was chosen
        input.attr('title', `יש לבחור שפה לבוחן.`);
        input.addClass('invalid');  // invalid class has a unique style 
        input.tooltip('show');  // showing the tooltip
        return false;
    }
    else {
        input.removeClass('invalid');  // invalid class has a unique style 
        input.tooltip('dispose');  // disabling the tooltip
        return true;
    }
}

function checkTimeMinSelected() {  // checking that a duration for the quiz was selected
    input = $('#timeMinSelect');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == 'title') {    // if no language was chosen
        input.attr('title', `יש לבחור את הזמן המוקצב לבוחן בדקות.`);
        input.addClass('invalid');  // invalid class has a unique style 
        input.tooltip('show');  // showing the tooltip
        return false;
    }
    else {
        input.removeClass('invalid');  // invalid class has a unique style 
        input.tooltip('dispose');  // disabling the tooltip
        return true;
    }
}

function checkQustionInputs(qNum) {  // checking inputs of a specific question
    var returnVal = true;
    $(`form#quizForm #q${qNum}`).find('input').each(function () {
        $(this).attr('data-placement', 'left');   // placement of the data
        $(this).attr('data-toggle', 'tooltip');   // title will appear in a tooltip
        if ($(this).prop('required') && $(this).val() == '') {  // all empty and required inputs of the question
            $(this).attr('title', `יש למלא את השדות המסומנים באדום.`);
            $(this).addClass('invalid');  // invalid class has a unique style 
            $(this).tooltip('show');  // showing the tooltip    
            returnVal = false;  // updating return value to false
        }
        else {
            $(this).removeClass('invalid');  // invalid class has a unique style 
            $(this).tooltip('dispose');  // disabling the tooltip 
        }
    });
    return returnVal;
}

/****** ==========/Check all inputs for valid info ================**********/ 

function showSnackbar(message) {
    // Get the snackbar DIV
    var x = $('#snackbar');

    // Add the "show" class to DIV
    x.addClass("show");

    // setting the message in the snackbar
    x.text(message);

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.removeClass("show") }, 3000);

}






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


$(document).on('change', '.imgPrevInput', function (event) {  // preview of image next to file input
    var input = event.target;   // input type file
    

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //get the file size and file type from file input field
        var fsize = input.files[0].size;
        $(this).attr('data-placement', 'left');
        $(this).attr('data-toggle', 'tooltip');
        if (fsize > 524288) { //do something if file size more than 0.5 mb (524288)
            const bytesInMB = 1048576;
            $(this).attr('title', `גודל הקובץ שנבחר הינו ${(fsize/bytesInMB).toFixed(2)} מגה. הקובץ חייב להיות קטן מ 0.5 מגה`);
            input.value = '';
            $(this).addClass('invalid');
            var element = $(this).prev();   // element is the img element
            element.attr('src', '');


        }
        else {
            $(this).attr('title', 'גודל הקובץ תקין');
            var element = $(this).prev();   // element is the img element
            readURL(input, element);
            $(this).removeClass('invalid');
         
        }
    }
    else {
        alert('Please upgrade your browser, because your current browser lacks some new features we need!');
    }
    $(this).tooltip('dispose').tooltip('show');
    

});


$('#langSelect').on('change', function () {
    $("#langSelect option[value='title']").remove();
});

