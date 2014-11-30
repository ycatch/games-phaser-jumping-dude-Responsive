
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

	this._platforms = null;
	this._player = null;
	this._cursors = null;

	this._stars = null;
	this._score = 0;
	this._scoreText = null;
	this._timeCounter = null;
	this._leftTime = null;
	this._leftTimeText = null;

	this._timesup_title = null;
	this._num_star = 16;
};

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
	
		//  We're going to be using physics, so enable the Arcade Physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);

		//  A simple background for our game
		this.add.sprite(0, 0, 'sky');

		//  The platforms group contains the ground and the 2 ledges we can jump on
		this._platforms = this.add.group();

		//  We will enable physics for any object that is created in this group
		this._platforms.enableBody = true;
		
		// Here we create the ground.
		var ground = this._platforms.create(0, this.world.height - 32, 'ground');
		ground.scale.setTo(2.5, 1);

		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;
		
		//  Now let's create two ledges
		var ledge = this._platforms.create(480, 440, 'ground');
		ledge.body.immovable = true;

		ledge = this._platforms.create(0, 300, 'ground');
		ledge.body.immovable = true;

		
		// ** The score & leftTimme
		this._scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '28px', fill: '#FFF' });

		this._timeCounter = 0;
		this._leftTime = 30;	
		this._leftTimeText = this.add.text(300, 16, 'Time: 0', { fontSize: '28px', fill: '#FFF' });

		// ** The player and its settings
		this._player = this.add.sprite(32, this.world.height - 300, 'dude');

		//  We need to enable physics on the player
		this.physics.arcade.enable(this._player);

		//  Player physics properties. Give the little guy a slight bounce.
		this._player.body.bounce.y = 0.2;
		this._player.body.gravity.y = 300;
		this._player.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		this._player.animations.add('left', [0, 1, 2, 3], 10, true);
		this._player.animations.add('right', [5, 6, 7, 8], 10, true);

		
		//  ** Stars to collect
		this._stars = this.add.group();

		//  We will enable physics for any star that is created in this group
		this._stars.enableBody = true;

		//  Here we'll create stars
		for (var i = 0; i < this._num_star; i++)
		{
			this.makeStar(i * 48 + 32);
		}

		//  Our controls.
		this._cursors = this.input.keyboard.createCursorKeys();
		
		this.getSound = this.add.audio('getSound');
		this.jumpSound = this.add.audio('jumpSound');

    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

		//  Collide the player and the stars with the platforms
		this.physics.arcade.collide(this._player, this._platforms);
		this.physics.arcade.collide(this._stars, this._platforms);

		//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
		this.physics.arcade.overlap(this._player, this._stars, this.collectStar, null, this);

		//  Reset the players velocity (movement)
		this._player.body.velocity.x = 0;
		
		if (this._cursors.left.isDown)
		{
			//  Move to the left
			this._player.body.velocity.x = -120;

			this._player.animations.play('left');
		}
		else if (this._cursors.right.isDown)
		{
			//  Move to the right
			this._player.body.velocity.x = 120;

			this._player.animations.play('right');
		}
		else
		{
			//  Stand still
			this._player.animations.stop();

			this._player.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (this._cursors.up.isDown && this._player.body.touching.down)
		{
			this.jumpSound.play();
			this._player.body.velocity.y = -310;
		}
		
		// update timer every frame
		this._timeCounter += this.time.elapsed;
		// if spawn timer reach one second (1000 miliseconds)
		if(this._timeCounter > 1000) {
			// reset it
			this._timeCounter = 0;
			this._leftTime --;
			this._leftTimeText.text = 'Time: ' + this._leftTime;
		}
		
		if(this._leftTime <= 0) {
			this.quitGame();
		}
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
		this.getSound.stop();
		this._timesup_title = this.add.sprite((this.world.width - 400) / 2, (this.world.height - 100) / 2, 'timesup');
		
		this.game.paused = true;
		var pausedText = this.add.text(240, 360, "Click anywhere to Menu.", { fontSize: '28px', fill: '#FFF' });
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
			this.state.start('MainMenu');
		}, this);
    },

	makeStar: function(x) {
		//  Create a star inside of the 'stars' group
		var star = this._stars.create(x, 0, 'star');

		//  Let gravity do its thing
		star.body.gravity.y = 300;

		//  This just gives each star a slightly random bounce value(0.6 - 0.8)
		star.body.bounce.y = 0.6 + Math.random() * 0.2;
	},

	collectStar: function(player, star) {
    
		// Removes the star from the screen
		star.kill();
		this.getSound.play();
		this.makeStar(Math.floor(Math.random() * this._num_star) * 48 + 32);

		//  Add and update the score
		this._score += 10;
		this._scoreText.text = 'Score: ' + this._score;

	}

};

