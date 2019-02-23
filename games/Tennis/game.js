var canvas;
var canvasContext;
var ballX=50;
var ballY=50;
var ballXspeed=5;
var ballYspeed=5;
var paddleBottom=250;
var paddleTop=250;
const PADDLE_HEIGHT=50;

window.onload=function(){
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  var framepersecond=30;
  setInterval(function(){
    moveSpirit();
    drawSpirit();
  },1000/framepersecond);
}



function drawSpirit(){
  //drawing canvas
  drawShape(0,0,canvas.width,canvas.height,'black');
  //drawing ball
  drawShape(ballX,ballY,20,20,'white');
  //drawing player paddle (bottom)
  drawShape(0,paddleBottom,10,PADDLE_HEIGHT,'white');
  //drawing computer paddle (top)
  drawShape(50,paddleTop,10,PADDLE_HEIGHT,'white');
  //draw center field

}

function drawShape(leftX, topY, width,height,drawColor){
 canvasContext.fillStyle=drawColor;
 canvasContext.fillRect(leftX,topY,width,height);
}

 function moveSpirit(){
   ballX+=ballXspeed;
   ballY+=ballYspeed;
   if(ballX>canvas.width){
     ballXspeed=-ballXspeed;
   }
   if(ballX<0){
     ballXspeed=-ballXspeed;
   }
   if(ballY>canvas.height){
     ballYspeed=-ballYspeed;
   }
   if(ballY<0){
     ballYspeed=-ballYspeed;
   }
 }
