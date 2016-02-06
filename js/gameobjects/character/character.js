var Character = DynamicObject.$extend({
	__init__ : function(pos,size) {
		this.$super( factory.createPlayer(pos,size) );
		this.physicssize = size;

		this.currentAction = "idle";
		this.animation = [];

		this.draw_final = new Canvas( vector(0,0) )
		this.draw_fire = new Canvas( vector(0,0) )

		this.gridpos = vector(0,0);

		this.moveSpeed = 6;

		this.health = 100;


		// FX
		this.frozenCounter = 0;
		this.fireCounter   = 0;
		this.inFire = false;
		this.fireDamageCounter = 0;
		this.acidCounter  = 0;
		this.acidDamageCounter = 0;

	},


	getBottom: function(){
		return this.physicspos.y + this.physicssize.h;
	},

	setFire: function(){
		if(this.state != "dying"){
			this.fireCounter = 120;
			// if(this.fireanimation.resting() == true) this.fireanimation.reset();
		}
	},

	setAcid: function(){
  	if(this.state != "dying") this.acidCounter = 90;
  },

	setIce: function(){
    if(this.state != "dying")	this.frozenCounter = 220;
	},

	isInIce: function(){
		return this.frozenCounter > 20;
	},

	isFrozen: function(){
		return this.frozenCounter > 0;
	},

	updateEffects: function(){
		if(this.frozenCounter > 0) this.frozenCounter--;
		if(this.fireCounter > 0) this.fireCounter--;
		if(this.inFire == true || this.fireCounter > 1){
			this.fireDamageCounter++;
			if(this.fireDamageCounter % 60 == 0) this.getHit(1);
		}
		this.inFire = false;
		if(this.acidCounter > 0) this.acidCounter--;
		if(this.acidCounter > 0){
			this.acidDamageCounter++;
			if(this.acidDamageCounter % 30 == 0) this.getHit(1);
		}
	},

	updateGridPos: function(){
		this.gridpos.x = Math.floor( this.physicspos.x / 5 );
		this.gridpos.y = Math.round( ( this.getBottom() ) / 5);
	},

	update: function(){
		this.$super();
		this.updateEffects();
		this.updateGridPos();
	},

	isDead: function(){
		return this.state == "dead";
	},

	getHit: function(dmg){
		if(this.state != "dying"){
			this.health -= dmg;
			if(this.health <= 0) this.state = "dying"
		}
	},

	draw: function(ctx){
		this.getAnimationFrames();

		this.drawToFinalContext();

    	this.draw_final.blendFunction("source-atop")

    	if(this.inFire){
			this.draw_final.fill( Color.fire, 0.4 );
    	}

    	this.draw_final.fill( Color.fire , (this.fireCounter   * 0.009) );
	    this.draw_final.fill( Color.acid , (this.acidCounter   * 0.009) );
	    this.draw_final.fill( Color.ice  , (this.frozenCounter * 0.009) );



	    this.draw_final.blendFunction("source-over")

	    this.drawFinal(ctx);
	}
});
