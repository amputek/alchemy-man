var TriggerPoint = GameObject.$extend({
    __init__: function(pos,size,spawner){
        this.$super( factory.createPlatform( pos, size ) );
        this.spawner = spawner;
    }
});

// shoudl this extend doodad instead??????
var EnemySource = Class.$extend({
    __init__: function(pos,frq,limit){
        this.physicspos = vector(pos.x, pos.y - 5);
        this.worldpos = toWorld(pos)
        this.frequency = frq;   
        this.counter = 0;
        this.mobcount = 0;
        this.maxmobcount = limit;
        this.active = true;
        this.ledges = [];
        // this.img = images.env.mobspawner_alive; //replace this for animation eventually
        this.animation = [];
        this.animation.spit   = new Animation( images.env.mobspawner_spit,   3, false, 12)
        this.animation.feeder = new Animation( images.env.mobspawner_feeder, 4, false, 20)
        this.spit_canvas = new Canvas( sizeVector(600,400) );
        this.feeder_canvas = new Canvas( sizeVector(600,400) );
        this.postLedge = null;
        this.mobs = [];


        // this.topleft = vector(15 * 5,1 * 5);
        this.size = sizeVector(25 * 5,5 * 5)

        var s  = vector(0,0);

        this.postLedge = null;
        this.leftLedge =  new Platform( vector( pos.x - 14.5  , pos.y + 2.5 ),  sizeVector( 0.5 , 17.5 ), null, s );
        this.rightLedge = new Platform( vector( pos.x + 4.5   , pos.y + 2.5 ),  sizeVector( 0.5 , 17.5 ), null, s );
        
        this.ledges.push( new Platform( vector( pos.x - 22.5  , pos.y + 15  ),  sizeVector( 2.5 , 5  ), null, s ) );
        this.ledges.push( new Platform( vector( pos.x - 5.0   , pos.y + 10  ),  sizeVector( 15  , 10 ), null, s ) );
        this.ledges.push( new Platform( vector( pos.x + 17.5  , pos.y + 15  ),  sizeVector( 7.5 , 5  ), null, s ) );
        this.ledges.push( new Platform( vector( pos.x + 32.5  , pos.y + 10  ),  sizeVector( 7.5 , 10 ), null, s ) );
        this.ledges.push( new Platform( vector( pos.x + 47.5  , pos.y - 7.5 ),  sizeVector( 7.5 , 2.5 ), null, s ) );
        // this.ledges.push( new Ledge( vector( pos.x + 17.5 , pos.y + 15  ),  sizeVector( 7.5 , 5 ), null ) );

        this.triggerPoint = new TriggerPoint( vector( pos.x - 5 , pos.y - 8 ),   sizeVector(8,5), this )
        // this.triggerPointRight = new TriggerPoint( vector( pos.x + 50 , pos.y - 5.0 ),   sizeVector(2.5,1), this )

    },

    draw: function( canvas ){
        canvas.save();
        canvas.translate( this.worldpos.x - 240 , this.worldpos.y - 160 );

        var a = (this.counter-80) % this.frequency;

        if(a > 50) canvas.drawImage( images.doodad.premade, vector( 600 - a*1.45 , 200 ) )

        canvas.drawImage( this.animation.spit.getFrame( this.spit_canvas ) );


        // var r = random(-2,2)
        // var r2 = random(-2,2)
        // canvas.translate( 0 ,  160  );
        // canvas.translate( r ,  r2   )
        // canvas.drawImage( images.env.mobspawner_base );
        // canvas.translate( -r ,  -r2   )
        // canvas.translate( 0 ,  -160 );

        canvas.translate( 400 ,  0  );
        canvas.drawImage( this.animation.feeder.getFrame( this.feeder_canvas ) );


        canvas.translate( 200 ,  -200  );
        canvas.drawImage( images.doodad.pipe_bottom );
        canvas.restore();
    },

    getBodies: function(graveyard){
        for (var i = 0; i < this.ledges.length; i++) {
            graveyard.push( this.ledges[i].body );
        }
        if( this.triggerPoint != null ) graveyard.push( this.triggerPoint.body  )
        if( this.leftLedge != null )  graveyard.push( this.leftLedge.body )
        if( this.rightLedge != null ) graveyard.push( this.rightLedge.body )
        if( this.postLedge != null )  graveyard.push( this.postLedge.body )
    },

    kill: function(){
        // this is a message from the collision listener. process death on the next update frame
        if(this.active == true) this.dyingCounter = 1;
    },

    death: function(){
        if(this.dyingCounter == 1){
            currentLevel.addTooltip("+100", this.worldpos)
            world.DestroyBody( this.triggerPoint.body );
            // world.DestroyBody( this.triggerPointRight.body );
            world.DestroyBody( this.leftLedge.body );
            world.DestroyBody( this.rightLedge.body );
            this.active = false;
            this.img = images.env.mobspawner_dead;  
            this.postLedge = new Platform( vector(this.physicspos.x-5,this.physicspos.y+7.5),  sizeVector(5,12.5), null, vector(0,0));
        }

        if(this.dyingCounter > 0 && this.dyingCounter < 200){
            this.dyingCounter++;
            // if( coin(0.1) ) currentLevel.addExplosion( vector(this.physicspos.x + random(-10,40), this.physicspos.y + random(-5,25)) , vector(0,0) , "fire" , null);
        }
    },

    createMobs: function(){
        if(this.mobcount < this.maxmobcount){
            this.counter++;

            if(this.counter == this.frequency - 10) this.animation.spit.reset();
            if(this.counter == 100) this.animation.feeder.reset();
            if(this.counter == this.frequency){
                var g = new Gumball( vector(this.physicspos.x-5,this.physicspos.y-2), vector(this.physicspos.x + random(-60,60), this.physicspos.y + random(-35,-20) ) );
                g.impulse( 0,-260 );
                g.body.SetPositionAndAngle( vector(this.physicspos.x-5,this.physicspos.y-2), random(-0.5,0.5))
                currentLevel.enemies.add( g );
                this.counter = 0;
                this.mobs.push(g);
                this.mobcount++;
            }
        }
    },

    isDead: function(){
        return false
    },

    update: function(){

        this.death();

        if(this.active == true){
            var c = this.counter % this.frequency;

            if( c > 60 && c < 70 && coin(0.9) ){
                currentLevel.addFragment( vector(this.physicspos.x + 47.5,this.physicspos.y - 35), vector(random(-0.05,0.05),0), (coin(1.0) ? "gumball" : "junk" ), "big")
                currentLevel.addFragment( vector(this.physicspos.x + 47.5,this.physicspos.y - 35), vector(random(-0.05,0.05),0), (coin(1.0) ? "gumball" : "junk" ), "big")
                currentLevel.addFragment( vector(this.physicspos.x + 47.5,this.physicspos.y - 35), vector(random(-0.05,0.05),0), (coin(1.0) ? "gumball" : "junk" ), "big")
            }

            this.animation.spit.incFrame();
            this.animation.feeder.incFrame();

            var removers = [];
            for (var i = 0; i < this.mobs.length; i++) {
                if( this.mobs[i].isDead() ){
                    this.mobcount--;
                    removers.push(this.mobs[i]);
                }
            }
            for (var i = 0; i < removers.length; i++) {
                this.mobs.splice( this.mobs.indexOf(removers[i]), 1 );
            }

            this.createMobs(); 
        }
    }

});
