//most of these should be moved out of the global namespace

function element(id){ return document.getElementById(id); }


// types.. maybe get rid of these eventually
function vector(x,y){  return {x:x,y:y} }
function sizeVector(w,h){  return {w:w,h:h}; }

//add some helper functions to Math class
Math.angle = function(x1,y1,x2,y2){ return Math.atan2(y2-y1,x2-x1); } //this should be here or in vector2?
Math.randomFloat = function(a,b){
    if( a === undefined && b === undefined ){
        return Math.random();
    } else if( a != undefined && b === undefined ){
        b = a;
        a = 0;
    }
    return (Math.random() * (b-a)) + a;

}
Math.randomInt = function(a,b){
    return Math.round(Math.randomFloat(a,b));
}
Math.coin = function(val){ return Math.randomFloat(1) < val; }
Math.PI2 = Math.PI * 2;


// vector operations - maybe this should just be a helper class?
//TODO what does tophysics actually do? can you clean up the releationship between b2vec2 and this vector helper etc.....
var Vector2 = new JS.Class({
    initialize: function(x,y){
        this.x = x || 0;
        this.y = y || 0;
    },
    set: function(x,y){
        this.x = x;
        this.y = y;
    },
    extend : {
        zero : {x:0,y:0},
        new      : function(x,y){ return {x:x||0,y:y||0}; },
        size     : function(w,h){ return {w:w||0,h:h||0}; },

        //creates a new vector for the box2d physics engine
        //this is now the only place b2vec2 is used
        b2 : function(a,b){
            if( !b ) return new Box2D.Common.Math.b2Vec2(a.x,a.y);
            return new Box2D.Common.Math.b2Vec2(a,b);
        },
        random   : function(r){       return Vector2.new(Math.randomFloat(-r,r),Math.randomFloat(-r,r)); },
        angle : function(a,b){        return Math.angle(a.x,a.y,b.x,b.y); },

        //convert a grid position to a position for the b2 physics world
        gridToPhysics : function(pos){    return Vector2.new(pos.x * 5, pos.y * 5); },

        //convert a physics position to a draw position
        physicsToDraw : function(pos){      return Vector2.new(Math.round(pos.x*SCALE) , Math.round(pos.y*SCALE)); },

        gridToDraw : function(pos){      return Vector2.new(Math.round(pos.x*5*SCALE) , Math.round(pos.y*5*SCALE)); },

        // convert a physics position to a grid position
        physicsToGrid : function(pos){       return Vector2.new(Math.floor(pos.x/5), Math.round(pos.y/5)); },


        equal : function(a,b){        return a.x == b.x && a.y == b.y; },
        distance : function(a,b){     return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); },
        add : function(a,b){ return Vector2.new(a.x + b.x, a.y + b.y); }
    }
});


var poop = Vector2.zero;
poop.x = 100;
console.log("poop",poop);
console.log("zero",Vector2.zero)


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
