var Splash = Doodad.$extend({
  __init__: function(pos){
    this.$super(pos);
    this.life = 0;
  },

  update: function(){
    this.life+=random(0,2)
  },

  isDead: function(){
    return this.life >= 10;
  },

  draw: function(ctx){
    ctx.setStroke( 'rgba(255,255,255,' + (0.25 - (this.life/40)) + ')' );
    ctx.line(this.worldpos.x,this.worldpos.y,this.worldpos.x - this.life,this.worldpos.y - this.life);
    ctx.line(this.worldpos.x,this.worldpos.y,this.worldpos.x + this.life,this.worldpos.y - this.life);
    ctx.line(this.worldpos.x,this.worldpos.y,this.worldpos.x,this.worldpos.y - this.life/2);
  }
});


var Weather = Class.$extend({
  __init__: function(){
    this.lightning = 0;
    this.splashes = new DynamicManager();
    this.angle = 0;
    this.severity = 0;
    this.splashAmount = 0;
    this.rainAmount = 0;
    this.lightningDom = element("lightning")
  },

  update: function(context,floors){
    this.light( )
    this.splash(context, floors)
    this.rain(context); 
  },

  setAmount: function(i){
    this.severity = i;
    this.angle = this.severity * 0.35;
    this.splashAmount = this.severity * 0.05;
    this.rainAmount = this.severity * 150;
  },

  rain: function(ctx){
    for(var i = 1; i < 5; i++){
      ctx.setStroke('rgba(255,255,255,' + (0.06 * i) + ')');
      ctx.setWidth( i*0.6 );
      for (var n = 0; n < this.rainAmount; n++) {
        var x = random(0,3000);
        var y = random(0,800)
        var lng = random(10,100)
        var a = this.angle + random(-0.1,0.1)
        ctx.line(x,y,x-sin(a)*lng,y-cos(a)*lng);
      }
    }
  },

  splash: function(ctx,floors){

    var graveyard = [];

    if(this.severity > 0.0){
      for (var i = 0; i < floors.length; i++) {
        var f = floors[i];
        if(f.physicssize.h == 2.5){
          if( coin(this.splashAmount) ) this.splashes.add( new Splash( vector(f.physicspos.x + random(-f.physicssize.w,f.physicssize.w), f.physicspos.y - f.physicssize.h) ) );
          if( coin(this.splashAmount*0.4) ){
            if(coin(0.5)){
              currentLevel.addFragment( vector(f.physicspos.x + f.physicssize.w + 0.3, f.physicspos.y - f.physicssize.h + 0.9) , vector(0,0), "water", "small" );
            } else {
              currentLevel.addFragment(  vector(f.physicspos.x - f.physicssize.w - 0.3, f.physicspos.y - f.physicssize.h + 0.9) , vector(0,0), "water", "small" );
            }
          }
        }
      }
  
      // ctx.setWidth( 2.0 );
      // this.splashes.update( ctx );
    
    }
  },

  light: function(){
    
    if(this.severity > 0.8){
      if(this.lightning == 0){
        if(coin(0.01)){
          this.lightning = 1;
        }
      } else {
        this.lightning++;
        if(coin(0.2)){
          element("lightning").style.opacity = 1.0;
        } else {
          element("lightning").style.opacity = 0.0;
        }
        if(this.lightning >= 25){
          this.lightning = 0;
          element("lightning").style.opacity = 0.0;
        }
      }
    }


  }
})
