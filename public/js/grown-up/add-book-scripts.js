$(document).ready(function () {
    $("#bookPic").hide();

});




$('#submintBtn').on('click', function () {
    checkAllInputs();
});



//   ==========Check all inputs for valid info ================
function checkAllInputs() {
    var check1, check2, check3, check4, check5, allClear;
    check1 = checkBookName();
    check2 = checkAuthorFirstName();
    check3 = checkAuthorLastName();
    check4 = checkLangSelected();
    check5 = checkBookPicInput();

    allClear = (check1 && check2 && check3 && check4 && check5);
    if (!allClear) {
        showSnackbar('יש למלא את כל השדות שממוסגרים באדום.');
        return;  // if any of the checks fails then don't continue
    } 
    $("#addBookForm").submit();
}


function checkBookName() {  // checking that a title of the book was entered
    input = $('#bookName');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == '') {    // if no book title was given
        input.attr('title', `יש להוסיף את שם הספר.`);
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

function checkAuthorFirstName() {  // checking that author's first name was entered
    input = $('#authorFirstName');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == '') {    // if no first name was given
        input.attr('title', `יש להוסיף את שמו הפרטי של הסופר.`);
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

function checkAuthorLastName() {  // checking that author's last name was entered
    input = $('#authorLastName');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == '') {    // if no last name was given
        input.attr('title', `יש להוסיף את שם משפחת הסופר.`);
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

function checkLangSelected() {  // checking that a languege for of the book was selected
    input = $('#langSelect');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == 'title') {    // if no language was chosen
        input.attr('title', `יש לבחור את שפת הספר.`);
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

 
function checkBookPicInput() {  // checking that bookPicInput is not empty
    input = $('#bookPicInput');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == '') {    // if no picture for the quiz was chosen
        input.attr('title', `.תמונת הספר הינה הכרחית`);
        input.addClass('invalid');  // invalid class has a unique style 
        input.tooltip('show');  // showing the tooltip
        return false;
    }
    else {
        return true;
    }
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






// $('#bookPic').on('error', function (e) {
//     $(this).attr('src', '/img/books/default-book.gif');
// });


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
            $('#bookPic').show();
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

