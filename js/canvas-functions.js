function sortFloors( floors ){
  floors.sort( function(a,b){
    // console.log(a.h,b.h)
    return b.h - a.h;
  });
}

function notMovingOrIce (floor){
  return floor instanceof MobilePlatform == false && floor instanceof IceBlock == false;
}


function rgb(r,g,b){    return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ', 1.0)'; }
function rgba(r,g,b,a){ return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ', ' + a + ')'; }

function element(id){ return document.getElementById(id); }
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

function distance(x1, y1, x2, y2) {  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)); }

// types
function vector(x,y){  return {x:x,y:y} }
function sizeVector(w,h){  return {w:w,h:h}; }


// vector operations
function toPhysics(pos){  return vector(pos.x * 5, pos.y * 5); }
function toWorld(pos){    return {x: round(pos.x*SCALE) ,y: round(pos.y*SCALE) }; }
function toGrid(x,y){     return {x: Math.floor( x / 5 ), y: Math.round( y / 5 )}; }
function equalVector(a,b){  return a.x == b.x && a.y == b.y; }
function vDistance(a,b){  return distance(a.x,a.y,b.x,b.y); }
function vAngle(a,b){  return angle(a.x,a.y,b.x,b.y); }
    


function lineOfSight(source, dest){

  source = vector(source.x / SCALE, source.y / SCALE);
  dest = vector(dest.x   / SCALE, dest.y   / SCALE);

  var input = new b2RayCastInput( source, dest, 1 )
  for(var i = 0; i < currentLevel.floors.collection.length; i++){
    var f = currentLevel.floors.collection[i];
    if( f instanceof Ladder == false){
      var output = new b2RayCastOutput    
      if( f.body.GetFixtureList().RayCast(output,input) ){
        return output.fraction; 
        } 
      } 
    }
  return null;
}



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


function getDir(pos,platform){

  var pCenterX = platform.worldpos.x / 8;
  var pCenterY = platform.worldpos.y / 8;
  var pLeft    = pCenterX - platform.physicssize.w;
  var pRight   = pCenterX + platform.physicssize.w;
  var pTop     = pCenterY - platform.physicssize.h;
  var pBottom  = pCenterY + platform.physicssize.h;

  var x = pos.x;
  var y = pos.y;

  var dToLeft = abs(x - pLeft);
  var dToTop = abs(y - pTop);
  var dToRight = abs(x - pRight);
  var dToBottom = abs(y - pBottom);

  var nx = x;
  var ny = y;

  var nearest = "left"
  var max = 1000;
  if(dToLeft < max){
    nearest = "left"; 
    max = dToLeft;
  }
  if(dToTop < max){
    nearest = "top"; 
    max = dToTop;
  }
  if(dToBottom < max){
    nearest = "bottom"; 
    max = dToBottom;
  }
  if(dToRight < max){
    nearest = "right";
  }

  if(nearest == "left"){
    nx = pLeft;
  }
  if(nearest == "right"){
    nx = pRight;
  }
  if(nearest == "top"){
    ny = pTop;
    if(nx < pLeft) nx = pLeft;
    if(nx >= pRight-5){
      nx = pRight-5;
    }
  }
  if(nearest == "bottom"){
    ny = pBottom;
    if(nx < pLeft) nx = pLeft;
    if(nx > pRight) nx = pRight
  }

  return {nearest:nearest,x:nx,y:ny};

}

function loadImage(url){
  var img = new Image();
  img.src = url;
  return img;
}

