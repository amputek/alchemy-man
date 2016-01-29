//most of these should be moved out of the global namespace


//not used atm
function sortFloors( floors ){
    floors.sort( function(a,b){
        return b.h - a.h;
    });
}

function rgba(r,g,b,a){ return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ', ' + (a||1.0) + ')'; }

function element(id){ return document.getElementById(id); }


// SOME MATHS FUNCTIONS

var PI = Math.PI;
var PI2 = Math.PI*2;

function angle(x1,y1,x2,y2){ return Math.atan2(y2-y1,x2-x1); }

// types
function vector(x,y){  return {x:x,y:y} }
function sizeVector(w,h){  return {w:w,h:h}; }

//add some helper functions to Math class
Math.angle = function(x1,y1,x2,y2){ return Math.atan2(y2-y1,x2-x1); }

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
        new      : function(x,y){ return {x:x,y:y}; },

        //creates a new vector for the box2d physics engine
        //this is now the only place b2vec2 is used
        b2 : function(a,b){
            if( !b ) return new Box2D.Common.Math.b2Vec2(a.x,a.y);
            return new Box2D.Common.Math.b2Vec2(a,b);
        },
        random   : function(r){       return vector(Math.randomFloat(-r,r),Math.randomFloat(-r,r)); },
        angle : function(a,b){        return angle(a.x,a.y,b.x,b.y); },

        //convert a grid position to a position for the b2 physics world
        gridToPhysics : function(pos){    return vector(pos.x * 5, pos.y * 5); },

        //convert a physics position to a draw position
        physicsToDraw : function(pos){      return vector(Math.round(pos.x*SCALE) , Math.round(pos.y*SCALE)); },

        gridToDraw : function(pos){      return vector(Math.round(pos.x*5*SCALE) , Math.round(pos.y*5*SCALE)); },

        // convert a physics position to a grid position
        physicsToGrid : function(pos){       return vector(Math.floor(pos.x/5), Math.round(pos.y/5)); },


        equal : function(a,b){        return a.x == b.x && a.y == b.y; },
        distance : function(a,b){     return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); },
        add : function(a,b){ return vector(a.x + b.x, a.y + b.y); }
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
