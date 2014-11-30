
BasicGame.Preloader = function (game) {

  this.preloadBar = null;

  this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    // Create a progress bar based on cropping on image
    this.preloadBar =
      this.add.sprite(this.game.width/2, this.game.height/2, 'preloader-bar');
    this.preloadBar.pivot.x = this.preloadBar.width/2;
    this.preloadBar.pivot.y = this.preloadBar.height/2;

    this.load.setPreloadSprite(this.preloadBar);


    // Load game assets here...

    this.load.spritesheet('duke', 'assets/spritesheet-duke.png', 50, 72);
	
	this.load.image('titlepage', 'assets/images/title_800x600.png');
	this.load.image('sky', 'assets/images/sky-dark.png');
	this.load.image('ground', 'assets/images/platform320.png');
	this.load.image('star', 'assets/images/star.png');
	this.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
	this.load.spritesheet('start-button', 'assets/ui/button.png', 87, 48);

	this.load.image('timesup', 'assets/images/timesup.png');

	this.load.audio('getSound', ['assets/audio/jump08.mp3']);
	this.load.audio('jumpSound', ['assets/audio/idou_ochiru_normal.mp3']);	

  },

  create: function () {

    this.preloadBar.cropEnabled = false;
	this.state.start('MainMenu');

  },

};
