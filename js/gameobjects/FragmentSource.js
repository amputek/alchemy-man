var FragmentSource = Doodad.$extend({
  __init__: function(pos,vel,type,frq){
    this.$super(pos.x,pos.y,1);
    this.physicspos = pos;
    this.vel = vel;
    this.type = type;
    this.frequency = frq;
    this.tfrequency = frq;
    this.counter = 0;
    this.enabled = true;

    this.rvx = this.vel.x * 0.2;
    this.rvy = this.vel.y * 0.2;
  },

  draw: function(ctx){

  },

  isDead: function(){
    return false;
  },

  update : function(){
    // console.log( this.counter, this.frequency )
    if(this.counter == this.tfrequency){
      this.tfrequency = round(this.frequency + random(-this.frequency*0.5,this.frequency*0.5));
      this.counter = 0;
      return true;
    }
    this.counter++;
    return false;
  }
});