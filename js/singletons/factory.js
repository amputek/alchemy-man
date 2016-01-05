var b2Vec2 = Box2D.Common.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

var Factory = Class.$extend({
	__init__: function(world){
		this.world = world;
		this.cPlayer = 0x0004;
		this.cBullet = 0x0002;
		this.cGround = 0x0001;
		this.mPlayer = this.cBullet | this.cGround;

		this.bodyDef = new b2BodyDef();

		this.bulletFixture = this.createCircleFixture(1.0);
		this.bulletFixture.friction = 0.0;
		this.bulletFixture.density = 0.0;

		this.icePlatformFixture = this.createRectFixture(2.5,5);

		this.iceFragmentFixture = this.createRectFixture(0.5,1);
		this.iceFragmentFixture.filter.categoryBits = this.cPlayer;
		this.iceFragmentFixture.filter.maskBits = this.mPlayer;
		this.iceFragmentFixture.friction = 0.1;
		this.iceFragmentFixture.density = 0.5;

		this.potionFragmentFixture = this.createCircleFixture(0.5);
		this.potionFragmentFixture.friction = 0.1;
		this.potionFragmentFixture.density = 1.0;

		this.hugeFragmentFixture = this.createCircleFixture(1.6);
		this.hugeFragmentFixture.friction = 0.1;
		this.hugeFragmentFixture.density = 1.0


		this.smokeFragmentFixture = this.createCircleFixture(4);
		this.smokeFragmentFixture.filter.categoryBits = this.cPlayer;
		this.smokeFragmentFixture.filter.maskBits = this.mPlayer;
		this.smokeFragmentFixture.friction = 0.1;
		this.smokeFragmentFixture.density = 0.1;

		this.potionSmallFragmentFixture = this.createRectFixture(0.2,0.1);
		this.potionSmallFragmentFixture.friction = 0.1;
		this.potionSmallFragmentFixture.density = 1.0;

		this.ingredientFixture = this.createRectFixture(1,1);
	},

	// BODY DEFS
	createStaticBodyDef : function( pos ) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_staticBody;
		bodyDef.position = pos;
		return bodyDef;
	},

	createKinematicBodyDef : function( pos ) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_kinematicBody;
		bodyDef.position = pos;
		return bodyDef;
	},

	createDynamicBodyDef : function( pos ) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position = pos;
		return bodyDef;
	},

	// FIXTURES

	createRectFixture: function(w,h) {
		var fixDef = new b2FixtureDef();
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox( w, h );
		return fixDef;
	},

	createCircleFixture: function(r) {
		var fixDef = new b2FixtureDef();
		fixDef.shape = new b2CircleShape(r);
		return fixDef;
	},

	// SPECIFIC THINGS

	createItem: function(pos) {
		var fd = this.ingredientFixture;
		var body = this.world.CreateBody( this.createStaticBodyDef( pos ) );
		body.CreateFixture( fd );
		return body;
	},

	createPlatform: function(pos,size) {
		var fd = this.createRectFixture(size.w,size.h);
		var body = this.world.CreateBody( this.createStaticBodyDef( pos ) );
		body.CreateFixture( fd );
		return body;
	},

	createMovingPlatform: function(pos,size) {
		var fd = this.createRectFixture(size.w,size.h);
		var body = this.world.CreateBody( this.createKinematicBodyDef(pos) );
		body.CreateFixture( fd );
		return body;
	},

	createBullet: function(pos) {
		var body = this.world.CreateBody( this.createDynamicBodyDef( pos ) );
		body.SetLinearDamping(0.0);
		body.CreateFixture( this.bulletFixture );
		return body;
	},

	createFragment: function(pos,vel,size) {
		var body = this.world.CreateBody( this.createDynamicBodyDef( pos ) );
		if(size == "big"){
			body.CreateFixture( this.potionFragmentFixture );
		} else if(size == "huge"){
			body.CreateFixture( this.hugeFragmentFixture )
		} else {
			body.CreateFixture( this.potionSmallFragmentFixture );
		}
		body.SetAngularDamping(1);
		body.ApplyImpulse( vel, pos );
		return body;
	},

	createSmokeFragment: function(pos,vel) {
		var body = this.world.CreateBody( this.createDynamicBodyDef( pos ) );
		body.CreateFixture( this.smokeFragmentFixture );
		body.ApplyImpulse( vel, pos );
		return body;
	},

	createRectFragment: function(pos,vel) {
		var db = this.createDynamicBodyDef( pos );
		var body = this.world.CreateBody( db );
		body.SetAngularDamping(0.3);
		body.CreateFixture( this.iceFragmentFixture );
		body.ApplyImpulse( new b2Vec2(vel.x,vel.y), new b2Vec2( pos.x+random(-10,10),pos.y+random(-10,10)));
		return body;
	},

	createPlayer: function(pos,size) {
		var fd = this.createRectFixture(size.w,size.h);
		fd.friction = 0.0;
		var playerBody = this.world.CreateBody( this.createDynamicBodyDef( pos ) );
		playerBody.CreateFixture(fd);
		playerBody.SetFixedRotation(true);
		return playerBody;
	}
});