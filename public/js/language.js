var  arrLang={
    'arb':{
      'home':'الصفحة الرئيسية',
      'myProfile':'حسابي الشخصي',
      'myBooks':'كتبي',
      'myQuizes':'اختباراتي',
      'myNotes':'مدوناتي',
      'myGames':'ألعابي',
      'myGroups':'مجموعاتي',
      'myFriends':'أصدقائي',
      'myAccount':'حسابي البنكي',
      'myCart':'سلة مشترياتي',
      'settings':'ضبط',
      'settings':'خروج'
    },
    'heb':{
      'home':'בית',
      'myProfile':'حسابي الشخصي',
      'myBooks':'كتبي',
      'myQuizes':'اختباراتي',
      'myNotes':'مدوناتي',
      'myGames':'ألعابي',
      'myGroups':'مجموعاتي',
      'myFriends':'أصدقائي',
      'myAccount':'حسابي البنكي',
      'myCart':'سلة مشترياتي',
      'settings':'ضبط',
      'settings':'خروج'
    }
  };

  $(function(){
    $('.translate').click(function(){
      var lang=$(this).attr('id');
      $('.lang').each(function(index,element){
        $(this).text(arrLang[lang][$(this).attr('key')]);
      })
    })
  });
  