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
		if( o.update() ) gameplay.addFragment( o.physicspos, vector(o.vel.x + Math.randomFloat(-o.rvx,o.rvx), o.vel.y + Math.randomFloat(-o.rvy,o.rvy) ), o.type, null)
	}
});

var ExplosionManager = new JS.Class(Manager,{
	initialize: function(){
		this.callSuper();
		this.preparedcollection = [];
	},

	add: function(pos,vel,type,ground,number){
		if(ground != null){
			var n = ground.getNearestEdge(pos);
			this.preparedcollection.push( {pos: vector(Math.round(pos.x/5)*5,Math.round(pos.y/5)*5) , vel:vel , type:type , ground:ground , nearest:n.nearest , number:number } )
		} else {
			this.preparedcollection.push( {pos: pos, vel: vel, type:type,ground:null , nearest:null , number:number} )
		}
	},


	updateIndividual: function( e, canvas ){
		if(e.life < e.fragmentNumber){
			if(e.type == "miniice"){
				gameplay.addFragment( e.physicspos, vector(Math.randomFloat(-0.5,0.5), Math.randomFloat(-0.2,0)), e.type, "small" );
			} else {
				var vel = vector( Math.randomFloat(-3,3), Math.randomFloat(-3 ,0) );
				var pos = vector(e.physicspos.x, e.physicspos.y);
				if(e.dir == "top"){
					vel.y-=5;
					vel.x = Math.randomFloat(0, e.vel.x * 0.5)
					pos.y-=2;
				} else if(e.dir == "bottom"){
					vel.x = Math.randomFloat(0, e.vel.x * 0.5)
					vel.y = Math.randomFloat(2,5);
					pos.y+=2;
				} else if(e.dir == "left"){
					vel.x = Math.randomFloat(-5,-2);
					vel.y = Math.randomFloat(0, e.vel.y * 0.5)
					pos.x-=2;
				} else if(e.dir == "right"){
					vel.x = Math.randomFloat(2,5);
					vel.y = Math.randomFloat(0, e.vel.y * 0.5)
					pos.x+=2
				}
				gameplay.addFragment( pos, vel, e.type, "big");
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
				if( p.ground.notMovingOrIce() && p.nearest != "bottom"){
					if(p.type == "acid") gameplay.acid.add(p.pos,p.ground);
					if(p.type == "fire") gameplay.fire.add(p.pos,p.ground);
				}
			} else {
				this.collection.push(new Explosion(p.pos,p.vel,p.type,null));
			}
		}
		this.preparedcollection = [];
		this.callSuper(ctx);
	}
});


var EffectManager = new JS.Class(Manager,{
	add: function(pos,platform,type){
		var a = platform.getNearestEdge(pos);
		var n = Vector2.physicsToGrid(a);
		var alreadyTaken = false;
		var platformGrid = Vector2.physicsToGrid(platform.physicspos);
		var w = platform.physicssize.w/5;
		var add = false;

		for(var i = 0; i < this.collection.length; i++){ if( Vector2.equal(n,this.collection[i].gridpos) ) alreadyTaken = true; }
		if( gameplay.squareOccupiedByEffect( n ) ) alreadyTaken = true;

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
		if( Math.coin(0.005) ){
			var nf = {x: 0, y: 0, vx: 0, vy: 0};
			if(f.dir == "right") nf = { x : 1           , y : -1   ,  vx : -0.1             , vy : -0.9           }
			if(f.dir == "left")  nf = { x : 0           , y : -1   ,  vx :  0.1             , vy : -0.9           }
			if(f.dir == "top")   nf = { x : Math.randomFloat(0,4) , y : -0.5 ,  vx : Math.randomFloat(-0.5,0.5) , vy : Math.randomFloat(-0.5,0) }
			gameplay.addFragment( vector(f.physicspos.x + nf.x,f.physicspos.y + nf.y), vector(nf.vx,nf.vy), "fire", null );
		}
		for (var n = 0; n < gameplay.enemies.length; n++) {
			if( Vector2.equal( gameplay.enemies[n].gridpos, f.gridpos ) ) gameplay.enemies[n].inFire = true;
		}
		if( Vector2.equal(player.gridpos, f.gridpos) ) player.inFire = true;
		this.callSuper( f , canvas );
	}
});

var AcidManager = new JS.Class(EffectManager,{
	add: function(pos,platform){
		this.callSuper(pos,platform,"acid")
	},
	updateIndividual : function( f , canvas ){
		if( Math.coin(0.005) ){
			var nf = {x: 0, y: 0, vx: 0, vy: 0};
			if(f.dir == "right") nf = { x : 1           , y : 5    ,  vx : -0.1             , vy : 0              }
			if(f.dir == "left")  nf = { x : 0           , y : 5    ,  vx :  0.1             , vy : 0              }
			if(f.dir == "top")   nf = { x : Math.randomFloat(0,4) , y : -0.5 ,  vx : Math.randomFloat(-0.5,0.5) , vy : Math.randomFloat(-0.5,0) }
			gameplay.addFragment( vector(f.physicspos.x + nf.x,f.physicspos.y + nf.y), vector(nf.vx,nf.vy), "acid", null );
		}

		this.callSuper( f , canvas );
	}
});

var EnemyManager = new JS.Class(GameObjectManager,{
	kill: function( e, graveyard ){
		if( e instanceof Gumball )  for (var i = 0; i < 30; i++) {  gameplay.addFragment( e.physicspos, Vector2.random(15) , "gumball" , "big" ) }
		if( e instanceof Chomper )  for (var i = 0; i < 20; i++) {  gameplay.addFragment( e.physicspos, Vector2.random(15) , "gumball" , "big" ) }
		if( e instanceof Creeper )  for (var i = 0; i < 20; i++) {  gameplay.addFragment( e.physicspos, Vector2.random(15) , (Math.coin(0.5) ? "fire" : "gumball") , "big" ) }
		gameplay.addExplosion( e , "fire" , null )
		this.callSuper( e, graveyard )
	},
	updateIndividual: function( e , canvas, graveyard ){
		if(e instanceof Gumball && e.state == "dying" && Math.coin(0.2)) gameplay.addFragment( e.physicspos, Vector2.random(5) , "gumball" , "big" );
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
		var gp = Vector2.physicsToGrid(pos);
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
