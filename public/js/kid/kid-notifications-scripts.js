
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


  $('tr').find('td:eq(5):contains(N)').parent().css('backgroundColor', '#ffff99').css('font-weight', '700'); // marking all notifications that hasn't been read


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


$(document).ready(function() {  // when approved button of a specific notification is clicked
  $(".userApproveBtn").click(function(){
      var rowNum = $(this).attr("data-row");  // getting row num
      var notificationClicked = userNotifications[rowNum - 1];  // getting the data of the notification clicked
      var supervisorID = userNotifications[rowNum - 1].senderID;
      var teacherID = userNotifications[rowNum - 1].senderID;
      var kidID = notificationClicked.recieverID;
      var notificationResponse = 'A';
      var notificationID = notificationClicked.notificationID;
      if (notificationClicked.typeN == 'supervision') { // when supervision approval is clicked then send a response
        $(`#roller-${rowNum}-Start`).show();  // showing the roller
        respondToSupervisionReq(supervisorID, kidID, notificationResponse, notificationID, $(this).parent() );
      }
      else if (notificationClicked.typeN == 'group') { // when group approval is clicked then send a response
        var openingSquareBracketIndex = notificationClicked.content.indexOf('[');
        var closingSquareBracketIndex = notificationClicked.content.indexOf(']');
        var groupID = parseInt(notificationClicked.content.substring(openingSquareBracketIndex + 1, closingSquareBracketIndex)); 
        console.log(groupID);
        $(`#roller-${rowNum}-Start`).show();  // showing the roller
        respondToAddGroupReq(teacherID, kidID, groupID, notificationResponse, notificationID, notificationClicked.content, $(this).parent() );
      }
  }); 
});

$(document).ready(function() {
  $(".userDeclilneBtn").click(function(){
      var rowNum = $(this).attr("data-row");
      // console.log($(this).parent());
      // $(this).parent().html(`<p class="userDeclilnedP">סורב</p> `);
      var notificationClicked = userNotifications[rowNum - 1];  // getting the data of the notification clicked
      var supervisorID = userNotifications[rowNum - 1].senderID;
      var teacherID = userNotifications[rowNum - 1].senderID;
      var kidID = userNotifications[rowNum - 1].recieverID;
      var notificationResponse = 'D';
      var notificationID = userNotifications[rowNum - 1].notificationID;

      if (notificationClicked.typeN == 'supervision') { // when supervision decline is clicked then send a response
        $(`#roller-${rowNum}-Start`).show();  // showing the roller
        respondToSupervisionReq(supervisorID, kidID, notificationResponse, notificationID, $(this).parent() );
      }
      else if (notificationClicked.typeN == 'group') { // when group decline is clicked then send a response
        var openingSquareBracketIndex = notificationClicked.content.indexOf('[');
        var closingSquareBracketIndex = notificationClicked.content.indexOf(']');
        var groupID = parseInt(notificationClicked.content.substring(openingSquareBracketIndex + 1, closingSquareBracketIndex)); 
        console.log(groupID);
        $(`#roller-${rowNum}-Start`).show();  // showing the roller
        respondToAddGroupReq(teacherID, kidID, groupID, notificationResponse, notificationID, notificationClicked.content, $(this).parent() );
      }
      
  }); 
});


function respondToSupervisionReq(supervisorID, kidID, notificationResponse, notificationID, element) {  // sending a response to supervision request and updating notification status (approved/declined)
  var url = '/kid/respondToSupervisionReq';
  $.ajax({
    url: url,
    type: 'POST',
    data: { supervisorID: supervisorID, kidID: kidID, notificationResponse: notificationResponse, notificationID: notificationID },
    success: function (result) {
      if (result == 'A') {
        element.html(`<p class="userApprovedP">אושר</p> `);  // updating the table cell content
      }
      else if (result == 'D') {
        element.html(`<p class="userDeclilnedP">סורב</p> `);  // updating the table cell content
      } 
    },
    error: function (err) {

    }
  });
}


function respondToAddGroupReq(teacherID, kidID, groupID, notificationResponse, notificationID, content, element) {  // sending a response to group invitation request and updating notification status (approved/declined)
  var url = '/kid/respondToAddGroupReq';
  $.ajax({
    url: url,
    type: 'POST',
    data: { teacherID: teacherID, kidID: kidID, groupID: groupID, notificationResponse: notificationResponse, notificationID: notificationID, content: content },
    success: function (result) {
      if (result == 'A') {
        element.html(`<p class="userApprovedP">אושר</p> `);  // updating the table cell content
      }
      else if (result = 'D') {
        element.html(`<p class="userDeclilnedP">סורב</p> `);  // updating the table cell content
      } 

    },
    error: function (err) {

    }
  });
}

