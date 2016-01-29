//game object should inherit from this too ?
var Doodad = new JS.Class({
	initialize: function(pos){
		this.drawpos = Vector2.physicsToDraw( pos );
	}
});
