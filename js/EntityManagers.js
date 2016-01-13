var BaseManager = new JS.Class({
	initialize       : function(   ){  this.collection = [];     },
	add              : function(obj){  this.collection.push(obj) },
	getCollection    : function(   ){  return this.collection;   },
	emptyCollection  : function(   ){  this.collection = [];     }
});

// Allows individuals to be drawn
var StaticManager = new JS.Class(BaseManager,{
	  updateIndividual: function( o , ctx ){   o.draw(ctx); },
	  update: function(ctx){ for(var i = 0; i < this.collection.length; i++){  this.updateIndividual( this.collection[i], ctx )  } }
});

// allows individuals to be updated (as well as drawn)
var DynamicManager = new JS.Class(StaticManager,{
	updateIndividual: function( o , ctx ){
		o.update();
		this.callSuper( o, ctx )
	}
});

//  allows individuals to be removed --- NO GAME OBJECTS YET
var Manager = new JS.Class(DynamicManager,{
	initialize: function(){
		this.callSuper();
		this.removers = [];
	},
	updateIndividual: function( o, ctx ){
		if ( o.isDead() ){
			this.kill( o );    // this bit is causing trouble in subclasses..........
		} else {
			this.callSuper( o, ctx )
		}
	},
	kill: function( o ){
		this.removers.push( o );
	},
	update: function( ctx ){
		this.removers = [];
		this.callSuper( ctx )
		this.collectGarbage();
	},
	collectGarbage: function( ){
		for(var i = 0; i < this.removers.length; i++){ this.collection.splice( this.collection.indexOf( this.removers[i]), 1 ); }
	}
});


// overwrites methods to have a graveyard parameter..... hmm
var GameObjectManager = new JS.Class(Manager,{
	updateIndividual: function( o, ctx, graveyard ){
		if ( o.isDead() ) this.kill( o, graveyard );
			o.draw(ctx);
			o.update();
		},
	update: function( ctx , graveyard ){
		this.removers = [];
		for(var i = 0; i < this.collection.length; i++){ this.updateIndividual( this.collection[i], ctx , graveyard) }
		this.collectGarbage();
	},
	kill: function( obj, graveyard ){
		graveyard.push( obj.body );
		this.callSuper( obj )
	},
	getBodies: function( graveyard){
		for (var i = 0; i < this.collection.length; i++) { this.kill( this.collection[i], graveyard ); }
		this.collection = [];
	}
});

var GameObjectCollectionManager = new JS.Class(DynamicManager,{
	kill: function( obj, graveyard ){ obj.getBodies( graveyard ); },
	getBodies: function( graveyard){
		for (var i = 0; i < this.collection.length; i++) { this.kill( this.collection[i], graveyard ); }
		this.collection = [];
	}
});

var FragmentSourceManager = new JS.Class(Manager,{
	updateIndividual: function(o){
		if( o.update() ) currentLevel.addFragment( o.physicspos, vector(o.vel.x + random(-o.rvx,o.rvx), o.vel.y + random(-o.rvy,o.rvy) ), o.type, null)
	}
});

var ExplosionManager = new JS.Class(Manager,{
		initialize: function(){
		this.callSuper();
		this.preparedcollection = [];
	},

	add: function(pos,vel,type,ground,number){
		if(ground != null){
			var n = getDir(pos,ground);
			this.preparedcollection.push( {pos: vector(round(pos.x/5)*5,round(pos.y/5)*5) , vel:vel , type:type , ground:ground , nearest:n.nearest , number:number } )
		} else {
			this.preparedcollection.push( {pos: pos, vel: vel, type:type,ground:null , nearest:null , number:number} )
		}
	},


	updateIndividual: function( e, canvas ){
		if(e.life < e.fragmentNumber){
			if(e.type == "miniice"){
				currentLevel.addFragment( e.physicspos, vector(random(-0.5,0.5), random(-0.2,0)), e.type, "small" );
			} else {
				var vel = vector( random(-3,3), random(-3 ,0) );
				var pos = vector(e.physicspos.x, e.physicspos.y);
				if(e.dir == "top"){
					vel.y-=5;
					vel.x = random(0, e.vel.x * 0.5)
					pos.y-=2;
				} else if(e.dir == "bottom"){
					vel.x = random(0, e.vel.x * 0.5)
					vel.y = random(2,5);
					pos.y+=2;
				} else if(e.dir == "left"){
					vel.x = random(-5,-2);
					vel.y = random(0, e.vel.y * 0.5)
					pos.x-=2;
				} else if(e.dir == "right"){
					vel.x = random(2,5);
					vel.y = random(0, e.vel.y * 0.5)
					pos.x+=2
				}
				currentLevel.addFragment( pos, vel, e.type, "big");
			}
		}
		this.callSuper( e, canvas )
	},

	update : function(ctx){
		for(var i = 0; i < this.preparedcollection.length; i++){
			var p = this.preparedcollection[i];
			if(p.ground != null){
				var n = p.number;
				if(n == null) n = 5;
				this.collection.push(new Explosion(p.pos,p.vel,p.type,p.nearest,n));
				if( notMovingOrIce(p.ground) && p.nearest != "bottom"){
					if(p.type == "acid") currentLevel.acid.add(p.pos,p.ground);
					if(p.type == "fire") currentLevel.fire.add(p.pos,p.ground);
				}
			} else {
				this.collection.push(new Explosion(p.pos,p.vel,p.type,null));
			}
		}
		this.preparedcollection = [];
		this.callSuper(ctx);
	}
});

