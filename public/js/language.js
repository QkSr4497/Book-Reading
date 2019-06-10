var  arrLang={
  'arb':{
    'welcom':'أهلا بك',
    'myPoints':'نقاطك',
    'books':'مكتبة',
    'store':'تسوق',
    'language':'إختر لغة',
    'home':'🏠 الصفحة الرئيسية ',
    'myProfile':'👦 حسابي الشخصي ',
    'myBooks':'📚 كتبي ',
    'myQuizes':'⏱️ اختباراتي ',
    'myNotes':'📄 مدوناتي  ',
    'myGames':'🎮 ألعابي ',
    'myGroups':'👨‍👩‍👧‍👦 مجموعاتي ',
    'myFriends':'👨‍👩‍ أصدقائي ',
    'myMessages':'✉️ رسائلي',
    'myAccount':'💳 حسابي البنكي ',
    'myCart':'🛒 سلة مشترياتي  ',
    'settings':' 🔧ضبط ',
    'logOut':'🏃 خروج ',
    'userName':'اسم المستخدم',
    'firstName':'الاسم الشخصي',
    'lastName':'اسم العائلة',
    'password':'كلمة مرور',
    'birthDate':'تاريخ الميلاد',
    'points':'نقاط',
    'update':'تعديل',
    'cancel':'إلغاء',
    'myMessagesList':'✉️ البريد الوارد  ',
    'newMessages':'رسائل جديدة',
    'oldMessages':'رسائل قديمة',
    'sender':'المرسل:',
    'subject':'الموضوع:',
    'play':'إلعب',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
    '':'',
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
