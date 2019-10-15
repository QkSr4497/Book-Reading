// Place your images in an array. The array is held in a global variable,
//  so a long name like random_images_array will help avoid conflicts with any other JavaScript in your page
var random_images_array = [
    "img-01.png",
    "img-02.png",
    "img-03.png",
    "img-04.png",
    "img-05.png",
    "img-06.png",
    "img-07.png",
    "img-08.png",
    "img-09.png",
    "img-10.png"];

var attribution_a_content_array = [
    `a title="No Attribution Required For This Picture"`, // "img-01.png"
    `a title="https://www.clipartmax.com/middle/m2i8i8G6i8A0m2b1_book-lists-and-resources-for-children-owl-in-nest-clipart/" `, // "img-02.png"
    `a title="No Attribution Required For This Picture"`, // "img-03.png"
    `a title="https://www.clipart.email/download/103494.html" `, // "img-04.png"
    `a title="No Attribution Required For This Picture"`, // "img-05.png"
    `a title="No Attribution Required For This Picture"`, // "img-06.png"
    `a title="http://pluspng.com/animals-reading-png-hd-8232.html"`, // "img-07.png"
    `a title="No Attribution Required For This Picture"`, // "img-08.png"
    `a title="https://www.disneyclips.com/images/toystory.html"`, // "img-09.png"
    `a title="https://www.vecteezy.com/free-vector/reading"`]; // "img-10.png"

// choosing random picture
function getRandomImage(imgAr, attributionArr, path) {
    path = path || '/pages/Login/images/'; // default path here
    var num = Math.floor( Math.random() * imgAr.length );
    var img = imgAr[ num ];
    var aContentStr = attributionArr[num];
    var imgStr = '<img src="' + path + img + '" alt="IMG">';
    var htmlStr = `<${aContentStr}>${imgStr}</a>`;
    document.write(htmlStr); document.close();
}