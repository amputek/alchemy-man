//a gameobject that moves
//has methods for physically affecting the body

var DynamicObject = GameObject.$extend({
	__init__: function(body){
		this.$super(body);
		this.vel = vector(0,0);
	},

	update: function(){
		this.physicspos = this.body.GetPosition();
		this.vel = this.body.GetLinearVelocity();
		this.drawpos = Vector2.physicsToDraw(this.physicspos);
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


function DynamicUpdate(obj){
	obj.physicspos = obj.body.GetPosition();
	obj.vel = obj.body.GetLinearVelocity();
	obj.drawpos = Vector2.physicsToDraw(obj.physicspos);
}
