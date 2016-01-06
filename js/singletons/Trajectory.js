var mouseBlips = new Manager();

var MouseBlip = Class.$extend({
  __init__: function(pos,type){
    this.pos = vector(pos.x+4,pos.y+3);
    this.life = 10;
    this.col = {r:255,g:50,b:20}

    if(type == "ice" ) this.col = {r:50  , g:155 , b:255};
    if(type == "acid") this.col = {r:100 , g:255 , b:50};
  },
  update: function(){
    this.life++;
  },
  isDead: function(){
    return(this.life >= 30);
  },
  draw: function(ctx){
    ctx.context.lineWidth = 3.0
    ctx.setStroke( rgba( this.col.r, this.col.g, this.col.b, (30-this.life) / 30 ) );
    ctx.setFill(   rgba( this.col.r, this.col.g, this.col.b, (30-this.life) / 90 ) );
    ctx.strokedCircle( this.pos.x, this.pos.y, this.life)
    ctx.solidCircle( this.pos.x, this.pos.y, this.life)
  }
});

var Trajectory = Class.$extend({
  __init__: function( worldGravity ){
    this.timestep = 1/60;
    var timestepSquared = this.timestep * this.timestep;
    var gx = worldGravity.x;
    var gy = worldGravity.y;
    this.stepGravityx = timestepSquared * gx;
    this.stepGravityy = timestepSquared * gy;

    this.fire = {r: 201, g: 50  , b: 16  };
    this.ice  = {r:50  , g:155  , b:255  };
    this.acid = {r:100 , g:255  , b:50   };

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

  draw: function( canvas ){
    if(input.pressed.leftmouse == true){

      var startx = player.worldpos.x - 23 * player.facing;
      var starty = player.worldpos.y - 30;

      input.shootAngle = angle( startx + offset.x, starty + offset.y, input.mousepos.x, input.mousepos.y);
      var mousepos = vector(input.mousepos.x, input.mousepos.y);


      var d = distance( startx + offset.x, starty + offset.y, input.mousepos.x, input.mousepos.y)
      if( d > 250 ){
        mousepos.x = (startx + offset.x) + cos(input.shootAngle) * 250;
        mousepos.y = (starty + offset.y) + sin(input.shootAngle) * 250;
      }

      var vel = distance( startx + offset.x, starty + offset.y, mousepos.x, mousepos.y)*0.3;

      lastr = vector(startx,starty)

      var i = 0;

      var done = false;



      if( playerweapon.currentlySelected == "fire") canvas.setFill( rgb(this.fire.r, this.fire.g, this.fire.b) );
      if( playerweapon.currentlySelected == "ice")  canvas.setFill( rgb(this.ice.r , this.ice.g , this.ice.b ) );
      if( playerweapon.currentlySelected == "acid") canvas.setFill( rgb(this.acid.r, this.acid.g, this.acid.b) );
      canvas.solidCircle(startx,starty,5);


      //draw trajectory

      number = 1300;

      while( done == false ){

        var op = (1.0) - (i/number)*1.0;


        //for testing
        op = 1.0;

        if( playerweapon.currentlySelected == "fire") canvas.setStroke( rgba(this.fire.r, this.fire.g, this.fire.b, op) );
        if( playerweapon.currentlySelected == "ice")  canvas.setStroke( rgba(this.ice.r , this.ice.g , this.ice.b , op) );
        if( playerweapon.currentlySelected == "acid") canvas.setStroke( rgba(this.acid.r, this.acid.g, this.acid.b, op) );


        // WTF is going on here?
        var poo = 20;
        var r = this.getPoint( startx , starty , cos(input.shootAngle) * vel, sin(input.shootAngle) * vel - poo, i);
        if(vel > poo) r = this.getPoint( startx , starty , cos(input.shootAngle) * vel, sin(input.shootAngle) * vel - poo + ((vel-poo)*0.05), i);


        var interrupt =  lineOfSight(lastr,r)

        if( interrupt == null){

            canvas.line(lastr.x,lastr.y,r.x,r.y)

        } else {

            //draw end circle

            var fraction = interrupt;
            var colpointx = lastr.x + (r.x - lastr.x) * fraction;
            var colpointy = lastr.y + (r.y - lastr.y) * fraction;

            if( playerweapon.currentlySelected == "fire") canvas.setFill( rgba(this.fire.r, this.fire.g, this.fire.b, op) );
            if( playerweapon.currentlySelected == "ice")  canvas.setFill( rgba(this.ice.r , this.ice.g , this.ice.b , op) );
            if( playerweapon.currentlySelected == "acid") canvas.setFill( rgba(this.acid.r, this.acid.g, this.acid.b, op) );

            canvas.solidCircle(colpointx,colpointy,5)
            canvas.line(lastr.x,lastr.y,colpointx,colpointy)
            done = true;
        }
        i+=15;
        if(i >= number ) done = true

        lastr = r;
      }
    }
  }
});
