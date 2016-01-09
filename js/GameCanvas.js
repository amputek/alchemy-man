var Canvas = Class.$extend({
	__init__: function(size){
		this.canvas = createCanvas();
		this.context = this.canvas.getContext('2d');
		if( size  == undefined) size = sizeVector(0,0);
		this.canvas.width = size.w;
		this.canvas.height = size.h
	},

	setAlpha:      function(   a   ){ this.context.globalAlpha = a;	                                    },
	setFill:       function( color ){ this.context.fillStyle = color;	                                  },
	setFill:       function( co,op ){ this.context.fillStyle = rgba(co.r,co.g,co.b,op || co.a || 1);				},
	setStroke:     function( color ){ this.context.strokeStyle = color;	                                },
	setStroke:     function( co,op ){ this.context.strokeStyle = rgba(co.r,co.g,co.b,op || co.a || 1);				},
	setWidth:      function(   w   ){ this.context.lineWidth = w;	                                      },
	blendFunction: function( blend ){ this.context.globalCompositeOperation = blend	                    },
	translate:     function( x , y ){ this.context.translate(x,y)	                                      },
	save:          function(       ){ this.context.save();	                                            },
	scale:         function( x , y ){ this.context.scale(x,y);	                                        },
	restore:       function(       ){ this.context.restore();	                                          },
	rotate:        function( r     ){ this.context.rotate(r)	                                          },
	clear: 				 function(       ){ this.canvas.width = this.canvas.width                           	},

	setSize: function(size){
		this.canvas.width = size.w;
		this.canvas.height = size.h;
	},

	fill: function(color){
		this.context.fillStyle = color;
		this.solidRect(0,0,this.canvas.width,this.canvas.height)
	},

	drawImage: function(img, pos){
		if(pos == undefined) pos = vector(0,0);
		this.context.drawImage(img, pos.x, pos.y)
	},

	getImage: function(){
		return this.canvas;
	},

	setCanvas: function(img){
		this.canvas = img;
	},

	tint: function(tint,opacity){
  	this.blendFunction("source-atop");
  	this.fill('rgba(' + tint.r + ',' + tint.g + ',' + tint.b + ',' + opacity + ')');
  	this.blendFunction("source-over");
	},

	circle: function( x, y, r, fill ){
		if( r > 0){
			this.context.beginPath();
	  	this.context.arc(x, y, r, 0, 2 * Math.PI, false);
	  	if( fill ){ this.context.fill(); } else { this.context.stroke() }
	  }
	},

	solidCircle:   function( x , y , r ){ this.circle(x,y,r, true)  },
	strokedCircle: function( x , y , r ){ this.circle(x,y,r, false)	},


	arc: function( x, y, r, s, l) {
	  if( r > 0){
	   this.context.beginPath();
	   this.context.arc(x, y, r, s, s+l, false);
	   this.context.fill();
	  }
	},

	strokedArc: function( x, y, r, s, l) {
	  if( r > 0){
	   this.context.beginPath();
	   this.context.arc(x, y, r, s, s+l, false);
	   this.context.stroke();
	  }
	},

	line: function(x1,y1,x2,y2){
  	this.context.beginPath();
  	this.context.moveTo(x1,y1);
  	this.context.lineTo(x2,y2);
  	this.context.stroke();
	},

	triangle: function(x1,y1,x2,y2,x3,y3){
	  this.context.beginPath();
	  this.context.moveTo(x1,y1);
	  this.context.lineTo(x2,y2);
	  this.context.lineTo(x3,y3);
	  this.context.fill();
	},

	strokedRect: function(x,y,w,h){
	  this.context.beginPath();
	  this.context.strokeRect(x,y,w,h);
	},

	solidRect: function(x,y,w,h){
	  this.context.beginPath();
	  this.context.fillRect(x,y,w,h);
	}

});




var GameCanvas = Canvas.$extend({
	__init__: function(size,offsetMod){
		// if( size.h < 550) size.h = 550;
		this.$super(  sizeVector(1080 + size.w * offsetMod, 550 + size.h * offsetMod ) )
		this.offsetMod = offsetMod;
		this.canvas.style.position = "absolute";
		if(offsetMod == 1) this.canvas.style.boxShadow = "0 0 0 1000px rgba(0,0,0,0.6)";
		element("game-wrapper").appendChild(this.canvas);
	},

	delete: function(){
		element("game-wrapper").removeChild(this.canvas);
	},

	update: function(shake){
		var x = Math.floor(offset.x* this.offsetMod + random(-shake,shake));
		var y = Math.floor(offset.y* this.offsetMod + random(-shake,shake));
		this.canvas.style.webkitTransform = "translate3d(" + x + "px," + y + "px, 0px)"
		// ctx.drawImage( this.canvas, offset.x * this.offsetMod + random(-shake,shake), offset.y * this.offsetMod + random(-shake,shake))
	}
});



