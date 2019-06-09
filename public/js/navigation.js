$(document).ready(function(){
  if ($("#mySidenav").css("display") == 'block') {
    $("#openNav").hide();
  } 
})

function responsiveNav() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  
  
  function openSideNav() {
    document.getElementById("main").style.marginRight = "240px";
    document.getElementById("mySidenav").style.width = "240px";
    document.getElementById("mySidenav").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
  }
  function closeSideNav() {
    document.getElementById("main").style.marginRight = "0%";
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
 
  }
  