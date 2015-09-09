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
	},
	update:function (){
		this.game.physics.arcade.collide(this.bird, this.ground);
		//check if our angle is less than 90
		//if it is rotate the bird towards the ground by 2.5 degrees
		if (this.bird.angle<90){
			this.bird.angle +=2.5;
		}


	}
}

//bird class
function Bird(_x, _y ){
	var bird =  game.add.sprite(_x,_y, 'bird');
	bird.anchor.setTo(0.5,0.5);
	bird.animations.add ('flap');
	bird.animations.play('flap',12,true);
	bird.game.physics.arcade.enableBody(bird);
	bird.game.add.existing(bird);
	return bird;
}