var GroundCharacter = Character.$extend({
	__init__: function(pos,size){
		this.$super(pos,size)
		this.currentPlatform = null;
		this.jumping = false;
		this.facing = -1;
		this.jumpHeight = 11;
	},


	setIce: function(){
    this.$super();
    if(this.facing == -1) this.stop("left")
    if(this.facing ==  1) this.stop("right")
    this.setVelocity(0,0)
    console.log("iced", this.currentAction)
	},


	updateGroundMovement: function(){
		if(this.isInIce() == false){
			if( this.currentAction == "run" && Math.abs( this.vel.x ) < Math.abs(this.moveSpeed) ){
				this.impulse( this.currentPlatform == null ? 0.5 * this.facing : 0.8 * this.facing , 0);
			}
			if(this.currentPlatform instanceof MobilePlatform){
				if(this.currentAction == "idle") this.setVelocity(this.currentPlatform.vel.x, this.currentPlatform.vel.y);
				if(this.currentAction == "run" ) this.setVelocity(this.currentPlatform.vel.x + (this.moveSpeed*this.facing*1.0), this.currentPlatform.vel.y);
			}
		}
	},

	update: function(){
		this.$super();
		if( this.jumping ===  true   ) this.jump();
	},


	isOnPlatform: function(){
		return this.currentPlatform != null;
	},

	addPlatform: function( platform ){
		if(this.currentPlatform === null && this.currentAction == "idle") this.setVelocity(0,0);
		this.currentPlatform = platform;
		if(this.currentPlatform instanceof MobilePlatform) this.setVelocity(this.currentPlatform.vel.x, this.currentPlatform.vel.y)
	},

	removePlatform: function( platform ){
		if(platform == this.currentPlatform) this.currentPlatform = null;
	},

	start: function( dir ){
		// if( this instanceof Chomper ) console.log("start",dir)
		if( !this.isInIce() ){
			if( dir == "jump"){
				this.jumping = true;
			} else {
				// if( this instanceof Chomper) console.log("start runubun")
				this.currentAction = "run";
				if( (dir == "left" && this.facing == 1) || (dir == "right" && this.facing ==-1 ) ){
					this.facing = -this.facing;
					this.setVelocity(this.vel.x*0.75, this.vel.y);
					// if( this instanceof Chomper) console.log("new facing", this.facing, this.vel.x)

				}
			}
		}
	},

	stop: function( dir ){
		if( dir == "jump"){
			this.jumping = false;
		} else {
			if( this.currentAction == "run"){
				this.currentAction = "idle";
				if( this.isOnPlatform() ){
					if( (dir == "left" && this.facing == -1) || ( dir == "right" && this.facing == 1) ) this.setVelocity(0, 0);
					if(this.currentPlatform instanceof MobilePlatform) this.setVelocity(this.vel.x,this.currentPlatform.vel.y)
				} else {
					this.setVelocity(this.vel.x * 0.8, this.vel.y);
				}
			}
		}
	},

	jump: function(){
		var jh = this.jumpHeight;
		if(this.frozenCounter > 0) jh = 0;
		if(this.isOnPlatform() ){
			this.impulse(0, -jh);
			this.currentPlatform = null;
		}
	},

});
