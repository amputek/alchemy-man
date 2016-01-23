var Doodad = new JS.Class({
	initialize: function(pos){
		this.worldpos = Vector2.toWorld( pos );
	}
});

var ScorchedGround = new JS.Class( Doodad, {
	initialse: function(pos){
		this.callSuper(pos);
		this.animation = new Animation( images.fx.scorched, 4, false, 62);
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext('2d');
		this.canvas.width = 140;
		this.canvas.height = 100;
		this.loopCount = 0;
	},

	update: function(){
		this.animation.incFrame();
		if(this.loopCount < 8){
		  if(this.animation.currentFrame == 42){
			this.animation.currentFrame = 18;
			this.loopCount++;
		  }
		}
	},

	draw: function(ctx){
		ctx.save();
		ctx.translate(this.worldpos.x-55,this.worldpos.y-86)
		// ctx.drawImage(this.animation.getFrame( this.canvas, this.context), 0,0 );
		ctx.restore();
	}
});
