var Player = ClimbingCharacter.$extend({
	__init__ : function(pos){
		this.$super(pos,sizeVector(2.0,5.5));

		this.moveSpeed = 10;
		this.jumpHeight = 16;
		this.health = 6;

		this.animation.run          = new Animation( images.player.run,          3  , true,  12 );
		this.animation.idle         = new Animation( images.player.idle,         5  , true,  12 );
		this.animation.takeoffrun   = new Animation( images.player.takeoffrun,   2  , false, 7  );
		this.animation.takeoffstill = new Animation( images.player.takeoffstill, 2  , false, 6  );
		this.animation.hover        = new Animation( images.player.hover,        6  , true , 1  );
		this.animation.landrun      = new Animation( images.player.landrun,      2  , false, 5  );
		this.animation.landstill    = new Animation( images.player.landstill,    2  , false, 4  );
		this.animation.climbmove    = new Animation( images.player.climb,        3  , true , 9  );
		this.animation.climbidle    = new Animation( images.player.climb,        2  , true , 1  );
		this.animation.idle_aim     = new Animation( images.player.idle_aim,     5  , false, 3  );
		this.animation.idle_release = new Animation( images.player.idle_release, 5  , false, 10 );
		this.animation.damaged      = new Animation( images.player.damage,       2  , false, 12 );
		this.animation.death        = new Animation( images.player.death,        4  , false, 24 );
		this.animation.current      = this.animation.idle;


		this.armanimation = [];
		this.armanimation.idle        = new Animation( images.arm.idle,          2  , true, 2  );
		this.armanimation.run         = new Animation( images.arm.run,           3  , true, 12  );
		this.armanimation.run_aim     = new Animation( images.arm.run_aim,       3  , false, 2  );
		this.armanimation.run_release = new Animation( images.arm.run_release,   3  , false, 13 );
		this.armanimation.idle_aim     = new Animation( images.arm.idle_aim,     5  , false, 3  );
		this.armanimation.idle_release = new Animation( images.arm.idle_release, 5  , false, 10 );
		this.armanimation.current = this.armanimation.idle;


		this.drawsize = sizeVector( 178, 100 )

		this.draw_final  = new Canvas( this.drawsize )
		this.draw_arm    = new Canvas( this.drawsize )
		this.draw_canvas = new Canvas( this.drawsize )

		var _this = this;

		function returnToHover(){ _this.animation.current = _this.animation.hover; }

		this.animation.takeoffrun.oncomplete = returnToHover;
		this.animation.takeoffstill.oncomplete = returnToHover;

		function returnToCurrentActionAnimation(){
			if(_this.state != "dying"){
				if(_this.currentAction == "idle") _this.animation.current = _this.animation.idle;
				if(_this.currentAction == "run")  _this.animation.current = _this.animation.run;
				_this.animation.current.reset();

				if(_this.currentAction == "idle") _this.armanimation.current = _this.armanimation.idle;
				if(_this.currentAction == "run")  _this.armanimation.current = _this.armanimation.run;
				_this.armanimation.current.reset();
		  	}
		}

		this.animation.landrun.oncomplete   = returnToCurrentActionAnimation;
		this.animation.damaged.oncomplete   = returnToCurrentActionAnimation;
		this.animation.landstill.oncomplete = returnToCurrentActionAnimation;

		this.armanimation.run_release.oncomplete = function(){ _this.armanimation.current = _this.armanimation.idle; }

	},

	// called once at moment of death
	kill: function(){
		currentLevel.painCounter = 0.8;
		allowControl = false;
		this.state = "dead"

		// stop all actions
		this.setVelocity(0,0)
		this.stop("jump")
		if(this.currentAction == "run"){
			if(this.facing == -1) this.stop("left")
			if(this.facing == 1 ) this.stop("right")
		}
		this.animation.current = this.animation.death;
	},

	make: function(type){
		if(this.aiming){
			this.animation.current.reset();
			this.armanimation.current.reset();
		}
	},


	getHit: function(val){
		if( !this.isDead() ){
			this.$super(val);
			currentLevel.shake(5);
			currentLevel.painCounter = 0.3;
			if(this.state == "dying") this.kill();
			updateHealthDom(this.health)
		}
	},

	update: function(){
		this.animation.current.incFrame();
		this.armanimation.current.incFrame();
		playerweapon.update();
		this.$super();
	},


	updateClimb: function(){
		this.$super();
		if(this.onLadder()){
			if(this.climbing != "off"){
				if(this.climbing == "up" || this.climbing == "down"){
					this.animation.current = this.animation.climbmove;
				} else {
					this.animation.current = this.animation.climbidle;
				}
			}
		}
	},

	addPlatform : function( platform ){
		if(this.currentPlatform === null && this.isDead() == false){
		  if(this.currentAction == "run"){
			this.animation.current = this.animation.landrun;
			this.animation.current.reset();
		  } else {
			this.animation.current = this.animation.landstill;
			this.animation.current.reset();
		  }
		}
		this.$super(platform);

		if(this.isDead() == false){
			if(platform instanceof JumpBox){
				this.setVelocity(this.vel.x,0)
				this.impulse(0,-30);
			}
		}

	},

  removePlatform: function( platform ){
		if(platform == this.currentPlatform && this.isDead() == false && this.jumping == false){
			this.animation.current = this.animation.hover;
		}
		this.$super(platform);
  	},

  aim: function(){
		this.aiming = true;
		if(this.currentAction == "run"  ) this.armanimation.current = this.armanimation.run_aim;
		if(this.currentAction == "idle" ){
			this.armanimation.current = this.armanimation.idle_aim;
			this.animation.current = this.animation.idle_aim;
			this.armanimation.current.reset();
			this.animation.current.reset();
		}
		this.armanimation.current.reset();
  },


  jumpOffLadder: function(){
		this.animation.current = this.animation.takeoffstill;
		this.armanimation.current = this.armanimation.idle;
		this.$super();
  },

	jump: function(){
		if( this.isOnPlatform() ){
			if(this.currentAction == "run"){
				this.animation.current = this.animation.takeoffrun;
				this.armanimation.current = this.armanimation.idle;
			} else{
				this.animation.current = this.animation.takeoffstill;
				this.armanimation.current = this.armanimation.idle;
			}
			this.animation.current.reset();
		}
		this.$super();
	},

	start: function(action){
		if(action == "left" || action == "right"){
			if( this.isOnPlatform() ){
				if(this.animation.current != this.animation.land){
					if(this.animation.current != this.animation.run){
						this.animation.current = this.animation.run;
						this.animation.current.reset();
					}
					if(this.aiming){
						this.armanimation.current = this.armanimation.run_aim;
					} else {
				  		if(this.armanimation.current != this.armanimation.idle_release && this.armanimation.current != this.armanimation.run && this.armanimation.current != this.armanimation.run_release){
								this.armanimation.current = this.armanimation.run;
								this.armanimation.current.reset();
				  		}
					}
					if(this.armanimation.current == this.armanimation.idle_release){
				  		this.armanimation.current = this.armanimation.run_release;
					}
			  	}
			}
		}
		this.$super(action);
	},

	stop: function(action){
		if(action == "left" || action == "right"){
			if( this.isOnPlatform() ){
				if(this.animation.current != this.animation.land){
					this.animation.current = this.animation.idle;
					this.animation.current.reset();
					if(this.aiming){
						this.armanimation.current = this.armanimation.idle_aim;
						this.animation.current = this.animation.idle_aim;
					} else if(this.armanimation.current == this.armanimation.run_release){
						this.armanimation.current = this.armanimation.idle;
					} else {
						if(this.aiming==false){
							this.armanimation.current = this.armanimation.idle;
						}
					}
				}
			}
		}
		this.$super(action);

	},

	shoot: function( angle ){
		this.aiming = false;
		if(this.isOnPlatform() == true){
			if(this.currentAction == "run") this.armanimation.current = this.armanimation.run_release;
			if(this.currentAction == "idle"){
				this.armanimation.current = this.armanimation.idle_release;
				this.animation.current = this.animation.idle_release;
				this.animation.current.reset();
			}
			this.armanimation.current.reset();
		}
		var ang = input.shootAngle;
		var vel = Vector2.distance( {x: player.worldpos.x + offset.x, y: player.worldpos.y + offset.y}, {x:input.mousepos.x, y:input.mousepos.y} ) * 0.12;
		var poo = 3.5;
		if(vel > poo){
			return playerweapon.shoot(this.physicspos.x - 2.3 * this.facing, this.physicspos.y - 5, ang, cos(ang) * vel, sin(ang) * vel - poo + ((vel-poo)*-0.1), i);
		} else {
			return playerweapon.shoot(this.physicspos.x - 2.3 * this.facing, this.physicspos.y - 5, ang, cos(ang) * vel, sin(ang) * vel - poo);
		}
  	},

	getAnimationFrames: function(){
		this.animation.current.getFrame(    this.draw_canvas );
		this.armanimation.current.getFrame( this.draw_arm  );
		// this.fireanimation.getFrame(        this.draw_fire.canvas   , this.draw_fire.context   );
	},

	drawToFinalContext: function(){
		this.draw_final.clear();
		this.draw_final.drawImage( this.draw_canvas.getImage() );
		if(this.state != "dying" && this.state != "dead") this.draw_final.drawImage( this.draw_arm.getImage() );
	},

	drawFinal: function( canvas ){
		 canvas.save();
		 canvas.translate( this.worldpos.x  - this.drawsize.w/2, this.worldpos.y - this.drawsize.h/2  );

		if( this.climbing == "off" || this.climbing == "ready-bottom"  || this.climbing == "ready-top"){
			if(this.facing == -1)  canvas.translate(this.drawsize.w,0);
			 canvas.scale(this.facing,1);
		} else {
			 canvas.translate(10,0)
		}

		 canvas.drawImage( this.draw_final.getImage() );
		 canvas.restore();
	}
});