var TooltipManager = new JS.Class(Manager,{
	collectGarbage: function( ){
		for(var i = 0; i < this.removers.length; i++){
			element("game-wrapper").removeChild( this.removers[i].dom )
			this.collection.splice( this.collection.indexOf( this.removers[i]), 1 );
		}
	}
});

var EffectManager = new JS.Class(Manager,{
	add: function(pos,platform,type){
		var a = getDir(pos,platform)
		var n = Vector2.toGrid(a);
		var alreadyTaken = false;
		var platformGrid = Vector2.toGrid(platform.physicspos);
		var w = platform.physicssize.w/5;
		var add = false;

		for(var i = 0; i < this.collection.length; i++){ if( equalVector(n,this.collection[i].gridpos) ) alreadyTaken = true; }
		if( currentLevel.occupied( n ) ) alreadyTaken = true;

		if(alreadyTaken === false){
			if(a.nearest != "top"){
				if(platform.physicspos.y + platform.physicssize.h && platform.physicssize.h > 10){
					add = true;
				}
			} else {
				if( platform.physicssize.w > 7 ){
					add = true;
				}
			}
		}

		if(add == true){
			var endPiece = !(n.x >= (platformGrid.x-w)+1.5 && n.x < (platformGrid.x+w)-1.0)
			if(type == "fire") this.collection.push( new Fire(n, endPiece, false, a.nearest));
			if(type == "acid") this.collection.push( new Acid(n, endPiece,  a.nearest));
		}
	}
});

var FireManager = new JS.Class(EffectManager,{
	add: function(pos,platform){
		this.callSuper(pos,platform,"fire")
	},

	updateIndividual: function( f , canvas ){
		if( coin(0.005) ){
			var nf = {x: 0, y: 0, vx: 0, vy: 0};
			if(f.dir == "right") nf = { x : 1           , y : -1   ,  vx : -0.1             , vy : -0.9           }
			if(f.dir == "left")  nf = { x : 0           , y : -1   ,  vx :  0.1             , vy : -0.9           }
			if(f.dir == "top")   nf = { x : random(0,4) , y : -0.5 ,  vx : random(-0.5,0.5) , vy : random(-0.5,0) }
			currentLevel.addFragment( vector(f.physicspos.x + nf.x,f.physicspos.y + nf.y), vector(nf.vx,nf.vy), "fire", null );
		}
		for (var n = 0; n < currentLevel.enemies.length; n++) {
			if( equalVector( currentLevel.enemies[n].gridpos, f.gridpos ) ) currentLevel.enemies[n].inFire = true;
		}
		if( equalVector(player.gridpos, f.gridpos) ) player.inFire = true;
		this.callSuper( f , canvas );
	}
});

var AcidManager = new JS.Class(EffectManager,{
	add: function(pos,platform){
		this.callSuper(pos,platform,"acid")
	},
	updateIndividual : function( f , canvas ){
		if( coin(0.005) ){
			var nf = {x: 0, y: 0, vx: 0, vy: 0};
			if(f.dir == "right") nf = { x : 1           , y : 5    ,  vx : -0.1             , vy : 0              }
			if(f.dir == "left")  nf = { x : 0           , y : 5    ,  vx :  0.1             , vy : 0              }
			if(f.dir == "top")   nf = { x : random(0,4) , y : -0.5 ,  vx : random(-0.5,0.5) , vy : random(-0.5,0) }
			currentLevel.addFragment( vector(f.physicspos.x + nf.x,f.physicspos.y + nf.y), vector(nf.vx,nf.vy), "acid", null );
		}

		this.callSuper( f , canvas );
	}
});

var EnemyManager = new JS.Class(GameObjectManager,{
	kill: function( e, graveyard ){
		currentLevel.addTooltip( e.worldpos, "+10" );
		if( e instanceof Gumball )  for (var i = 0; i < 30; i++) {  currentLevel.addFragment( e.physicspos, randomVector(15) , "gumball" , "big" ) }
		if( e instanceof Chomper )  for (var i = 0; i < 20; i++) {  currentLevel.addFragment( e.physicspos, randomVector(15) , "gumball" , "big" ) }
		if( e instanceof Creeper )  for (var i = 0; i < 20; i++) {  currentLevel.addFragment( e.physicspos, randomVector(15) , (coin(0.5) ? "fire" : "gumball") , "big" ) }
		currentLevel.addExplosion( e , "fire" , null )
		this.callSuper( e, graveyard )
	},
	updateIndividual: function( e , canvas, graveyard ){
		if(e instanceof Gumball && e.state == "dying" && coin(0.2)) currentLevel.addFragment( e.physicspos, randomVector(5) , "gumball" , "big" );
		this.callSuper( e , canvas, graveyard );
	},
	getBodies: function( graveyard){
		for (var i = 0; i < this.collection.length; i++) { graveyard.push(this.collection[i].body) }
		this.collection = [];
	}
});


var IceManager = new JS.Class(GameObjectManager,{
	initialize: function(){
		this.preFreeze = null;
		this.callSuper();
	},
	add: function(pos,platform){
		var gp = Vector2.toGrid(pos);
		this.preFreeze = vector(pos.x, gp.y* 5);
	},
	update : function(ctx, graveyard){
		if(this.preFreeze != null){
			this.collection.push(new IceBlock( this.preFreeze ) );
			this.preFreeze = null;
		}
		this.callSuper(ctx, graveyard);
	}
});
