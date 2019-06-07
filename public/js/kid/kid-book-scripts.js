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
    updateBookType(bookID, bookType, (error, result) => {
      if (error) {
        console.log(error);
      }
      else {
          console.log('status: ' + result);
      }
      
    });
  }