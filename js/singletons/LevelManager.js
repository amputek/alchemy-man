
// CONTAINS THE RAW JSON DATA FOR EACH LEVEL
var LevelJSONDatabase = new JS.Singleton( JS.Class, {

    //takes a callback function for when levels have finished loading
    initialize: function(){
        this.data = [];
        this.databaseSize = 0;
        this.successfulLoads = 0;
        this.finishedLoadingCallback = null;
    },

    init: function( callback ){
        this.finishedLoadingCallback = callback;
        this.parseLevels();
    },

    // creates levels from JSON data
    parseLevels: function(){

        element("level-list").innerHTML = "";
        this.data = [];
        this.successfulLoads = 0;

        var filenames = [];

        var _this = this;

        //get levels from js/levels directory
        var xhr = new XMLHttpRequest();
        xhr.open('POST','js/levels/get.php',true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200){

                //get list of files in level directory
                var fileList = $.parseJSON(xhr.responseText);

                //get all json files from directory
                for(var i = 0; i < fileList.length; i++){
                    if( fileList[i].split('.').pop() == "json"){
                        filenames.push( fileList[i] )
                    }
                }

                _this.databaseSize = filenames.length;


                for (var i = 0; i < _this.databaseSize; i++) {

                    //create dom in menu
                    var list = document.createElement("li");
                    element("level-list").appendChild(list);

                    //parse level
                    _this.parseLevel(filenames[i], i );
                };

            }
        }

    },

    // Save a level to the database
    saveLevel: function( data , filename ){
        var xhr = new XMLHttpRequest();
        xhr.open('POST','js/levels/server.php',true);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        debug.log("Saving Level: " + filename + ".json")
        xhr.send('json=' + data + '&filename=' + filename);

        var _this = this;
        setTimeout(function(){ _this.parseLevels() },500);
    },

    loadSuccess: function( data, ind ){
        debug.log("- Finished parsing level " + ind + ": '" + data.name + "'");
        this.data[ind] = data;
        // sortFloors( data.platforms );
        element("level-list").children[ind].innerHTML = '"' + data.name + '"';
        this.successfulLoads++;
        if(this.successfulLoads == this.databaseSize){

            var levellist = element("level-list")
    		for (var i = 0; i < levellist.children.length; i++) {
    			(function(i){
    				levellist.children[i].addEventListener( "mousedown", function(){  game.loadLevel(i) }, false );
    			}(i));
    		};

            this.finishedLoadingCallback();
        }
    },

    // parsed a single level of specified name
    parseLevel: function( filename, i ){
        var _this = this;
        var _index = i;
        debug.log(  "- Parsing '" + filename + "' from JSON file into JSON database of levels.");
        var filename = 'js/levels/' + filename + '?nocache=(' + (new Date()).getTime()
        $.getJSON(filename, function(data){
        }).success( function(data){
            _this.loadSuccess(data, _index);
        });
    },

    getLevel: function(index){
        return this.data[index];
    }

});




