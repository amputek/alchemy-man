var MobilePlatform = Floor.$extend({
    __init__: function( pos, size ){
        this.$super( factory.createMovingPlatform( pos, size ));
        this.physicssize = size;
        this.drawsize = sizeVector(this.physicssize.w*SCALE,this.physicssize.h*SCALE);
        this.vel = new b2Vec2( 0 , 0 );
        this.setVelocity(0,0)
    },

    setVelocity: function(x,y){
        this.body.SetLinearVelocity( new b2Vec2(x, y));
    },

    setPosition: function( pos ){
        this.body.SetPositionAndAngle( pos, 0 );
    },

    update: function(){
        this.currentpos = this.physicspos = this.body.GetPosition();
        this.vel = this.body.GetLinearVelocity();
        this.worldpos = Vector2.toWorld(this.physicspos);
    }
});




var PlatformTriggerPoint = GameObject.$extend({
    __init__: function(pos,callback){
        this.$super( factory.createPlatform( vector(pos.x,pos.y+4.5), sizeVector(5,0.5) ) );
        this.callback = callback;
    },

    trigger: function(){
      this.callback();
    }
});


var MovingPlatform = MobilePlatform.$extend({
  __init__: function(pos,size,endpos,time,enabled){
    this.$super(pos,size);
    this.endpos = endpos;
    this.time = time;
    this.startpos = pos;
    this.currentpos = pos;
    this.enabled = enabled; //????????
    if(this.enabled == true) this.setVelocity( (this.endpos.x-this.currentpos.x) * this.time, (this.endpos.y-this.currentpos.y) * this.time);

    this.draw_canvas = new Canvas( sizeVector(this.physicssize.w*SCALE*2,500));

    this.draw_canvas.fill("red")
    this.toppos = vector(0,0);
  },


  setTopPos: function(pos){
    this.toppos = pos;
    var height = (this.endpos.y*SCALE)-this.toppos.y;
    if(this.startpos.y > this.endpos.y) height = (this.startpos.y*SCALE)-this.toppos.y;
    this.draw_canvas = new Canvas( sizeVector(this.physicssize.w*SCALE*2, height ));
  },

  enable: function(){
    this.enabled = true;
  },

  startJourney: function(){
    this.enabled = true;
    this.body.SetAwake(true)
    this.setVelocity( (this.endpos.x-this.startpos.x) * this.time, (this.endpos.y-this.startpos.y) * this.time);
  },

  stopJourney: function(){
    this.enabled = false;
    this.body.SetAwake(true)
    this.setVelocity( 0,0);
  },

  getBodies: function(graveyard){
    graveyard.push(this.body)
    if(this.triggerPoint != undefined) graveyard.push(this.triggerPoint.body)
  },


  reachedDest: function(){
    this.setVelocity(0,0);
    this.setPosition( this.endpos );
    this.endpos = vector(this.startpos.x, this.startpos.y);
    this.startpos = vector(this.currentpos.x, this.currentpos.y)
    this.enabled = false;
    this.startJourney();
  },

  update: function(){
    this.$super();
    if(this.enabled){
      if( Vector2.distance( this.physicspos, this.endpos   ) < 0.1) this.reachedDest();
    }
  },

  draw: function(ctx){
    this.draw_canvas.clear();
    this.draw_canvas.setFill("black");

    this.toppos.x = this.worldpos.x - this.physicssize.w*SCALE;

    var lx = this.drawsize.w - (this.drawsize.w-20);
    var rx = this.drawsize.w + (this.drawsize.w-20)

    this.draw_canvas.solidCircle( lx , 0 , 15 );
    this.draw_canvas.solidCircle( rx , 0 , 15 );

    var top = this.worldpos.y - this.toppos.y;


    for(var y = top-40; y > -100; y-=40){
      this.draw_canvas.drawImage( images.env.triggered.chain, vector(lx-20, y));
      this.draw_canvas.drawImage( images.env.triggered.chain, vector(rx-20, y));
    }

    this.draw_canvas.drawImage( images.env.triggered.chain_bottom, vector(lx-20, top-60));
    this.draw_canvas.drawImage( images.env.triggered.chain_bottom, vector(rx-20, top-60));

    this.draw_canvas.setFill("white");

    this.draw_canvas.drawImage( images.env.triggered.left, vector( 0, top-20 ) );
    for( var x = 40; x < (this.drawsize.w*2-40); x+=40){
       this.draw_canvas.drawImage( images.env.triggered.main, vector( x, top-20));
    }
    this.draw_canvas.drawImage( images.env.triggered.right, vector( (this.drawsize.w*2-40), top-20) );

    ctx.drawImage( this.draw_canvas.getImage(), this.toppos);





  }


});


var SwitchedMovingPlatform = MovingPlatform.$extend({
  __init__: function(pos,size,endpos,time,triggerpos){
    this.$super( pos, size, endpos, time, false );
    var _this = this;
    this.triggerPoint = new PlatformTriggerPoint(triggerpos, function(){ _this.enable() } )
    this.triggerimg = images.doodad.lever_ground_off;
  },

    enable: function(){
      this.enabled = !this.enabled;
      if(this.enabled == false){
        this.stopJourney()
        this.triggerimg = images.doodad.lever_ground_off;
      } else {
        this.startJourney();
        this.triggerimg = images.doodad.lever_ground_on;
      }
    },

  draw: function(ctx){
    this.$super(ctx);
    ctx.drawImage(this.triggerimg, vector(this.triggerPoint.worldpos.x-60,this.triggerPoint.worldpos.y-75));
  }
});
