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
var trajectory;
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

var mouseOverlay;



window.onload = function(){
	game = new GameManager();
}

// function Setup(){
//
// 	this.levelLoader = null;
// 	debug   = new Debug(); // create debugger
// 	images  = new ImageManager(); // create image manager
// 	var world = new Box2D.Dynamics.b2World(new b2Vec2(0, 10),  true ); // create world
// 	factory = new Factory(this.world); // create factory
// 	world.SetContactListener( CreateListener() ); // set up listener for world
// 	playerweapon = new PotionManager();
// 	camera = new Camera( vector(0,0), vector(0,0) ); //create camera
// 	trajectory = new Trajectory( this.world.GetGravity() ); //set up trajectory manager
//
// 	mouseOverlay = new GameCanvas( sizeVector(1080,550), 0);
// 	mouseOverlay.canvas.style.zIndex = 300
//
// 	game = new GameManager( world );
// }
//
//
// var GameManager = Class.$extend({
// 	__init__: function( world ){
// 		this.world = world;
// 		this.currentLevelIndex = 0;
// 		this.gamestarted = false;
// 	},
//
// 	// Update Mouse Overlay
// 	updateMouseOverlay: function(){
// 		mouseOverlay.clear();
// 		mouseOverlay.setFill( "red" )
// 		mouseBlips.update( mouseOverlay );
// 	},
//
// 	// Main Game update function
// 	update : function(){
// 		window.requestAnimationFrame( function(){ game.update() } );
// 		if(debugging) debug.stats.begin();
//
// 		//check if current level has finished
// 		if( currentLevel.checkEnd() ){
// 			this.nextLevel();
// 		} else {
// 			debug.update();
// 			this.world.Step( 1 / 12, 5, 6);
// 			currentLevel.update(this.world)
// 			camera.update( player.physicspos, 0.07 );
// 		}
// 		if(debugging) debug.stats.end();
//
// 		this.updateMouseOverlay();
//
// 	}
//
// });

var GameManager = Class.$extend({


	//Create Physics World, Singletons (Image manager, factory, player weapon, camera, trajectory)
	__init__: function(){

		this.levelLoader = null;

		// create debugger
		debug   = new Debug();

		// create image manager
		images  = new ImageManager();

		// create world
		this.world = new Box2D.Dynamics.b2World(new b2Vec2(0, 10),  true );

		// create factory
		factory = new Factory(this.world);

		// set up listener for world
		this.world.SetContactListener( CreateListener() );

		playerweapon = new PotionManager();

		//create camera
		camera = new Camera( vector(0,0), vector(0,0) );

		//set up trajectory manager
		trajectory = new Trajectory( this.world.GetGravity() );

		this.currentLevelIndex = 0;
		this.gamestarted = false;

		mouseOverlay = new GameCanvas( sizeVector(1080,550), 0);
		mouseOverlay.canvas.style.zIndex = 300
	},

	updateMouseOverlay: function(){
		mouseOverlay.clear();
		mouseOverlay.setFill( "red" )
		mouseBlips.update( mouseOverlay );
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
		}
		if(debugging) debug.stats.end();

		this.updateMouseOverlay();

	},

	nextLevel : function(){
		this.currentLevelIndex++;

		if(this.currentLevelIndex = this.database.databaseSize){
			this.currentLevelIndex = 0;
			this.loadLevel( this.currentLevelIndex );
		} else {
			this.loadLevel( this.currentLevelIndex );
		}

	},

	loadLevel: function( index ){
		this.currentLevelIndex = index;
		console.log("LOADING LEVEL", this.currentLevelIndex)
		if(currentLevel != undefined && currentLevel != null) currentLevel.clearLevel(this.world);
		currentLevel = this.levelLoader.loadLevelFromData( this.database.getLevel( index ) );
	},


	// Now Images Have Finished Loading
	loadLevelManager : function(){
		player = new Player( vector(0,0), this.world )
		this.levelLoader = new LevelLoader();
		this.database = new LevelDatabase( this.finishedLoadingLevels );

	},

	finishedLoadingLevels: function(){

		var levellist = element("level-list")

		for (var i = 0; i < levellist.children.length; i++) {
			(function(i){
				levellist.children[i].addEventListener( "mousedown", function(){  game.loadLevel(i) }, false );
			}(i));
		};

		if(game.gamestarted == false) game.setupInputs();
	},

	setupInputs : function(){
		input = new Input();
		input.addDomEvents();
    	playerweapon.equip("fire")
		this.startGame()
	},

	startGame : function(){
		this.gamestarted = true;
		debug.log( "-----------------------------" );
		debug.log( "LOAD SUCCESFUL. STARING GAME." );
		debug.log( "-----------------------------" );
		this.loadLevel( this.currentLevelIndex );
		this.update();
	},

	finishedLoadingImages: function(){
		debug.log("--- Finished loading images");
		game.loadLevelManager();
	},

	playerDeath: function(){

		var tempLevelIndex = game.currentLevelIndex;
		console.log("player death", tempLevelIndex)

		var gameOverDom = element("game-over")

		$(document).unbind( "mousedown"  , input.mouseDown );
		$(document).unbind( "mouseup"    , input.mouseUp   );
		$(document).unbind( "mousemove"  , input.mouseMove );
		$(document).unbind( "keydown"    , input.keyDown   );
		$(document).unbind( "keyup"      , input.keyUp     );
		$(document).unbind( "mousewheel" , input.wheel     );

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
			player = new Player( vector(0,0), game.world )
			game.currentLevelIndex = tempLevelIndex;
			updateHealthDom(player.health);
			game.setupInputs();
		},2150);

		setTimeout(function(){ gameOverDom.style.opacity = 0.0;    },2200)
		setTimeout(function(){ gameOverDom.style.display = "none"; },2700)
	}

});
