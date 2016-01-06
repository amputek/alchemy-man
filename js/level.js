var Level = Class.$extend({
	__init__: function(){

		// ENTITIES

		// Do I really need to instansiate these each time???
		// can they not remain consistent outside of levels?
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
	    this.tooltips           = new TooltipManager();

		this.weather 			= new Weather();
		this.nolandzones        = [];

		this.endpos = null;
		this.shakeAmount = 0;
		this.canvas  = [];
		this.gamecontext = null;
		this.painCounter = 0.0;
		this.bottomLimit = 0;

		this.ambientLight = null;

	},



	// PRIVATE
	effectEntity : function(entity, type){
		if(type == "fire") entity.setFire();
		if(type == "acid") entity.setAcid();
	},




	updatePlayer : function( canvas ){
		player.update();
  		if(player.worldpos.y > this.bottomLimit )	player.getHit(6)
		player.draw( canvas );
	},


	updateShake : function(){
		if(this.shakeAmount > 0){
			// element("wrapper").style.webkitTransform = "rotateZ(" + random(-this.shakeAmount*0.2, this.shakeAmount*0.2) + "deg)"
			this.shakeAmount--;
		}
	},


	pain: function( canvas ){
		if(this.painCounter > 0.01){
			canvas.blendFunction("lighter");
			canvas.fill( 'rgba(255,50,30,' + this.painCounter + ')' );
			canvas.blendFunction("source-over");
			this.painCounter-=0.02;
			if(this.painCounter <= 0.0) this.painCounter = 0;
		}
	},


	//called from listener class

	detonatePotionOnFloor: function( potion, floor ){
		this.addExplosion( potion , potion.type , floor );
		potion.kill();
		if( potion.type == "ice" && notMovingOrIce(floor) && getDir(  potion.physicspos , floor ).nearest == "top") currentLevel.ice.add(  potion.physicspos, floor );
	},

	detonatePotionOnCharacter: function( potion, entity ){
		this.effectEntity( entity, potion.type )

		// check if entity is allowed to be iced
		if(potion.type == "ice" && entity instanceof GroundCharacter && entity.isOnPlatform() && entity.isInIce() == false){
			currentLevel.ice.add( vector(entity.physicspos.x, entity.gridpos.y * 5), entity.currentPlatform );
			entity.setIce();
		}
		entity.getHit(1)
		if( potion.type == "fire" && entity instanceof Gumball ) entity.getHit(5)
		potion.kill();
		this.addExplosion( potion , potion.type, null, 0 );
	},

	fragmentOnFloor: function( fragment, floor ){
		if( notMovingOrIce( floor ) && !fragment.isDead() ){
			if( fragment.type == "fire") this.fire.add( fragment.physicspos, floor );
			if( fragment.type == "acid") this.acid.add( fragment.physicspos, floor, (fragment.vel.y >= 0.0 && fragment.physicspos.y < floor.getTop() ) );
			if( fragment.type == "drip") fragment.kill();
		}
		fragment.kill();
	},

	fragmentOnCharacter: function( fragment, character ){
		this.effectEntity( character, fragment.type)
		fragment.kill();
	},


	// called from listener, and entity manager
	addExplosion: function( source , type , ground , number ){
		this.shake(5)
		var vel = source.vel;
		if(vel == undefined) vel = vector(0,0);
		if(number == undefined) number = 5;
		this.explosions.add( source.physicspos , vel , type , ground , number );
	},

	// called from entity manager
	addFragment: function( pos, vel, type, size ){ this.fragments.add( new Fragment( pos , vel , type , size ) ); },

	//called from entity manager ()
	addTooltip: function( pos, text ){ this.tooltips.add( new Tooltip( pos, text) ); },


	//called by Chomper ONLY
	getFloors: function(){
		return this.floors.collection;
	},


    //called  levelmanager

	setEnd : function( pos ){
		this.endpos = new b2Vec2(pos.x,pos.y);
	},

	setSize: function( size ){
		this.bottomLimit = size.h * SCALE + 100;
	},

	occupied: function( pos ){
		for (var i = 0; i < this.nolandzones.length; i++) { if( equalVector( pos , this.nolandzones[i] ) ) return true;  }
		return false;
	},


	// called by player
	shake: function(a){
		this.shakeAmount = a;
	},


    //called by game
	checkEnd : function(){
		if(player.isDead() == false) return vDistance( player.physicspos, this.endpos ) < 5;
	},

	clearLevel: function(world){
		var graveyard = [];
		this.floors.getBodies(             graveyard )
		this.movingplatforms.getBodies(    graveyard )
		this.triggeredplatforms.getBodies( graveyard )
		this.fragments.getBodies(          graveyard )
		this.projectiles.getBodies(        graveyard )
		this.ice.getBodies(                graveyard )
		this.enemies.getBodies(            graveyard )
		this.enemySources.getBodies(       graveyard )
		for(var i = 0; i < graveyard.length;            i++){			world.DestroyBody( graveyard[i] 						) }
		for(var i = 0; i < this.canvas.length; i++) {			this.canvas[i].delete(); 		}
	},

	update: function(world){

		this.gamecanvas.clear();
		// this.gamecanvas.setAlpha( 1.0 );

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
		this.tooltips.update( 				this.gamecanvas, graveyard );

		trajectory.draw(              		this.gamecanvas       			);


		// FIND A WAY OF STRORING AMBIENT LIGHT INSIDE GAME CANVAS. NO NEED TO KEEP IT STORED IN LEVEL CLASS JUST FOR THIS LINE:
		this.gamecanvas.tint( this.ambientLight, 0.1+this.ambientLight.darkness);
		this.weather.update( this.gamecanvas, this.floors.collection )


		for (var i = 0; i < this.canvas.length; i++) { this.canvas[i].update(this.shakeAmount);  }


		this.pain( this.gamecanvas );
		this.updateShake();

		for (var i = 0; i < graveyard.length; i++){	world.DestroyBody( graveyard[i] ) }
	}

});
