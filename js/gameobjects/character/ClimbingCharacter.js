var ClimbingCharacter = GroundCharacter.$extend({
	__init__: function(pos,size){
		this.$super(pos,size)
		this.climbing = "off";
		this.currentLadder = null;
		this.holdingUp = false;
	},

	onLadder: function(){
		return this.climbing == "on" || this.climbing == "down" || this.climbing == "up";
	},

	update: function(){
		this.$super();
		if( this.onLadder() === false ) this.updateGroundMovement();
		this.updateClimb();
	},

	
	addPlatform: function( platform ){
		this.$super( platform );
		if(this.climbing == "down") this.climbing = "ready-bottom"
	},


	updateClimb: function(){

		// move from above ladder to below ladder
		if(this.currentLadder != null){
			if(this.climbing == "ready-top"){
				if(this.physicspos.y > this.currentLadder.getTop()+1){
					this.climbing = "ready-bottom"
				}
			}
		}

		if(this.onLadder() == true){
			var dir = 1;
	
			//lock character to center of ladder
			if(this.currentLadder != null){
				this.setPosition( vector( this.currentLadder.physicspos.x, this.physicspos.y ) );	
			} 
	
			if(this.climbing == "up")   dir  = -1;
			if(this.climbing == "down") dir  = 1;
	
			// move up/down the ladder
			if( abs(this.vel.y) < 4.5){
				this.impulse(0,1.5 * dir)
			} else {
				this.setVelocity(0,4.5*dir)
			}
	
			// if currently on ladder and not moving, negate gravity
			if(this.climbing == "on") this.setVelocity(this.vel.x*0.8,-0.82);
		}
	},
	
	ladder: function(onLadder, aboveLadder ,ladderElement){
		if(onLadder == true){
			if(aboveLadder == false){

				if(this.climbing == "off"){
				
					if(this.currentPlatform == null){
						// this used to be "on"
						this.climbing = "ready-bottom";
						this.currentLadder = ladderElement;
					} else {
						this.currentLadder = ladderElement;
						this.climbing = "ready-bottom";
					}
	
					if(this.holdingUp == true){
						this.climbing = "up";
						this.currentLadder = ladderElement;
					}
				}
			} else {

				this.currentLadder = ladderElement;
				this.climbing = "ready-top"
			}
		} else {
			
			if(this.climbing != "off" || this.climbing != "ready-top" || this.climbing != "ready-bottom"){
				this.currentLadder = null;
				this.climbing = "off";

			}
		}
	},

	// basically events from input(W or S)
	climb: function(go,dir){
		if(go == 1){
			if(dir == -1) this.holdingUp = true;
			if(this.climbing != "off"){
				if(dir == -1){
					if(this.climbing != "up" && this.climbing != "ready-top") this.climbing = "up";
				} else {
					if(this.climbing == "ready-top"){
						this.climbing = "down";
						this.currentPlatform = null;
					} else if( this.climbing == "ready-bottom"){

	
					} else if(this.climbing != "off"){
						this.climbing = "down"
					}
				}
			}
		} else {
			this.holdingUp = false;
			if(this.climbing != "off" && this.climbing != "ready-bottom" && this.climbing != "ready-top") this.climbing = "on";
		}
	},

	jumpOffLadder: function(){
		this.setVelocity(0,0)
		if(this.currentAction == "run"){
			this.impulse(this.facing*10, -this.jumpHeight*0.5);
		} else {
			this.impulse(0, -this.jumpHeight);
		}
		this.climbing = "ready-bottom"
	},

	jump: function(){
		this.$super();
		if( !this.isOnPlatform() && this.onLadder() ) this.jumpOffLadder();
	},

});