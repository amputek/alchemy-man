var Debug = Class.$extend({
  __init__: function(){
    this.debugText = element("debug").innerHTML;

    if(debugging){
      
      this.debugCanvasWrapper = document.createElement("div")
  
      this.debugCanvasWrapper.style.width = this.debugCanvasWrapper.style.height = "2500px"
      this.debugCanvasWrapper.style.position = "absolute"
      this.debugCanvasWrapper.style.zIndex = 100;
      this.debugCanvasWrapper.style.overflow = "hidden";

      // debug wrapper at top of screeen
      stats = new Stats();
      element("debug-wrapper").style.display = "block";
      element("debug-wrapper").appendChild( stats.domElement );

      // debug draw for physics
      var debugCanvas =  element("debug");
      debugCanvas.width = debugCanvas.height = 2500;
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite( debugCanvas.getContext('2d') );
      debugDraw.SetDrawScale(SCALE);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(0.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);
    
      this.debugCanvasWrapper.appendChild(debugCanvas)

      // grid
      // gridcanvas = new Canvas( sizeVector(2500,1000) );
      // gridcanvas.getImage().style.position = "absolute"
      // gridcanvas.getImage().style.zIndex = 100;
      // gridcanvas.setStroke('rgba(100,200,255,0.5)');
      // for(var x = 0; x < 2000; x+=40){ gridcanvas.line( x , 0 , x    ,  800 ); }
      // for(var y = 0; y < 2000; y+=40){ gridcanvas.line( 0 , y , 2000 ,  y   ); }

      // this.debugCanvasWrapper.appendChild( gridcanvas.getImage() )
    
      element("game-wrapper").appendChild(this.debugCanvasWrapper)
    }

    
  },

  log: function(text,con){
    var time = (Date.now() - now)
    if(con != false) console.log(time/1000, text)
    var d = this.debugText;
    this.debugText = "<br/> [" + (time/1000) + "s] " + text;
    this.debugText += d;    
  },

  update : function(){
    if(debugging){
      this.debugCanvasWrapper.style.webkitTransform = "translate3d(" + offset.x + "px," + offset.y + "px, 0px)"
      world.DrawDebugData();
      // element("body-count").innerHTML = "bodies: " + world.GetBodyCount();
      // element("time").innerHTML = "time: " + round( (Date.now() - now) / 100 ) / 10;
    }
  },
});