//this isn't used anywhere???
var LightCanvas = GameCanvas.$extend({
	__init__: function(w,h,lights,floors){
		this.$super(w,h,1.0);

		this.tempCanvas = createCanvas();
		this.tempContext = this.tempCanvas.getContext('2d');
		this.tempCanvas.width = w;
		this.tempCanvas.height = h

		this.floors = floors;

	},


	update: function(shake){

		this.tempContext.clearRect(0,0,3000,3000)
		this.clear();

		var pos = player.worldpos;
		blendFunction(this.tempContext, "source-over");
		var color = 'rgba(255,125,80,1.0)'
		if(playerweapon.currentlySelected == "ice") color = 'rgba(100,200,255,1.0)'
		if(playerweapon.currentlySelected == "acid") color = 'rgba(130,255,105,1.0)'
		radial(this.tempContext, pos.x ,  pos.y ,  200 , color , 'transparent' );
		solidCircle(this.tempContext,pos.x, pos.y,200);

		blendFunction( this.tempContext, "destination-out")
		this.getShadows( pos, this.floors, this.tempContext)

		blendFunction(this.context, "source-over");
		this.context.fillStyle = 'rgba(0,0,0,0.96)'
		solidRect(this.context,0,0,3000,3000);
		blendFunction(this.context, "destination-out");
		this.context.drawImage( this.tempCanvas, 0, 0)

		blendFunction( this.context, "source-over")
		this.context.globalAlpha = 0.1;
		this.context.drawImage( this.tempCanvas, 0, 0);

		this.$super(shake);

	},

    setPoints: function(x1,y1,x2,y2){
        var points = [];
        points.push(x1);
        points.push(y1);
        points.push(x2);
        points.push(y2);
        return points;
    },

	getShadows: function(light,floors,ctx){

		var lx = light.x;
		var ly = light.y;

		ctx.fillStyle = 'rgba(0,0,0,0.96)'
		// ctx.strokeStyle = 'blue'

		for(var n = 0; n < floors.length; n++){
			var f = floors[n];

			var fx = f.worldpos.x;
			var fy = f.worldpos.y;


			// draw the ledge onto canvas (blockot entire ledge)
			ctx.drawImage( f.canvas, fx - f.drawsize.w, fy - f.drawsize.h)
			// solidRect(ctx, fx, fy, 100, 100)

			var dist = distance(fx , fy , lx, ly);
			if (dist < 800) {
				var ang = angle(fx,fy,lx,ly);
				var corners = [];
				var left = fx - f.drawsize.w;
				var top = fy - f.drawsize.h;
				var right = fx + f.drawsize.w;
				var bottom = fy + f.drawsize.h;


				if (ly <= top){
					if(lx < left){
						corners = this.setPoints(left,bottom,right,top)
					} else if( lx >= left && lx <= right ){
						corners = this.setPoints(left,top,right,top);
					} else if( lx > right){
						corners = this.setPoints(right,bottom,left,top);
					}
				} else if( ly >= bottom){
					if(lx < left){
						corners = this.setPoints(left,top,right,bottom);
					} else if( lx >= left && lx <= right ){
						corners = this.setPoints(left,bottom,right,bottom)
					} else if( lx > right){
						corners = this.setPoints(right,top,left,bottom)
					}
				} else {
					if(lx < left){
						corners = this.setPoints(left,top,left,bottom);
					} else {
						corners = this.setPoints(right,top,right,bottom)
					}
				}

				var shadowLength = 14000;

				var newangle = angle(corners[0], corners[1], lx, ly);
				var fx = corners[0] - cos(newangle) * shadowLength;
				var fy = corners[1] - sin(newangle) * shadowLength;
				var newangle1 = angle(corners[2], corners[3], lx, ly);
				var fx1 = corners[2] - cos(newangle1) * shadowLength;
				var fy1 = corners[3] - sin(newangle1) * shadowLength;
				var centerx = ((corners[0] - lx) + (corners[2] - lx))/2;
				var centery = ((corners[1] - ly) + (corners[3] - ly))/2;
				drawQuad(ctx, corners[0], corners[1], corners[2], corners[3], fx1, fy1, fx, fy);
				// ctx.stroke();
				// line(ctx, corners)


			}
		}

	},


});
