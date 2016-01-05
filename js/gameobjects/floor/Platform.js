var Platform = Floor.$extend({
	__init__: function(pos,size){
		this.$super( factory.createPlatform( pos, size ) );
		this.physicssize = size;
	}
});

var JumpBox = Platform.$extend({
  __init__: function(pos,size){
    this.$super( pos, size );
  }
});