var Explosion = new JS.Class( Doodad, {
	initialize :function (pos,vel,type,dir,fragmentNumber) {

		this.callSuper(pos);
		this.physicspos = pos;
		this.type = type;
		this.dir = dir;
		this.vel = vel;
		this.fragmentNumber = fragmentNumber;
		this.life = 1;

		this.draw_canvas = new Canvas( sizeVector(151, 200) )

		this.totalLife = 100;

		this.animation = null;
		if(type == "fire"){
			if(this.dir == "top"){
				this.animation = new Animation( images.fx.fire_explosion, 2, false, 31);
			} else {
				this.animation = new Animation( images.fx.fire_explosion_gen, 2, false, 28);
			}
		} else if(type == "acid"){
			if(this.dir == "top"){
				this.animation = new Animation( images.fx.acid_explosion, 2, false, 26);
			} else {
				this.animation = new Animation( images.fx.acid_explosion_gen, 2, false, 14);
			}
		} else if(type == "miniice"){
			this.fragmentNumber = 2;
		} else if(type == "gumball"){
			this.fragmentNumber = 0;
			this.totalLife = 10
			this.animation = new Animation( images.fx.gumball_explosion, 3, false, 3)
		}

	},

	update: function(){

	},

	isDead: function(){
		return this.life >= this.totalLife;
	},

	draw: function ( canvas ) {
		this.life++;
		if(this.animation != null && this.animation.resting() == false){
			this.animation.incFrame();
			canvas.save();
			canvas.translate(this.drawpos.x,this.drawpos.y)
			if(this.type == "acid"){
				if(this.dir == "right" || this.dir == "left")	canvas.translate(0,20)
			}
			canvas.translate(-75,-150);
			if(this.type == "acid") canvas.translate(0,-16)
			if(this.type == "gumball") canvas.translate(60,130)
			canvas.drawImage( this.animation.getFrame( this.draw_canvas ) );
			canvas.restore();
		}
	}

});
