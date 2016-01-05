var GameObject = Class.$extend({
	__init__: function( body ){
		this.body = body;
		this.body.SetUserData( this );
		this.physicspos = this.body.GetPosition(); 
    this.worldpos = toWorld(this.physicspos);
	}
});