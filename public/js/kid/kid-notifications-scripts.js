
(function() {
    var tableHeaders = document.getElementsByClassName("c-table__header");
    var tableCells = document.getElementsByClassName("c-table__cell");
    var span = document.createElement("span");
  
    for (var i = 0; i < tableCells.length; i++) {
      span = document.createElement("span");
      span.classList.add("c-table__label");
      tableCells[i].prepend(span);
    }
  
    var tableLabels = tableHeaders[0].getElementsByClassName("c-table__col-label");
    var spanMod = document.getElementsByClassName("c-table__label");
  
    for (var i = 0; i < tableLabels.length; i++) {
      for (var a = 0; a < tableCells.length; a++) {
        spanMod[a].innerHTML = tableLabels[i].innerHTML;
      }
    }
  
    var b = tableLabels.length;
    for (var a = 0; a < tableCells.length; a++) {
      spanMod[a].innerHTML = tableLabels[a%b].innerHTML;
    }
  })();



$(document).ready(function () {  // set all user notifications as read
  notificationsMarkAsRead();
});


  $('tr').find('td:eq(4):contains(N)').parent().css('backgroundColor', '#ffff99').css('font-weight', '700'); // marking all notifications that hasn't been read


  function notificationsMarkAsRead() {
    var url = '/notificationsMarkRead';
    $.ajax({
      url: url,
      type: 'POST',
      success: function (result) {

      },
      error: function (err) {

      }
    });
}


$(document).ready(function() {
  $("#removeAllNotifications").click(function(){
    var url = '/removeAllUserNotifications';
    $.ajax({
      url: url,
      type: 'POST',
      success: function (result) {
        window.location.assign('/kid/kid-notifications');

      },
      error: function (err) {
      }
    });
  }); 
});

