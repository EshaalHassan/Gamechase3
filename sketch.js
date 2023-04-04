var canvas;
var backgroundImage,thiefImg,policeImg, trackImage;
var obstacle1Image, obstacle2Image;                        //C41// SA
var database, gameState;
var form, player, playerCount;
var allPlayers, thief, police,obstacle1,obstacle2; // C41//SA
var catchImage;                   //C42// SA
var playersArray = [];
var fuels, jewellery,obstacles;
var fuelImg;
var cars;

function preload() {
  backgroundImage=loadImage("assets/background.jpg");
  thiefImg=loadImage("assets/CARS/thiefvan.png");
  policeImg=loadImage("assets/CARS/policecar.png");
  fuelImg=loadImage("assets/fuel.png");
  car1Img=loadImage("assets/CARS/car1.png");
  car2Img=loadImage("assets/CARS/car2.png");
  trackImage=loadImage("assets/track.jpg");
  
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
