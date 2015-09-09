'use strict';

var MenuState = {
	preload: function (){

	},
	create : function (){
		//add the background sprite
		this.background = this.game.add.sprite (0,0,'background');
		//add the ground sprite as a tile
		//and start scrollign in the negative x direction
		this.ground = this.game.add.tileSprite(0,400,335,112,'ground');
		this.ground.autoScroll(-200,0);

		//create a group to put the title assets in 
		//so they can be maniupated as a whole
		this.titleGroup = this.game.add.group();

		//create the title sprite
		//and add it to the group
		this.title = this.game.add.sprite (0,0, 'title');
		this.titleGroup.add (this.title);

		//create the bird sprite
		//and add it to the title group
		this.bird = this.game.add.sprite (200,5,'bird');
		this.titleGroup.add (this.bird);

		//add an animation to the bird
		//and begin the animation;

		this.bird.animations.add ('flap');
		this.bird.animations.play('flap',12,true);

		//set the originanting location of the group

		this.titleGroup.x= 30;
		this.titleGroup.y = 100;

		//create an oscillating animation tween for the group
		this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);


	},
	update: function (){


	}
};


