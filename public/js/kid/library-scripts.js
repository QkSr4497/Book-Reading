$(document).ready(function () {
    filterByLanguage(langPreferred);
    updateSelectLngDefault(langPreferred);
    
});


function filterByLanguage(language) {
    li = $('#myUL a');
    for (i = 0; i < li.length; i++) {
        console.log(li.eq(i).attr("data-book-language"))
        var bookLngIterator = li.eq(i).attr("data-book-language");
        if (bookLngIterator == language) {
            li.eq(i).css('display', '');
        }
        else {
            li.eq(i).css('display', 'none');
        }
    }
}

function filterOff() {
    li = $('#myUL a');
    for (i = 0; i < li.length; i++) {
        li.eq(i).css('display', '');
    }
}

function searchFilter() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("a");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("p")[0];
        var bookLngIterator = li[i].getAttribute("data-book-language");

        var e = document.getElementById("filterLngSelect");
        var filterLangSelect = e.options[e.selectedIndex].value;
        var lngFilter = (filterLangSelect == 'all') ? true : (bookLngIterator == filterLangSelect);
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1 && lngFilter) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

$('#filterLngSelect').on('change', function() {
    if( this.value == 'all' ) {
        filterOff();
    }
    else {
        filterByLanguage(this.value);
    }
  });

  function updateSelectLngDefault(language) {
    $("#filterLngSelect").val(language).change();
  }