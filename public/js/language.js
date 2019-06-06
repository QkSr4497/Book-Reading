var  arrLang={
  'arb':{
    'welcom':'أهلا بك',
    'myPoints':'نقاطك',
    'books':'مكتبة',
    'store':'تسوق',
    'language':'إختر لغة',
    'open':' إضغط',
    'home':'🏠 الصفحة الرئيسية ',
    'myProfile':'👦 حسابي الشخصي ',
    'myBooks':'📚 كتبي ',
    'myQuizes':'⏱️ اختباراتي ',
    'myNotes':'📄 مدوناتي  ',
    'myGames':'🎮 ألعابي ',
    'myGroups':'👨‍👩‍👧‍👦 مجموعاتي ',
    'myFriends':'👨‍👩‍ أصدقائي ',
    'myAccount':'💳 حسابي البنكي ',
    'myCart':'🛒 سلة مشترياتي  ',
    'settings':' 🔧ضبط ',
    'logOut':'🏃 خروج ',
    'myBookBoard':'📚 لائحة كتبي ',
    'readingToday':'ماذا ستقرأ اليوم؟',
    'booksIWantToRead':'كتب أريد قراءتها',
    'booksIamReading':'كتب أقرأها الآن',
    'finishedBooks':'كتب انتهيت من قراءتها',
    'gameStor':'  🎲 حانوت ألعاب',
    'addToCart':'أضف الى السلة',
    'shoppingCart':'🛒 سلة التسوق ',
    'totalAmount':'المجموع الكلي',
    'checkout':'إدفع',
    'enoughMoney':'لا تملك عدد النقاط الكافي حتى تتم عملية الشراء 😔',
    'addNote':' أضف مدونة جديدة',
    '':'',
    '':'',
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
$(document).ready(function() {
  $('.translate').click(function(){
    var lang=$(this).attr('id');
    $('.lang').each(function(index ,element){
      $(this).text(arrLang[lang][$(this).attr('key')]);
    });
  });
});
