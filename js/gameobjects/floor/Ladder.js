var Ladder = GameObject.$extend({
  __init__: function(pos,size){
    this.$super( factory.createPlatform( pos , size ) );
    this.physicssize = size;
  },

  getTop: function(){
    return this.physicspos.y - this.physicssize.h;
  } 
});
