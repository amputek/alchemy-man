 var Floor = GameObject.$extend({
     __init__: function(body){
        this.$super(body);
        this.physicssize = sizeVector(0,0);
        this.boundary = {left:0,top:0,bottom:0,right:0};
    },

    getFixture: function(){
        return this.body.GetFixtureList()
    },

    getTop: function(){
        return this.boundary.top;
    },

    notMovingOrIce: function(){
        return this instanceof MobilePlatform == false && this instanceof IceBlock == false;
    },

    getNearestEdge: function(pos){

        var distanceToLeft   = Math.abs(pos.x - this.boundary.left);
        var distanceToTop    = Math.abs(pos.y - this.boundary.top);
        var distanceToRight  = Math.abs(pos.x - this.boundary.right);
        var distanceToBottom = Math.abs(pos.y - this.boundary.bottom);

        var nearest = "left"
        var nx = pos.x;
        var ny = pos.y;


        //find the closest edge

        var max = 1000;

        if(distanceToLeft < max){
            nearest = "left";
            max = distanceToLeft;
        }
        if(distanceToTop < max){
            nearest = "top";
            max = distanceToTop;
        }
        if(distanceToBottom < max){
            nearest = "bottom";
            max = distanceToBottom;
        }
        if(distanceToRight < max){
            nearest = "right";
        }

        switch( nearest ){
            case "left":
                nx = this.boundary.left;
                break;
            case "right":
                nx = this.boundary.right;
                break;
            case "top":
                ny = this.boundary.top;
                if(nx < this.boundary.left) nx = this.boundary.left;
                if(nx >= this.boundary.right-5) nx = this.boundary.right-5;
                break;
            case "bottom":
                ny = this.boundary.bottom;
                if(nx < this.boundary.left ) nx = this.boundary.left;
                if(nx > this.boundary.right) nx = this.boundary.right
                break;
        }

        return {nearest:nearest, x:nx, y:ny};
    }

});
