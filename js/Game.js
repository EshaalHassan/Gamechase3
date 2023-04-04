class Game {
    constructor() {
      this.resetTitle = createElement("h2");
      this.resetButton = createButton("");
      this.playerMoving = false;
      this.leftKeyActive = false;
      this.blast = false; //C42//SA
    }
  
    update(count) {
      database.ref("/").update({
        gameState: count
      });
    }
    getState() {
      var gameStateRef = database.ref("gameState");
      gameStateRef.on("value", function(data) {
        gameState = data.val();
      });
    }
  
    start() {
      player = new Player();
      playerCount = player.getCount();
  
      form = new Form();
      form.display();
  
     thief = createSprite(width / 2 - 500, height - 300);
     thief.addImage("theifImg", thiefImg);
    // thief.scale = 0.07; 
  
    //  car1.addImage("blast", blastImage); //C42 //SA
  
      police = createSprite(width / 2 + 100, height - 100);
      police.addImage("policeImg",policeImg);
     // police.scale = 0.07;
  
     // car2.addImage("blast", blastImage); //C42//SA
     
      playersArray = [police,thief];
  
      fuels = new Group();
      jewellery = new Group();
      obstacles = new Group(); //C41 //SA
  
      // Adding fuel sprite in the game
      this.addSprites(fuels, 4, fuelImg, 0.02);
  
      // Adding coin sprite in the game
    //  this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
  
      //C41 //BP //SA
      var obstaclesPositions = [
        { x: width / 2 + 250, y: height - 800, image: car1Img },
        { x: width / 2 - 150, y: height - 1300, image: car1Img },
        { x: width / 2 + 250, y: height - 1800, image: car1Img },
        { x: width / 2 - 180, y: height - 2300, image: car2Img},
        { x: width / 2, y: height - 2800, image: car2Img },
        { x: width / 2 - 180, y: height - 3300, image: car1Img },
        { x: width / 2 + 180, y: height - 3300, image: car2Img },
        { x: width / 2 + 250, y: height - 3800, image: car2Img },
        { x: width / 2 - 150, y: height - 4300, image: car1Img },
        { x: width / 2 + 250, y: height - 4800, image: car2Img },
        { x: width / 2, y: height - 5300, image: car1Img },
        { x: width / 2 - 180, y: height - 5500, image: car2Img }
      ];
  
      //Adding obstacles sprite in the game
      this.addSprites(
        obstacles,
        obstaclesPositions.length,
        car2Img,
        0.4,
        obstaclesPositions
      );
    }
  
    //C41 //SA
    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
      for (var i = 0; i < numberOfSprites; i++) {
        var x, y;
  
        //C41 //SA
        if (positions.length > 0) {
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].image;
        } else {
          x = random(width / 2 + 150, width / 2 - 150);
          y = random(-height * 4.5, height - 400);
        }
        var sprite = createSprite(x, y);
        sprite.addImage("sprite", spriteImage);
  
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
    }
  
    
  
    play() {
      this.handleElements();
      this.handleResetButton();
  
      Player.getPlayersInfo();
     
  
      if (allPlayers !== undefined) {
        image(trackImage, 0, -height * 5, width, height * 6);
  
        this.showFuelBar();
        //this.showLife();
        
  
        //index of the array
        var index = 0;
        for (var plr in allPlayers) {
          //add 1 to the index for every loop
          index = index + 1;
  
          //use data form the database to display the cars in x and y direction
          var x = allPlayers[plr].positionX;
          var y = height - allPlayers[plr].positionY;
  
          //C42//TA
  
          playersArray[index - 1].position.x = x;
          playersArray[index - 1].position.y = y;
  
          if (index === player.index) {
            stroke(10);
            fill("red");
            ellipse(x, y, 60, 60);
  
            this.handleFuel(index);
           // this.handlePowerCoins(index);
           // this.handleCarACollisionWithCarB(index); //C41//BP//TA
            //this.handleObstacleCollision(index); //C41//SA
  
            //C42//TA
            // if (player.life <= 0) {
            //   this.blast = true;
            //   this.playerMoving = false;
            // }
  
            // Changing camera position in y direction
            camera.position.y = playersArray[index - 1].position.y;
          }
        }
  
        if (this.playerMoving) {
          player.positionY += 5;
          player.update();
        }
  
        // handling keyboard events
        this.handlePlayerControls();
  
        // Finshing Line
        const finshLine = height * 6 - 100;
  
        if (player.positionY > finshLine) {
          gameState = 2;
          player.rank += 1;
          Player.updateCarsAtEnd(player.rank);
          player.update();
          this.showRank();
        }
  
        drawSprites();
      }
    }
    handleElements() {
      form.hide();
      form.titleImg.position(40, 50);
      form.titleImg.class("gameTitleAfterEffect");
  
      this.resetTitle.html("Reset Game");
      this.resetTitle.class("resetText");
      this.resetTitle.position(width-150, 40);
  
      this.resetButton.class("resetButton");
      this.resetButton.position(width-100, 100);
  
    }

  
    handleFuel(index) {
      // Adding fuel
      playersArray[index - 1].overlap(fuels, function(collector, collected) {
        player.fuel = 185;
        //collected is the sprite in the group collectibles that triggered
        //the event
        collected.remove();
      });
  
      // Reducing Player car fuel
      if (player.fuel > 0 && this.playerMoving) {
        player.fuel -= 0.3;
      }
  
      if (player.fuel <= 0) {
        gameState = 2;
        this.gameOver();
      }
    }
  
    // handlePowerCoins(index) {
    //   cars[index - 1].overlap(powerCoins, function(collector, collected) {
    //     player.score += 21;
    //     player.update();
    //     //collected is the sprite in the group collectibles that triggered
    //     //the event
    //     collected.remove();
    //   });
    // }
  
    handleResetButton() {
      this.resetButton.mousePressed(() => {
        database.ref("/").set({
          carsAtEnd: 0,
          playerCount: 0,
          gameState: 0,
          palyers: {}
        });
        window.location.reload();
      });
    }
  
    showFuelBar() {
      push();
      image(fuelImg, width / 2 - 130, height - player.positionY - 450, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 450, 185, 20);
      fill("#ffc400");
      rect(width / 2 - 100, height - player.positionY - 450, player.fuel, 20);
      noStroke();
      pop();
    }
  
    // showLife() {
    //   push();
    //   image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
    //   fill("white");
    //   rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    //   fill("#f50057");
    //   rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    //   noStroke();
    //   pop();
    // }
  

  
    handlePlayerControls() {
      //C41 //TA
      if (!this.blast) {
        if (keyIsDown(UP_ARROW)) {
          this.playerMoving = true;
          player.positionY += 10;
          player.update();
        }
  
        if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
          this.leftKeyActive = true;
          player.positionX -= 5;
          player.update();
        }
  
        if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
          this.leftKeyActive = false;
          player.positionX += 5;
          player.update();
        }
      }
    }
  
    //C41 //SA
    handleObstacleCollision(index) {
      if (cars[index - 1].collide(obstacles)) {
        //C41 //TA
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
  
        //C41 //SA
        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
  
        player.update();
      }
    }
  
    //C41 //TA //Bp
    handleCarACollisionWithCarB(index) {
      if (index === 1) {
        if (cars[index - 1].collide(cars[1])) {
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
  
          //Reducing Player Life
          if (player.life > 0) {
            player.life -= 185 / 4;
          }
  
          player.update();
        }
      }
      if (index === 2) {
        if (cars[index - 1].collide(cars[0])) {
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
  
          //Reducing Player Life
          if (player.life > 0) {
            player.life -= 185 / 4;
          }
  
          player.update();
        }
      }
    }
  
    showRank() {
      swal({
        title: `FINALLY SOMEONE ONE WHICH IS YOU!!!:)${"\n"}Rank${"\n"}${player.rank}`,
        text: "YOU PASSED THIS ONLINE DRIVING TEST!!",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
    }
  
    gameOver() {
      swal({
        title: `BE BETTER AT PLAYING MY GAME!!:()`,
        text: "PASS! YOUR DRIVING TEST!!!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "BYEE!!!"
      });
    }
    end() {
      console.log("Game Over");
    }
  }
  