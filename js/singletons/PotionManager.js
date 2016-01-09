var PotionManager = Class.$extend({
  __init__ : function(){
    this.cooldown = 0;
    this.currentlySelected = "fire";
    this.crafting = null;
    this.craftTimer = 0;
    this.craftDuration = 1;
    this.enabled = {fire:true,ice:true,acid:true,nuke:false};
  },

  update: function(){
    if(this.crafting != null){
      this.craftTimer++;
      if(this.craftTimer > this.craftDuration){
        this.equip(this.crafting);
        this.crafting = null;
      }
    }
    this.cooldown--;
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
      input.reticule.style.border = "1px solid rgb(" + potionColor.fire.r + "," + potionColor.fire.g + "," + potionColor.fire.b + ")";
      input.reticule.style.boxShadow = "0 0 0px rgba(" + potionColor.fire.r + "," + potionColor.fire.g + "," + potionColor.fire.b + ", 1.0)";
    }
    if(type == "ice"){
      input.reticule.style.border = "1px solid rgb(" + potionColor.ice.r + "," + potionColor.ice.g + "," + potionColor.ice.b + ")";
      input.reticule.style.boxShadow = "0 0 0px rgba(" + potionColor.ice.r + "," + potionColor.ice.g + "," + potionColor.ice.b + ", 1.0)";
    }
    if(type == "acid"){
      input.reticule.style.border = "1px solid rgb(" + potionColor.acid.r + "," + potionColor.acid.g + "," + potionColor.acid.b + ")";
      input.reticule.style.boxShadow = "0 0 0px rgba(" + potionColor.acid.r + "," + potionColor.acid.g + "," + potionColor.acid.b + ", 1.0)";
    }

    //mouseBlips.add( new MouseBlip( input.mousepos, this.currentlySelected) )

  },

  shoot : function(x,y,angle,vx,vy){
    if(this.currentlySelected != null){
      var potion = new Potion( vector(x,y),this.currentlySelected);
      potion.impulse(vx,vy);
      this.cooldown=0;
      return potion;
    }
  }
});
