var EDITORSCALE = 10;


// In-Editor representation of a level.
// Contains editor versions of ingame objects, and controls their display in the DOM
var EditorLevel = Class.$extend({
    __init__ : function(){
        this.name = "Blank Level";
        this.items = [];
        this.startPoint = new Door( vector(5 ,12) ,  element("start-point"));
        this.endPoint   = new Door( vector(35,5) ,  element("end-point"));
        this.levelboundary = new EditorBoundary( vector(3,3), sizeVector( 20, 20 ) );
        this.ambientLight = {r:0,g:0,b:0,a:0};
        this.weatherSeverity = 0.0;
    },


    clear: function(){
        for (var i = 0; i < this.items.length; i++) {
            element("editor-background").removeChild( this.items[i].dom );
            if(this.items[i] instanceof EditorTriggeredPlatform){
                element("editor-background").removeChild( this.items[i].triggered_dom )
                element("editor-background").removeChild( this.items[i].target_dom )
            }
        }
        this.items = [];
    },

    removeItem: function(platform){
        this.items.splice( this.items.indexOf( platform ), 1 );
        element("editor-background").removeChild( platform.dom )
        if(platform instanceof EditorTriggeredPlatform == true){
            element("editor-background").removeChild( platform.target_dom );
            element("editor-background").removeChild( platform.triggered_dom );
        }
    },

    setStartPoint: function(){

    },

    setEndPoint: function(){

    },

    updateTint: function(r,g,b,a){

    },

    setBoundary: function( item ){
        this.levelboundary = item;
    },

    addItem: function( item ){
        this.items.push( item );
        item.dom.style.zIndex = (this.mode == "delete" ? 2 : 0);
    },

    read: function( data ){
        this.name = data.name;
        this.levelboundary = new EditorBoundary( vector(3,3), sizeVector(data.width, data.height ));

        this.startPoint = new Door( vector(data.start.x+2, data.start.y+3) ,  element("start-point"));
        this.endPoint = new Door( vector(data.end.x+2, data.end.y+3) ,  element("end-point"));

        element("weather").value = data.weather;
        element("setting").value = data.setting;

        element("tint-r").value = data.ambientLight.r;
        element("tint-g").value = data.ambientLight.g;
        element("tint-b").value = data.ambientLight.b;

        for (var i = 0; i < data.platforms.length; i++) {
            var p = data.platforms[i];
            this.addItem( new EditorPlatform( vector(p.x+3,p.y+3), sizeVector(p.w,p.h) ) );
        };

        for (var i = 0; i < data.ladders.length; i++) {
            var p = data.ladders[i];
            this.addItem( new EditorLadder( vector(p.x+3,p.y+3), sizeVector(1,p.h) ) );
        };

        for (var i = 0; i < data.jumpboxes.length; i++) {
            var p = data.jumpboxes[i];
            this.addItem( new EditorJumpbox( vector(p.x+3,p.y+3), sizeVector(p.w,p.h) ) );
        };

        for (var i = 0; i < data.triggeredplatforms.length; i++) {
            var p = data.triggeredplatforms[i];
            this.addItem( new EditorTriggeredPlatform( vector(p.x+3,p.y+3), sizeVector(p.w,p.h), vector(p.ex+3,p.ey+3), vector(p.tx+3,p.ty+3), p.time, p.switched ));;
        };

        for (var i = 0; i < data.enemies.length; i++) {
            var p = data.enemies[i];
            this.addItem( new EditorEnemy( vector(p.x+3,p.y+3), p.type ) );
        };

        for (var i = 0; i < data.fragmentsources.length; i++) {
            var p = data.fragmentsources[i];
            console.log("FS vel:", p.vx,p.vy)
            this.addItem( new EditorFragmentSource( vector(p.x+3,p.y+3), vector(p.vx,p.vy), p.frequency, p.type ) );
        };

        for (var i = 0; i < data.craftingtables.length; i++) {
            var p = data.craftingtables[i];
            this.addItem( new EditorCraftingTable( vector(p.x+2,p.y+4) , p.type ) );
        };

        for (var i = 0; i < data.enemysources.length; i++) {
            var p = data.enemysources[i];
            this.addItem( new EditorEnemySource( vector(p.x-2,p.y+0) , p.type ) );
        };


    },

    // SENDS JSON DATA TO TEMPORARY STORAGE IN LEVEL DATABASE
    compile:function(){

        debug.log("EDITOR: Compiling", this.name)

        var level = new Object();
        level.name = this.name;
        var d = 0.0;
        level.ambientLight = {"r": element("tint-r").value , "g": element("tint-g").value , "b": element("tint-b").value , "darkness":0.0};
        level.start = this.startPoint.getJSON();
        level.end   = this.endPoint.getJSON();
        level.width = this.levelboundary.size.w;
        level.height = this.levelboundary.size.h;
        level.setting = element("setting").value;
        level.weather = element("weather").value;
        level.soundtrack = "alice";
        level.enemies = [];
        level.platforms = [];
        level.jumpboxes = [];
        level.ladders = [];
        level.fragmentsources = [];
        level.triggeredplatforms = [];
        level.craftingtables = [];
        level.enemysources = [];

        for (var i = 0; i < this.items.length; i++) {
            var p = this.items[i]
            if(p instanceof EditorEnemy) level.enemies.push( p.getJSON() )
            if(p instanceof EditorPlatform) level.platforms.push( p.getJSON() );
            if(p instanceof EditorJumpbox) level.jumpboxes.push( p.getJSON() );
            if(p instanceof EditorLadder) level.ladders.push( p.getJSON() );
            if(p instanceof EditorFragmentSource) level.fragmentsources.push( p.getJSON() );
            if(p instanceof EditorEnemySource) level.enemysources.push( p.getJSON() )
            if(p instanceof EditorCraftingTable) level.craftingtables.push( p.getJSON() );
            if(p instanceof EditorTriggeredPlatform)  level.triggeredplatforms.push( p.getJSON() );
        }

        level.conveyers = [];
        
        level.supports = [];
        level.doodads = [];

        return level;
    }
});


