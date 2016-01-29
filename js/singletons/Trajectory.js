// var mouseBlips = new Manager();
//
// var MouseBlip = Class.$extend({
//   __init__: function(pos,type){
//     this.pos = vector(pos.x+4,pos.y+3);
//     this.life = 10;
//     this.col = {r:255,g:50,b:20}
//
//     if(type == "ice" ) this.col = {r:50  , g:155 , b:255};
//     if(type == "acid") this.col = {r:100 , g:255 , b:50};
//   },
//   update: function(){
//     this.life++;
//   },
//   isDead: function(){
//     return(this.life >= 30);
//   },
//   draw: function(ctx){
//     ctx.context.lineWidth = 3.0
//     ctx.setStroke( rgba( this.col.r, this.col.g, this.col.b, (30-this.life) / 30 ) );
//     ctx.setFill(   rgba( this.col.r, this.col.g, this.col.b, (30-this.life) / 90 ) );
//     ctx.strokedCircle( this.pos.x, this.pos.y, this.life)
//     ctx.solidCircle( this.pos.x, this.pos.y, this.life)
//   }
// });

var Trajectory = Class.$extend({
    __init__: function( worldGravity ){
        this.timestep = 1/60;
        var timestepSquared = this.timestep * this.timestep;
        var gx = worldGravity.x;
        var gy = worldGravity.y;
        this.stepGravityx = timestepSquared * gx;
        this.stepGravityy = timestepSquared * gy;
    },

    getPoint : function( startx,starty,startvx,startvy,n ){
        var stepvx = this.timestep * startvx;
        var stepvy = this.timestep * startvy;
        var nn = (0.5) * n*n+n
        var rx = startx + n * stepvx + nn * this.stepGravityx;
        var ry = starty + n * stepvy + nn * this.stepGravityy;
        var r = vector(rx,ry);
        return r;
    },


    lineOfSight : function(source, dest){

        source = vector(source.x / SCALE, source.y / SCALE);
        dest = vector(dest.x   / SCALE, dest.y   / SCALE);

        var input = new b2RayCastInput( source, dest, 1 )
        for(var i = 0; i < currentLevel.floors.collection.length; i++){
            var f = currentLevel.floors.collection[i];
            if( f instanceof Ladder == false){
                var output = new b2RayCastOutput;
                if( f.body.GetFixtureList().RayCast(output,input) ){
                    return output.fraction;
                }
            }
        }
        return null;
    },


    draw: function( canvas ){
        if(input.pressed.leftmouse == false) return;

        var startx = player.drawpos.x - 23 * player.facing;
        var starty = player.drawpos.y - 30;

        var start = vector(player.drawpos.x - 23 * player.facing, player.drawpos.y - 30);

        //input.shootAngle = angle( startx + offset.x, starty + offset.y, input.mousepos.x, input.mousepos.y);

        input.shootAngle = Vector2.angle( Vector2.add(start, offset), input.mousepos ) ;

        var mousepos = vector(input.mousepos.x, input.mousepos.y);


        var d = Vector2.distance( {x: startx + offset.x, y: starty + offset.y}, {x:input.mousepos.x, y:input.mousepos.y});
        if( d > 250 ){
            mousepos.x = (startx + offset.x) + Math.cos(input.shootAngle) * 250;
            mousepos.y = (starty + offset.y) + Math.sin(input.shootAngle) * 250;
        }

        var vel = Vector2.distance( {x: startx + offset.x, y: starty + offset.y}, {x: mousepos.x, y:mousepos.y })*0.3;

        lastr = vector(startx,starty)

        var i = 0;

        var done = false;



        if( playerweapon.currentlySelected == "fire") canvas.setFill( potionColor.fire );
        if( playerweapon.currentlySelected == "ice")  canvas.setFill( potionColor.ice  );
        if( playerweapon.currentlySelected == "acid") canvas.setFill( potionColor.acid );

        canvas.solidCircle(startx,starty,5);


        //draw trajectory

        number = 1300;

        while( done == false ){

            var op = (1.0) - (i/number)*1.0;

            //for testing
            op = 1.0;

            if( playerweapon.currentlySelected == "fire") canvas.setStroke( potionColor.fire, op );
            if( playerweapon.currentlySelected == "ice")  canvas.setStroke( potionColor.ice, op );
            if( playerweapon.currentlySelected == "acid") canvas.setStroke( potionColor.acid, op );


            // WTF is going on here?
            var poo = 20;
            var r = this.getPoint( startx , starty , Math.cos(input.shootAngle) * vel, Math.sin(input.shootAngle) * vel - poo, i);
            if(vel > poo) r = this.getPoint( startx , starty , Math.cos(input.shootAngle) * vel, Math.sin(input.shootAngle) * vel - poo + ((vel-poo)*0.05), i);


            var interrupt =  this.lineOfSight(lastr,r)

            if( interrupt == null){

                canvas.line(lastr.x,lastr.y,r.x,r.y)

            } else {

                //draw end circle

                var fraction = interrupt;
                var colpointx = lastr.x + (r.x - lastr.x) * fraction;
                var colpointy = lastr.y + (r.y - lastr.y) * fraction;

                if( playerweapon.currentlySelected == "fire") canvas.setFill( potionColor.fire, op );
                if( playerweapon.currentlySelected == "ice")  canvas.setFill( potionColor.ice, op );
                if( playerweapon.currentlySelected == "acid") canvas.setFill( potionColor.acid, op );

                canvas.solidCircle(colpointx,colpointy,5)
                canvas.line(lastr.x,lastr.y,colpointx,colpointy)
                done = true;
            }
            i+=15;
            if(i >= number ) done = true

            lastr = r;

        }
    }
});
