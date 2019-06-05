$(document).ready(function() {
    $('.deleteItem').on('click', function() {    // function will run on click
        var id = $(this).data('id');    // gettin the id from the data-id attribute
        var url = '/kid/notes/delete/' + id;
       // if (confirm('Delete Game?')) {    // confirming the delete
            $.ajax({
                url: url,
                type:'DELETE',
                success: function(result) {
                    console.log('Deleting GNote...');
                   window.location.href = '/kid/notes'; // redirection
                },
                error: function(err) {
                    console.log(err);
                }
            });
      //  }
    });

});
//======================================================
$(document).ready(function() {
    $('.deleteItem').on('click', function() {    // function will run on click
        var id = $(this).data('id');    // gettin the id from the data-id attribute
        var url = '/kid/notes/delete/' + id;
       // if (confirm('Delete Game?')) {    // confirming the delete
            $.ajax({
                url: url,
                type:'DELETE',
                success: function(result) {
                    console.log('Deleting GNote...');
                   window.location.href = '/kid/notes'; // redirection
                },
                error: function(err) {
                    console.log(err);
                }
            });
      //  }
    });

});
