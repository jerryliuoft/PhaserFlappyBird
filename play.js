'use strict';

var PlayState = {
	create: function (){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1200;

		//add the background sprite
		this.background = this.game.add.sprite (0,0,'background');

		this.bird = Bird(100, this.game.height/2);
		this.bird.flap = function(){
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
		flapKey.onDown.add(this.bird.flap, this.bird);

		//add mouse/touch controls

		this.input.onDown.add(this.bird.flap, this.bird);


		//add a timer
		this.pipeGenerator = this.game.time.events.loop (Phaser.Timer.SECOND*1.25, this.generatePipe, this);
		this.pipeGenerator.timer.start();

	},
	update:function (){
		this.game.physics.arcade.collide(this.bird, this.ground);
		//check if our angle is less than 90
		//if it is rotate the bird towards the ground by 2.5 degrees
		if (this.bird.angle<90){
			this.bird.angle +=2.5;
		}


	},
	generatePipe: function (){
		var pipeY = this.game.rnd.integerInRange(-100,100);

		//new Pipe (game,0,0,0);
		var pipegroup = new PipeGroup(this.game);
		pipegroup.x = this.game.width;
		pipegroup.y = pipeY;	

	}
};

//bird class
function Bird(_x, _y ){
	var bird =  game.add.sprite(_x,_y, 'bird');
	bird.anchor.setTo(0.5,0.5);
	bird.animations.add ('flap');
	bird.animations.play('flap',12,true);
	bird.game.physics.arcade.enableBody(bird);
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
}
PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;
