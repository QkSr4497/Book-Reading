$(document).ready(function () {
    updateBooksList();   // update the books select
    populateDurationSelect();   // update the duration select
    $("#bookPic").hide();
});

// global variables
var booksArray;



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
        type:'GET',
        success: function(result) {
            callback(undefined, result);
        },
        error: function(err) {
            callback('error requsting the Book List!', undefined);
        }
    });
}

$('#booksList').on('change', function() {
    var chosenBookName = booksArray[this.value].bookName;;
    var picPath = booksArray[this.value].pic;
    console.log(picPath);
   // console.log(JSON.stringify(booksArray[this.value]));
    $('#bookPic').attr('src', picPath);
    $("#booksList option[value='title']").remove();
    $('#bookPic').show();
    $("#formTitle").text( "Creating Quiz for: " + chosenBookName);
  });

  $('#bookPic').on('error', function (e) {
    $(this).attr('src', '/img/books/default-book.gif');
  });

  
  function readURL(input) { // allow preview of uploaded pic
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#quizPic').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

$("#quizPicInput").change(function(){
    readURL(this);
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

$('#timeMinSelect').on('change', function() {
    $("#timeMinSelect option[value='title']").remove();
  });

$('#langSelect').on('change', function() {
    $("#langSelect option[value='title']").remove();
  });
  

// $('#booksList').on({
//     'click': function(){
//         console.log(JSON.stringify(booksArray));
//         $('#my_image').attr('src','second.jpg');
//     }
// });