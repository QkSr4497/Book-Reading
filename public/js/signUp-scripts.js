

//   ==========Stuff to do when page is loaded ================
$(document).ready(function () {
    $("#birthdate").on("change", function () {
        this.setAttribute(
            "data-date",
            moment(this.value, "YYYY-MM-DD")
                .format(this.getAttribute("data-date-format"))
        )
    }).trigger("change");

});


//   ==========Changing inputs according to the role ================
$(function () {
    $("#role").change(function () {
        if (this.value == "kid") {
            $("#phoneTitle").hide();
            $("#phone").hide();
            $("#birthdateTitle").show();
            $("#birthdate").show();
        }
        else {
            $("#birthdateTitle").hide();
            $("#birthdate").hide();
            $("#phoneTitle").show();
            $("#phone").show();
        }
    });
});


//   ==========Check all inputs for valid info ================

function checkAllInputs() {
    var check1 = checkFirstName();
    var check2 = checkLastName();
    var check3 = checkEmail();
    var check4 = checkUserName();
    var check5 = checkPassword();
    var check6 = checkRole();
    var check7 = checkDateOfBirth();
    var check8 = checkPhone();
    if (!check1 || !check2 || !check3 || !check4 || !check5 || !check6 || !check7 || !check8) {
        showSnackbar();
        // window.alert("Please Correct all Inputs with red comment");
    }
    else {
        checkDuplicates();
    }
}

//   ==========Check Duplicates for User Name and Email ================
function checkDuplicates() {
    userName = document.getElementById("userName").value;
    checkUserDuplicates(userName , (error, userData) => {
        emailExceptionText = "";
        userExceptionText = "";
        if (userData == 'taken') {
            var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
            userExceptionText = arrLang[langPref]['userExceptionText'];
            // userExceptionText = "User Name is taken.";
            showSnackbar();
            document.getElementById("userNameException").innerHTML = userExceptionText;  
        }
        else if (userData == 'free') {
            userExceptionText = "";
            email = document.getElementById("email").value;;
            checkEmailDuplicates(email , (error, emailData) => {
                if (emailData == 'taken') {
                    var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
                    emailExceptionText = arrLang[langPref]['emailExceptionText'];
                    // emailExceptionText = "Email already registered.";
                    showSnackbar();
                    document.getElementById("emailException").innerHTML = emailExceptionText;
                }
                else if (emailData == 'free') {   
                    emailExceptionText = "";
                    // window.alert("Update is successful");
                    document.myForm.submit(); // Form will be submitted by it's name
                }  
            });
        }    
    });

}

const checkEmailDuplicates = (email, callback) => {
    var url = '/signUp/checkEmailDuplicates/' + email;
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
            callback('error requsting the Email check!', undefined);
        }
    });
}

const checkUserDuplicates = (userName, callback) => {
    var url = '/signUp/checkUserDuplicates/' + userName;
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
            callback('error requsting the User Name check!', undefined);
        }
    });
}



