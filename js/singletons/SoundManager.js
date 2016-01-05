var SoundManager = Class.$extend({
  __init__: function(){
    if (!createjs.Sound.initializeDefaultPlugins()) { return; }
    this.audioPath = "sounds/";
    this.manifest = [
        // {id:"throw",       src:"throw2.mp3"},
        // {id:"glass",       src:"glass.mp3"},
        // {id:"rain",        src:"rain.mp3"},
        // {id:"drops",       src:"drops.mp3"},
        // {id:"alice",       src:"alice.mp3"},
        // {id:"allgone",     src:"allgone.mp3"},
        // {id:"audioslave",  src:"audioslave.mp3"},
        // {id:"door",        src:"door.mp3"}
    ];
    createjs.Sound.registerManifest(this.manifest, this.audioPath);
    this.ambience = [];
    var _this = this;
    this.muteDom = element("mute");
    this.timeouts = [];

    createjs.Sound.setVolume(0.0);

    this.muteDom.addEventListener("mousedown",function(){
      if(_this.muted == true){
        _this.muted = false;
        setDebugText("Sound unmuted")
        _this.muteDom.innerHTML = "MUTE"
        createjs.Sound.setVolume(1.0);
      } else {
        _this.muted = true;
        setDebugText("Sound muted")
        _this.muteDom.innerHTML = "UNMUTE"
        createjs.Sound.setVolume(0.0);
      }

    },false);
  },

  reduceVol: function(e){

    var _this = this;
    var v = e.getVolume();
    // console.log(e, e.volume)
    e.volume = v*0.99
    if(v >= 0.001){
      setTimeout( function(){
        _this.reduceVol(e);
      },10);
    } else {
      e.stop();
    }
  },

  endLevel: function(){
    for (var i = 0; i < this.ambience.length; i++) {
      var sound = this.ambience[i];
      // sound.instance.stop();
      this.reduceVol(sound.instance)
    }
    for (var i = 0; i < this.timeouts.length; i++) {
      clearTimeout(this.timeouts[i]);
    };

    this.timeouts = [];
    
  },


  loop: function(id,vol,pan, crossover){
    var instance = createjs.Sound.play(id);
    var d = instance.getDuration();
    instance.uniqueId = id;
    if(pan == undefined) pan = 0;
    if(vol == undefined) vol = 1.0;
    if(crossover == undefined) crossover = 0;
    instance.volume = vol;
    instance.pan = pan;
    this.ambience.push( {id: id, instance: instance } );
    var _this = this;
    var _id = id;
    var _pan = pan;
    var _vol = vol;
    var _crossover = crossover;
    this.timeouts.push( setTimeout(function(){
       _this.loop(_id,_vol,_pan,_crossover)
      }, (d - crossover))
    )
  },

  play: function(id,vol,pan){
    var instance = createjs.Sound.play(id);
    if(pan == undefined) pan = 0;
    if(vol == undefined) vol = 1.0;
    instance.volume = vol;
    instance.pan = pan;
    instance.loop = 2;
  }
});