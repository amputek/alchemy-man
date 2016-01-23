var Platform = Floor.$extend({
	__init__: function(pos,size){
		this.$super( factory.createPlatform( pos, size ) );
		this.physicssize = size;
		this.boundary = {
			left   : this.physicspos.x - this.physicssize.w,
			right  : this.physicspos.x + this.physicssize.w,
			top    : this.physicspos.y - this.physicssize.h,
			bottom : this.physicspos.y + this.physicssize.h
		}
	}
});

var JumpBox = Platform.$extend({
	__init__: function(pos,size){
    	this.$super( pos, size );
	}
});
