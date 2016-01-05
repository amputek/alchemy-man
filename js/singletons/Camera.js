var Camera = Class.$extend({
	__init__: function( size, target ){
		this.size = size;
		this.speed = 0.07;
		this.rightLimit = this.size.w - 73;
		this.leftLimit = 64;
		this.topLimit = 32;
		this.bottomLimit = this.size.h - 38;
		this.setPos( target )
		this.focusTarget = vector(0,0)
		this.focusTimer = 0;
		this.focusLength = 0;



		
	},

	focusOn: function( target, time){
		this.focusTarget = target;
		this.focusTimer = 0;
		this.focusLength = time;
		this.speed = 0.002;
	},

	setPos: function( target ){
		var s = this.speed;
		this.speed = 1.0;
		this.update(target);
		this.speed = s;
	},

	update: function( target ){

		var targetx = target.x;
		var targety = target.y;

		

		if(this.focusTarget != null){
			targetx = this.focusTarget.x;
			targety = this.focusTarget.y;
			this.focusTimer++;
			if(this.focusTimer >= this.focusLength ) this.focusTarget = null;
		} else {
			if(this.speed < 0.07) this.speed += (0.07 - this.speed) * 0.003
		}


		if( targetx > this.rightLimit ) targetx = this.rightLimit;
		if( targetx < this.leftLimit  ) targetx = this.leftLimit;

		var diff =  ((-targetx * SCALE) + 500 ) - offset.x
		if( abs(diff) > 2 ) offset.x += diff * this.speed;

		if( targety > this.bottomLimit ) targety = this.bottomLimit;
		if( targety < this.topLimit    ) targety = this.topLimit;

		var diff = ((-targety * SCALE) + 250 ) - offset.y
		if( abs(diff) > 2 ) offset.y += diff * this.speed;





	}
});


function easeInOutQuad(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
}