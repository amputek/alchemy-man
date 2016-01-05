window.onload = function(){

	// var str = window.location.search.substring(1), i, val, params = str.split("&");
	// editon = (str == "editor" || str == "edit" || str == "e")
	// debugging = (str == "debug" || str == "d")

	// element("level-list").children[0].addEventListener("mousedown",function(){ window.location.href = window.location.href; }, false)
	// element("level-list").children[1].addEventListener("mousedown",function(){ window.location.href = window.location.href; }, false)
	// console.log(window.location.href)

	game = new GameManager();

}

var playerweapon;
var camera;
var trajectory;
var playerdeaths = 0;
var mouseOverlay;



var Menu = Class.$extend({
	__init__: function(){
		this.tempDom = element("temp-dom");
		this.levelList = element("level-list").children;
		this.saveButton = element("compile-level");
	},

	hideTemp : function(){
		element("temp-dom").style.display = "none";
		element("compile-level").style.display = "none";
	},

	highlight: function(index){
	  for (var i = 0; i < element("level-list").children.length; i++) { element("level-list").children[i].style.background = "#555" }
    element("level-list").children[index].style.background = "#fff"
	},

	showTemp: function(){
		for (var i = 0; i < element("level-list").children.length; i++) { element("level-list").children[i].style.background = "#555" }
		element("temp-dom").style.background = "#fff"
		element("temp-dom").style.display = "block";
		element("compile-level").style.display = "block"
	},

	addTemp: function(){
		var li = document.createElement("li")
		li.id = "temp-dom"
		li.innerHTML = "<em>Unsaved Temporary Level</em>"
		li.style.display = "none";
		element("level-list").appendChild(li)
		element("compile-level").style.display = "none"
	}


});

var menu;

var GameManager = Class.$extend({

	__init__: function(){
		this.loadbar     = element("loadbar-inner");
		this.loadOverlay = element("loading");


		sound   = new SoundManager();
		images  = new ImageManager();
		world   = new b2World(new b2Vec2(0, 10),  true );

		debug   = new Debug();

		debug.log("NEW GAME")
		debug.log("----------------------")
		debug.log("Loading Images")


		factory = new Factory(world)
		world.SetContactListener( CreateListener() );
		playerweapon = new PotionManager();
		camera = new Camera( vector(0,0), vector(0,0) );
		trajectory = new Trajectory();

		menu = new Menu();

		this.currentLevelIndex = 0;
		this.gamestarted = false;
		this.tempLevel = null;

		if(editon == true) editor = new Editor();

		mouseOverlay = new GameCanvas( sizeVector(1080,550), 0);
		mouseOverlay.canvas.style.zIndex = 300
	},

	updateMouseOverlay: function(){
		mouseOverlay.clear();
		mouseOverlay.setFill( "red" )
		mouseBlips.update( mouseOverlay );
	},

	update : function(){
		loop = window.requestAnimationFrame( function(){ game.update() } );
		if(debugging) stats.begin();
		if( currentLevel.checkEnd() ){
			this.nextLevel();
		} else {
			debug.update();
			world.Step( 1 / 12, 5, 6);
			currentLevel.update(world)
			camera.update( player.physicspos, 0.07 );
		}
		if(debugging) stats.end();

		this.updateMouseOverlay();

	},

	setTempLevel: function( level ){
		element("temp-dom").innerHTML = '<em>"' + level.name + '" edit (unsaved)</em>'
		this.tempLevel = level;
		this.loadTempLevel();
	},

	saveLevel: function( level , a ){
		this.setTempLevel( level );
		game.database.saveLevel( JSON.stringify(level), a );
		menu.hideTemp();
	},

	nextLevel : function(){
		playerdeaths = 0;
		this.currentLevelIndex++;

		// console.log(this.currentLevelIndex, this.databaseSize)
		if(this.currentLevelIndex = this.database.databaseSize){
			if(this.tempLevel != null){
				this.loadTempLevel();
			} else {
				this.currentLevelIndex = 0;
				this.loadLevel( this.currentLevelIndex );
			}
		} else {
			this.loadLevel( this.currentLevelIndex );
		}

	},

	loadLevel: function( index ){
		this.currentLevelIndex = index;
		if(this.tempLevel != null){
			this.tempLevel = null;
			menu.hideTemp();
		}
		console.log("LOADING LEVEL", this.currentLevelIndex)
		if(currentLevel != undefined && currentLevel != null) currentLevel.clearLevel(world);
		currentLevel = levelManager.loadLevelFromData( this.database.getLevel( index ) );

		if( editon ) editor.readFromJSON( this.database.getLevel( index ) );

    	menu.highlight(index);
	},

	loadTempLevel: function(){
		if(currentLevel != undefined) currentLevel.clearLevel(world);
		currentLevel = levelManager.loadLevelFromData( this.tempLevel );
		menu.showTemp();
	},

	// Now Images Have Finished Loading
	loadLevelManager : function(){
		player = new Player( vector(0,0), world )
		levelManager = new LevelManager();
		var _this = this;
		this.database = new LevelDatabase( this.finishedLoadingLevels );

	},

	finishedLoadingLevels: function(){


		menu.addTemp();

		var levellist = element("level-list")

		for (var i = 0; i < levellist.children.length; i++) {
			(function(i){
				levellist.children[i].addEventListener( "mousedown", function(){  game.loadLevel(i) }, false );
			}(i));
		};

		if(game.gamestarted == false) game.setupInputs();
	},

	setupInputs : function(){
		debug.log("Setting Up Input");
		input = new Input();
		$(document).mousedown( input.mouseDown );
		$(document).mouseup(   input.mouseUp   );
		$(document).mousemove( input.mouseMove );
		$(document).keydown(   input.keyDown   );
		$(document).keyup(     input.keyUp     );
    $(document).mousewheel(input.wheel     );
    playerweapon.equip("fire")
		this.startGame()
	},

	startGame : function(){
		this.gamestarted = true;
		debug.log( "-----------------------------" );
		debug.log( "LOAD SUCCESFUL. STARING GAME." );
		debug.log( "-----------------------------" );
		console.log(this.tempLevel, this.currentLevelIndex);
		(this.tempLevel == null ? this.loadLevel( this.currentLevelIndex ) : this.loadTempLevel() );
		this.update();
		element("loadbar").style.opacity = 0.0;
		setTimeout(function(){ game.loadOverlay.style.opacity = 0.0; },500);
		setTimeout(function(){ game.loadOverlay.style.display = "none"; },6500)
	},

	finishedLoadingImage: function(num,total){
		debug.log("Loading Images (" + num + "/" + total + ")",false);
		this.loadbar.style.height = ((num / total ) * 300) + "px";
		if( num == total ){
			debug.log("--- Finished loading images");
			game.loadLevelManager();
		}
	},

	playerDeath: function(){

		playerdeaths++;

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
			world.DestroyBody(player.body);
			player = null;
			currentLevel.clearLevel(world);
		},2100);

		setTimeout(function(){
			currentLevel = null;
			player = new Player( vector(0,0), world )
			game.currentLevelIndex = tempLevelIndex;
			inControl = true;
			updateHealthDom(player.health);
			game.setupInputs();
		},2150);

		setTimeout(function(){ gameOverDom.style.opacity = 0.0;    },2200)
		setTimeout(function(){ gameOverDom.style.display = "none"; },2700)
	}

});
