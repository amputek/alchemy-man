// Simplify Box2D variables --- do these all need to be here??????
var b2RayCastInput = Box2D.Collision.b2RayCastInput;
var b2RayCastOutput = Box2D.Collision.b2RayCastOutput;

var SCALE = 8;

//toooooo many singletons
// SINGLETONS - can be accessed globally
var player; // accessed everywhere apparently
var playerweapon; //gamecanvas, player, trajectory, game, input
var gameplay; //game, gameobjects, level, input. could probably be replaced by "game" eventually.

//GLOBAL VARIABLES
var offset = vector(0,0); //canvas, player, camera (set), trajectory

var debugging = false;

window.onload = function(){
	setup = new SetupGame( GameManager.startGame );
}


//main setup function. will do for now, but could do with cleaner callback structure!
function SetupGame( finishedLoadingCallback ){

	var setup = this;

	GameManager.init();

	this.finishedLoadingCallback = finishedLoadingCallback;

	this.startLoading = function(){
		debug.logline("NEW GAME");
		debug.log("Loading Images")
		images.init( this.loadWorld ); // create image manager, with a callback to load world when finished
	}

	this.loadWorld = function(){
		debug.logline("Finished loading images");
		debug.log("Loading World");
		GameManager.world = new Box2D.Dynamics.b2World( Vector2.b2(0, 10),  true ); // create world
		factory.init(GameManager.world); // create factory
		GameManager.world.SetContactListener( CreateListener() ); // set up listener for world
		playerweapon = new PotionManager();
		GameManager.camera = camera;
		GameManager.trajectory = new Trajectory( GameManager.world.GetGravity() );
		setup.loadLevelManager();
	}

	// Now Images Have Finished Loading
	this.loadLevelManager = function(){
		debug.logline("Finished loading world");
		debug.log("Loading Levels");
		player = new Player( vector(0,0), GameManager.world )
		// LevelJSONDatabase.init( setup.setupInputs );
		GameManager.levelGenerator = new LevelGenerator( setup.setupInputs );
	}

	//now levels have finished loading
	this.setupInputs = function(){
		debug.logline("Finished loading levels");
		debug.log("Loading Inputs");
		input.init(playerweapon);
		input.addDomEvents();
    	playerweapon.equip("fire")
		debug.logline("Finished loading inputs");
		setup.finishedLoadingCallback();
	}

	this.startLoading();
}




//This should include:
//game canvases (don't need to be created every time a level is made!)
//entity collections
//listener collision functions

//what does this do that gameplay sholdnt
var GameManager = new JS.Singleton( JS.Class, {

	initialize: function(){
		this.levelIndex = 0;
		this.camera = null; //in gameplay manager ?
		this.trajectory = null; //in gameplay manager?
		this.playerDying = false; //in gameplay manager?
		this.loop = null;
		this.paused = false;
	},

	init: function(){
		gameplay = new GameplayManager();
	},

	//now inputs have been set up
	startGame : function(){
		debug.logline( "GAME LOAD SUCCESFUL." );
		debug.log("Loading Level " + GameManager.levelIndex)
		GameManager.loadLevel( GameManager.levelIndex );
		debug.logline("Load of level " + GameManager.levelIndex + ": '" + gameplay.name + "' complete. Starting GameManager.")
		GameManager.update();
	},

	// Main Game update function
	update : function(){
		this.loop = window.requestAnimationFrame( function(){ GameManager.update() } );

		if(this.paused) return;
		if(debugging) debug.stats.begin();

		//check if current level has finished
		if( gameplay.checkEnd() ){
			this.nextLevel();
		} else {
			debug.update();
			this.world.Step( 1 / 12, 5, 6);
			gameplay.update(this.world)
			this.camera.update( player.physicspos, 0.07 );
			if( !this.playerDying && player.isDead() ) GameManager.playerDeath();
		}
		if(debugging) debug.stats.end();
	},

	//called by this.update when current level's end is reached
	nextLevel : function(){
		this.levelIndex++;

		//loop round to level 0 when last level is finished
		if(this.levelIndex == LevelJSONDatabase.databaseSize){
			this.levelIndex = 0;
			this.loadLevel( this.levelIndex );
		} else {
			this.loadLevel( this.levelIndex );
		}

	},

	//loadl level of specified index
	loadLevel: function( index ){
		this.levelIndex = index;

		//if no current level "exists", clear it. Otherwise do nothing (eg at start of game)
		if(gameplay != undefined && gameplay != null) gameplay.clearLevel(this.world);

		// get json data from database, pass json data to level loader. set level as current level
		this.levelGenerator.generateLevel( index );
		gameplay.initPlayer();

		//probably dont need to make new camera each time?
		this.camera.reset( gameplay.physicsSize, player.physicspos );
	},

	playerDeath: function(){


		this.playerDying = true;

		var tempLevelIndex = GameManager.levelIndex;
		debug.log("player death " +  tempLevelIndex);

		var gameOverDom = element("game-over")

		input.removeDomEvents();

		setTimeout(function(){ gameOverDom.style.display = "block" } , 1500);
		setTimeout(function(){ gameOverDom.style.opacity = 1.0;    } , 1600);

		setTimeout(function(){
			cancelAnimationFrame(GameManager.loop);
			GameManager.world.DestroyBody(player.body);
			player = null;
			gameplay.clearLevel(GameManager.world);
		},2100);

		setTimeout(function(){
			player = new Player( vector(0,0), GameManager.world );
			GameManager.levelIndex = tempLevelIndex;
			updateHealthDom(player.health);
			input.addDomEvents();
			GameManager.startGame();
			GameManager.playerDying = false;
		},2150);

		setTimeout(function(){ gameOverDom.style.opacity = 0.0;    },2200)
		setTimeout(function(){ gameOverDom.style.display = "none"; },2700)
	}
});
