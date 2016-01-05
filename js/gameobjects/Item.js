var Item = GameObject.$extend({
    __init__: function(pos,type){
        this.$super( factory.createItem( pos ) );
        this.dead = false;
        this.counter = 0;
        this.type = type;
    },

    take: function(){
        this.dead = true;
        return this.type;
    },

    isDead: function(){
        return this.dead;
    },

    draw: function(ctx){
        if(this.dead == false){
            this.counter+=0.1;
            
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 3.0;
            line(ctx,this.worldpos.x,this.worldpos.y,this.worldpos.x,this.worldpos.y + 18)
            ctx.lineWidth = 5.0;
            ctx.lineCap = "round"
            line(ctx,this.worldpos.x,this.worldpos.y + 18,this.worldpos.x - 4,this.worldpos.y + 14);
            line(ctx,this.worldpos.x,this.worldpos.y + 18,this.worldpos.x + 4,this.worldpos.y + 14);

            if(this.type == "red") ctx.fillStyle = 'rgba(255,10,20,1.0)'
            if(this.type == "blue") ctx.fillStyle = 'rgba(50,100,255,1.0)'
            if(this.type == "green") ctx.fillStyle = 'rgba(50,180,55,1.0)'
            solidCircle(ctx, this.worldpos.x, this.worldpos.y, 7)
        }
    }
});