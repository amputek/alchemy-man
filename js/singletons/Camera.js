var camera = new JS.Singleton(JS.Class,{

	//camera gets initalised with a level size and a starting position
	initialize: function(){
		this.speed = 0.07;
		this.rightLimit = 0;
		this.leftLimit = 64;
		this.topLimit = 32;
		this.bottomLimit = 64;
	},

	reset: function( size, target ){
		this.rightLimit = size.w - 73;
		this.bottomLimit = size.h - 38;
		this.setPos( target );
	},

	// instantly set the position of the camera to a target location
	setPos: function( target ){
		var s = this.speed;
		this.speed = 1.0;
		this.update(target);
		this.speed = s;
	},


	update: function( target ){

		var targetx = target.x;
		var targety = target.y;

		//keep camera within level boundaries
		if( targetx > this.rightLimit ) targetx = this.rightLimit;
		if( targetx < this.leftLimit  ) targetx = this.leftLimit;
		if( targety > this.bottomLimit) targety = this.bottomLimit;
		if( targety < this.topLimit   ) targety = this.topLimit;


		//ease camera towards target
		var diff =  ((-targetx * SCALE) + 500 ) - offset.x
		if( abs(diff) > 2 ) offset.x += diff * this.speed;
		var diff = ((-targety * SCALE) + 250 ) - offset.y
		if( abs(diff) > 2 ) offset.y += diff * this.speed;
	}
});
