var IceBlock = MobilePlatform.$extend({
  __init__: function(pos,ground){
    this.$super( vector( pos.x, pos.y-5), sizeVector(2,5), null );
    this.growAnimation = new Animation(images.fx.ice_grow, 3, false, 12 );
    this.meltAnimation = new Animation(images.fx.ice_melt, 3, false, 38 )
    this.currentAnimation = this.growAnimation
    this.draw_canvas = new Canvas( sizeVector(60, 100 ) )
    this.life = 200;
    this.dead = false;
    this.finished = false;
    this.setVelocity( 0 , -0.0 )
  },

  update: function(){

    this.physicspos = this.body.GetPosition();
    this.vel = this.body.GetLinearVelocity();

    this.currentAnimation.incFrame();
    this.life--;

    if(this.life == 100){
      this.currentAnimation = this.meltAnimation;
    }
    if(this.life <= 80){
      this.body.SetAwake(true)
      this.setVelocity( 0, 3.8 - (this.life / 80)*3.8);
    }

  },

  isDead: function(){
    return this.life < 0;
  },

  draw: function(canvas){
    canvas.drawImage( this.currentAnimation.getFrame( this.draw_canvas ) , vector(this.worldpos.x-30, this.worldpos.y-47 ) );
  }
});