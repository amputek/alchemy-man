// Simplify Box2D variables --- do these all need to be here??????
var b2RayCastInput = Box2D.Collision.b2RayCastInput;
var b2RayCastOutput = Box2D.Collision.b2RayCastOutput;

var SCALE = 8;

//toooooo many singletons
// SINGLETONS - can be accessed globally
var game; //Game Manager --- now only accessed by setup and game
var player; // accessed everywhere apparently
var playerweapon; //gamecanvas, player, trajectory, game, input
var currentLevel; //game, gameobjects, level, input. could probably be replaced by "game" eventually.

var gamePaused = false;

//GLOBAL VARIABLES
var offset = vector(0,0); //canvas, player, camera (set), trajectory
var now = Date.now();

var debugging = false;

var setup;

var potionColor = {
	fire : {r: 201 , g: 50  , b: 16  },
	ice  : {r: 50  , g:155  , b:255  },
	acid : {r: 100 , g:255  , b:50   }
}

window.onload = function(){
	game = new GameManager();
	setup = new SetupGame( game.startGame );
}


//main setup function. will do for now, but could do with cleaner callback structure!
function SetupGame( finishedLoadingCallback ){
	this.finishedLoadingCallback = finishedLoadingCallback;

	this.startLoading = function(){
		debug.log("NEW GAME");
		debug.logline();
		debug.log("Loading Images")
		images.init( this.loadWorld ); // create image manager, with a callback to load world when finished
	}

	this.loadWorld = function(){
		debug.log("Finished loading images");
		debug.logline();
		debug.log("Loading World");
		game.world = new Box2D.Dynamics.b2World( Vector2.b2(0, 10),  true ); // create world
		factory.init(game.world); // create factory
		game.world.SetContactListener( CreateListener() ); // set up listener for world
		playerweapon = new PotionManager();
		game.camera = camera;
		game.trajectory = new Trajectory( game.world.GetGravity() );
		setup.loadLevelManager();
	}

	// Now Images Have Finished Loading
	this.loadLevelManager = function(){
		debug.log("Finished loading world");
		debug.logline();
		debug.log("Loading Levels");
		player = new Player( vector(0,0), game.world )
		// game.levelGenerator = new LevelGenerator( setup.setupInputs );
		LevelJSONDatabase.init( setup.setupInputs );
	}

	//now levels have finished loading
	this.setupInputs = function(){
		debug.log("Finished loading levels");
		debug.logline();
		debug.log("Loading Inputs");
		input.init(playerweapon);
		input.addDomEvents();
    	playerweapon.equip("fire")
		debug.log("Finished loading inputs");
		debug.logline();
		setup.finishedLoadingCallback();
	}

	this.startLoading();
}




//This should include:
//game canvases (don't need to be created every time a level is made!)
//entity collections
//listener collision functions

var GameManager = Class.$extend({

	__init__: function(){
		this.currentLevelIndex = 0;
		// this.levelGenerator = null;
		this.camera = null; //in gameplay manager ?
		this.trajectory = null; //in gameplay manager?
		this.playerDying = false; //in gameplay manager?
		this.loop = null;

		currentLevel = new GameplayManager();
	},

	//now inputs have been set up
	startGame : function(){
		debug.log( "GAME LOAD SUCCESFUL." );
		debug.logline();
		debug.log("Loading Level " + game.currentLevelIndex)
		game.loadLevel( game.currentLevelIndex );
		debug.log("Load of level " + game.currentLevelIndex + ": '" + currentLevel.name + "' complete. Starting game.")
		debug.logline();
		game.update();
	},


	// Main Game update function
	update : function(){
		this.loop = window.requestAnimationFrame( function(){ game.update() } );

		if(gamePaused) return;
		if(debugging) debug.stats.begin();

		//check if current level has finished
		if( currentLevel.checkEnd() ){
			this.nextLevel();
		} else {
			debug.update();
			this.world.Step( 1 / 12, 5, 6);
			currentLevel.update(this.world)
			this.camera.update( player.physicspos, 0.07 );
			if( !this.playerDying && player.isDead() ) game.playerDeath();
		}
		if(debugging) debug.stats.end();
	},

	//called by this.update when current level's end is reached
	nextLevel : function(){
		this.currentLevelIndex++;

		//loop round to level 0 when last level is finished
		if(this.currentLevelIndex == LevelGenerator.database.databaseSize){
			this.currentLevelIndex = 0;
			this.loadLevel( this.currentLevelIndex );
		} else {
			this.loadLevel( this.currentLevelIndex );
		}

	},

	//loadl level of specified index
	loadLevel: function( index ){
		this.currentLevelIndex = index;

		//if no current level "exists", clear it. Otherwise do nothing (eg at start of game)
		if(currentLevel != undefined && currentLevel != null) currentLevel.clearLevel(this.world);

		// get json data from database, pass json data to level loader. set level as current level
		LevelGenerator.generateLevelFromJSONData( index, currentLevel );
		currentLevel.initPlayer();

		//probably dont need to make new camera each time?
		this.camera.reset( currentLevel.physicsSize, player.physicspos );
	},

	playerDeath: function(){


		this.playerDying = true;

		var tempLevelIndex = game.currentLevelIndex;
		debug.log("player death " +  tempLevelIndex);

		var gameOverDom = element("game-over")

		input.removeDomEvents();

		setTimeout(function(){ gameOverDom.style.display = "block" } , 1500);
		setTimeout(function(){ gameOverDom.style.opacity = 1.0;    } , 1600);

		setTimeout(function(){
			cancelAnimationFrame(game.loop);
			game.world.DestroyBody(player.body);
			player = null;
			currentLevel.clearLevel(game.world);
		},2100);

		setTimeout(function(){
			currentLevel = null;
			player = new Player( vector(0,0), game.world );
			game.currentLevelIndex = tempLevelIndex;
			updateHealthDom(player.health);
			setup.setupInputs();
			game.playerDying = false;
		},2150);

		setTimeout(function(){ gameOverDom.style.opacity = 0.0;    },2200)
		setTimeout(function(){ gameOverDom.style.display = "none"; },2700)
	}
});
