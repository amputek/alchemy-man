var EditorObject = Class.$extend({
    __init__:function( pos , size ){
        this.pos = vector(pos.x,pos.y);
        this.size = sizeVector(size.w,size.h);
        this.dom = document.createElement("div");
        this.dom.className = "editor-object "
        element("editor-background").appendChild( this.dom );
        this.dom.style.zIndex = 0;
        this.updateDom();

        var _this = this;
        this.dom.addEventListener("mousedown",function(e){
            if(editor.mode == "delete"){
                editor.removeItem(_this);
            }
            if(editor.mode == "move"){
                var x = $(_this.dom).offset().left - e.pageX
                var y = $(_this.dom).offset().top  - e.pageY
                editor.pickupItem(_this,vector(x,y));
            }
        }, false );


        // this.dom.addEventListener("mousemove",function(e){
        //     console.log( $(_this.dom).offset().top, e.pageY)
        //         var x = $(_this.dom).offset().left - e.pageX
        //         var y = $(_this.dom).offset().top  - e.pageY
        //     // console.log(x,y)
        // }, false );

    },

    getJSON: function(){
        return {x: this.pos.x - editor.currentLevel.levelboundary.pos.x ,y: this.pos.y -  editor.currentLevel.levelboundary.pos.y ,w: this.size.w , h: this.size.h };
    },

    updateDom: function( ){
        this.dom.style.left = (this.pos.x * EDITORSCALE) + "px"
        this.dom.style.top  = (this.pos.y * EDITORSCALE) + "px"
        this.dom.style.width  = (this.size.w * EDITORSCALE) + 'px'
        this.dom.style.height = (this.size.h * EDITORSCALE) + 'px'
    }
})

var EditorJumpbox = EditorObject.$extend({
    __init__:function( pos ){
        this.$super( pos, sizeVector(1,1) )
        this.dom.className += "jumpbox";
    }
});

var EditorEnemy = EditorObject.$extend({
    __init__:function( pos, type ){
        this.$super( pos, sizeVector(1,1) )
        this.type = type;
        this.dom.className += "enemy editor-" + type;
    },

    getJSON: function(){
        return {x: this.pos.x - editor.currentLevel.levelboundary.pos.x ,y: this.pos.y -  editor.currentLevel.levelboundary.pos.y ,type: this.type};
    }
});



var EditorFragmentSource = EditorObject.$extend({
    __init__:function( pos , vel , frq , type){
        this.$super(pos, sizeVector(1,1) )
        this.type = type;
        this.frequency = frq;
        this.dom.className += "fragmentsource"
        this.vel = vector(vel.x,vel.y)
    },

    getJSON: function(){
        return {x: this.pos.x - editor.currentLevel.levelboundary.pos.x, y: this.pos.y -  editor.currentLevel.levelboundary.pos.y , vx: this.vel.x , vy: this.vel.y , type: this.type , frequency: this.frequency }
    }
})

var EditorCraftingTable = EditorObject.$extend({
    __init__:function( pos , type){
        this.$super(pos, sizeVector(2,1) )
        this.type = type;
        this.dom.className += "craftingtable"
    },

    getJSON: function(){
        return {x: this.pos.x + 1 - editor.currentLevel.levelboundary.pos.x, y: this.pos.y - 1 + editor.currentLevel.levelboundary.pos.y , type: this.type }
    }
});


var EditorEnemySource = EditorObject.$extend({
    __init__:function( pos , frq , limit){
        this.$super(pos, sizeVector(16,7) )
        this.limit = limit;
        this.frequency = frq;
        this.dom.className += "enemysource"
    },

    // change this at some point
    getJSON: function(){
        return {x: this.pos.x - editor.currentLevel.levelboundary.pos.x + 5, y: this.pos.y -  editor.currentLevel.levelboundary.pos.y + 3, type: "gumball"};
    }
})

var EditorCraftingTable = EditorObject.$extend({
    __init__:function( pos , type){
        this.$super(pos, sizeVector(2,1) )
        this.type = type;
        this.dom.className += "craftingtable"
    },

    getJSON: function(){
        return {x: this.pos.x + 1 - editor.currentLevel.levelboundary.pos.x, y: this.pos.y - 1 + editor.currentLevel.levelboundary.pos.y , type: this.type }
    }
});





var EditorArea = EditorObject.$extend({
   __init__:function( pos, size ){
        this.$super( pos , size);
        this.start = vector(pos.x, pos.y);

        if(this.size.w <= 0){
            this.pos.x = this.start.x + this.size.w;
            this.size.w = -this.size.w;
        }
        if(this.size.h <= 0){
            this.pos.y = this.start.y + this.size.h;
            this.size.h = -this.size.h;
        }

        if(this.size.w == 0) this.size.w = 1;
        if(this.size.h == 0) this.size.h = 1;

        this.updateDom();
    }
});


