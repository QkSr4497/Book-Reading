$( document ).ready(function() {
    $('#modalProfilePic').attr('src', profilePicPath);
    $('#new_userName').attr('value', userDataJson.userName);
    $('#new_firstName').attr('value', userDataJson.firstName);
    $('#new_lastName').attr('value', userDataJson.lastName);
    $('#newProfilePicInput').attr('name', `profilePic_${userDataJson.userName}`);
    console.log(userDataJson)
    console.log(userDataJson.birthDate)
    var kidBirthDate = new Date(userDataJson.birthDate);
    kidBirthDate.setDate(kidBirthDate.getDate() + 1);   // for some reason we need to increment the date by 1 day
    console.log(kidBirthDate)
    kidBirthDate = new Date(kidBirthDate).toISOString().split('T')[0];  // changing format to match input type="date"
    // kidBirthDate.add(1).day();
    $('#new_birthDate').attr('value', kidBirthDate);
});


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

$(".close").click(function() {    
    $("#liClose").css("visibility", "hidden");  // removing close button
    $('#newProfilePicInput').removeClass('invalid');    // removing flashing effect
    var ExceptionText = "";
    document.getElementById("profilePicException").innerHTML = ExceptionText;   // canceling profile picture update
 });


function readURL(input, element) { // allow preview of uploaded pic
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            element.attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}


function checkAllInputs() {
    var check1 = checkFirstName();
    var check2 = checkLastName();
    var check3 = checkDateOfBirth();
    var check4 = checkProfilePic();
  
    if (!check1 || !check2 || !check3 || !check4) {
        showSnackbar('יש לתקן את כל השדות שלצידם הערה באדום.');
        // window.alert("Please Correct all Inputs with red comment");
    }
    else {
        $("#profileForm").submit();
    }
}


function checkFirstName() {
    var firstName, ExceptionText, returnBoolean;
    firstName = document.getElementById("new_firstName").value;
    if (firstName === "") {
        ExceptionText = "&nbsp;&nbsp;&nbsp;";
        ExceptionText += "שם פרטי הינו נחוץ!";
        returnBool = false;
    }
    else if (!/^[a-zA-Z\u05d0-\u05ea\u0621-\u064A\u0660-\u0669]+$/.test(firstName)) {
        ExceptionText = "&nbsp;&nbsp;&nbsp;";
        ExceptionText += "שם פרטי מוכרח להיות מורכב מאותיות בעברית/אנגלית/ערבית בלבד!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;  
    }
    document.getElementById("firstNameException").innerHTML = ExceptionText;
    return returnBoolean;
}

function checkLastName() {
    var lastName, ExceptionText, returnBoolean;
    lastName = document.getElementById("new_lastName").value;
    if (lastName === "") {
        ExceptionText = "&nbsp;&nbsp;&nbsp;";
        ExceptionText += "שם משפחה הינו נחוץ!";
        returnBool = false;
    }
    else if (!/^[a-zA-Z\u05d0-\u05ea\u0621-\u064A\u0660-\u0669]+$/.test(lastName)) {
        ExceptionText = "&nbsp;&nbsp;&nbsp;";
        ExceptionText += "שם משפחה מוכרח להיות מורכב מאותיות בעברית/אנגלית/ערבית בלבד!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("lastNameException").innerHTML = ExceptionText;
    return returnBoolean;
}

function checkDateOfBirth() {
    var birthDate, ExceptionText, returnBoolean;

    var ToDate = new Date();
    Todate = Date.now();


    birthDate = document.getElementById("new_birthDate").value;
    if (birthDate === "") {
        ExceptionText = "&nbsp;&nbsp;&nbsp;";
        ExceptionText += "תאריך לידה הינו נחוץ!";
        returnBoolean = false;
    }
    else if (new Date(birthDate).getTime() > ToDate.getTime()) {
        ExceptionText = "&nbsp;&nbsp;&nbsp;";
        ExceptionText += "תאריך לידה מוכרח להיות מן העבר!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }

    document.getElementById("birthDateException").innerHTML = ExceptionText;
    return returnBoolean;
}

function checkProfilePic() {
    var returnBoolean;
    var profilePicException = $( "#profilePicException" ).text();
    if (profilePicException === "") {

        returnBoolean = true;
    }
    else {

        returnBoolean = false;
    }
    return returnBoolean;

}

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