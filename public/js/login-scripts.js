// Place your images in an array. The array is held in a global variable,
//  so a long name like random_images_array will help avoid conflicts with any other JavaScript in your page
var random_images_array = ["img-01.png", "img-02.png", "img-03.png", "img-04.png",
    "img-05.png", "img-06.png", "img-07.png", "img-08.png", "img-09.png"];

// choosing random picture
function getRandomImage(imgAr, path) {
    path = path || '../pages/Login/images/'; // default path here
    var num = Math.floor( Math.random() * imgAr.length );
    var img = imgAr[ num ];
    var imgStr = '<img src="' + path + img + '" alt="IMG">';
    document.write(imgStr); document.close();
}