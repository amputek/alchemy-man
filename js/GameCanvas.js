var Canvas = new JS.Class({
	initialize: function(size){
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext('2d');
		if( size  == undefined) size = sizeVector(0,0);
		this.canvas.width = size.w;
		this.canvas.height = size.h
	},

	extend : {
		rgba: function(r,g,b,a){
			return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ', ' + (a||1.0) + ')';
		}
	},

	setAlpha:      function(   a   ){ this.context.globalAlpha = a;	},
	setFill:       function( color ){ this.context.fillStyle = color; },
	setFill:       function( co,op ){ this.context.fillStyle   = Canvas.rgba( co.r , co.g , co.b , op || co.a || 1); },
	setStroke:     function( color ){ this.context.strokeStyle = color; },
	setStroke:     function( co,op ){ this.context.strokeStyle = Canvas.rgba( co.r , co.g , co.b , op || co.a || 1); },
	setWidth:      function(   w   ){ this.context.lineWidth = w; },
	blendFunction: function( blend ){ this.context.globalCompositeOperation = blend; },
	translate:     function( x , y ){ this.context.translate(x,y);  },
	save:          function(       ){ this.context.save(); },
	scale:         function( x , y ){ this.context.scale(x,y); },
	restore:       function(       ){ this.context.restore(); },
	rotate:        function( r     ){ this.context.rotate(r); },
	clear: 		   function(       ){ this.canvas.width = this.canvas.width; },

	setSize: function(size){
		this.canvas.width = size.w;
		this.canvas.height = size.h;
	},

	fill: function(color, opacity){
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

	//TODO clean up this mess ffs.
	tint: function( tint , opacity ){
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




var GameCanvas = new JS.Class(Canvas,{
	initialize: function(size,offsetMod,ambientLight){
		// if( size.h < 550) size.h = 550;
		this.callSuper(  sizeVector(1080 + size.w * offsetMod, 550 + size.h * offsetMod ) )
		this.offsetMod = offsetMod;
		this.canvas.style.position = "absolute";
		if(offsetMod == 1) this.canvas.style.boxShadow = "0 0 0 1000px rgba(0,0,0,0.6)";
		element("game-wrapper").appendChild(this.canvas);
		this.ambientLight = ambientLight;
	},

	updateTint: function(){
		this.tint( this.ambientLight, 0.1 + this.ambientLight.darkness );
	},

	setSize: function(size){
		this.$super(  sizeVector(1080 + size.w * this.offsetMod, 550 + size.h * this.offsetMod ) );
	},

	delete: function(){
		element("game-wrapper").removeChild(this.canvas);
	},

	update: function(shake){
		var x = Math.floor(offset.x * this.offsetMod + Math.randomFloat(-shake,shake));
		var y = Math.floor(offset.y * this.offsetMod + Math.randomFloat(-shake,shake));
		this.canvas.style.webkitTransform = "translate3d(" + x + "px," + y + "px, 0px)"
	}
});
