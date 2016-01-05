var PotionManager = Class.$extend({
  __init__ : function(){
    this.cooldown = 0;
    this.currentlySelected = "fire";
    this.crafting = null;
    this.craftTimer = 0;
    this.enabled = {fire:true,ice:true,acid:true,nuke:false};

    // this.equip("fire")

  },

  update: function(){
    if(this.crafting != null){
      this.craftTimer++;
      if(this.craftTimer > 1){
        this.equip(this.crafting);
        this.crafting = null;
      }
    }
    this.cooldown--;
  },

  enable: function(type){
    if(type == "fire") this.enabled.fire = true;
    if(type == "ice" ) this.enabled.ice  = true;
    if(type == "acid") this.enabled.acid = true;

    debug.log("You've learnt how to make " + type + " potions!!")
    this.currentlySelected = type;
  },

  pickup: function(type){

  },

  make: function(start,type){

    if(start == true && this.crafting == null && this.currentlySelected != type){
      if(type != this.crafting){
        var success = true;

        if(type == "fire") success = this.enabled.fire;
        if(type == "ice" ) success = this.enabled.ice;
        if(type == "acid") success = this.enabled.acid;


        player.make(type);

        if(success == true ){
          this.crafting = type;
          this.craftTimer = 0;
        }
      }
    }
    if(start == false){
      this.crafting = null;
      this.craftTimer = 0;
    }
  },

  equip: function(type){

    this.currentlySelected = type;
    if(type == "fire"){
      input.reticule.style.border = "1px solid rgb(255,50,20)";
      input.reticule.style.boxShadow = "0 0 0px rgba(255,50,20, 1.0)";

      // input.reticule.children[0].style.background = "rgb(255,50,20)";
    }
    if(type == "ice"){
      input.reticule.style.border = "1px solid rgb(50,155,255)";
      input.reticule.style.boxShadow = "0 0 0px rgba(50,155,255, 1.0)";
      // input.reticule.children[0].style.background = "rgb(50,155,255)";
    }
    if(type == "acid"){
      input.reticule.style.border = "1px solid rgb(100,255,50)";
      input.reticule.style.boxShadow = "0 0 0px rgba(100,255,50, 1.0)";
      // input.reticule.children[0].style.background = "rgb(100,255,50)";
    }

    mouseBlips.add( new MouseBlip( input.mousepos, this.currentlySelected) )

  },

  shoot : function(x,y,angle,vx,vy){
    if(this.currentlySelected != null){
      var potion = new Potion( vector(x,y),this.currentlySelected);
      potion.impulse(vx,vy);
      sound.play("throw",1.0,0.0);
      this.cooldown=0;
      return potion;
    }
  }
});