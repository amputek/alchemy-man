
var Gumball = Character.$extend({
	__init__ : function(pos,target){
		this.$super(pos,{w:4,h:5.5});
		this.target = Vector2.toWorld(target);

		this.moveSpeed = 0;
		this.jumpHeight = 0;
		this.bodyanimation = new Animation(images.gumball.body,2,true,21);
		this.propanimation = [];
		this.propanimation.waft = new Animation(images.gumball.waft,2,false,24);
		this.propanimation.idle = new Animation(images.gumball.idle,2,true,8);
		this.propanimation.current = this.propanimation.idle;
		this.cannonanimation = new Animation(images.gumball.cannon,4,false,13);

		var _this = this;

		this.propanimation.waft.oncomplete = function(){
			_this.propanimation.current = _this.propanimation.idle;
			_this.propanimation.waft.reset();
		};


		this.drawsize = sizeVector( 200, 200 );
		this.draw_final = new Canvas( this.drawsize );
		this.draw_prop  = new Canvas( this.drawsize );
		this.draw_canvas = new Canvas( this.drawsize );
		this.draw_fire = new Canvas( this.drawsize );
		this.draw_cannon = new Canvas( sizeVector(25,70) );

		this.health = 5;
		this.state = "hovering";
		this.canClimb = false;
		this.lightLevel = 0.0;
		this.body.SetAngularDamping(0.5);
		this.body.SetLinearDamping(0.3);
		this.body.SetFixedRotation(false);
		this.body.GetFixtureList().SetFriction(3.4);
		this.body.GetFixtureList().SetDensity(0.21);
		this.body.ResetMassData();

		this.upCounter = 0;
		this.upping = false;
		this.shootCounter = 0;

		this.inRange = false;
		this.aimAngle = 0;

		this.cannonpos = vector(0,0);

	},

	applyImpulse: function(vx,vy,px,py){
		this.body.ApplyImpulse( new b2Vec2( vx , vy ), new b2Vec2( px , py ) );
	},

	updateCannon: function(){
		this.shootCounter++;
		if(this.inRange == true){
			if(this.shootCounter % 60 == 50) this.cannonanimation.reset();
			if(this.shootCounter % 60 == 0) this.shoot();
		}
	},

	hover: function(bodyAngle){

		var sinBodyAngle = sin(bodyAngle);
		var cosBodyAngle = cos(bodyAngle);

		if( bodyAngle > 1  ) bodyAngle = 1;
		if( bodyAngle < -1 ) bodyAngle = -1;

		this.applyImpulse( ( this.target.x - this.worldpos.x ) * 0.01, cosBodyAngle * -14.4 , this.physicspos.x + bodyAngle , this.physicspos.y + 1 );

		// this.applyImpulse( 0, ( this.target.y - this.worldpos.y ) * 0.01 , this.physicspos.x + bodyAngle , this.physicspos.y + 1 );

		if(this.upping == true){

			if(this.frozenCounter == 0) this.applyImpulse( sinBodyAngle * 2.5, cosBodyAngle * (-4.1*this.upCounter) ,  this.physicspos.x+random(-1,1) , this.physicspos.y+3 );

			this.upCounter++;
			if(this.upCounter == 3){
			  this.upCounter = 0;
			  this.upping = false;
			}
		}

		if(this.worldpos.y > (this.target.y-5) && this.upping == false){
			this.upping = true;
			this.propanimation.current = this.propanimation.waft;
		}

		if(this.frozenCounter == 0) this.updateCannon();

		this.inRange = Vector2.distance(this.physicspos, player.physicspos) < 50

		var x = this.physicspos.x + sinBodyAngle * 6.5;
		var y = this.physicspos.y + cosBodyAngle * 6.5;

		this.cannonpos = vector(x,y);
		this.aimAngle = angle(x,y,player.physicspos.x,player.physicspos.y)


		 if(this.frozenCounter == 0) this.updateCannon();

	},


	update: function(){

		var bodyAngle = this.body.GetAngle();
		var sinBodyAngle = sin(bodyAngle);
		var cosBodyAngle = cos(bodyAngle);

		if(this.state == "hovering") this.hover( bodyAngle )
		if(this.state == "dying") this.applyImpulse( sinBodyAngle * random(-20,-10) , cosBodyAngle * random(-20,-10) , this.physicspos.x+random(-10,10) , this.physicspos.y+random(-10,10) );

		this.bodyanimation.incFrame();
		this.propanimation.current.incFrame();
		this.cannonanimation.incFrame();

		this.$super();
	},

	shoot: function(  ){
		var vel = 17.0
		var ang = this.aimAngle;
		var sinAng = sin(ang);
		var cosAng = cos(ang);
		var startPos = vector( this.cannonpos.x + cosAng * 6, this.cannonpos.y + sinAng * 6 )
		var cannon = new Gum( startPos , vector( cosAng * vel , sinAng * vel - 1.0 ) );
		currentLevel.projectiles.add( cannon );
	},

	getAnimationFrames: function(){
		this.bodyanimation.getFrame(         this.draw_canvas );
		this.propanimation.current.getFrame( this.draw_prop   );
		this.cannonanimation.getFrame(       this.draw_cannon );
		// this.fireanimation.getFrame(         this.draw_fire.canvas   ,this.draw_fire.context   );
	},

	drawToFinalContext: function(){
		this.draw_final.clear();
		this.draw_final.context.save();
		this.draw_final.context.translate(100,135)
		this.draw_final.context.rotate(this.aimAngle - Math.PI/2)
		this.draw_final.context.translate(-12,-15);
		this.draw_final.drawImage( this.draw_cannon.getImage() );
		this.draw_final.context.restore();
		this.draw_final.drawImage(this.draw_canvas.getImage() );
		this.draw_final.drawImage(this.draw_prop.getImage() );
		// this.draw_final.drawImage(this.draw_firecanvas, vector(70,30) );
	},

	drawFinal: function( canvas ){
		 canvas.save();
		 canvas.translate( this.worldpos.x  , this.worldpos.y   );
		 canvas.rotate(this.body.GetAngle());
		 canvas.translate(-100,-85);
		 canvas.drawImage( this.draw_final.getImage() );
		 canvas.restore();
	}

});
