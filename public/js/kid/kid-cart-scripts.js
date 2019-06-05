$(document).ready(function() {
    $('.deleteItem').on('click', function() {    // function will run on click
        var id = $(this).data('id');    // gettin the id from the data-id attribute
        var url = '/kid/cart/delete/' + id;
       // if (confirm('Delete Game?')) {    // confirming the delete
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
       // recalculateCart();
      //  }
    });

});

//=================================================================
function checkoutFunction(){
    var total=document.getElementById('cart-total');
     var totaltext=total.textContent;
     var totalCart=Number(totaltext);
     console.log(totalCart);

   var points=document.getElementById('kidPoints');
   var pointsText=points.textContent;
   var kidPoints=Number(pointsText);
   console.log(kidPoints);
  
   var leftOver=kidPoints-totalCart;
   console.log('leftOver'+leftOver);

   if(kidPoints<totalCart){
       userExceptionText = "You don't have enough points 😔";
       document.getElementById("userNameException").innerHTML = userExceptionText; 
   } 
    else{
        $('.product').each(function () {
         var id =$(this).children('.deleteItem').data('id');
         console.log('id'+ id);
         editKidPoints(leftOver);
        // removeFromCart(id);      
        // addToMyGames(id);


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
                window.location.href = '/kid/cart'; // redirection
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
             },
             error: function(err) {
                 console.log(err);
             }
         });
}