function checkFirstName() {
    var firstName, ExceptionText, returnBoolean;
    firstName = document.getElementById("firstName").value;
    if (firstName === "") {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['firstNameRequired'];
        // ExceptionText = "First Name is required!";
        returnBool = false;
    }
    else if (!/^[a-zA-Z]+$/.test(firstName)) {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['firstNameLetters'];
        // ExceptionText = "First Name must contain only letters.";
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
    lastName = document.getElementById("lastName").value;
    if (lastName === "") {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['lastNameRequired'];
        // ExceptionText = "Last Name is required!";
        returnBool = false;
    }
    else if (!/^[a-zA-Z]+$/.test(lastName)) {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['lastNameLetters'];
        // ExceptionText = "Last Name must contain only letters.";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("lastNameException").innerHTML = ExceptionText;
    return returnBoolean;
}


/*

function checkGender() {
    var genderSelected, ExceptionText, returnBoolean;
    genderSelected = document.getElementById("gender").value;
    if (genderSelected === "") {
        ExceptionText = "this field is required!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("GenderException").innerHTML = ExceptionText;
    return returnBoolean;
}

*/
function checkDateOfBirth() {
    var birthDate, ExceptionText, returnBoolean;
    
    var ToDate = new Date();
    Todate = Date.now();
    
    if ($("#role").val() == 'kid') {
        birthDate = document.getElementById("birthdate").value;
        if (birthDate === "") {
            var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
            ExceptionText = arrLang[langPref]['birthDateRequired'];
            // ExceptionText = "Birthdate is required!";
            returnBoolean = false;
        }
        else if (new Date(birthDate).getTime() > ToDate.getTime()) {
            var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
            ExceptionText = arrLang[langPref]['birthDateInvalid'];
            // ExceptionText = "Your Birthdate must be former than now.";
            returnBoolean = false;
        }
        else {
            ExceptionText = "";
            returnBoolean = true;
        }
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("birthDateException").innerHTML = ExceptionText;
    return returnBoolean;
}
/*

function checkAddress1() {
    var addressLine, ExceptionText, returnBoolean;
    addressLine = document.getElementById("addressLine1").value;
    if (addressLine === "") {
        ExceptionText = "this field is required!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("addressLine1Exception").innerHTML = ExceptionText;
    return returnBoolean;
}


function checkCity() {
    var city, ExceptionText, returnBoolean;
    city = document.getElementById("city").value;
    if (city === "") {
        ExceptionText = "this field is required!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("cityException").innerHTML = ExceptionText;
    return returnBoolean;
}


function checkState() {
    var state, ExceptionText, returnBoolean;
    state = document.getElementById("state").value;
    if (state === "") {
        ExceptionText = "this field is required!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("stateException").innerHTML = ExceptionText;
    return returnBoolean;
}

function checkZip() {
    var zip, ExceptionText, returnBoolean;
    var zipPattern = /^[0-9]+$/;
    zip = document.getElementById("postcode").value;
    if (zip === "") {
        ExceptionText = "this field is required!";
        returnBoolean = false;
    }
    else if (zipPattern.test(zip) === false || zip.length < 6) {
        ExceptionText = "zipCode must be at least 6 digits and contain digits only!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("zipException").innerHTML = ExceptionText;
    return returnBoolean;
}

function checkCountry() {
    var countrySelected, ExceptionText, returnBoolean;
    countrySelected = document.getElementById("country").value;
    if (countrySelected === "") {
        ExceptionText = "this field is required!";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("countryException").innerHTML = ExceptionText;
    return returnBoolean;
}

*/
function checkEmail() {
    var email, ExceptionText, returnBoolean;
    var emailPattern = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    email = document.getElementById("email").value;
    if (email === "") {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['emailRequired'];
        // ExceptionText = "Email is required!";
        returnBoolean = false;
    }
    else if (emailPattern.test(email) === false) {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['emailInvalid'];
        // ExceptionText = "Email must be in valid format like a@b.com";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("emailException").innerHTML = ExceptionText;
    return returnBoolean;
}

function checkUserName() {
    var userName, ExceptionText, returnBoolean;
    userName = document.getElementById("userName").value;
    if (userName === "") {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['userNameRequired'];
        // ExceptionText = "Username is required!";
        returnBoolean = false;
    }

    else if (/\s/.test(userName)) {  // check if there are any whitespaces
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['userNameSpaces'];
        // ExceptionText = "Username must not contain any whitespaces.";
        returnBoolean = false;
    }
    else if(userName.length < 4)
    {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['userNameLength'];
        // ExceptionText = "Username must contain at least 4 characters.";
        returnBoolean = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("userNameException").innerHTML = ExceptionText;
    return returnBoolean;
}

function checkPassword() {
    var pass1, pass2, ExceptionText1, ExceptionText2, returnBoolean;
    pass1 = document.getElementById("pass1").value;
    pass2 = document.getElementById("pass2").value;
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/; // at least six characters and at least one number, one lowercase, one uppercase letter.
    
    if (pass1 === "") {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText1 = arrLang[langPref]['passRequired'];
        // ExceptionText1 = "Password is required!";
        ExceptionText2 = "";
        returnBoolean = false;
    }
    else if(!re.test(pass1)) {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText1 = arrLang[langPref]['passInvalid'];
        // ExceptionText1 = "Password must contain at least 6 characters and at least one number, one lowercase and one uppercase letter.";
        ExceptionText2 = "";
        returnBoolean = false;
    }
    else if(pass2 === "") {
        ExceptionText1 = "";
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText2 = arrLang[langPref]['confirmPassRequired'];
        // ExceptionText2 = "Repeating password is required!";
    }
    else if(pass1 != pass2) {
        ExceptionText1 = "";
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText2 = arrLang[langPref]['passMatchInvalid'];
        // ExceptionText2 = "Passwords Don't Match!";
    }
    else {
        ExceptionText1 = "";
        ExceptionText2 = "";
        returnBoolean = true;
    }
    document.getElementById("pass1Exception").innerHTML = ExceptionText1;
    document.getElementById("pass2Exception").innerHTML = ExceptionText2;
    return returnBoolean;
}

function checkRole() {
    var role, ExceptionText, returnBoolean;
    role = document.getElementById("role").value;
    if (role === "none") {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText = arrLang[langPref]['roleRequired'];
        // ExceptionText = "Role is required!";
        returnBool = false;
    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("roleException").innerHTML = ExceptionText;
    return returnBoolean;
}


function checkPhone() {
    var phone, ExceptionText, returnBoolean;
    var phonePattern = /^[0-9]+$/;
    if ($("#role").val() != 'kid') {
        phone = document.getElementById("phone").value;
        if (phone === "") {
            var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
            ExceptionText = arrLang[langPref]['phoneRequired'];
            // ExceptionText = "Phone Number is required!";
            returnBoolean = false;
        }
        else if (phonePattern.test(phone) === false || phone.length < 9 || phone.length > 10) {
            var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
            ExceptionText = arrLang[langPref]['phoneInvalid'];
            // ExceptionText = "Phone number must be 9-10 digits long and contain digits only.";
            returnBoolean = false;
        }
        else {
            ExceptionText = "";
            returnBoolean = true;
        }

    }
    else {
        ExceptionText = "";
        returnBoolean = true;
    }
    document.getElementById("phoneException").innerHTML = ExceptionText;
    return returnBoolean;
}


function showSnackbar() {
    // Get the snackbar DIV
    var x = $('#snackbar');

    // Add the "show" class to DIV
    x.addClass("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.removeClass( "show" ) }, 3000);

}