//CONVERTS JSON DATA INTO GAMEOBJECTS.
//PREPARES LEVEL FOR ENGINE
var LevelGenerator = new JS.Singleton( JS.Class, {

    initialize: function(  ){
        this.posterCount = 0;
    },

    getSize: function( objectData ){
        if( objectData.w == undefined ) objectData.w = 1;
        return sizeVector( objectData.w * 2.5 , objectData.h * 2.5 );
    },

    getPosition2: function( x,y,w,h ){
        var nx,ny,nw,nh;
        //incase its an object
        if( x.x != undefined){
            nx = x.x;
            ny = x.y;
            nw = x.w;
            nh = x.h;
        }

        if( nh == undefined ){
            nw = 0;
            nh = 0;
        }
        if( nh != undefined && nw == undefined ) nw = 1;
        return vector( (nx * 5) + (nw * 2.5) , (ny * 5) + (nh * 2.5) );
    },

    setStart : function( level, pos, floor ){
		level.startpos = Vector2.b2(pos);
		level.startPlatform = floor;
	},

	setEnd : function( level, pos ){
		level.endpos = Vector2.b2(pos);
	},

	setSize: function( level, size ){
		level.physicsSize = size;
	},

    //non-interactive drawing
    //this could be moved into doodads? "support" is just a type of doodad right?
    drawSupports: function( data , canvas ){

        for (var i = 0; i < data.length; i++) {
            var d = data[i];

            var draw_temp = new Canvas( sizeVector(600,600))

            for(var ay = 0; ay < d.h; ay++){
                if(ay == 0){
                    draw_temp.drawImage( images.env.support_top, vector(80-0,ay*5*SCALE ) );
                    ay++;
                } else if(ay == d.h-1){
                    draw_temp.drawImage( images.env.support_base, vector(80-3,ay*5*SCALE-15 ) );
                } else if (ay % 2 == 0){
                    draw_temp.drawImage( images.env.support_high[Math.randomInt(0,2)], vector(80,ay*5*SCALE ) );
                } else {
                    draw_temp.drawImage( images.env.support_low[Math.randomInt(0,3)], vector(80,ay*5*SCALE ) );
                }
            }
            for(var ay = 1.5; ay < d.h - 3; ay += Math.randomFloat(1.5,2.5)){
                if( Math.coin(0.2) ) draw_temp.drawImage( images.doodad.poster[ Math.randomInt(3,4) ], vector(84,ay * 5 * SCALE ));
            }

            draw_temp.drawImage( images.doodad.lampfitting_l, vector(80 - 78, 0 ) );
            draw_temp.drawImage( images.doodad.lampfitting_r, vector(80 + 38, 0 ) );

            canvas.drawImage( draw_temp.getImage() , Vector2.physicsToDraw( vector(d.x*5 - 10, d.y*5) ) );

        }
    },

    drawDoodads: function( data, canvases ){

        for (var i = 0; i < data.length; i++) {
            var d = data[i];

            var img = null;
            if(d.type == "generator")          img = images.doodad.gen_fore
            if(d.type == "barrel")             img = images.env.boxpile_2_2_blur;
            if(d.type == "drawers")            img = images.doodad.drawers;
            if(d.type == "pipe_bottom")        img = images.doodad.pipe_bottom;
            if(d.type == "pipe_top")           img = images.doodad.pipe_top;
            if(d.type == "pipe_left")          img = images.doodad.pipe_left;
            if(d.type == "pipe_right")         img = images.doodad.pipe_right;
            if(d.type == "pipe_bottom_left")   img = images.doodad.pipe_bottom_left[ Math.randomInt(0,2) ]
            if(d.type == "pipe_bottom_right")  img = images.doodad.pipe_bottom_right[ Math.randomInt(0,2) ]
            if(d.type == "pipe_top_left")      img = images.doodad.pipe_top_left[ Math.randomInt(0,2) ]
            if(d.type == "pipe_top_right")     img = images.doodad.pipe_top_right[ Math.randomInt(0,2) ]
            if(d.type == "pipe_hor")           img = images.doodad.pipe_hor[ Math.randomInt(0,4) ]
            if(d.type == "pipe_vert")          img = images.doodad.pipe_vert[ Math.randomInt(0,4) ]
            if(d.type == "pile")               img = images.doodad.pile;
            if(d.type == "boiler")             img = images.doodad.boiler;
            if(d.type == "box")                img = ( d.depth == 2 ? images.env.boxpile_4_2_blur : images.env.boxpile_4_2_blur2 );
            if(d.type == "lamp_fitting_left")  img = images.doodad.lampfitting_l;
            if(d.type == "lamp_fitting_right") img = images.doodad.lampfitting_r;
            if(d.type == "bg_platform_0")      img = images.doodad.bg_platform[0];
            if(d.type == "bg_platform_1")      img = images.doodad.bg_platform[1];
            if(d.type == "bg_platform_2")      img = images.doodad.bg_platform[2];
            if(d.type == "door")               img = images.doodad.door;
            if(d.type == "lamp")               img = (d.depth == 3 ? images.doodad.lamp : images.doodad.lamp_blur);
            canvases[d.depth].drawImage( img, Vector2.physicsToDraw( this.getPosition2( d ) ) );


        }
    },


    //game object loading (and drawing)

    loadAndDrawJumpBoxes: function( data , floors, canvas ){
        for (var i = 0; i < data.length; i++) {
            var pos = this.getPosition2( data[i] );
            var size = this.getSize( data[i] );
            canvas.drawImage( images.env.jumpbox, vector(pos.x*SCALE - 22 , pos.y*SCALE - 20 ));
            floors.add( new JumpBox( pos , size ) );
        }
    },

    loadAndDrawLadders: function( data, floors, canvas ){

        for (var i = 0; i < data.length; i++) {
            var f = data[i];

            var pos = this.getPosition2( f );
            var size = this.getSize( f );

            var drawpos = Vector2.physicsToDraw(pos);
            var drawsize = sizeVector(f.w * SCALE * 2.5, f.h * SCALE * 2.5 );

            //temporary draw
            canvas.save();
            canvas.translate( drawpos.x,  drawpos.y);
            canvas.setFill( 'black' );
            for(var i = -drawsize.h; i < drawsize.h; i+= 20){
                canvas.solidRect( -22 , i-2  , 44 , 6  );
                canvas.solidRect( -17 , i-22 , 6  , 46 );
                canvas.solidRect( 13  , i-22 , 6  , 46 );
            }
            canvas.setFill( 'rgb(100,65,30)' );
            for(var i = -drawsize.h; i < drawsize.h; i+= 20){
                canvas.solidRect( -20 , i    , 40 , 2  );
                canvas.solidRect( -15 , i-20 , 2  , 40 );
                canvas.solidRect( 15  , i-20 , 2  , 40 );
            }
            canvas.restore();


            floors.add( new Ladder( pos, size ) );

        }
    },

    loadPlatforms: function( data, floors ){
        for (var i = 0; i < data.length; i++) {
            floors.add( new Platform( this.getPosition2(data[i]), this.getSize(data[i]) ) );
        }
    },

    loadMovingPlatforms: function( data, floors ){

        for (var i = 0; i < data.length; i++) {
            var f = data[i]
            var endpos = this.getPosition2( f.ex, f.ey, f.w, f.h );
            var triggerpos = this.getPosition2( f.tx, f.ty );

            if(f.switched == true){
                floors.add( new SwitchedMovingPlatform( this.getPosition2(f), this.getSize(f), endpos, f.time, triggerpos ) );
            } else {
                floors.add( new MovingPlatform( this.getPosition2(f), this.getSize(f), endpos, f.time, true ) );
            }
        }
    },


    drawMovingPlatforms: function(movers, floors, canvas){

        for(var i = 0; i < movers.length; i++){
            var m = movers[i];
            var x = m.physicspos.x;
            var y = m.physicspos.y - m.physicssize.h;

            var currenty = 0;
            for (var n = 0; n < floors.length; n++) {
                var f = floors[n];
                if( f.physicspos.x - f.physicssize.w < x && f.physicspos.x + f.physicssize.w > x){
                    var y2 = f.physicspos.y + f.physicssize.h;
                    if( y2 < y ){
                        if(y2 > currenty) currenty = y2;
                    }
                }
            }

            m.setTopPos( vector( m.drawpos.x - m.physicssize.w*SCALE,currenty*SCALE ) );
        }
    },

    loadEnemies: function( data, enemies ){
        for (var i = 0; i < data.length; i++) {
            var d = data[i]
            if(d.type == "gumball") enemies.add( new Gumball( this.getPosition2(d), this.getPosition2(d) ) );
            if(d.type == "chomper") enemies.add( new Chomper( this.getPosition2(d) ) );
            if(d.type == "creeper") enemies.add( new Creeper( this.getPosition2(d) ) );
        }
    },


    loadFragmentSources: function( data, fs ){
        for (var i = 0; i < data.length; i++) {
            var d= data[i];
            fs.add( new FragmentSource( this.getPosition(d), vector(d.vx,d.vy), d.type, d.frequency) );
        }

    },

    //For drawing floors

    isBrick: function( f ){
        if(f.physicssize.h == 2.5) return false;
        if(f.physicssize.h == 5 && f.physicssize.w == 7.5) return false;
        if(f.physicssize.h == 10 && f.physicssize.w == 5) return false;
        if(f.physicssize.w > 5) return true;
        if(f.physicssize.w == 5 && f.physicssize.h != 10) return true;
        if(f.physicssize.w == 2.5 && f.physicssize.h > 15) return true;
        return false;
    },

    drawLedges: function(floors,canvas){

        for(var i = 0; i < floors.length; i++){
            var f = floors[i]

            if( this.isBrick(f) == false ){

                var drawsize = sizeVector( f.physicssize.w * SCALE * 2, f.physicssize.h * SCALE * 2 );
                var draw_temp = new Canvas( sizeVector( drawsize.w + 70, drawsize.h + 70 ) );
                var drawoffset = vector(0,0);
                var drawn = false;


                if(f.physicssize.w == 2.5){
                    if(f.physicssize.h == 5){
                        draw_temp.drawImage( images.env.boxpile_1_2[ Math.randomInt(0,2) ] );
                        drawoffset = vector(1,-2);
                        drawn = true;
                    } else if(f.physicssize.h == 10){
                        draw_temp.drawImage( images.env.boxpile_1_4[ Math.randomInt(0,1) ] );
                        drawoffset = vector(0,-2);
                        drawn = true;
                    } else if(f.physicssize.h == 15){
                        draw_temp.drawImage( images.env.boxpile_1_6 );
                        drawoffset = vector(0,-2);
                        drawn = true;
                    } else if(f.physicssize.h == 7.5){
                        draw_temp.drawImage( images.env.boxpile_1_3 );
                        drawoffset = vector(1,-2);
                        drawn = true;
                    } else if(f.physicssize.h == 2.5){
                        if( f instanceof JumpBox == false ){
                            draw_temp.drawImage( images.env.boxpile_1_1[ Math.randomInt(0,3) ] );
                            drawoffset = vector(1,-2);
                            drawn = true;
                        } else {
                            drawn = true;
                        }
                    }
                } else if(f.physicssize.w == 5){
                    if(f.physicssize.h == 5){
                        draw_temp.drawImage( images.env.boxpile_2_2 );
                        drawoffset = vector(40,37)
                        drawn = true;
                    } else if(f.physicssize.h == 10){
                        draw_temp.drawImage( images.env.boxpile_2_4);
                        drawoffset = vector(73,73);
                        // drawsize.w += 100;
                        drawn = true;
                    }
                } else if(f.physicssize.w == 7.5){
                    if(f.physicssize.h == 5){
                        draw_temp.drawImage( images.env.boxpile_3_2 );
                        drawoffset = vector(15,0);
                        drawn = true;
                    }
                }

                if(drawn == false){
                    if(f.physicssize.h == 2.5){
                        for(var ax = 0; ax < f.physicssize.w*2; ax+=5){
                            if(ax == 0){
                                draw_temp.drawImage( images.env.floorboard_leftend                , vector( ax*SCALE , 0 ) );
                            } else if(ax == f.physicssize.w*2 - 5){
                                draw_temp.drawImage( images.env.floorboard_rightend               , vector( ax*SCALE , 0 ) );
                            } else if(ax % 10 == 5){
                                draw_temp.drawImage( images.env.floorboard_left[ Math.randomInt(0,3) ] , vector( ax*SCALE , 0 ) );
                            } else {
                                draw_temp.drawImage( images.env.floorboard_right[ Math.randomInt(0,2) ], vector( ax*SCALE , 0 ) );
                            }
                        }
                    }
                }
                // drawsize.w += drawoffset.x;
                // drawsize.h += drawoffset.y;
                var drawsize = sizeVector( f.physicssize.w * SCALE * 2 + drawoffset.x, f.physicssize.h * SCALE * 2 + drawoffset.y);
                draw_temp.setFill("red")
                // draw_temp.solidRect(0,0,1000,1000);
                canvas.drawImage( draw_temp.getImage(), vector( f.drawpos.x - drawsize.w/2 , f.drawpos.y - drawsize.h/2 ) )
                // canvas.setFill("blue")
                // console.log(f.physicspos.x - drawsize.w/2 , f.physicspos.y - drawsize.h/2)
                // canvas.solidRect( f.drawpos.x - drawsize.w/2 , f.drawpos.y - drawsize.h/2 , 50, 50);

            }
        }


    },

    drawBricks: function(floors,canvas){

        var brickArray = [];
        for(var i = -50; i < 300; i++){
            brickArray[i] = [];
            for(var n = -50; n < 300; n ++){
                brickArray[i][n] = 0;
            }
        }

         for (var i = 0; i < floors.length; i++) {
            var f = floors[i];
            if(this.isBrick(f)){
                for(var x = f.physicspos.x - f.physicssize.w; x < f.physicspos.x+f.physicssize.w; x+=5){
                    for(var y = f.physicspos.y - f.physicssize.h; y < f.physicspos.y+f.physicssize.h; y+=5){
                        brickArray[ Math.round(x/5)][ Math.round(y/5)] = 1;
                    }
                }
            }
        }



        for(var x = 0; x < 250; x++){
            for(var y = 0; y < 250; y ++){
                if(brickArray[x][y] == 1){


                    if(brickArray[x-1][y] == 0 && brickArray[x+1][y] == 0){
                        if(brickArray[x][y+1] == 0){
                            canvas.setFill("pink")
                            canvas.drawImage( images.env.brick_column_bottom                , vector( x*40, y*40 ) );
                        } else {
                            canvas.setFill("purple")
                            canvas.drawImage( images.env.brick_column_middle[Math.randomInt(0,2)], vector( x*40, y*40 ) );
                        }
                    } else if(brickArray[x-1][y] == 0){

                        if(brickArray[x][y+1] == 0){
                            canvas.drawImage( images.env.brick_left_bottom                 , vector( x*40 , y*40 ) );
                        } else {
                            canvas.setFill("blue")
                            canvas.drawImage( images.env.brick_left[ 0 ]                   , vector( x*40 , y*40 ) );
                        }
                    } else if(brickArray[x+1][y] == 0){
                        if(brickArray[x][y+1] == 0){
                            canvas.setFill("yellow")
                            canvas.drawImage( images.env.brick_right_bottom                , vector( x*40 , y*40 ) );
                        } else {
                            canvas.setFill("orange")
                            canvas.drawImage( images.env.brick_right[ 0 ]                  , vector( x*40 , y*40 ) );
                        }
                    } else {
                        if(brickArray[x][y+1] == 0){
                            canvas.setFill("white")
                            canvas.drawImage( images.env.brick_bottom[ Math.randomInt(0,1) ]    , vector( x*40 , y*40 ) );
                        } else {
                            canvas.setFill("orange")
                            canvas.drawImage( images.env.brick_middle[ Math.randomInt(0,2) ]    , vector( x*40 , y*40 ) );
                        }
                    }


                }
            }
        }





        // draw posters
        for(var x = 0; x < 250; x+=1){
            for(var y = 0; y < 250; y+=1){
                if(brickArray[x][y] == 1){
                    if(brickArray[x][y+2] == 1 && brickArray[x+2][y] == 1 ){
                        if(Math.coin(0.08)) canvas.drawImage( images.doodad.poster[Math.randomInt(0,4)], vector((x+0.5)*40,y*40));
                    }
                }
            }
        }

        // draw exposed pipe area
        for(var x = Math.randomInt(-4,0); x < 250; x+=Math.randomInt(4,6)){
            for(var y = Math.randomInt(-4,0); y < 250; y+=Math.randomInt(2,4)){
                if(brickArray[x][y] == 1){

                    if(brickArray[x][y+1] == 1 && brickArray[x][y+2] == 1 && brickArray[x][y+3] == 1 && brickArray[x+1][y] == 1 && brickArray[x+2][y] == 1 && brickArray[x+3][y] == 1 && brickArray[x+4][y] == 1 && brickArray[x+4][y+3] == 1){
                        if(Math.coin(0.1)) canvas.drawImage( images.env.brick_exposed, vector((x+0.5)*40,y*40));
                    }
                }
            }
        }




        canvas.setFill("purple")
        for(var x = 0; x < 250; x++){
            for(var y = 0; y < 250; y ++){
                if(brickArray[x][y] == 1){
                    for(var i = 0; i < floors.length; i++){
                        var f = floors[i];
                        if(f.physicssize.h == 2.5){
                            if(x*5 >= f.physicspos.x - f.physicssize.w && x*5 < f.physicspos.x + f.physicssize.w){
                                if(y*5 == f.physicspos.y + f.physicssize.h){
                                    if( brickArray[x-1][y] == 0){
                                        if( f.physicspos.x-f.physicssize.w <= (x-3)*5){
                                            if( brickArray[x][y+1] != 0){
                                                canvas.drawImage(images.doodad.lampfitting_l, vector((x-1.9)*40, y*40));
                                            }
                                        }
                                    }
                                    if( brickArray[x+1][y] == 1 && brickArray[x+2][y] == 0){
                                        if( f.physicspos.x+f.physicssize.w >= (x+5)*5){
                                            if( brickArray[x+1][y+1] != 0){
                                                canvas.drawImage(images.doodad.lampfitting_r, vector((x+1.9)*40, y*40));
                                            }
                                        }
                                    }
                                    if( brickArray[x+1][y] == 0){
                                        if( f.physicspos.x+f.physicssize.w >= (x+4)*5){
                                            if( brickArray[x][y+1] != 0){
                                                canvas.drawImage(images.doodad.lampfitting_r, vector((x+0.9)*40, y*40));
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }








    },

    drawLedgeShadows: function(floors,canvas,zones){
        canvas.setFill( 'rgba(0,0,0,0.6)' );
        for (var i = 0; i < floors.length; i++) {
            var f = floors[i];
            for (var j = 0; j < floors.length; j++) {
                var f2 = floors[j];
                if(f != f2 && f.physicssize.w >= 5 && f2.physicssize.w >= 5){
                    if(f.physicspos.y+f.physicssize.h > f2.physicspos.y - f2.physicssize.h && f.physicspos.y-f.physicssize.h <= f2.physicspos.y + f2.physicssize.h){
                        for(var x = f.physicspos.x - f.physicssize.w; x < f.physicspos.x + f.physicssize.w; x+=5){
                            if(x >= f2.physicspos.x - f2.physicssize.w && x < f2.physicspos.x + f2.physicssize.w){
                                var loc = Vector2.physicsToGrid( new Vector2(x,f2.physicspos.y + f2.physicssize.h));

                                zones.push( loc );


                                // draw shadow underneath floorboards
                                if(f2.physicssize.h == 2.5 && f.physicssize.h != 2.5){
                                    var shadowHeight = 8
                                    if(x == f2.physicspos.x - f2.physicssize.w){
                                        canvas.solidRect( loc.x * SCALE * 5, loc.y * SCALE * 5 - 26, 20,shadowHeight)
                                        canvas.solidRect( loc.x * SCALE * 5 + 20, loc.y * SCALE * 5, 20,shadowHeight)
                                    } else if(x == f2.physicspos.x + f2.physicssize.w-5){
                                        canvas.solidRect( loc.x * SCALE * 5 + 20, loc.y * SCALE * 5 - 26, 20,shadowHeight)
                                        canvas.solidRect( loc.x * SCALE * 5, loc.y * SCALE * 5, 20,shadowHeight)
                                    } else {
                                        canvas.solidRect( loc.x * SCALE * 5, loc.y * SCALE * 5, 40,shadowHeight)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


    },

    drawBackdrop: function( setting, canvas ){
        if(setting == "exterior") canvas.canvas.style.backgroundImage = "url('images/sunset.jpg')";
        if(setting == "interior") canvas.canvas.style.backgroundImage = "url('images/factory.jpg')";
    },

    drawDoors: function( start, end, canvas ){
        if(start.type == "door") canvas.drawImage( images.doodad.door,      vector(start.x * 5 * SCALE - 90 , start.y * 5 * SCALE - 160 ) );
        if(end.type   == "door") canvas.drawImage( images.doodad.door_open, vector(end.x   * 5 * SCALE - 150, end.y   * 5 * SCALE - 160 ) );
    },

    tintFloorCanvas: function( floorcanvas, ambientLight ){
        floorcanvas.tint( ambientLight  , 0.4+ambientLight.darkness );
    },

    tintCanvases: function( level, ambientLight ){
        level.ambientLight = ambientLight;
        var darkness = ambientLight.darkness;
        level.canvas[0].tint( ambientLight  , 0.7+darkness );
        level.canvas[1].fill( rgba(ambientLight.r,ambientLight.g,ambientLight.b,0.3) );
        level.canvas[1].tint( ambientLight  , 0.5+darkness );
        level.canvas[2].tint( ambientLight  , 0.5+darkness );
        level.canvas[3].tint( ambientLight  , 0.3+darkness );
        level.canvas[5].tint( ambientLight  , 0.5+darkness );
    },


    //TODO: this in unnecessarily long-winded. do the "highest" check on-the-fly
    findClosestPlatform: function( pos, floors ){

        var closefloors = [];

        //get all platforms that are directly below the position
        for(var i = 0; i < floors.length; i++){
            var f = floors[i];
            if(f.physicspos.y >= pos.y ){
                if( pos.x > f.physicspos.x - f.physicssize.w){
                    if( pos.x < f.physicspos.x + f.physicssize.w){
                        closefloors.push(f);
                    }
                }
            }
        }

        var cf = closefloors[i];
        var highest = 1000;
        for (var i = 0; i < closefloors.length; i++) {
            var cf = closefloors[i];
            if( cf.physicspos.y < highest ){
                highest = cf.physicspos.y;
                closest = cf;
            }
        }

        return closest;


    },

    generateLevelFromJSONData: function( index, level ){

        //get json data from database
        var data = LevelJSONDatabase.getLevel( index );

        level.name = data.name;



        //startpos goes from a grid value (in the json data), to a physics position, to a draw position, to a b2vec2 in the level.js
        //clean this up


        //some of these functions are based here, some are in level.js.
        //eg. we tell the level "setStart", but "loadplatforms" is here. why?

        level.weather.setAmount(data.weather)
        this.setEnd(  level, this.getPosition2( data.end ) );
        this.setSize( level, sizeVector( data.width * 5, data.height * 5) );


        var floorcanvas  = level.canvas[3];

        this.drawDoors( data.start, data.end, level.canvas[3]);

        // draw supports and doodads
        this.drawSupports( data.supports , level.canvas[3] );
        this.drawDoodads(  data.doodads , level.canvas );

        //TODO: only need to do this if new setting is different
        this.drawBackdrop( data.setting, level.canvas[0] );

        // tint doors and non-interactive doodads (before adding any platforms etc)
        this.tintFloorCanvas( floorcanvas, data.ambientLight );

        this.loadAndDrawJumpBoxes( data.jumpboxes          , level.floors, floorcanvas );
        this.loadAndDrawLadders(   data.ladders            , level.floors, floorcanvas );
        this.loadPlatforms(        data.platforms          , level.floors );
        this.loadMovingPlatforms(  data.triggeredplatforms , level.triggeredplatforms );
        this.loadEnemies(          data.enemies            , level.enemies );
        this.loadFragmentSources(  data.fragmentsources    , level.fragmentsources );
        this.drawMovingPlatforms(  level.triggeredplatforms.getCollection(), level.floors.getCollection(), floorcanvas )
        this.drawBricks(           level.floors.getCollection(), floorcanvas )
        this.drawLedgeShadows(     level.floors.getCollection(), floorcanvas, level.nolandzones)
        this.drawLedges(           level.floors.getCollection(), floorcanvas )

        this.tintCanvases( level, data.ambientLight )

        var startpos  = this.getPosition2( data.start );
        this.setStart( level, startpos, this.findClosestPlatform( startpos, level.floors.getCollection() ) );


    },

});
