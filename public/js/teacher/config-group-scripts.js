
$(document).ready(function () {
    $("#groupPic").hide();
    updateGroupList();
    $('#selectedGroupMembersDiv').hide();
    resetEmailList(allUsersEmails);

});




$('#submintBtn').on('click', function () {
    checkAllInputs();
});



//   ==========Check all inputs for valid info ================
function checkAllInputs() {
    var check1, check2, check3, allClear;
    check1 = checkGroupSelected();
    check2 = checkUserEmailSelected();
    check3 = checkPermissionSelected();

    allClear = (check1 && check2 && check3);
    if (!allClear) {
        showSnackbar('יש למלא את כל השדות שממוסגרים באדום.');
        return;  // if any of the checks fails then don't continue
    } 

    $('#groupList option').val(function(){  // sending the groupID
        return $(this).attr('groupID');
     });
     
    $("#configGroupForm").submit();
}


function checkGroupSelected() {  // checking that a group was selected
    input = $('#groupList');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == 'title') {    // if no group was selected
        input.attr('title', `יש לבחור קבוצה.`);
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

function checkUserEmailSelected() {  // checking that a user email was chosen
    input = $('#userEmailChosen');
    var checkValidInput = $(`#emailList option[value='${input.val()}']`).val();
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (checkValidInput == undefined) {    // if no group was selected
        input.attr('title', `יש לבחור אימייל מתוך הרשימה בלבד.`);
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

function checkPermissionSelected() {  // checking that a permission was selected
    input = $('#permissionSelect');
    input.attr('data-placement', 'left');   // placement of the data
    input.attr('data-toggle', 'tooltip');   // title will appear in a tooltip
    if (input.val() == 'title') {    // if no permission was chosen
        input.attr('title', `יש לבחור הרשאה מתוך הרשימה.`);
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



// $('#groupPic').on('error', function (e) {
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
            $('#groupPic').show();
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


$('#groupList').on('change', function () {
    $("#groupList option[value='title']").remove();
    $('#selectedGroupMembersDiv').show();
});

$('#permissionSelect').on('change', function () {
    $("#permissionSelect option[value='title']").remove();
});

function updateGroupList() {    // update the groups select
    var $mySelect = $('#groupList');
        $.each(allGroupsData, function (key, value) {  // each item in books array
            var $option = $("<option/>", {
                value: key,
                text: value.groupData.groupName,
                groupID: value.groupData.groupID
            });
            $mySelect.append($option);  //  appending option to the select
        });
}

// $('#groupList option').val(function(){  // sending the groupID and not the name 
//     return $(this).attr('groupID');
//  });

$('#groupList').on('change', function () {
    var chosenGroup = allGroupsData[this.value];
    var picPath = chosenGroup.groupData.pic;
    // console.log(picPath);
    // console.log(JSON.stringify(booksArray[this.value]));
    $('#groupPic').attr('src', picPath);
    $("#groupList option[value='title']").remove();
    $('#groupPic').show();
    $("#formTitle").text("הוספת משתמשים לקבוצת: " + chosenGroup.groupData.groupName);
    updateChosenGroupMembers(chosenGroup.groupAdminMembers, chosenGroup.groupKidMembers, $('#viewBySelect').val());
    resetEmailList(allUsersEmails);
    updateEmailList(chosenGroup.groupAdminMembers, chosenGroup.groupKidMembers);
    // $("#groupList option").each(function () {
    //     console.log($(this).attr('groupID'))
    // });
});

function updateChosenGroupMembers(groupAdminMembers, groupKidMembers, viewBy) {
    var commandAdminString, commandKidString;
    if (viewBy == 'userName') {
        commandAdminString = `groupAdminMembers[i].userName`;
        commandKidString =  `groupKidMembers[i].userName`;
    }
    else if (viewBy == 'email') {
        commandAdminString = `groupAdminMembers[i].email`;
        commandKidString =  `groupKidMembers[i].email`;
    }
    else if (viewBy == 'fullName') {
        commandAdminString = `groupAdminMembers[i].firstName +' '+ groupAdminMembers[i].lastName`;
        commandKidString =  `groupKidMembers[i].firstName +' '+ groupKidMembers[i].lastName`;
    }
    // console.log(groupAdminMembers, groupKidMembers);
    $('#groupMembersDiv').empty(); 
    $('#groupMembersDiv').append(`<h3> :מנהלי הקבוצה</h3> <ul class="adminList"></ul>`);
    for (var i = 0; i < groupAdminMembers.length; i++) {
        $('#groupMembersDiv .adminList').append(`<li>${eval(commandAdminString)}</li>`);

    }
    $('#groupMembersDiv').append(`<h3> :חברי הקבוצה</h3> <ul class="simpleMembersList"></ul>`);
    for (var i = 0; i < groupKidMembers.length; i++) {
        $('#groupMembersDiv .simpleMembersList').append(`<li>${eval(commandKidString)}</li>`);
    }
}

$('#viewBySelect').change(function(){
    var selectedGroup = $('#groupList').val();
    if (selectedGroup == 'title') return; // still no group selected
    var chosenGroup = allGroupsData[selectedGroup];
    updateChosenGroupMembers(chosenGroup.groupAdminMembers, chosenGroup.groupKidMembers, this.value);
}); 

function updateEmailList(groupAdminMembers, groupKidMembers) {
    for (var i = 0; i < groupAdminMembers.length; i++) {
        $(`#emailList option[value='${groupAdminMembers[i].email}']`).remove();

    }
    for (var i = 0; i < groupKidMembers.length; i++) {
        $(`#emailList option[value='${groupKidMembers[i].email}']`).remove();
    }


    sortSelectAlphabetically('emailList'); 
}

function resetEmailList(ListOfAllUserEmails) {
    $('#emailList').empty();    // removeing all options from select
    var $mySelect = $('#emailList');
        $.each(ListOfAllUserEmails, function (key, value) {  // each item in books array
            var $option = $("<option/>", {
                value: this.email
            });
            $mySelect.append($option);  //  appending option to the select
        });

        sortSelectAlphabetically('emailList');
}

function sortSelectAlphabetically(selectIdString) {
    var options = $(`#${selectIdString} option`);                    // Collect options         
    options.detach().sort(function (a, b) {               // Detach from select, then Sort
        var at = $(a).val();
        var bt = $(b).val();
        return (at > bt) ? 1 : ((at < bt) ? -1 : 0);            // Tell the sort function how to order
    });
    options.appendTo(`#${selectIdString}`); 
}

