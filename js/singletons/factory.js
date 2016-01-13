var factory = new JS.Singleton(JS.Class,{
	initialize: function(){

		this.cPlayer = 0x0004;
		this.cBullet = 0x0002;
		this.cGround = 0x0001;
		this.mPlayer = this.cBullet | this.cGround;

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
		this.hugeFragmentFixture.density = 1.0;

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

	init: function(world){
		this.world = world;
	},

	createBodyDef : function( pos, type ){
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		if(type == "static"   ) bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		if(type == "kinematic") bodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;
		if(type == "dynamic"  ) bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		bodyDef.position = pos;
		return bodyDef;
	},

	// BODY DEFS
	createStaticBodyDef : function( pos ) { return this.createBodyDef( pos, "static" ); },
	createKinematicBodyDef : function( pos ) { return this.createBodyDef( pos, "kinematic" ); },
	createDynamicBodyDef : function( pos ) { return this.createBodyDef( pos, "dynamic" ); },


	// FIXTURES

	createRectFixture: function(w,h) {
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		var fixDef = new Box2D.Dynamics.b2FixtureDef();
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox( w, h );
		return fixDef;
	},

	createCircleFixture: function(r) {
		var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
		var fixDef = new Box2D.Dynamics.b2FixtureDef();
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
			body.CreateFixture( this.hugeFragmentFixture );
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
