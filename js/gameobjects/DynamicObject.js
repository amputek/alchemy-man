var DynamicObject = GameObject.$extend({
	__init__: function(body){
		this.$super(body);
		this.vel = vector(0,0);
	},

	update: function(){
		this.physicspos = this.body.GetPosition();
		this.vel = this.body.GetLinearVelocity();
		this.worldpos = toWorld(this.physicspos)
	},

	// i should change this to vector param??
	impulse: function(x,y){
		this.body.ApplyImpulse( vector( x, y ), this.physicspos );
	},

	setVelocity: function(x,y){
		this.body.SetLinearVelocity( vector(x, y));
	},

	setPosition: function( pos ){
		this.body.SetPositionAndAngle( pos, 0 );
	}
});