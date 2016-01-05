var Conveyer = Platform.$extend({
  __init__: function(pos,size){
    this.$super( pos, size )
    this.counter = 0;
  }
});