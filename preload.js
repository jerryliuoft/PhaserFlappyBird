'use strict';



var PreloadState= {



	preload: function() {

		this.ready = false;
		this.load.image('preloader', 'assets/preloader.gif');
	
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.asset = this.add.sprite (this.width/2, this.height/2, 'preloader');
		this.asset.anchor.setTo (0.5,0.5);
		this.load.setPreloadSprite(this.asset);
	
		this.load.image('background', 'assets/background.png');
		this.load.image('ground','assets/ground.png');
		this.load.image('title','assets/title.png');
		this.load.image('startButton', 'assets/start-button.png');
		this.load.spritesheet('bird','assets/bird.png',34,24,3);
	},

	create:function (){
		this.asset.cropEnabled = false;
	},

	update:function (){
		if(this.ready){
			this.game.state.start('Menu');
		}
	},

	onLoadComplete: function(){
		this.ready = true;
	}
};