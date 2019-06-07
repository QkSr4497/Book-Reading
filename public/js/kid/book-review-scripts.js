$(document).ready(function() {

 //===========================================

    $('#getReviews').on('click', function() {    // function will run on click
        var id = $(this).data('id');    // gettin the id from the data-id attribute
        var url = '/kid/single-book-page/getReivews/' + id;
            $.ajax({
                url: url,
                type:'GET',
                success: function(result) {
                    console.log('Getting all reviews for the book');
                   //window.location.href = '/kid/single-book-page/'+id; // redirection
                },
                error: function(err) {
                    console.log(err);
                }
            });
    });

//=========================================================


    $('#addToList').on('click', function() {    // function will run on click
        var id = $(this).data('id');    // gettin the id from the data-id attribute
        var url = '/kid/books/addToList/' + id;
            $.ajax({
                url: url,
                type:'POST',
                success: function(result) {
                    console.log('Adding New Book...');
                     window.location.href = '/kid/books'; // redirection
                },
                error: function(err) {
                    console.log(err);
                }
            });
    });

//======================================================
    var id=document.getElementById("bookID").textContent;


    checkIfHasBook(id , (error, bookToList) => {
        if (bookToList == 'free') {
            //can not add review befor add it to list
            var btn=document.getElementById("addToList");
            btn.style.display="block";
            var btn=document.getElementById("review");
            btn.style.display="none";
            var textarea=document.getElementById("reviewContent");
            textarea.style.display="none";

        }
        else if (bookToList == 'taken') { 
            var btn=document.getElementById("addToList");
            btn.style.display="none";
            //check if it finished or not
            checkIfBookFinished(id , (error, bookStatus) => {
                if (bookStatus == 'finished') {
                    checkIfHasReview(id , (error, bookReview) => {
                        if (bookReview == 'hasnot') {
                            var btn=document.getElementById("review");
                            btn.style.display="block";
                            var textarea=document.getElementById("reviewContent");
                            textarea.style.display="block";
                        }
                        else if (bookReview == 'has') {   
                            var btn=document.getElementById("review");
                            btn.style.display="none";
                            var textarea=document.getElementById("reviewContent");
                            textarea.style.display="none";
                        }  
                    });  
                    // var btn=document.getElementById("review");
                    // btn.style.display="block";
                    // var textarea=document.getElementById("reviewContent");
                    // textarea.style.display="block";
                }
                else if (bookStatus == 'notFinished') {   
                    console.log('not finished')
                    var btn=document.getElementById("review");
                    btn.style.display="none";
                    var textarea=document.getElementById("reviewContent");
                    textarea.style.display="none";
                }  
            });
        } 
    });
    //----------------------------------------------------


//================================================


    // checkIfHasReview(id , (error, bookReview) => {
    //     if (bookReview == 'hasnot') {
    //         var btn=document.getElementById("review");
    //         btn.style.display="block";
    //         var textarea=document.getElementById("reviewContent");
    //         textarea.style.display="block";
    //     }
    //     else if (bookReview == 'has') {   
    //         var btn=document.getElementById("review");
    //         btn.style.display="none";
    //         var textarea=document.getElementById("reviewContent");
    //         textarea.style.display="none";
    //     }  
    // });  


  //======================================================



});
//=====================================================================



const checkIfBookFinished = (bookID, callback) => {
    
    var url = '/kid/hasFinishedBook' + bookID;
    $.ajax({
        url: url,
        type:'GET',
        success: function(result) {
         
            if (result.status == 'finished') {
                callback(undefined, result.status);
            }
            else if (result.status == 'notFinished') {
                callback(undefined, result.status);
            }

        },
        error: function(err) {
            callback('error requsting the book check!', undefined);
        }
    });
}

//=====================================================================

const checkIfHasBook= (bookID, callback) => {
    
    var url = '/kid/hasBook' + bookID;
    $.ajax({
        url: url,
        type:'GET',
        success: function(result) {
         
            if (result.status == 'taken') {
                callback(undefined, result.status);
            }
            else if (result.status == 'free') {
                callback(undefined, result.status);
            }

        },
        error: function(err) {
            callback('error requsting the book check!', undefined);
        }
    });
}

const checkIfHasReview= (bookID, callback) => {
    
    var url = '/kid/hasReview' + bookID;
    $.ajax({
        url: url,
        type:'GET',
        success: function(result) {
         
            if (result.status == 'has') {
                callback(undefined, result.status);
            }
            else if (result.status == 'hasnot') {
                callback(undefined, result.status);
            }

        },
        error: function(err) {
            callback('error requsting the book check!', undefined);
        }
    });
}