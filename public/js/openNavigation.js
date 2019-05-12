// to open and close left side navbar
function openNav() {
document.getElementById("mySidenav").style.width = "200px";
document.getElementById("main").style.marginLeft = "200px";
}

function closeNav() {
document.getElementById("mySidenav").style.width = "0";
document.getElementById("main").style.marginLeft= "20px";
}


//responsive navbar
function responsiveNavigation() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
    x.className += " responsive";
    } else {
    x.className = "topnav";
    }
}