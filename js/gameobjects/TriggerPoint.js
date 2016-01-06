var TriggerPoint = GameObject.$extend({
    __init__: function(pos,size,spawner){
        this.$super( factory.createPlatform( pos, size ) );
        this.spawner = spawner;
    }
});
