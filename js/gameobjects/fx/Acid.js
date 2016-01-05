var Effect = Class.$extend({
    __init__ : function(pos,endPiece,dir){
        this.gridpos = pos;
        this.physicspos = toPhysics(pos);
        this.worldpos = toWorld(this.physicspos);
        this.life = 15;

        this.draw_canvas = new Canvas();

        this.dir = dir;
        this.endPiece = endPiece;
        this.animation = null;
        this.animationEndPoint = 0;
        this.animationLoopPoint = 0;
        this.drawoffset = vector(0,0);
    },

    update : function(){
        this.life-=0.06;
        this.animation.incFrame();
        if(this.life >= 5){
            if(this.animation.currentFrame == this.animationEndPoint) this.animation.currentFrame = this.animationLoopPoint;
        }
    },

    isDead: function(){
        return this.life <= 0;
    },

    draw : function( canvas ){
        canvas.save();
        canvas.translate(  this.worldpos.x - this.drawoffset.x, this.worldpos.y - this.drawoffset.y );
        canvas.drawImage( this.animation.getFrame( this.draw_canvas ) );
        canvas.restore();
    }
});


var Acid = Effect.$extend({
    __init__ : function(pos,endPiece,dir){
        this.$super(pos,endPiece,dir);
        this.draw_canvas.setSize( sizeVector(100,60) )

        this.animationEndPoint = 52;
        this.animationLoopPoint = 12;

        if(dir == "left"){
            this.animation = new Animation( images.fx.acidright, randomInt(3,4), false, 69);
            this.drawoffset = vector(50,10)
        } else if(dir == "right"){
            this.animation = new Animation( images.fx.acidleft, randomInt(3,4), false, 69);
            this.drawoffset = vector(10,10)
        } else {
            this.animationEndPoint = 58;
            this.animationLoopPoint = 15;
            if(endPiece == true){
                this.animation = new Animation( images.fx.acid_small, randomInt(2,4), false, 88);
                this.drawoffset = vector(5,50)
                // this.draw_canvas.width = 100;
            } else {
                this.drawoffset = vector(30,50)
                this.animation = new Animation( images.fx.acid, randomInt(2,4), false, 81);
            }
        }
    }
});


var Fire = Effect.$extend({
    __init__ : function(pos,endPiece,perm,dir){
        this.$super(pos,endPiece,dir);
        this.draw_canvas.setSize( sizeVector(60,100) )
        this.animationEndPoint = 27;
        this.animationLoopPoint = 10;

        if(dir == "left"){
            this.animation = new Animation( images.fx.firerightwall, randomInt(3,4), false, 44);
            this.drawoffset = vector(45,45);
        } else if(dir == "right"){
            this.animation = new Animation( images.fx.fireleftwall, randomInt(3,4), false, 44);
            this.drawoffset = vector(10,45)
        } else {
            this.drawoffset = vector(50,82)
            if( coin(0.5) ){
                this.animation = new Animation( images.fx.fireL, randomInt(3,4), false, 41);
            } else {
                this.animation = new Animation( images.fx.fireR, randomInt(3,4), false, 41);
            }
            if(endPiece == true){
                this.animation = new Animation( images.fx.firesmall, randomInt(3,4),false,41);
            }
            this.draw_canvas.setSize( sizeVector(140, 100) )
        }
    }
});