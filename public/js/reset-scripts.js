


function checkAllInputs() {

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });
    
    var check = checkPassword();

    
    if (!check) {
        showSnackbar();
        // window.alert("Please Correct all Inputs with red comment");
    }
    else {
        document.myForm.submit(); // Form will be submitted by it's name
    }
}


function checkPassword() {
    var pass1, pass2, ExceptionText1, ExceptionText2, returnBoolean, input1, input2;
    pass1 = document.getElementById("pass1").value;
    pass2 = document.getElementById("pass2").value;
    input1 = $('#pass1');
    input2 = $('#pass2');
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/; // at least six characters and at least one number, one lowercase, one uppercase letter.
    
    if (pass1 === "") {
        // console.log($("#pass1").parent().data('validate'));
        // console.log($("#pass2").parent().data('validate'));
        
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText1 = arrLang[langPref]['passRequired'];
        // ExceptionText1 = "Password is required!";
        ExceptionText2 = "";
        $('#pass1').parent().attr('data-validate', ExceptionText1);
        $('#pass2').parent().attr('data-validate', ExceptionText2);
        showValidate(input1);
        returnBoolean = false;
    }
    else if(!re.test(pass1)) {
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText1 = arrLang[langPref]['passInvalid'];
        // ExceptionText1 = "Password must contain at least 6 characters and at least one number, one lowercase and one uppercase letter.";
        ExceptionText2 = "";
        $('#pass1').parent().attr('data-validate', ExceptionText1);
        $('#pass2').parent().attr('data-validate', ExceptionText2);
        showValidate(input1);
        returnBoolean = false;
    }
    else if(pass2 === "") {
        ExceptionText1 = "";
        // ExceptionText2 = "Repeating password is required!";
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText2 = arrLang[langPref]['confirmPassRequired'];
        $('#pass1').parent().attr('data-validate', ExceptionText1);
        $('#pass2').parent().attr('data-validate', ExceptionText2);
        showValidate(input2);
        returnBoolean = false;
    }
    else if(pass1 != pass2) {
        ExceptionText1 = "";
        // ExceptionText2 = "Passwords Don't Match!";
        var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
        ExceptionText2 = arrLang[langPref]['passMatchInvalid'];
        $('#pass1').parent().attr('data-validate', ExceptionText1);
        $('#pass2').parent().attr('data-validate', ExceptionText2);
        showValidate(input2);
        returnBoolean = false;
    }
    else {
        ExceptionText1 = "";
        ExceptionText2 = "";
        $('#pass1').parent().attr('data-validate', ExceptionText1);
        $('#pass2').parent().attr('data-validate', ExceptionText2);
        returnBoolean = true;
    }
    // document.getElementById("pass1Exception").innerHTML = ExceptionText1;
    // document.getElementById("pass2Exception").innerHTML = ExceptionText2;
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


function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}