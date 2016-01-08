// Simplify Box2D variables --- do these all need to be here??????
var b2RayCastInput = Box2D.Collision.b2RayCastInput;
var b2RayCastOutput = Box2D.Collision.b2RayCastOutput;
var b2Vec2 = Box2D.Common.Math.b2Vec2;


var SCALE = 8;

//toooooo many singletons
// SINGLETONS - can be accessed globally
var game; //Game Manager
var images; // accessed by game objects and level manager
var debug; // accessed by everything
var camera; // accesed by: GAME, and Level Manager
var trajectory
var player; // accessed everywhere apparently
var input; //accessed by: Player (needs shoot angle?), Trajectory, Potion Manager (tells reticule what colour to be),
var factory; //called from many game objects. could make this a class variable for game object?
var playerweapon; //gamecanvas, trajectory, game, input


//GLOBAL VARIABLES
var gamespeed = 1.0;
var offset = vector(0,0)
var now = Date.now();
var currentLevel;
var debugging = false;

var setup;


window.onload = function(){
	game = new GameManager();
	setup = new SetupGame( game.startGame );
}

function SetupGame( finishedLoadingCallback ){
	this.finishedLoadingCallback = finishedLoadingCallback;

	this.startLoading = function(){
		debug   = new Debug(); // create debugger
		images  = new ImageManager( this.loadWorld ); // create image manager, with a callback to load world when finished
	}

	this.loadWorld = function(){
		debug.log("--- Finished loading images");
		debug.log("Loading World");
		game.world = new Box2D.Dynamics.b2World(new b2Vec2(0, 10),  true ); // create world
		factory = new Factory(game.world); // create factory
		game.world.SetContactListener( CreateListener() ); // set up listener for world
		playerweapon = new PotionManager();
		camera = new Camera( vector(0,0), vector(0,0) );  //create camera
		trajectory = new Trajectory( game.world.GetGravity() );
		setup.loadLevelManager();
	}

	// Now Images Have Finished Loading
	this.loadLevelManager = function(){
		debug.log("--- Finished loading world");
		debug.log("Loading Levels");
		player = new Player( vector(0,0), game.world )
		game.levelGenerator = new LevelGenerator();
		game.JSONdatabase = new LevelDatabase( setup.finishedLoadingLevels );
	}

	//called once levels having finished loading
	this.finishedLoadingLevels = function(){
		debug.log("--- Finished loading levels");
		var levellist = element("level-list")
		for (var i = 0; i < levellist.children.length; i++) {
			(function(i){
				levellist.children[i].addEventListener( "mousedown", function(){  game.loadLevel(i) }, false );
			}(i));
		};
		setup.setupInputs();
	}

	//now levels have finished loading
	this.setupInputs = function(){
		debug.log("Loading Inputs");
		input = new Input();
		input.addDomEvents();
    	playerweapon.equip("fire")
		debug.log("--- finished loading inputs");
		setup.finishedLoadingCallback();
	}

	this.startLoading();
}





var GameManager = Class.$extend({

	//Create Physics World, Singletons (Image manager, factory, player weapon, camera, trajectory)
	__init__: function(){
		this.currentLevelIndex = 1;
		this.levelGenerator = null;
		this.JSONdatabase = null;
	},

	//now inputs have been set up
	startGame : function(){
		debug.log( "-----------------------------" );
		debug.log( "LOAD SUCCESFUL. STARING GAME." );
		debug.log( "-----------------------------" );
		game.loadLevel( game.currentLevelIndex );
		game.update();
	},


	// Main Game update function
	update : function(){
		window.requestAnimationFrame( function(){ game.update() } );
		if(debugging) debug.stats.begin();

		//check if current level has finished
		if( currentLevel.checkEnd() ){
			this.nextLevel();
		} else {
			debug.update();
			this.world.Step( 1 / 12, 5, 6);
			currentLevel.update(this.world)
			camera.update( player.physicspos, 0.07 );
			if( player.isDead() ) game.playerDeath();
		}
		if(debugging) debug.stats.end();
	},

	//called by this.update when current level's end is reached
	nextLevel : function(){
		this.currentLevelIndex++;

		//loop round to level 0 when last level is finished
		if(this.currentLevelIndex == this.JSONdatabase.databaseSize){
			this.currentLevelIndex = 0;
			this.loadLevel( this.currentLevelIndex );
		} else {
			this.loadLevel( this.currentLevelIndex );
		}

	},

	//loadl level of specified index
	loadLevel: function( index ){
		this.currentLevelIndex = index;
		debug.log("LOADING LEVEL " + this.currentLevelIndex)

		//if no current level "exists", clear it. Otherwise do nothing (eg at start of game)
		if(currentLevel != undefined && currentLevel != null) currentLevel.clearLevel(this.world);

		//load new data from level.
		// get json data from database, pass json data to level loader. set level as current level
		currentLevel = this.levelGenerator.generateLevelFromJSONData( this.JSONdatabase.getLevel( index ) );
		// camera = new Camera( levelPhysicsSize, player.physicspos );
	},

	playerDeath: function(){

		var tempLevelIndex = game.currentLevelIndex;
		console.log("player death", tempLevelIndex)

		var gameOverDom = element("game-over")

		input.removeDomEvents();

		setTimeout(function(){ gameOverDom.style.display = "block" } , 1500);
		setTimeout(function(){ gameOverDom.style.opacity = 1.0;    } , 1600);

		setTimeout(function(){
			webkitCancelAnimationFrame(loop);
			game.world.DestroyBody(player.body);
			player = null;
			currentLevel.clearLevel(game.world);
		},2100);

		setTimeout(function(){
			currentLevel = null;
			player = new Player( vector(0,0), game.world );
			game.currentLevelIndex = tempLevelIndex;
			updateHealthDom(player.health);
			game.setupInputs();
		},2150);

		setTimeout(function(){ gameOverDom.style.opacity = 0.0;    },2200)
		setTimeout(function(){ gameOverDom.style.display = "none"; },2700)
	}
});
