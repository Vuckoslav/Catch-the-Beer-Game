/*-----------ONLOAD INIT-----------*/
window.onload = function(){
var c = document.querySelector("canvas");
var canvas = document.querySelector("canvas");
c.width = innerWidth;
c.height = innerHeight;
c = c.getContext("2d");
  
/*-----------CONTROLS-----------*/ 
//mouse & touch 
function startGame(){
mouse = {
  x: innerWidth/2,
  y: innerHeight-33
};
  
touch = {
  x: innerWidth/2,
  y: innerHeight-33
};
  
// mouse 
canvas.addEventListener("mousemove", function(event){
mouse.x = event.clientX;
//mouse.y = event.clientY;
});
// touch
canvas.addEventListener("touchmove", function(event){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var touch = event.changedTouches[0];
  var touchX = parseInt(touch.clientX);
  var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
  event.preventDefault();
  mouse.x = touchX;
  //mouse.y = touchY;
});
  
/*-----------GAME-----------*/  
//player
var player_width = 32;
var player_height = 85;
var playerImg = new Image();
var score = 0;
var health = 100;

//bullet array
var _bullets = []; // hold n bullets
var bulletImg = new Image();
   bulletImg.src = "images/Heart-icon.png";
var bullet_width = 6;
var bullet_height = 8;
var bullet_speed = 8;

//drink array
var _drinks = []; // hold n enemies
var drinkImg = new Image();
var drink_width = 32;
var drink_height = 32;


//health array
var _healthkits = []; // hold n health kits
var healthkitImg = new Image();
healthkitImg.src = "images/hospital.png";  
var healthkit_width = 32;
var healthkit_height = 32;





function choosePlayer(){
  var viking = "images/viking-icon.png";
  var pirate = "images/pirate-icon.png";
  var beer = "images/beer-icon.png";
  var rum = "images/Cuba-Libre-icon.png";
  var userInput = prompt("SELECT THE WARIOR!\n1 is for VIKING and 2 is for PIRATE", 1);   
  if(userInput==1){
    playerImg.src = viking;
    drinkImg.src = beer;
  }
  else if(userInput==2){
    playerImg.src = pirate;
    drinkImg.src = rum;
  }
  else{
    playerImg.src = viking;
    drinkImg.src = beer;
  }
}choosePlayer();






/*-----------GAME OBJECTS-----------*/  
//Player 
function Player(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  
  this.draw = function(){
    c.beginPath();
    c.drawImage(playerImg, mouse.x-player_width, mouse.y-player_height); //draw player and center cursor
  };
  
  this.update = function(){
    this.draw();
  };
}

//Bullet 

function Bullet(x, y, width, height, speed){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  
  this.draw = function(){
    c.beginPath();
    c.drawImage(bulletImg, this.x, this.y);
  };
  
  this.update = function(){
    this.y -= this.speed;
    this.draw();
  };
}


//Drink 
function Drink(x, y, width, height, speed){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  
  this.draw = function(){
    c.beginPath();
    c.drawImage(drinkImg, this.x, this.y);
  };
  
  this.update = function(){
    this.y += this.speed;
    this.draw();
  };
}

//Health kit   
function Healthkit(x, y, width, height, speed){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
  
  this.draw = function(){
    c.beginPath();
    c.drawImage(healthkitImg, this.x, this.y);
  };
  
  this.update = function(){
    this.y += this.speed;
    this.draw();
  };
}
  
/*-----------_new OBJECT-----------*/  

var __player = new Player(mouse.x, mouse.y, player_width, player_height);


function drawDrinks(){
  for (var _ = 0; _<4; _++){  
    var x = Math.random()*(innerWidth-drink_width);
    var y = -drink_height; 
    var width = drink_width;
    var height = drink_height;
    var speed = Math.random()*4.5;
    var __drink = new Drink(x, y, width, height, speed);
    _drinks.push(__drink); 
  }
}setInterval(drawDrinks, 5000);
  
  

function drawHealthkits(){
  for (var _ = 0; _<1; _++){  
    var x = Math.random()*(innerWidth-drink_width);
    var y = -drink_height; 
    var width = healthkit_width;
    var height = healthkit_height;
    var speed = Math.random()*2.6;
    var __healthkit = new Healthkit(x, y, width, height, speed);
    _healthkits.push(__healthkit); 
  }
}setInterval(drawHealthkits, 15000);



  

function fire(){ 
  for (var _ = 0; _<1; _++){
    var x = mouse.x-bullet_width/2;
    var y = mouse.y-player_height;
    var __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
    _bullets.push(__bullet); 
    //shot.play();
  }
}setInterval(fire, 200);
  

canvas.addEventListener("click", function(){
  //fire();
});
  
/*-----------COLLISION -----------*/
function collision(a,b){
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
/*-----------SCORE-----------*/
c.fillStyle = "white";
c.font = "1em Arial";

/*----------- ERROR HANDLING-----------*/
function stoperror() {
  return true;
}  
window.onerror = stoperror;
  
/*-----------LOOP-----------*/
function animate(){
  requestAnimationFrame(animate); 
  c.beginPath(); //begin
  c.clearRect(0,0,innerWidth,innerHeight); 
  c.fillText("Health: " + health, 5, 20); 
  c.fillText("Score: " + score, innerWidth-100, 20); 
  
/*-----------__player, __bullet, __enemy update, __healthkit update-----------*/
  //update _player
  __player.update();
  //update bullets 
  for (var i=0; i < _bullets.length; i++){
    _bullets[i].update();
    if (_bullets[i].y < 0){
      _bullets.splice(i, 1);
    }
  }
  //update drinks 
  for (var k=0; k < _drinks.length; k++){
    _drinks[k].update();
    
    if(_drinks[k].y > innerHeight){
      _drinks.splice(k, 1);
      health -= 10;
    if(health == 0){
      alert("You are DRUNK!!!\nYour score was "+score);
      startGame();
     }
    }
  }
  
  
  for(var j = _drinks.length-1; j >= 0; j--){
    for(var l = _bullets.length-1; l >= 0; l--){
      if(collision(_drinks[j], _bullets[l])){
        _drinks.splice(j, 1);
        _bullets.splice(l, 1);
        score++;
      }
    }
  }
  
  
  for(var h=0; h < _healthkits.length; h++){
    _healthkits[h].update();
  }
  
  for(var hh = _healthkits.length-1; hh >= 0; hh--){
    for(var hhh = _bullets.length-1; hhh >= 0; hhh--){
      if(collision(_healthkits[hh], _bullets[hhh])){
        _healthkits.splice(hh, 1);
        _bullets.splice(hhh, 1);
        health += 10;
      }
    }
  } 
  
} 
animate();
}startGame();
}; 