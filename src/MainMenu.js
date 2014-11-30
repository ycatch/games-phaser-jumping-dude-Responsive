
BasicGame.MainMenu = function(game) {
	this.music = null;
	this.playButton = null;
};

BasicGame.MainMenu.prototype = {

	create: function() {

	var logo = this.add.sprite(0, 0, 'titlepage');

	var button = this.add.button(this.game.width/2-43, this.game.height - 120,
								'start-button',
								this.startGame,
								this, 1, 0, 2);
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}
};
