    $(document).ready(function() {$('.updateNote').on('click', function() {
        $('#updateTitle').val($(this).data('title'));
        $('#updateContent').val($(this).data('content'));
        $('#updateNoteID').val($(this).data('id'));
        $('#updateBookName').val($(this).data('bookName'));
        $('#updateBookID').val($(this).data('bookID'));
        $('#updateNotePic').val($(this).data('notePic'));       
    });
  });
  
  //=======================================================
  function getSelected(){
    var e = document.getElementById("bookSelect");
    var result =e.options[e.selectedIndex].value;
    document.getElementById("bookID").value=result;
  }
  function getUpdateSelected(){
    var e = document.getElementById("updateBookSelect");
    var result =e.options[e.selectedIndex].value;
    document.getElementById("updateBookID").value=result;
  }
//================================================
$(document).on('change', '.imgPrevInput', function (event) {  // preview of image next to file input
    var input = event.target;   // input type file
    var ExceptionText;
    

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //get the file size and file type from file input field
        var fsize = input.files[0].size;
        if (fsize > 524288) { //do something if file size more than 0.5 mb (524288)
            const bytesInMB = 1048576;
            ExceptionText = "&nbsp;&nbsp;&nbsp;";
            ExceptionText += `גודל הקובץ שנבחר הינו ${(fsize/bytesInMB).toFixed(2)} מגה. הקובץ חייב להיות קטן מ 0.5 מגה`;
            // $('#profilePicException').text(`גודל הקובץ שנבחר הינו ${(fsize/bytesInMB).toFixed(2)} מגה. הקובץ חייב להיות קטן מ 0.5 מגה`);
            input.value = '';
            console.log($(this))
            console.log((this))
            $(this).addClass('invalid');
            var element = $('.profilePic').prev();   // element is the img element
            element.attr('src', '');
            $("#liClose").css("visibility", "visible"); // adding close button to cancel picture update attempt
        }
        else {
            var element = $('.profilePic');   // element is the img element
            readURL(input, element);
            $(this).removeClass('invalid');
            // $('#profilePicException').text(``);
            ExceptionText = "";
            $("#liClose").css("visibility", "hidden"); // no need for close button
        }
        document.getElementById("profilePicException").innerHTML = ExceptionText;
    }
    else {
        $("#liClose").css("visibility", "visible"); // adding close button to cancel picture update attempt
        alert('Please upgrade your browser, because your current browser lacks some new features we need!');
    }
});
//===============================================

$(document).ready(function() {
    $('.deleteNote').on('click', function() {    // function will run on click
        var id = $(this).data('id');    // gettin the id from the data-id attribute
        var url = '/kid/notes/delete/' + id;
       // if (confirm('Delete Game?')) {    // confirming the delete
            $.ajax({
                url: url,
                type:'DELETE',
                success: function(result) {
                    console.log('Deleting Note...');
                   window.location.href = '/kid/notes'; // redirection
                },
                error: function(err) {
                    console.log(err);
                }
            });
       // recalculateCart();
      //  }
    });

});
//======================================================



//==================================
function readURL(input, element) { // allow preview of uploaded pic
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            element.attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}
//========================================
$(".close").click(function() {    
    $("#liClose").css("visibility", "hidden");  // removing close button
    $('#newNotePicInput').removeClass('invalid');    // removing flashing effect
    var ExceptionText = "";
    document.getElementById("profilePicException").innerHTML = ExceptionText;   // canceling profile picture update
 });

 function checkAllInputs() {
    // var check1 = checkFirstName();
    // var check2 = checkLastName();
    // var check3 = checkDateOfBirth();
    // var check4 = checkProfilePic();
  
    // if (!check1 || !check2 || !check3 || !check4) {
    //     showSnackbar('יש לתקן את כל השדות שלצידם הערה באדום.');
    //     // window.alert("Please Correct all Inputs with red comment");
    // }
   // else {
        $("#noteForm").submit();
  //  }
}