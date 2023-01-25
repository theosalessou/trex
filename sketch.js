var START = 1;
var PLAY = 2;
var END = 0;
var gameState = START;

// --

var trex, trex_running, trex_collided;

// --

var ground, invisibleGround, groundImg;
var cloud, cloudImg;
var obstacle, obstacle1Img, obstacle2Img, obstacle3Img, obstacle4Img, obstacle5Img, obstacle6Img;

// --

var score = 0;

// --

var gameOver, gameOverImg;
var restart, restartImg;

// ==

var obstaclesGroup;
var cloudsGroup;

// -- 
var jumpSound , pointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_static = loadImage("trex1.png");
  trex_collided = loadAnimation("trex_collided.png")

  groundImg = loadImage("ground2.png");

  cloudImg = loadImage("cloud.png");

  obstacle1Img = loadImage("obstacle1.png");
  obstacle2Img = loadImage("obstacle2.png");
  obstacle3Img = loadImage("obstacle3.png");
  obstacle4Img = loadImage("obstacle4.png");
  obstacle5Img= loadImage("obstacle5.png");
  obstacle6Img = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.wav")
  dieSound = loadSound("die.wav")
  checkPointSound = loadSound("point.wav")
}


// ---------- FUNCTION SETUP ---------- \\


function setup() {  
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  trex.scale = 0.5;
  trex.x = 50
  trex.addAnimation("running", trex_running);
  trex.addImage("static", trex_static);
  trex.addAnimation("collided", trex_collided)

// trex.debug = false;
// trex.setCollider("circle", 50,180,50)


  ground = createSprite(windowWidth/2,windowHeight,windowWidth,20);
  ground.addImage("ground", groundImg);

  invisibleGround = createSprite(200,windowHeight+5  ,windowWidth,10)
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();
}


// ---------- FUNCTION DRAW ---------- \\


function draw() {
  background("white");
 

    // ---------- START ---------- \\ 


  if (gameState === START){
    
    text("Aperte espaço para iniciar", 50, 50)

    trex.changeImage("static", trex_static);

    gameOver = createSprite(windowWidth/2,windowHeight/2-20);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.8;
  
    restart = createSprite(windowWidth/2,windowHeight/2+20);
    restart.addImage(restartImg);
    restart.scale = 0.7;

    gameOver.visible = false;
    restart.visible = false;

      if (keyWentDown("space")){
      gameState = PLAY;
    }}
  

    // ---------- PLAY ---------- \\


  if (gameState === PLAY){

    text("" + score, 550, 50)
    score = score+Math.round(frameCount/60);

    trex.collide(invisibleGround);

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(touches.length>0|| keyDown("space") && trex.y >= 100){
      trex.velocityY = -12
      jumpSound.play();
      touches=[]
    }
    

    if(score > 0 & score%500 === 0){
      checkPointSound.play();
    }
  
    trex.changeAnimation("running", trex_running);
    trex.velocityY = trex.velocityY + 0.8

    ground.velocityX = -(4 + 3*score/100);
    

    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)){
      dieSound.play();
     gameState = END;
    }

    // ---------- END { ---------- \\

  } else if (gameState === END){
  
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     

    gameOver.visible = true;
    restart.visible = true;

    trex.changeImage("collided", trex_collided)

    if (mouseWentDown("left")){
      gameState = START;

      gameOver.visible = false;
      restart.visible = false;

      cloudsGroup.destroyEach();
      obstaclesGroup.destroyEach();

      score = score-score
      

    // ---------- END } ---------- \\

    }

  }
  
  trex.collide(invisibleGround);

  drawSprites();
}

 function spawnClouds(){ 

  if (frameCount % 60 === 0){
  cloud = createSprite(windowWidth,100,40,10);
  cloud.addImage("cloud", cloudImg);
  cloud.velocityX = -2;
  cloud.scale = 0.7;
  cloud.y = Math.round(random(10,220))
  cloud.depth = trex.depth;
  trex.depth = trex.depth+1;
  cloud.lifetime = 500;

  cloudsGroup.add(cloud);
}}

 function spawnObstacles(){

  if (frameCount % 60 === 0){
  obstacle = createSprite(windowWidth,windowHeight-20,10,10);
  obstacle.velocityX = -(6 + score/100);
  obstacle.scale = 0.55;
  obstacle.lifetime = 320

  obstaclesGroup.add(obstacle);

var rand = Math.round(random(1,6))

  switch (rand) {
    case 1:
      obstacle.addImage(obstacle1Img)
    break;
    case 2:
      obstacle.addImage(obstacle2Img)
    break;
    case 3:
      obstacle.addImage(obstacle3Img)
    break;
    case 4:
      obstacle.addImage(obstacle4Img)
    break;
    case 5:
      obstacle.addImage(obstacle5Img)
    break;
    case 6:
      obstacle.addImage(obstacle6Img)
    break;
    default:
    break;
  }
}
 }
