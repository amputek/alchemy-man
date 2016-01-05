var Projectile = DynamicObject.$extend({
	__init__ : function( pos ){
		this.$super( factory.createBullet( pos ) );
		this.dead = false;
		this.life = 0;
		this.damage = 5;
	},

	update : function(){
		this.$super();
		this.life++;
	},

  kill: function(){
    this.dead = true;
  },

  isDead: function(){
    return this.dead;
  }
});



var Potion = Projectile.$extend({
  __init__ : function( pos, type ){
    this.$super( pos );
    this.type = type;
    if(type == "fire"){
      this.img = images.potion.fire;
    } else if(type == "ice"){
      this.img = images.potion.ice;
    } else if(type == "acid"){
      this.img = images.potion.poison;
    }
    this.damage = 15;
  },

  draw : function( canvas ){
    canvas.save();
    canvas.translate( this.worldpos.x+3, this.worldpos.y+3 );
    canvas.rotate( this.life*0.3 );
    canvas.translate( -8, -12 );
    canvas.drawImage( this.img );
    canvas.translate(8,12)
    canvas.rotate( -this.life*0.3);
    canvas.translate(-8,-12)
    canvas.drawImage( images.potion.shine );
    canvas.restore();
  }
});




var CannonBall = Projectile.$extend({
	__init__ : function( pos, type ){
		this.$super( pos );
		this.damage = 15;
	},

	draw : function(ctx){
		ctx.save();
		ctx.translate( this.worldpos.x-5, this.worldpos.y );
		ctx.rotate( this.life*0.3 );
		ctx.translate( -15, -15 );
		ctx.drawImage( images.cannon, 0, 0 );
		ctx.restore();
	}
});

var Gum = Projectile.$extend({
	__init__ : function( pos, vel ){
		this.$super( pos );
		this.damage = 15;
    this.body.SetLinearDamping(0.0)
	  this.v = vel;
    this.setVelocity(vel.x, vel.y);
    this.img = images.gum[ randomInt(0,3) ]
  },

	draw : function( canvas ){
    this.setVelocity(this.v.x,this.v.y);
		canvas.save();
		canvas.translate( this.worldpos.x, this.worldpos.y );
    canvas.drawImage( this.img, vector(-4,-4));
		canvas.restore();
	}
});