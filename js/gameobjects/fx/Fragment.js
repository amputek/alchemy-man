var Fragment = DynamicObject.$extend({
    __init__ :function(pos,vel,type,size){
        this.$super( factory.createFragment(pos,vel,size ) );
        this.life = 0;
        this.type = type;
        
        if(type == "ice" || type == "postice" || type == "miniice"){
            if(size == "big"){
                this.radius = 1.0 * SCALE;
                this.img = images.fx.ice_shard[ randomInt(0,6) ];
            } else {
                this.radius = 0.4 * SCALE;
                this.img = images.fx.ice_shard[ 7 ];
            }
        }
        if(type == "gumball") this.img = images.gum[ randomInt(0,3) ];
        if(type == "fire") this.img = images.fx.ember;
        if(type == "acid") this.img = images.fx.aciddrip;
        if(type == "water") this.img = images.fx.water;
        if(type == "junk"){
            this.img = images.fx.junk[randomInt(0,1)];
            this.applyImpulse( random(-1,1), random(-1,1) , this.physicspos.x + random(-2,2), this.physicspos.y + random(-2,2) );
        }
    },

    applyImpulse: function(vx,vy,px,py){
        this.body.ApplyImpulse( new b2Vec2( vx , vy ), new b2Vec2( px , py ) );
    },

    update:function () {
        this.$super();
        this.life++;
    },

    kill: function(){
        this.life = 51;
    },

    isDead: function(){
        return this.life > 50;
    },

    draw:function( canvas ){
        canvas.save();
        canvas.translate(this.worldpos.x, this.worldpos.y);
        canvas.rotate(this.body.GetAngle());
        canvas.translate(-20,-20);
        if(this.type == "gumball") canvas.translate(16,16);
        canvas.drawImage( this.img );
        canvas.restore();
    }
});
