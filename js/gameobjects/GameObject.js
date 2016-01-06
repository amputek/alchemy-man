//highest level class for game objects.
//Has a body, a position in the physics world, and a position in the rendered world
var GameObject = Class.$extend({
	__init__: function( body ){
		this.body = body;
		this.body.SetUserData( this );
		this.physicspos = this.body.GetPosition();
    	this.worldpos = toWorld(this.physicspos);
	}
});
