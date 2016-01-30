
//this manages the updating of the game / current level ONLY. level set up occurs in level manager.
//this doesn't need to know anything about what's happening outside of the current level itself.
var GameplayManager = new JS.Class({

	//this now gets called ONCE when the game starts
	initialize: function(){

		// ENTITIES - get repopulated at the start of every level
	    this.floors             = new GameObjectManager();
	    this.movingplatforms    = new GameObjectManager();
	    this.triggeredplatforms = new GameObjectCollectionManager();
	    this.enemies            = new EnemyManager();
	    this.projectiles        = new GameObjectManager();
	    this.fragments          = new GameObjectManager();
	    this.fire               = new FireManager();
	    this.acid               = new AcidManager();
	    this.ice                = new IceManager();
	    this.explosions         = new ExplosionManager();
	    this.fragmentSources    = new FragmentSourceManager();
	    this.enemySources       = new GameObjectCollectionManager();
		this.weather 			= new Weather();

		this.nolandzones        = [];

		this.startpos = null;
		this.endpos = null;

		this.startPlatform = null;

		this.shakeAmount = 0;



		//TODO clean this up
		this.canvas  = [];

		var canvasSize = sizeVector( 960, 250 )
		this.canvas[0] = new GameCanvas( canvasSize , 0.2  );
		this.weather.createLightningDOM();
        this.canvas[1] = new GameCanvas( canvasSize , 0.5  );    //far background
        this.canvas[2] = new GameCanvas( canvasSize , 0.75 );    //near background
        this.canvas[3] = new GameCanvas( canvasSize , 1 );    //static middleground
        this.canvas[4] = new GameCanvas( canvasSize , 1 );    //game middleground
        this.canvas[5] = new GameCanvas( canvasSize , 1.2 );

		this.gamecanvas = this.canvas[4];

		this.painCounter = 0.0;

		//this is just for the debug to print out level name
		this.name = "";

		//this is needed for the camera to reset, and to check if player leaves boundary.
		this.physicsSize = null;



		// this.levelDetails = {
		// 	name : "",
		// 	physicsSize : null,
		// 	ambientLight : null,
		// 	startPlatform : null
		// }

	},


	// private
	effectEntity : function(entity, type){
		if(type == "fire") entity.setFire();
		if(type == "acid") entity.setAcid();
	},

	//called from listener class
	detonatePotionOnFloor: function( potion, floor ){
		this.addExplosion( potion , potion.type , floor );
		potion.kill();
		if( potion.type == "ice" && floor.notMovingOrIce() && floor.getNearestEdge( potion.physicspos ).nearest == "top") gameplay.ice.add(  potion.physicspos, floor );
	},

	//called from listener class
	detonatePotionOnCharacter: function( potion, entity ){
		this.effectEntity( entity, potion.type )

		// check if entity is allowed to be iced
		if(potion.type == "ice" && entity instanceof GroundCharacter && entity.isOnPlatform() && entity.isInIce() == false){
			gameplay.ice.add( vector(entity.physicspos.x, entity.gridpos.y * 5), entity.currentPlatform );
			entity.setIce();
		}
		entity.getHit(1)
		if( potion.type == "fire" && entity instanceof Gumball ) entity.getHit(5)
		potion.kill();
		this.addExplosion( potion , potion.type, null, 0 );
	},

	//called from listener class
	fragmentOnFloor: function( fragment, floor ){
		if( floor.notMovingOrIce() && !fragment.isDead() ){
			if( fragment.type == "fire") this.fire.add( fragment.physicspos, floor );
			if( fragment.type == "acid") this.acid.add( fragment.physicspos, floor, (fragment.vel.y >= 0.0 && fragment.physicspos.y < floor.getTop() ) );
			if( fragment.type == "drip") fragment.kill();
		}
		fragment.kill();
	},

	//called from listener class
	fragmentOnCharacter: function( fragment, character ){
		this.effectEntity( character, fragment.type)
		fragment.kill();
	},


	// called from listener (player getting hit), and entity manager (enemies dying)
	addExplosion: function( source , type , ground , number ){
		this.shake(5);
		var vel = source.vel;
		if(vel == undefined) vel = vector(0,0);
		if(number == undefined) number = 5;
		this.explosions.add( source.physicspos , vel , type , ground , number );
	},

	// called from entity manager )effects, explosions, enemies dying, fragment sources)
	addFragment: function( pos, vel, type, size ){ this.fragments.add( new Fragment( pos , vel , type , size ) ); },

	// called from entity manager
	squareOccupiedByEffect: function( pos ){
		for (var i = 0; i < this.nolandzones.length; i++) { if( Vector2.equal( pos , this.nolandzones[i] ) ) return true;  }
		return false;
	},


	//called by Chomper ONLY
	getFloors: function(){
		return this.floors.collection;
	},

	// called by player
	shake: function(a){
		this.shakeAmount = a;
	},



	//called from game
	initPlayer: function(){
        player.body.SetPosition( Vector2.b2(this.startpos.x,this.startpos.y+5) );
        player.currentPlatform = this.startPlatform;
        if(player.currentAction == "idle") player.animation.current = player.animation.idle;
        if(player.currentAction == "run") player.animation.current = player.animation.run;
        player.animation.current.reset();
    },


    //called by game
	checkEnd : function(){
		if(player.isDead() == false) return Vector2.distance( player.physicspos, this.endpos ) < 5;
	},

	//called by game
	clearLevel: function(world){
		var graveyard = [];
		this.floors.getBodies(             graveyard );
		this.movingplatforms.getBodies(    graveyard );
		this.triggeredplatforms.getBodies( graveyard );
		this.fragments.getBodies(          graveyard );
		this.projectiles.getBodies(        graveyard );
		this.ice.getBodies(                graveyard );
		this.enemies.getBodies(            graveyard );
		this.enemySources.getBodies(       graveyard );

		//need to get rid of FX too 9/1/16
		this.fire.emptyCollection();
		this.ice.emptyCollection();
		this.acid.emptyCollection();
		this.explosions.emptyCollection();

		for(var i = 0; i < graveyard.length; i++){ world.DestroyBody( graveyard[i] ) }
		for(var i = 0; i < this.canvas.length; i++) { this.canvas[i].clear(); }
	},


	//UPDATE FUNCTIONS

	updatePlayer : function( canvas ){
		player.update();
 		if(player.physicspos.y > this.physicsSize.h ) player.getHit(6)
		player.draw( canvas );
	},

	updateShake : function(){
		if(this.shakeAmount > 0) this.shakeAmount--;
	},

	updatePain: function( canvas ){
		if(this.painCounter > 0.01){
			canvas.blendFunction("lighter");
			canvas.fill( 'rgba(255,50,30,' + this.painCounter + ')' );
			canvas.blendFunction("source-over");
			this.painCounter-=0.02;
			if(this.painCounter <= 0.0) this.painCounter = 0;
		}
	},

	update: function(world){

		this.gamecanvas.clear();

		var graveyard = [];
		this.movingplatforms.update(    this.gamecanvas, graveyard );
		this.triggeredplatforms.update( this.gamecanvas, graveyard );
		this.enemies.update(				this.gamecanvas, graveyard );
		this.updatePlayer(           		this.gamecanvas 			);
		this.gamecanvas.blendFunction(  "lighter" );
		this.ice.update(             		this.gamecanvas, graveyard );
		this.fragmentSources.update( 		this.gamecanvas, graveyard );
		this.fragments.update(       		this.gamecanvas, graveyard );
		this.fire.update(            		this.gamecanvas, graveyard );
		this.acid.update(            		this.gamecanvas, graveyard );
		this.explosions.update(      		this.gamecanvas, graveyard );
		this.gamecanvas.blendFunction(  "source-over"  );
		this.projectiles.update(     		this.gamecanvas, graveyard );
		this.enemySources.update(			this.gamecanvas, graveyard );

		//TODO: this souldn't be accessed from here
		GameManager.trajectory.draw( this.gamecanvas );

		this.gamecanvas.updateTint();

		this.weather.update( this.gamecanvas, this.floors.collection )


		for (var i = 0; i < this.canvas.length; i++) { this.canvas[i].update(this.shakeAmount);  }


		this.updatePain( this.gamecanvas );
		this.updateShake();

		for (var i = 0; i < graveyard.length; i++){	world.DestroyBody( graveyard[i] ) }
	}

});
