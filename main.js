'use strict';


var game;

var game = new Phaser.Game(288, 505,Phaser.AUTO, 'flappy-bird-reborn');


//Game States
game.state.add('Menu', MenuState);

game.state.add('Preload', PreloadState);
game.state.add('Play', PlayState);

game.state.start('Preload');
