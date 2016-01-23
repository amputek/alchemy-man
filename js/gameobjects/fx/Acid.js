var Effect = new JS.Class({
    initialize: function(pos,endPiece,dir){
        this.gridpos = pos;
        this.physicspos = Vector2.toPhysics(pos);
        this.worldpos = Vector2.toWorld(this.physicspos);
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


var Acid = new JS.Class(Effect,{
    initialize : function(pos,endPiece,dir){
        this.callSuper(pos,endPiece,dir);
        this.draw_canvas.setSize( sizeVector(100,60) )

        this.animationEndPoint = 52;
        this.animationLoopPoint = 12;

        if(dir == "left"){
            this.animation = new Animation( images.fx.acidright, Math.randomInt(3,4), false, 69);
            this.drawoffset = vector(50,10)
        } else if(dir == "right"){
            this.animation = new Animation( images.fx.acidleft, Math.randomInt(3,4), false, 69);
            this.drawoffset = vector(10,10)
        } else {
            this.animationEndPoint = 58;
            this.animationLoopPoint = 15;
            if(endPiece == true){
                this.animation = new Animation( images.fx.acid_small, Math.randomInt(2,4), false, 88);
                this.drawoffset = vector(5,50)
                // this.draw_canvas.width = 100;
            } else {
                this.drawoffset = vector(30,50)
                this.animation = new Animation( images.fx.acid, Math.randomInt(2,4), false, 81);
            }
        }
    }
});


var Fire = new JS.Class(Effect,{
    initialize : function(pos,endPiece,perm,dir){
        this.callSuper(pos,endPiece,dir);
        this.draw_canvas.setSize( sizeVector(60,100) )
        this.animationEndPoint = 27;
        this.animationLoopPoint = 10;

        if(dir == "left"){
            this.animation = new Animation( images.fx.firerightwall, Math.randomInt(3,4), false, 44);
            this.drawoffset = vector(45,45);
        } else if(dir == "right"){
            this.animation = new Animation( images.fx.fireleftwall, Math.randomInt(3,4), false, 44);
            this.drawoffset = vector(10,45)
        } else {
            this.drawoffset = vector(50,82)
            if( Math.coin(0.5) ){
                this.animation = new Animation( images.fx.fireL, Math.randomInt(3,4), false, 41);
            } else {
                this.animation = new Animation( images.fx.fireR, Math.randomInt(3,4), false, 41);
            }
            if(endPiece == true){
                this.animation = new Animation( images.fx.firesmall, Math.randomInt(3,4),false,41);
            }
            this.draw_canvas.setSize( sizeVector(140, 100) )
        }
    }
});