var Editor = Class.$extend({

    __init__:function(){

        debug.log("Loading Editor")

        element("editor-wrapper").style.display = 'block';
        this.wrapper    = element("editor-wrapper");
        this.draw_canvas = new Canvas( sizeVector(1080,550) );
        this.draw_canvas.getImage().style.position = "absolute";
        element("editor-background").appendChild( this.draw_canvas.getImage() )        
        
        this.grid = null;
        this.drawGrid();


        // CLASS VARIABLES
        this.currentLevel = new EditorLevel();
        this.currentTriggered = [];
        this.currentEnemyType = null;
        this.current = vector(5,0);
        this.start   = vector(0,0);
        this.areasize = new sizeVector(30,14);
        this.currentlyDrawingArea = false;
        this.pickedUp = null;
        this.pickedUpOffset = vector(0,0);

        // DOM CONTROL
        element("setting").onchange = function(){ editor.updateGameEngine() }
        element("weather").onchange = function(){ editor.updateGameEngine() }
        element("tint-r").onchange  = function(){ editor.updateGameEngine() }
        element("tint-g").onchange  = function(){ editor.updateGameEngine() }
        element("tint-b").onchange  = function(){ editor.updateGameEngine() }
        element("tint-a").onchange  = function(){ editor.updateGameEngine() }
        element("dec-scale").addEventListener(      "mousedown" , function(){ 
            if(EDITORSCALE >= 5){
                EDITORSCALE -= 1;   
                element("editor-background").removeChild( editor.grid.getImage() );
                editor.drawGrid();
                game.loadLevel(game.currentLevelIndex);
            }
        } , false);
        element("inc-scale").addEventListener(      "mousedown" , function(){ 
            EDITORSCALE +=1;   
            element("editor-background").removeChild( editor.grid.getImage() );
            editor.drawGrid();
            game.loadLevel(game.currentLevelIndex);
            // editor.updateGameEngine();
        } , false);

        element("set-delete").addEventListener(      "mousedown" , function(){ editor.setMode("delete");    } , false);
        element("set-move").addEventListener(      "mousedown" , function(){ editor.setMode("move");    } , false);
        element("set-boundary").addEventListener(    "mousedown" , function(){ editor.setMode("boundary")   } , false);
        element("set-start-point").addEventListener( "mousedown" , function(){ editor.setMode("startpoint") } , false);
        element("set-end-point").addEventListener(   "mousedown" , function(){ editor.setMode("endpoint")   } , false);
        element("add-chomper").addEventListener(     "mousedown" , function(){ editor.currentEnemyType = "chomper"; editor.setMode("enemy"); } , false);
        element("add-creeper").addEventListener(     "mousedown" , function(){ editor.currentEnemyType = "creeper"; editor.setMode("enemy"); } , false);
        element("add-gumball").addEventListener(     "mousedown" , function(){ editor.currentEnemyType = "gumball"; editor.setMode("enemy"); } , false);
        element("add-platform").addEventListener(    "mousedown" , function(){ editor.setMode("platform") } , false);
        element("add-ladder").addEventListener(      "mousedown" , function(){ editor.setMode("ladder")   } , false);
        element("add-jumpbox").addEventListener(     "mousedown" , function(){ editor.setMode("jumpbox")  } , false);
        element("add-triggered").addEventListener(   "mousedown" , function(){ editor.setMode("triggered")  } , false);
        element("add-spawner").addEventListener(   "mousedown" , function(){ editor.setMode("enemysource")  } , false);
        element("add-firefragmentsource").addEventListener(     "mousedown" , function(){ editor.currentSourceType = "fire"; editor.setMode("fragmentsource");  } , false);
        element("add-acidfragmentsource").addEventListener(     "mousedown" , function(){ editor.currentSourceType = "acid"; editor.setMode("fragmentsource");  } , false);
        element("add-firecraftingtable").addEventListener(      "mousedown" , function(){ editor.currentSourceType = "fire"; editor.setMode("craftingtable");  } , false);
        element("add-acidcraftingtable").addEventListener(      "mousedown" , function(){ editor.currentSourceType = "acid"; editor.setMode("craftingtable");  } , false);
        element("add-icecraftingtable").addEventListener(       "mousedown" , function(){ editor.currentSourceType = "ice" ; editor.setMode("craftingtable");  } , false);
        element("add-usedcraftingtable").addEventListener(      "mousedown" , function(){ editor.currentSourceType = "used"; editor.setMode("craftingtable");  } , false);
        element("compile-level").addEventListener(   "mousedown" , function(){ editor.saveLevel() }, false);
        element("new-level").addEventListener(       "mousedown" , function(){ 
            editor.currentLevel.clear();
            editor.currentLevel = new EditorLevel();
            editor.currentLevel.addItem( new EditorPlatform( vector(0,14), sizeVector(7,1) ) );
            editor.updateGameEngine();
        }, false);
    },



    drawGrid: function(){
        var grid_canvas = new Canvas( sizeVector(1080,550) );
        grid_canvas.getImage().style.zIndex = 1;
        grid_canvas.getImage().style.position = "absolute"
        grid_canvas.setStroke( 'rgba(255,255,255,0.15)' );
        for (var x = 0; x < 1080; x += EDITORSCALE){  grid_canvas.line(x,0,x,1080)    };
        for( var y = 0; y < 1080; y += EDITORSCALE){  grid_canvas.line(0,y,1080,y)    };
        grid_canvas.canvas.addEventListener("mousemove", this.mouseMove, true);
        grid_canvas.canvas.addEventListener("mousedown", this.mouseDown, false);
        element("editor-background").appendChild( grid_canvas.getImage() );
        this.grid = grid_canvas;
    },

    pickupItem: function(item, offset){
        this.pickedUp = item;
        this.pickedUpOffset = vector(round(-offset.x/EDITORSCALE), round(-offset.y/EDITORSCALE));
        console.log(offset)
        for (var i = 0; i < this.currentLevel.items.length; i++) { this.currentLevel.items[i].dom.style.zIndex = 0 };
    },

    getLocalPos: function(e){
        return vector(e.pageX-editor.wrapper.offsetLeft-element("editor-background").offsetLeft, e.pageY-editor.wrapper.offsetTop-element("editor-background").offsetTop);
    },


    mouseMove: function(e){
        editor.updateCurrentPosition( editor.getLocalPos(e) );
        if(editor.currentlyDrawingArea == true){
            editor.areasize.w = editor.current.x - editor.start.x;
            editor.areasize.h = editor.current.y - editor.start.y;
            element("area-size").innerHTML = "( " + editor.areasize.w + " , " + editor.areasize.h + " )";        
        }

        if(editor.mode == "move"){
            if(editor.pickedUp != null){
                editor.pickedUp.pos.x = editor.current.x - editor.pickedUpOffset.x;
                editor.pickedUp.pos.y = editor.current.y - editor.pickedUpOffset.y;
                editor.pickedUp.updateDom();
            }
        }
    },

    mouseDown: function(e){

        if(editor.mode == "startpoint"){
            editor.currentLevel.startPoint = new Door( editor.current ,  element("start-point"))
            editor.updateGameEngine();
        } else if(editor.mode == "endpoint"){
            editor.currentLevel.endPoint = new Door( editor.current ,  element("end-point"))
            editor.updateGameEngine();
        } else if(editor.mode == "boundary"){
            (!editor.currentlyDrawingArea ? editor.startDrawingArea() : editor.setBoundary() )
        } else if(editor.mode == "jumpbox"){
            editor.addItem( new EditorJumpbox( editor.current ) );
        } else if(editor.mode == "enemysource"){
            editor.addItem( new EditorEnemySource( editor.current, 400, 5 ) );
        } else if(editor.mode == "craftingtable"){
            editor.addItem( new EditorCraftingTable( editor.current ) );
        } else if(editor.mode == "enemy"){
            editor.addItem( new EditorEnemy( editor.current, editor.currentEnemyType) );
        } else if(editor.mode == "fragmentsource"){
            editor.startDrawingArea();
            editor.setMode("post-fragmentsource");
        } else if(editor.mode == "post-fragmentsource"){
            var local = editor.getLocalPos(e);


            var vx = local.x - (editor.start.x) * EDITORSCALE;
            var vy = local.y - (editor.start.y) * EDITORSCALE;
            vx /= EDITORSCALE;
            vy /= EDITORSCALE

            var vel = vector( vx, vy )

            var frq = parseInt(prompt("Set Fragment source frequency (number of frames per new fragment)", 5));
            editor.addItem( new EditorFragmentSource( editor.start, vel, frq, editor.currentSourceType ) );
            editor.setMode("fragmentsource")
        } else if(editor.mode == "delete"){

        } else if(editor.mode == "ladder"){
            (!editor.currentlyDrawingArea ? editor.startDrawingArea() : editor.addItem( new EditorLadder( editor.start, editor.areasize) ) );
        } else if(editor.mode == "platform"){
            (!editor.currentlyDrawingArea ? editor.startDrawingArea() : editor.addItem( new EditorPlatform( editor.start, editor.areasize ) ) );
        } else if(editor.mode == "triggered"){
            if(!editor.currentlyDrawingArea){
                editor.startDrawingArea();
            } else {
                editor.setMode( "post-triggered" )
                editor.currentTriggered = {x: editor.start.x, y: editor.start.y, w: editor.areasize.w, h:editor.areasize.h, ex: 0, ey: 0, tx: 0, ty: 0, looping: false}
            }
        } else if(editor.mode == "post-triggered"){
            editor.currentTriggered.ex = editor.current.x;
            editor.currentTriggered.ey = editor.current.y;
            

            var sw = confirm("Should it be controlled by a switch?");
            if(sw == true){
                editor.setMode("post-post-triggered");        
            } else {
                editor.addTriggeredPlatform( false );
            }

        } else if(editor.mode == "post-post-triggered"){
            editor.currentTriggered.tx = editor.current.x;
            editor.currentTriggered.ty = editor.current.y;
            editor.addTriggeredPlatform( true );
        } else if(editor.mode == "move"){
            if(editor.pickedUp != null){
                editor.pickedUp = null;
                editor.updateGameEngine();
                editor.setMode("move")
            }
        }
    },

    addTriggeredPlatform: function( sw ){
        var speed = prompt("Enter a platform speed (between 0 and 0.4)",0.1)
        var t = editor.currentTriggered;
        var pos = vector(t.x,t.y);
        var size = sizeVector(t.w,t.h);
        var endpos = vector(t.ex, t.ey);
        var triggerpos = vector(t.tx,t.ty);
        editor.addItem( new EditorTriggeredPlatform( pos, size, endpos, triggerpos, speed, sw ));
        editor.setMode("triggered");
        editor.currentTriggered = null;          
    },

    startDrawingArea: function(){
        editor.currentlyDrawingArea = true;
        editor.start.x = editor.current.x;
        editor.start.y = editor.current.y;
    },

    setBoundary: function(){
        this.currentLevel.setBoundary( new EditorBoundary( this.start, this.areasize ) );
        this.currentlyDrawingArea = false;
        this.updateGameEngine();
    },

    addItem: function(item){
        this.currentLevel.addItem( item );
        editor.updateGameEngine();
        editor.currentlyDrawingArea = false;
    },

    removeItem: function(item){
        this.currentLevel.removeItem( item );
        editor.updateGameEngine();
    },

    setMode: function(mode){
        for (var i = 0; i < this.currentLevel.items.length; i++) { this.currentLevel.items[i].dom.style.zIndex = (mode == "delete" || mode == "move" ? 2 : 0);  }

        if(mode == "delete"){
            $('.editor-object').css('cursor','pointer');

            $('.editor-object').css('border-color','rgba(255,0,0,0.5)');
        }
        if(mode == "move"){
            $('.editor-object').css('cursor','move');
            $('#editor-background').css('cursor','move');
            $('.editor-object').css('border-color','rgba(255,255,255,0.5)');
        } else {
            $('#editor-background').css('cursor','pointer');
        }

        this.mode = mode;
        var text = mode + " mode"
        if(this.mode == null)                  text = "No mode currently active";
        if(this.mode == "delete")              text = "Delete Objects";
        if(this.mode == "move")              text = "Move Object";
        if(this.mode == "fragmentsource")      text = "Place fragment source Location";
        if(this.mode == "post-fragmentsource") text = "Draw Vector for initial velocity of fragments";
        if(this.mode == "enemy")               text = "Place spawn position of " + editor.currentEnemyType;
        if(this.mode == "platform")            text = "Place Platform";
        if(this.mode == "startpoint")          text = "Place Level Start Point";
        if(this.mode == "endpoint")            text = "Place Level End Point";
        if(this.mode == "boundary")            text = "Draw Level boundaries";
        if(this.mode == "ladder")              text = "Place Ladder";
        if(this.mode == "jumpbox")             text = "Place 1x1 Jumpbox";
        if(this.mode == "craftingtable")       text = "Place " + editor.currentSourceType + " Crafting Table";
        if(this.mode == "triggered")           text = "Place start position of triggered platform";
        if(this.mode == "post-triggered")      text = "Place end position of triggered platform";
        if(this.mode == "post-post-triggered") text = "Place Switch position";
        element("current-mode").innerHTML = text;
    },


    readFromJSON: function( data ){
        this.currentLevel.clear();
        this.currentLevel = new EditorLevel();
        this.currentLevel.read( data );
    },

    // SENDS JSON DATA TO TEMPORARY STORAGE IN LEVEL DATABASE
    updateGameEngine:function(){
        game.setTempLevel( this.currentLevel.compile() )
    },

    // what even is this?
    saveLevel: function(){
        var a = prompt("Save As?",editor.currentLevel.name);
        editor.currentLevel.name = a;
        // var level = this.currentLevel.compile();
        // game.saveLevel( JSON.stringify(level), a );
        // game.setTempLevel( level );
        game.saveLevel( this.currentLevel.compile(), a )
    },

    drawArea: function(){
        this.rect( this.start, this.areasize );
    },

    rect: function(pos,size){
        this.draw_canvas.solidRect( pos.x*EDITORSCALE, pos.y*EDITORSCALE, size.w*EDITORSCALE, size.h*EDITORSCALE)
    },

    updateCurrentPosition:function(v){
        this.current.x = round(v.x / EDITORSCALE);
        this.current.y = round(v.y / EDITORSCALE);
        element("current-point").innerHTML = "( " + this.current.x + " , " + this.current.y + " )";

        this.draw_canvas.clear();

        if(this.mode != "delete" && this.mode != null && this.mode != "move"){
            this.draw_canvas.setStroke('rgba(255,255,255,0.5)');
            var ax = this.current.x * EDITORSCALE;
            var ay = this.current.y * EDITORSCALE;
            if(this.mode != "post-fragmentsource"){
                this.draw_canvas.line(ax-15,ay,ax+15,ay);
                this.draw_canvas.line(ax,ay-15,ax,ay+15);
            }
        }
        if(this.mode == "boundary" && this.currentlyDrawingArea){
            this.draw_canvas.setFill('rgba(255,255,255,0.5');
            this.drawArea();
        } else if(this.mode == "endpoint"){
            this.draw_canvas.setFill('rgba(250,50,50,0.5');
            this.rect( vector(this.current.x, this.current.y-1),sizeVector(1,3));
        } else if(this.mode == "startpoint"){
            this.draw_canvas.setFill('rgba(100,250,250,0.5');
            this.rect( vector(this.current.x, this.current.y-1),sizeVector(1,3));
        } else if(this.mode == "platform" && this.currentlyDrawingArea == true){
            this.draw_canvas.setFill('rgba(100,250,50,0.5');
            this.drawArea();
        } else if(this.mode == "ladder" && this.currentlyDrawingArea == true){
            this.draw_canvas.setFill('rgba(250,250,50,0.5');
            this.rect( this.start, sizeVector( 1, this.areasize.h) )
        } else if(this.mode =="jumpbox"){
            this.draw_canvas.setFill('rgba(200,50,500,0.5');
            this.rect( this.current, sizeVector(1,1) )
        } else if(this.mode =="enemysource"){
            this.draw_canvas.setFill('rgba(200,250,20,0.5');
            this.rect( this.current, sizeVector(16,7) )
        } else if(this.mode =="craftingtable"){
            this.draw_canvas.setFill('rgba(50,250,200,0.5');
            this.rect( this.current, sizeVector(2,1) )
        } else if(this.mode == "enemy"){
            this.draw_canvas.setFill('rgba(250,50,50,0.5')
            this.draw_canvas.solidCircle(this.current.x*EDITORSCALE + EDITORSCALE/2,this.current.y*EDITORSCALE + EDITORSCALE/2,EDITORSCALE/2)
        } else if(this.mode == "fragmentsource"){
            this.draw_canvas.setFill('rgba(250,50,250,0.5')
            this.draw_canvas.solidCircle(this.current.x*EDITORSCALE,this.current.y*EDITORSCALE,3);    
        } else if(this.mode == "post-fragmentsource"){
            this.draw_canvas.setStroke('rgba(250,50,250,0.5')
            this.draw_canvas.line(this.start.x*EDITORSCALE, this.start.y*EDITORSCALE,v.x,v.y);
        } else if(this.mode == "triggered" && this.currentlyDrawingArea){
            this.draw_canvas.setFill('rgba(250,150,30,0.5');
            this.drawArea();
        } else if(this.mode == "post-triggered"){
            this.draw_canvas.setFill('rgba(250,150,30,0.5');
            this.rect( this.currentTriggered, this.currentTriggered )
            this.rect( this.current, this.currentTriggered )
        } else if(this.mode == "post-post-triggered"){
            this.draw_canvas.setFill('rgba(250,150,30,0.5');
            this.rect( this.currentTriggered, this.currentTriggered )
            this.rect( vector(this.currentTriggered.ex, this.currentTriggered.ey), this.currentTriggered);
            this.draw_canvas.solidCircle(this.current.x*EDITORSCALE + EDITORSCALE/2,this.current.y*EDITORSCALE + EDITORSCALE/2,EDITORSCALE/2)
        } else {
            this.draw_canvas.setFill('transparent');
        }

        
    }

});
