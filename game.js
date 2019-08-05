const _WIDTH_ = 700;	//OG WIDTH is 450

//Preload all the images needed
function preload() {
  //this.load.image('bug1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
  this.load.image('bug1', 'images/Untitled.png');
  this.load.image('bug2', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png');
  this.load.image('bug3', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_3.png');
  //this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
  this.load.image('platform', 'images/platform.png');
  this.load.image('codey', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/codey.png');
}

//initialize the gameState object. Give it a proper of score, set to 0
const gameState = {
  score: 0
};

//Creates the game world.
function create() {
  //gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);	//Add the sprite 'codey' from the image, make it affected by physics
  gameState.player = this.physics.add.sprite(_WIDTH_ / 2, 450, 'codey').setScale(.5);
  
  
  const platforms = this.physics.add.staticGroup();		//Make this platform NOT affected by gravity.
  //platforms.create(225, 490, 'platform').setScale(1, .3).refreshBody();
  platforms.create(_WIDTH_ / 2, 490, 'platform').setScale(1, .3).refreshBody();


  gameState.scoreText = this.add.text(195, 485, 'Score: 0', { fontSize: '15px', fill: '#000000' }); //Add the text in at the bottom.
  

  gameState.player.setCollideWorldBounds(true);		//Make is so players stay within the frame of the game

  this.physics.add.collider(gameState.player, platforms);		//Make it so the player doesn't fall beneath the platform.
  
  gameState.cursors = this.input.keyboard.createCursorKeys();		//set up keyboard input for the gameState

  const bugs = this.physics.add.group();	//returns a Group object to bugs that I can use to organize multiple enemy sprites

  function bugGen () {			//define a function that randomly generates bugs at the top of the screen
    const xCoord = Math.random() * _WIDTH_;
    bugs.create(xCoord, 10, 'bug1');	//actually creates the bugs
  }

  const bugGenLoop = this.time.addEvent({		//delays the creation of the bugs to every 100 miliseconds
    //delay: 125,
	delay: 80,
    callback: bugGen,
    callbackScope: this,
    loop: true,
  });

  this.physics.add.collider(bugs, platforms, function (bug) {	//Collides the bugs with the platform and destroys the bugs, and increases the score
    bug.destroy();
    gameState.score += 10;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
  })
  
  this.physics.add.collider(gameState.player, bugs, () => {		//Sets up the endgame for when a player and a bug collide. Ends the game.
    bugGenLoop.destroy();
    this.physics.pause();
    this.add.text(152, 250, 'You suck man', { fontSize: '15px', fill: '#000000' });
    this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
    
		
    this.input.on('pointerup', () =>{
      gameState.score = 0;
    	this.scene.restart();
    }); //end this.input.on(pointerup)
  }); //end this.physics.add.collider(gameState.player, bugs)
}// end function create()

function update() {
  if (gameState.cursors.left.isDown) {
    gameState.player.setVelocityX(-300);
  } else if (gameState.cursors.right.isDown) {
    gameState.player.setVelocityX(300);
  } else {
    gameState.player.setVelocityX(0);
  }
}

const config = {
  type: Phaser.AUTO,
  //type: Phaser.CANVAS,
  //width: 450,
  width: _WIDTH_,
  height: 500,
  //backgroundColor: "b9eaff",
  backgroundColor: "f5a031",
  physics: {
    default: 'arcade',
    arcade: {
      //gravity: { y: 200 },
	  gravity: { y: 500 },
      enableBody: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
