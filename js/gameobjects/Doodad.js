var Doodad = Class.$extend({
	__init__: function(pos){
		this.worldpos = toWorld( pos );
	}
});

var ScorchedGround = Doodad.$extend({
	__init__: function(pos){
		this.$super(pos);
		this.animation = new Animation( images.fx.scorched, 4, false, 62);
		this.canvas = createCanvas();
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