var EditorPlatform = EditorArea.$extend({
    __init__:function( pos, size ){
        this.$super( pos, size );
        this.dom.className += "platform";
    }
});




var EditorTriggeredPlatform = EditorArea.$extend({
    __init__:function( pos, size, epos, tpos, speed, triggered){
        this.e = vector(epos.x,epos.y);

        this.triggered_dom = document.createElement("div");
        this.triggered_dom.className = "editor-object triggered";
        element("editor-background").appendChild( this.triggered_dom )

        this.triggered = triggered;

        if(triggered == true){
            this.trigger = vector(tpos.x, tpos.y);
            this.triggered_dom.style.zIndex = 0;
            this.triggered_dom.style.left = (this.trigger.x * EDITORSCALE) + "px";
            this.triggered_dom.style.top = (this.trigger.y * EDITORSCALE) + "px";
            this.triggered_dom.style.width = EDITORSCALE;
            this.triggered_dom.style.height = EDITORSCALE
            this.triggered_dom.style.opacity = 1.0;
            this.triggered_dom.style.borderTopLeftRadius = EDITORSCALE
            this.triggered_dom.style.borderTopRightRadius = EDITORSCALE
        } else {
            this.trigger = vector(0,0);
        }

        this.$super(pos, size );

        this.speed = speed;
        this.dom.className += "triggered";

        this.target_dom = document.createElement("div");
        this.target_dom.className = "editor-object triggered";
        element("editor-background").appendChild( this.target_dom )
        this.target_dom.style.zIndex = 0;
        this.target_dom.style.left = (this.e.x * EDITORSCALE) + "px";
        this.target_dom.style.top = (this.e.y * EDITORSCALE) + "px";
        this.target_dom.style.width = this.dom.style.width;
        this.target_dom.style.height = this.dom.style.height;
        this.target_dom.style.opacity = 0.3;


    },

    getJSON: function(){

        return{
            x:          this.pos.x - editor.currentLevel.levelboundary.pos.x,
            y:          this.pos.y - editor.currentLevel.levelboundary.pos.y,
            ex:         this.e.x   - editor.currentLevel.levelboundary.pos.x,
            ey:         this.e.y   - editor.currentLevel.levelboundary.pos.y,
            w:          this.size.w,
            h:          this.size.h,
            switched:   this.triggered,
            tx:         this.trigger.x - editor.currentLevel.levelboundary.pos.x,
            ty:         this.trigger.y - editor.currentLevel.levelboundary.pos.y,
            time:       this.speed
        }
    }





});


var EditorLadder = EditorArea.$extend({
    __init__:function( pos , size ){
        this.$super(pos, size);
        this.dom.className += "ladder";

        this.size.w = 1;

        if(this.size.h <= 1){
            this.size.h = 1;
        } else {
            this.size.h = this.size.h;
        }
        this.updateDom();
    },

    getJSON: function(){
        return {x: this.pos.x - editor.currentLevel.levelboundary.pos.x ,y: this.pos.y -  editor.currentLevel.levelboundary.pos.y, h: this.size.h };
    }
});

var EditorBoundary = EditorArea.$extend({
    __init__:function( pos , size ){
        this.$super(pos,size);
        element("editor-background").removeChild( this.dom )
        this.dom = element("boundary");
        this.updateDom();
    },

    setStart: function(pos){
        this.start = vector(pos.x,pos.y)
        this.updateDom();
    }
});

var Door = Class.$extend({
    __init__: function(pos, dom){
        this.pos = vector(pos.x,pos.y)
        this.dom = dom;
        this.dom.style.width = EDITORSCALE;
        this.dom.style.height = EDITORSCALE*3;
        this.dom.style.left = pos.x * EDITORSCALE;
        this.dom.style.top = (pos.y-1) * EDITORSCALE;
    },

    updateDom: function(){
        // this.pos = vector(this.pos.x,this.pos.y)
        this.dom.style.left = this.pos.x * EDITORSCALE;
        this.dom.style.top = (this.pos.y-1) * EDITORSCALE;
        this.dom.style.width = EDITORSCALE;
        this.dom.style.height = EDITORSCALE*3;
    },

    getJSON: function(){
        return {x: this.pos.x - editor.currentLevel.levelboundary.pos.x + 1 , y: this.pos.y - editor.currentLevel.levelboundary.pos.y , type:"door"}
    }
});
