'use strict';

var PlayState = {
	create: function (){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1200;

		//add the background sprite
		this.background = this.game.add.sprite (0,0,'background');

		this.bird = Bird(100, this.game.height/2);
		this.bird.flap = function(){
			this.flapSound.play();
			this.body.velocity.y = - 400;
			//rotate the bird to -40 degrees
			this.game.add.tween(this).to({angle:-40}, 100).start();

		}

		this.ground = this.game.add.tileSprite(0,400,335,112,'ground');
		this.ground.autoScroll(-200,0);
		this.game.physics.arcade.enableBody(this.ground);
		this.ground.body.allowGravity = false;
		this.ground.body.immovable = true;


		// keep the spacebar from propogating up to the browser
		this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
		//add keyboard controls
		var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		flapKey.onDown.addOnce(this.startGame, this);
		flapKey.onDown.add(this.bird.flap, this.bird);

		//add mouse/touch controls
		this.input.onDown.addOnce	(this.startGame, this);
		this.input.onDown.add(this.bird.flap, this.bird);





//create and add a group to hold our pipeGroup
		this.pipes = this.game.add.group();

		this.instructionGroup = this.game.add.group();
		this.instructionGroup.add (this.game.add.sprite(this.game.width/2,100, 'getReady'));
		this.instructionGroup.add (this.game.add.sprite(this.game.width/2,325, 'instructions'));

		this.instructionGroup.setAll ('anchor.x', 0.5);
		this.instructionGroup.setAll ('anchor.y', 0.5);


		this.score = 0;
		this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont', this.score.toString(),24);
		this.scoreText.visible = false;


		this.scoreSound= this.game.add.audio('score');


	},
	update:function (){
		//enable collision between the bird and the ground
		this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
		//enable collisions between the bird and each group in the pipes group
		this.pipes.forEach(function(pipeGroup){
			this.checkScore(pipeGroup);
			this.game.physics.arcade.collide (this.bird, pipeGroup, this.deathHandler, null, this);
		}, this);
		//check if our angle is less than 90
		//if it is rotate the bird towards the ground by 2.5 degrees
		if (this.bird.angle<90 && this.bird.alive){
			this.bird.angle +=2.5;
		}




	},
	generatePipe: function (){
		var pipeY = this.game.rnd.integerInRange(-100,100);

		//new Pipe (game,0,0,0);
		var pipegroup = this.pipes.getFirstExists(false);
		if(!pipegroup){
			pipegroup = new PipeGroup(this.game, this.pipes);

		}
		
		pipegroup.reset(this.game.width + pipegroup.width/2, pipeY)	

	},

	deathHandler: function (){
		this.bird.alive = false;
		this.pipes.callAll ('stop');
		this.pipeGenerator.timer.stop();
		this.ground.stopScroll();
		this.scoreboard = new Scoreboard (game);
		game.add.existing (this.scoreboard);
		//console.log('DEAD!!');
		this.scoreboard.show(this.score);
	},
	checkScore: function (pipeGroup){
		if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x){
			pipeGroup.hasScored = true;
			this.score++;
			this.scoreText.setText (this.score.toString());	
			this.scoreSound.play();
		}

	},

	shutdown: function (){
		this.game.input.keyboard.removeKey (Phaser.Keyboard.SPACEBAR);
		this.bird.destroy();
		this.pipes.destroy();
		this.scoreboard.destroy();
	},

	startGame: function (){
		this.bird.body.allowGravity = true;
		this.bird.alive = true;
		//add a timer
		this.pipeGenerator = this.game.time.events.loop (Phaser.Timer.SECOND*1.25, this.generatePipe, this);
		this.pipeGenerator.timer.start();
		this.instructionGroup.destroy();
		this.scoreText.visible = true;

	}
};

//bird class
function Bird(_x, _y ){
	var bird =  game.add.sprite(_x,_y, 'bird');
	bird.anchor.setTo(0.5,0.5);
	bird.animations.add ('flap');
	bird.animations.play('flap',12,true);
	bird.game.physics.arcade.enableBody(bird);
	bird.body.allowGravity = false;
	bird.checkWorldBounds = true;
	bird.outofBoundsKill = true;
	bird.alive = false;
	bird.flapSound = game.add.audio('flap');
	//bird.game.add.existing(bird);
	return bird;
};

