
var Enemy = ClimbingCharacter.$extend({
  __init__ : function(pos,size){
    this.$super(pos,size);
    this.state = "patrolling";
    this.facing = randomInt(0,1) * 2 - 1;
    this.turnCounter = 0;
    this.currentAction = "idle"
  },

  //this could be a class method?
  lineOfSight: function(source, dest){
    var input = new b2RayCastInput( source.physicspos, dest.physicspos, 1 );
    var floors = currentLevel.getFloors();
    for(var i = 0; i < floors.length; i++){
      if( floors[i] instanceof Ladder == false){
        if( floors[i].getFixture().RayCast( new b2RayCastOutput ,input) ) return false;
      }
    }
    return true;
  },

  update: function(){
    this.turnCounter++;
    if(this.state != "dying"){
      this.behave()
    } else {
      this.kill();
    }
    this.animation.current.incFrame();
    this.$super();
  },

  behave: function(){
    this.turnCounter++;
    if(this.state == "patrolling") this.patrol();
    if(this.state == "hunting") this.hunt();
  },

  turn: function(){
    if(this.turnCounter > 50){
      this.turnCounter = 0;
      if(this.facing == -1){

        this.stop("left")
        this.start("right");
      } else {

        this.stop("right")
        this.start("left");
      }
    }
  },

  getAnimationFrames: function(){
    this.animation.current.getFrame( this.draw_canvas );
  },

  drawToFinalContext: function(){
    this.draw_final.clear();
    this.draw_final.drawImage( this.draw_canvas.getImage() );
  },

  // could this be further up the superclass chain?
  kill: function(){
    this.state = "dead"
    this.animation.current = this.animation.dead;
    this.stop("left");
    this.stop("right");
  },

  // this might get moved later-- for patrolling type enemies
  wallHit: function(above){
    if(above == false) this.turn();
  },

  hunt: function(){
    if(this.physicspos.x > player.physicspos.x){
      if(this.facing == 1) this.turn()
    } else {
      if(this.facing == -1) this.turn()
    }
  },

  atEdgeOfPlatform: function(){
    if(this.currentPlatform != null){
      return( this.physicspos.x <= this.currentPlatform.physicspos.x - this.currentPlatform.physicssize.w+2.5 || this.physicspos.x >= this.currentPlatform.physicspos.x + this.currentPlatform.physicssize.w-2.5);
    }
    return false;
  },



  stop: function(action){
    if(action == "left" || action == "right"){
      this.animation.current = this.animation.idle;
      this.animation.current.reset();
    }
    this.$super(action);
  }
});

var Chomper = Enemy.$extend({
  __init__ : function(pos){
    this.$super(pos,sizeVector(4,4));

    this.moveSpeed = 1.5;
    this.jumpHeight = 14;
    this.animation.idle = new Animation(images.chomper.walk   , 3 , true  , 1  );
    this.animation.run  = new Animation(images.chomper.walk  , 2 , true  , 13 );
    this.animation.attack = new Animation(images.chomper.attack , 3 , true  , 16 );
    this.animation.dead = new Animation(images.chomper.walk   , 3 , false , 1  );
    this.animation.current = this.animation.attack;

    this.drawsize = sizeVector(178,100)
    this.draw_canvas = new Canvas( this.drawsize )
    this.draw_final = new Canvas( this.drawsize );

    this.health = 7;

    this.spotCounter = 0;
    this.attackCounter = 0;
  },

  setFire: function(){
    // override this -- fire immunity
  },

  patrol: function(){


    if(this.lineOfSight( this, player) == true){
      if(player.worldpos.x > this.worldpos.x){
        this.facing == 1
      } else {
        this.facing = -1;
      }
      this.stop("left");
      this.spotCounter++;
      if(this.spotCounter >= 200){
        this.state = "hunting"
        if(this.physicspos.x > player.physicspos.x){
          this.start("left")
        } else {
          this.start("right")
        }
        this.moveSpeed = 7;
      }
    } else {
        if(this.spotCounter > 0) this.spotCounter--;
        if(this.currentAction == "idle"){
            if(this.spotCounter <= 0){

                if( coin(0.5) ) {
                    this.start("left");
                } else {
                    this.start("right")
                }
            }
        }
    }

    if( this.atEdgeOfPlatform() ) this.turn();

  },

 start: function(action){
    if(action == "left" || action == "right"){

      if(this.state == "patrolling"){
        if(this.animation.current != this.animation.run) this.animation.current = this.animation.run;
      } else {
        if(this.animation.current != this.animation.attack) this.animation.current = this.animation.attack;
      }
    }
    this.$super(action);
  },

  hunt: function(){
    this.$super();
    if( this.atEdgeOfPlatform() ) this.jump();
    if(coin(0.05)) this.jump();
    this.attackCounter++;
    if(this.attackCounter % 50 == 30 && vDistance(this.physicspos,player.physicspos) < 10) player.getHit(1)
  },

  drawFinal: function( canvas ){
    canvas.save();
    canvas.translate( this.worldpos.x  - this.drawsize.w/2, this.worldpos.y - this.drawsize.h/2 + 8 );
    if(this.facing == -1) canvas.translate(this.drawsize.w,0);
    canvas.scale(this.facing,1);
    canvas.drawImage( this.draw_final.getImage() );
    canvas.restore();
  }

});


var Creeper = Enemy.$extend({
  __init__ : function(pos){
    this.$super(pos,sizeVector(2,4));

    this.moveSpeed = 1.0;
    this.jumpHeight = 0;

    this.animation.idle = new Animation(images.creeper.idle,3,true,1);
    this.animation.run  = new Animation(images.creeper.idle,3,true,1);
    this.animation.dead = new Animation(images.creeper.idle,3,false,1)
    this.animation.current = this.animation.run;

    this.drawsize = sizeVector(30,70)
    this.draw_canvas = new Canvas( this.drawsize )
    this.draw_final = new Canvas( this.drawsize );

    this.health = 7;
  },

  patrol: function(){
    if(this.atEdgeOfPlatform() )this.turn();
    if( coin(0.5) ) this.turn();
    if(this.lineOfSight( this, player) == true) this.state = "hunting"
  },

  hunt: function(){
    this.$super();
    if( vDistance(this.physicspos, player.physicspos) < 30) this.state = "exploding"
  },

  vibrate: function(){
    // this.stop("left");
    // this.stop("right");
    this.hunt();
    // if( vDistance(this.physicspos, player.physicspos) > 30) this.state = "hunting"
  },

  behave: function(){
    this.$super();
    if(this.state == "exploding") this.vibrate();
    if( vDistance(this.physicspos, player.physicspos) < 10 ) this.kill();
  },

  drawFinal: function( canvas ){
    canvas.save();
    canvas.translate( this.worldpos.x  - this.drawsize.w/2, this.worldpos.y - this.drawsize.h/2 + 0 );
    if(this.state == "exploding") canvas.translate( random(-3,3), random(-3,3) )
    if(this.facing == -1) canvas.translate(this.drawsize.w,0);
    canvas.scale(this.facing,1);
    canvas.drawImage( this.draw_final.getImage() );
    canvas.restore();
  }

});
