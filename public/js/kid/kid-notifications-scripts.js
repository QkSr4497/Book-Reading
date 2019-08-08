
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


function notificationsMarkAsRead() {  // updating all new user notifications as read
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


$(document).ready(function() {  // removing all user notifications once remove button clicked
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


$(document).ready(function() {
  $(".userApproveBtn").click(function(){
      var rowNum = $(this).attr("data-row");
      var supervisorID = userNotifications[rowNum - 1].senderID;
      var kidID = userNotifications[rowNum - 1].recieverID;
      var notificationResponse = 'A';
      var notificationID = userNotifications[rowNum - 1].notificationID;
      alert(notificationID);
      respondToSupervisionReq(supervisorID, kidID, notificationResponse, notificationID)
  }); 
});

$(document).ready(function() {
  $(".userDeclilneBtn").click(function(){
      var rowNum = $(this).attr("data-row");
      var supervisorID = userNotifications[rowNum - 1].senderID;
      var kidID = userNotifications[rowNum - 1].recieverID;
      var notificationResponse = 'D';
      var notificationID = userNotifications[rowNum - 1].notificationID;
      alert(notificationID);
      respondToSupervisionReq(supervisorID, kidID, notificationResponse, notificationID)
  }); 
});


function respondToSupervisionReq(supervisorID, kidID, notificationResponse, notificationID) {  // sending a response to supervision request and updating notification status (approved/declined)
  var url = '/kid/respondToSupervisionReq';
  $.ajax({
    url: url,
    type: 'POST',
    data: { supervisorID: supervisorID, kidID: kidID, notificationResponse: notificationResponse, notificationID: notificationID },
    success: function (result) {

    },
    error: function (err) {

    }
  });
}

