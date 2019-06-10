
var totalCart=0;
var price=0;
  $('.product .price').each(function () {
     price +=parseFloat($(this).data('price'));
    console.log('price' + price);
    totalCart += Number(price);
    console.log('totalCart' + totalCart);


  });

$('#cart-total').html(price.toFixed(2));


$(document).ready(function() {
    $('.deleteItem').on('click', function() {    // function will run on click
        var id = $(this).data('id');    // gettin the id from the data-id attribute
        var url = '/kid/cart/delete/' + id;
            $.ajax({
                url: url,
                type:'DELETE',
                success: function(result) {
                console.log('Deleting Game...');
                  window.location.href = '/kid/cart'; // redirection
                },
                error: function(err) {
                    console.log(err);
                }
            });
    });

});

//=================================================================
function checkoutFunction(){
    var total=document.getElementById('cart-total');
     var totaltext=total.textContent;
     var totalCart=Number(totaltext);
     console.log('totalCart'+totalCart);

   var points=document.getElementById('kidPoints');
   //should check when it is null
   if(points==null){
       points=0;
   }
   var pointsText=points.textContent;
   var kidPoints=Number(pointsText);
   console.log('kidPoints'+kidPoints);
  
   var leftOver=kidPoints-totalCart;
   console.log('leftOver'+leftOver);

   if(kidPoints<totalCart){
    var p= document.getElementById("userNameException");
    p.style.display = "block";
    getMessage();
      // userExceptionText = "You don't have enough points 😔";
      // document.getElementById("userNameException").innerHTML = userExceptionText; 
   } 
    else{
        $('.product').each(function () {
         var id =$(this).children('.deleteItem').data('id');
         console.log('id'+ id);
         removeFromCart(id); 
         addToMyGames(id);
         editKidPoints(leftOver);              



       });     
    }   

}//func check out


/* remove from cart after buying  */
function removeFromCart(id)
{
    var url = '/kid/cart/delete/' + id;
    // if (confirm('Delete Game?')) {    // confirming the delete
         $.ajax({
             url: url,
             type:'DELETE',
             success: function(result) {
                 console.log('Deleting Game...');
                window.location.href = '/kid/games'; // redirection
             },
             error: function(err) {
                 console.log(err);
             }
         });
}

/* add games to kid's games */
function addToMyGames(id)
{
    var url = '/kid/games/add' + id;
    // if (confirm('Delete Game?')) {    // confirming the delete
         $.ajax({
             url: url,
             method: 'POST',
             success: function(result) {
                 console.log('Adding Game...');
                window.location.href = '/kid/games'; // redirection
             },
             error: function(err) {
                 console.log(err);
             }
         });
}

/* add games to kid's games */
function editKidPoints(points)
{
   // var newPoits=points;
    var url = '/kid/points/edit' + points;
    // if (confirm('Delete Game?')) {    // confirming the delete
         $.ajax({
             url: url,
             method: 'POST',
             success: function(result) {
                 console.log('Updating Kid Points...');
                 window.location.href = '/kid/games'; // redirection
             },
             error: function(err) {
                 console.log(err);
             }
         });
}


function getMessage(){
    // Get the modal
    var modal = document.getElementById("myModal");
    
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // show the message
      modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function(event) {
    //   if (event.target == modal) {
    //     modal.style.display = "none";
    //   }
    // }
    }