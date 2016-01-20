//most of these should be moved out of the global namespace


//not used atm
function sortFloors( floors ){
    floors.sort( function(a,b){
        return b.h - a.h;
    });
}

function rgb(r,g,b){    return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ', 1.0)'; }
function rgba(r,g,b,a){ return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ', ' + a + ')'; }

function element(id){ return document.getElementById(id); }

//doodad and canvas
function createCanvas(){  return document.createElement("canvas");}


// SOME MATHS FUNCTIONS

var PI = Math.PI;
var PI2 = Math.PI*2;

function round(val){  return Math.round(val); }
function angle(x1,y1,x2,y2){ return Math.atan2(y2-y1,x2-x1); }
function sin(a){ return Math.sin(a); }
function cos(a){ return Math.cos(a); }
function abs(a){ return Math.abs(a); }

function random(a,b){     return (Math.random() * (b-a)) + a;       }
function randomInt(a,b){  return round(random(a,b));                }
function randomVector(r){ return vector(random(-r,r),random(-r,r)); }
function coin(val){       return random(0,1) < val;                 }

//function distance(x1, y1, x2, y2) {  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)); }

// types
function vector(x,y){  return {x:x,y:y} }
function sizeVector(w,h){  return {w:w,h:h}; }


// vector operations

//maybe this should just be a helper class
var Vector2 = new JS.Class({
    initialize: function(x,y){
        this.x = x || 0;
        this.y = y || 0;
    },
    set: function(x,y){
        this.x = x;
        this.y = y;
    },

    // toPhysics : function(){  return new Vector(this.x * 5              , this.y * 5); },
    // toWorld   : function(){  return new Vector(round(this.x*SCALE)     , round(this.y*SCALE) ); },
    // toGrid    : function(){  return new Vector(Math.floor( this.x / 5 ), Math.round( this.y / 5 )); },
    // equalTo   : function(b){ return this.x == b.x && a.y == this.y; },
    extend : {
        new      : function(x,y){ return {x:x,y:y}; },
        random   : function(r){ return vector(random(-r,r),random(-r,r)); },
        angle : function(a,b){        return angle(a.x,a.y,b.x,b.y); },
        toPhysics : function(pos){    return new Vector2(pos.x * 5, pos.y * 5); },
        toWorld : function(pos){      return new Vector2(round(pos.x*SCALE) , round(pos.y*SCALE)); },
        toGrid : function(pos){       return new Vector2(Math.floor(pos.x/5), Math.round(pos.y/5)); },
        equal : function(a,b){        return a.x == b.x && a.y == b.y; },
        distance : function(a,b){     return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); }
    }
});


// why is this here?
function updateHealthDom(health){
    if(health == 0){
        element("health-0").children[0].style.marginTop = "28px"
        element("health-1").children[0].style.marginTop = "28px"
        element("health-2").children[0].style.marginTop = "28px"
    }
    if(health == 1){
        element("health-0").children[0].style.marginTop = "15px"
        element("health-1").children[0].style.marginTop = "28px"
        element("health-2").children[0].style.marginTop = "28px"
    }
    if(health == 2){
        element("health-0").children[0].style.marginTop = "4px"
        element("health-1").children[0].style.marginTop = "28px"
        element("health-2").children[0].style.marginTop = "28px"
    }
    if(health == 3){
        element("health-0").children[0].style.marginTop = "4px"
        element("health-1").children[0].style.marginTop = "15px"
        element("health-2").children[0].style.marginTop = "28px"
    }
    if(health == 4){
        element("health-0").children[0].style.marginTop = "4px"
        element("health-1").children[0].style.marginTop = "4px"
        element("health-2").children[0].style.marginTop = "28px"
    }
    if(health == 5){
        element("health-0").children[0].style.marginTop = "4px"
        element("health-1").children[0].style.marginTop = "4px"
        element("health-2").children[0].style.marginTop = "15px"
    }
    if(health == 6){
        element("health-0").children[0].style.marginTop = "4px"
        element("health-1").children[0].style.marginTop = "4px"
        element("health-2").children[0].style.marginTop = "4px"
    }
}

function loadImage(url){
  var img = new Image();
  img.src = url;
  return img;
}