//pipe class
// 0 for down, 1 for up : frame
 function Pipe(game, x, y, frame ){
	console.log('in Pipe!');
	Phaser.Sprite.call(this, game, x, y, 'pipe');
	console.log('created Pipe!');
	this.anchor.setTo(0.5,0.5);
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity= false;
	this.body.immovable = true;
	this.frame = frame;
	game.add.existing(this);
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;
// group to group the top and bottom pipes

function PipeGroup (game, parent){
	console.log('generating pipes in PipeGroup!');
	Phaser.Group.call (this, game, parent);

	this.topPipe = new Pipe(game,0,0,0);
	this.add(this.topPipe);
	this.bottomPipe = new Pipe(game, 0, 440, 1);
	this.add(this.bottomPipe);

	this.hasScored = false;
	this.setAll('body.velocity.x', -200);
}
PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;
PipeGroup.prototype.reset = function (x,y){
	this.topPipe.reset(0,0);
	this.bottomPipe.reset(0,440);
	this.x =x;
	this.y = y;
	this.setAll('body.velocity.x', -200);
	this.hasScored = false;
	this.exists = true;

}
PipeGroup.prototype.checkWorldBounds = function (){
	if(!this.topPipe.inWorld){
		this.exists = false;
	}
};
PipeGroup.prototype.update = function (){
	this.checkWorldBounds();
}

function Scoreboard (game){
	//console.log('in Scoreboard');
	var gameover;

	Phaser.Group.call (this, game);
	gameover = this.create(this.game.width/2, 100, 'gameover');
	gameover.anchor.setTo(0.5,0.5);
	

	this.scoreboard = this.create(this.game.width/2, 200, 'scoreboard');
	this.scoreboard.anchor.setTo(0.5,0.5);


	this.scoreText = this.game.add.bitmapText (this.scoreboard.width, 180, 'flappyfont', '', 18 );
	this.add(this.scoreText);

	this.bestScoreText = this.game.add.bitmapText (this.scoreboard.width, 230, 'flappyfont', '', 18);
	this.add(this.bestScoreText);

	//add our start button with a callback
	this.startButton = this.game.add.button (this.game.width/2, 300, 'startButton', this.startClick, this);
	this.startButton.anchor.setTo(0.5,0.5);

	this.add(this.startButton);

	this.y = this.game.height;
	this.x = 0;
	//console.log('OutScoreBoard!!');

};
Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;
Scoreboard.prototype.show = function (score){
	var medal,bestScore;
	//setp 1
	this.scoreText.setText(score.toString());
	if(localStorage){
		bestScore = localStorage.getItem('bestScore');
		if(!bestScore || bestScore<score){
			bestScore = score;
			localStorage.setItem('bestScore',bestScore);
		}

	}else{
		//FallBack . localstorage isn't available
		bestScore= 'N/A';
	}

	this.bestScoreText.setText(bestScore.toString());

	if(score >= 10 && score< 20){
		medal = this.game.add.sprite (-65, 7, 'medals', 1);
		medal.anchor.setTo(0.5,0.5);
		this.scoreboard.addChild(medal);

	}else if (score >=20){
		medal = this.game.add.sprite (-65,7,'medals',0);
		medal.anchor.setTo(0.5,0.5);
		this.scoreboard.addChild(medal);
	}


	if(medal){
		var emitter = this.game.add.emitter(medal.x, medal.y, 400);
		this.scoreboard.addChild(emitter);
		emitter.width = medal.width;
		emitter.height = medal.height;
		emitter.makeParticles('particle');
		emitter.setRotation (-100,100);
		emitter.setXSpeed(0,0);
		emitter.setYSpeed(0,0);
		emitter.minParticleScale= 0.25;
		emitter.maxParticleScale = 0.5;
		emitter.setAll('body.allowGravity', false);

		emitter.start(false,1000,1000);

	}

	this.game.add.tween(this).to ({y:0}, 1000, Phaser.Easing.Bounce.Out, true);
};
Scoreboard.prototype.startClick= function(){
	this.game.state.start('Play');
}

