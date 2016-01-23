var Animation = Class.$extend({
	__init__: function(sheet,speed,looping,frames){
		this.sheet = sheet;
		this.speed = speed;
		this.looping = looping;
		this.frames = frames;

		this.currentFrame = 0;
		this.width = this.sheet.width / this.frames;
		this.height = this.sheet.height;
		this.counter = 0;

		this.oncomplete = null;

		this.frameUpdated = false;
	},

	incFrame : function(){

		this.frameUpdated = false;

		this.counter++;
		if(this.counter >= Math.round(this.speed)){
			if(this.currentFrame < this.frames){
				this.currentFrame++;
				this.frameUpdated = true;
			}

			if(this.currentFrame >= this.frames){
				if(this.looping === true){
					this.currentFrame = 0;
				} else {
					this.currentFrame = this.frames-1;
					if(this.oncomplete !== null){
						this.oncomplete();
					}
				}
			}

			this.counter = 0;
		}
	},

	resting : function(){
		return this.currentFrame == this.frames;
	},

	setToEnd: function(){
		this.currenetFrame = this.frames;
	},

	reset : function(){
		this.currentFrame = 0;
	},

	getFrame : function( draw_canvas ){
		// only requires redraw if frame has ben updated
		if(this.frameUpdated == true){
			draw_canvas.clear();
			draw_canvas.context.drawImage( this.sheet, this.currentFrame*this.width , 0, this.width, this.height, 0, 0, this.width, this.height );
		}
		return draw_canvas.getImage();
	}
});
