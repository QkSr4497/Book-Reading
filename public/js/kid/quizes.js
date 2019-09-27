function searchQuiz() {
    // Declare variables
    var input, filter, ul, li, p, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("quizUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      p = li[i].getElementsByTagName("p")[0];
      txtValue = p.textContent || p.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
  
  function searchDoneQuiz() {
    // Declare variables
    var input, filter, ul, li, p, i, txtValue;
    input = document.getElementById('searchInputDoneQuiz');
    filter = input.value.toUpperCase();
    ul = document.getElementById("doneQuizUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      p = li[i].getElementsByTagName("p")[0];
      txtValue = p.textContent || p.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }