var CraftingTable = GameObject.$extend({
  __init__: function(pos,type){
    this.$super( factory.createPlatform( pos, sizeVector(5,10) ));
    this.type = type;
    this.used = false;
    // if(this.type == "fire") this.animation = new Animation(images.doodad.crafting_fire, 5, true,  14 );
    // if(this.type == "used") this.animation = new Animation(images.doodad.crafting_used, 20, true, 1 );    
    // if(this.type == "ice")  this.animation = new Animation(images.doodad.crafting_ice,  12, true,  1 );
    // if(this.type == "used") this.used = true;


    this.animation = new Animation(images.doodad.crafting_used, 20, true, 1 );    
    this.animation.incFrame();
    this.draw_canvas = new Canvas( sizeVector(120,120) );

    this.counter = 0;
  },
  
  use: function(ctx){
    this.used = true;
    this.animation = new Animation(images.doodad.crafting_used,  12, true,  1 );
  },

  update: function(){
    this.animation.incFrame();
  },

  isDead: function(){
    return false
  },

  draw: function( canvas ){

    canvas.save();
    canvas.translate( this.worldpos.x - 60, this.worldpos.y - 40 )
    canvas.drawImage( this.animation.getFrame( this.draw_canvas ) );
    canvas.restore();
  }
});