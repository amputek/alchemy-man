 var Floor = GameObject.$extend({
     __init__: function(body){
      this.$super(body);
        this.physicssize = sizeVector(0,0);
    },

    getFixture: function(){
      return this.body.GetFixtureList()
    },

    getTop: function(){
      return this.physicspos.y - this.physicssize.h;
    }

});
