var Tooltip = Class.$extend({
  __init__: function(pos,text){
    this.text = text;
    this.life = 0;
    this.dead = false;
    this.worldpos = pos;
    this.dom = document.createElement("div");
    this.dom.className = "tooltip";
    this.dom.style.zIndex = 500;
    this.dom.innerHTML = "" + this.text;
    element("game-wrapper").appendChild(this.dom);
    this.dom.style.left = round(this.worldpos.x);
    this.dom.style.top = round(this.worldpos.y);
    var _this = this;
    setTimeout(function(){ _this.dom.style.opacity = 0.0 },1);
    this.vy = 6.0;
  },

  update: function(){

  },  

  isDead: function(){
    return this.life >= 100;
  },

  draw: function(ctx){
    this.life++;
    this.worldpos.y -= this.vy;
    this.vy *= 0.96
    this.dom.style.left = round(this.worldpos.x + offset.x);
    this.dom.style.top = round(this.worldpos.y + offset.y);
  },
})