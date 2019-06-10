function allowDropIntrested(ev) {
    if(ev.target.id==="intrested"){
    ev.preventDefault();
    }

  }

  function allowDropReading(ev) {
    console.log('allowDropReading '+ ev.target.id )
     if(ev.target.id === "reading"){
      console.log('prevented moving : '+ev.dataTransfer.getData("text") + 'to: ' + ev.target.id );
    ev.preventDefault();
    ev.stopPropagation();

    }
  }
    function allowDropFinish(ev) {
       if(ev.target.id === 'finished'){
          ev.preventDefault();
 
    }
  }

  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
     console.log('drag: '+ev.dataTransfer.getData("text"));
  }


    const updateBookType = ( (bookID, bookType, callback) => {
      var bookData = {};
      bookData.bookID = bookID;
      bookData.bookType = bookType;
     // console.log('new object ' +JSON.stringify(bookData));
      var url = '/kid/books/edit';
      $.ajax({
        url: url,
        type: 'POST',
        data: bookData,
        success: function (result) {
            callback(undefined , result.status);
       },
      error: function (err) {
            callback('error updating book type', undefined);
       }
    });
      });
  

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    console.log('movigng book : '+ev.dataTransfer.getData("text"));
    console.log('to '+ev.target.id);

    var bookID=ev.dataTransfer.getData("text");
    var bookType=ev.target.id;
    if(bookType==='finished'){
      checkIfHasQuiz(bookID , (error, bookReview) => {
        if (bookReview == 'hasNot') {
          getMessage();
        }
        else if (bookReview == 'has') { 
          updateBookType(bookID, bookType, (error, result) => {
            if (error) {
              console.log(error);
            }
            else {
                console.log('status: ' + result);
            }
            
          });
        }  
    }); 
    }//
    else{
      updateBookType(bookID, bookType, (error, result) => {
        if (error) {
          console.log(error);
        }
        else {
            console.log('status: ' + result);
        }
        
      });
    }
 

  }





  const checkIfHasQuiz = (bookID, callback) => {
    
    var url = '/kid/hasQuiz' + bookID;
    $.ajax({
        url: url,
        type:'GET',
        success: function(result) {
          console.log('bookID quiz'+bookID);
         
            if (result.status == 'has') {
                callback(undefined, result.status);
            }
            else if (result.status == 'hasNot') {
                callback(undefined, result.status);
            }

        },
        error: function(err) {
            callback('error requsting the book quiz check!', undefined);
        }
    });
}


function getMessage(){
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// show the message
  modal.style.display = "block";
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  window.location.href = '/kid/books'; // redirection
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }
}


