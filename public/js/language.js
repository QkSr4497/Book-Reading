var  arrLang={
  'arb':{
    'welcom':'أهلا بك',
    'myPoints':'نقاطك',
    'books':'مكتبة',
    'store':'تسوق',
    'language':'إختر لغة',
    'notifications':'إشعارات',
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
    'groupName':'اسم المجموعة',
    'createdBy':'المؤسس',
    'posts':'منشور',
    'addPost':'أضف منشور',
    'admin':'مشرف',
    'member':'عضو',
    'bookName':' اسم الكتاب: ',
    'author':' المؤلف: ',
    'addToReadingList':'أضف للقراءة',
    'reviews':'تعليقات',
    'addReview':'أضف رأيك',
    'doQuizFirst':'عليك أن تمتحن أولا 😁',
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
    '':'',
    '':'',
    '':'',
    '':'',
  },
  'heb':{
    'welcom':'ברוך הבא ',
    'myPoints':'נקודות שלי',
    'books':'ספריה',
    'store':'חנות',
    'language':' שפה ',
    'notifications':'התראות',
    'home':'🏠דף הבית ',
    'myProfile':'👦פרופיל',
    'myBooks':'📚 רשימת הספרים ',
    'myQuizes':'⏱️בחנים',
    'myNotes':'📄 הערות',
    'myGames':'🎮 משחקים ',
    'myGroups':'👨‍👩‍👧‍👦 קבוצות ',
    'myFriends':'👨‍👩‍ חברים ',
    'myMessages':'✉️ הודעות',
    'myAccount':'💳 חשבון ',
    'myCart':'🛒סל קניות',
    'settings':' 🔧הגדרות',
    'logOut':'🏃 יציאה',
    'userName':'שם משתמש',
    'firstName':'שם פרטי',
    'lastName':'שם משפחה',
    'password':'סיסמא',
    'birthDate':'תאריך לידה',
    'points':'נקודות',
    'update':'עדכן',
    'cancel':'בטל',
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
    'readingToday':'מה תרצה לקרוא היום?',
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


  }
};

$(document).ready(function() {  // getting the langueage preferred by the user from the global variable langPreferred which declared in each page
                                // and translating the page
  var langPref = (langPreferred == 'hebrew') ? 'heb' : 'arb';
    $('.lang').each(function(index ,element){
      $(this).text(arrLang[langPref][$(this).attr('key')]);
      
    });
});

$(document).ready(function() {  // translating the page according to the clicked language
  $('.translate').click(function(){
    var clicked = $(this).attr('id');
    var langClicked = (clicked == 'heb') ? 'hebrew' : 'arabic';
    updateLangPreferred(langPreferred, langClicked);
    $('.lang').each(function(index ,element){
      $(this).text(arrLang[clicked][$(this).attr('key')]);
    });
  });
});

function updateLangPreferred(preferred, clicked) {
  

    var url = '/changeLangPreferred';
    $.ajax({
      url: url,
      type: 'POST',
      data: { lang: clicked },
      success: function (result) {

      },
      error: function (err) {

      }
    });
}