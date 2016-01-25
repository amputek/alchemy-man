
// CONTAINS THE RAW JSON DATA FOR EACH LEVEL
var LevelJSONDatabase = Class.$extend({

    //takes a callback function for when levels have finished loading
    __init__: function( callback ){
        this.data = [];
        this.databaseSize = 0;
        this.successfulLoads = 0;
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
var LevelGenerator = Class.$extend({

    __init__: function( callback ){
        this.database = new LevelJSONDatabase( callback );
        this.posterCount = 0;
    },

    getVectors: function(f){
        var size = sizeVector( f.w * 2.5 , f.h * 2.5 );
        var pos  = vector    ( f.x*5 + size.w , f.y*5 + size.h );
        return { pos: pos , size: size }
    },

    loadPlatform: function( f, canvas ){
        var vectors = this.getVectors(f);
        return new Platform( vectors.pos, vectors.size );
    },

    loadJumpBox: function( f , canvas ){
        var vectors = this.getVectors(f);
        canvas.drawImage( images.env.jumpbox, vector(vectors.pos.x*SCALE - 22 , vectors.pos.y*SCALE - 20 ));
        return new JumpBox( vectors.pos , vectors.size );
    },

    loadLedge: function( f , canvas ){
        var vectors = this.getVectors(f)
        var img = null;
        var drawoffset = vector(0,0);

        if(f.w == 1){
            if(f.h == 2){
                img = images.env.boxpile_1_2[ Math.randomInt(0,2) ];
                drawoffset = vector(1,-2);
            } else if(f.h == 4){
                img = images.env.boxpile_1_4;
                drawoffset = vector(0,-2);
            } else if(f.h == 5){
                img = images.env.boxpile_1_5;
                drawoffset = vector(0,-2);
            } else if(f.h == 6){
                img = images.env.boxpile_1_6;
                drawoffset = vector(0,-2);
            } else {
                img = images.env.boxpile_1_1[ Math.randomInt(0,3) ];
                drawoffset = vector(1,-2);
            }
        } else if(f.w == 2){
            if(f.h == 2){
                img = images.env.boxpile_2_2;
                drawoffset = vector(40,37)
            } else if(f.h == 4){
                img = images.env.machine;
                drawoffset = vector(45,0);
            }
        } else if(f.w == 3){
            if(f.h == 2){
                img = images.env.boxpile_3_2;
                drawoffset = vector(15,0);
            } else {
                img = images.env.toyrack;
                drawoffset = vector(-0,0);
            }
        }


        drawsize = sizeVector( vectors.size.w * SCALE + drawoffset.x, vectors.size.h * SCALE + drawoffset.y );
        canvas.drawImage( img, vector( vectors.pos.x*SCALE - drawsize.w, vectors.pos.y*SCALE - drawsize.h ) );

        return new Platform( vectors.pos , vectors.size )
    },

    loadDoodad: function( d, canvas ){
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
        canvas.drawImage( img, Vector2.toWorld( Vector2.gridToPhysics(d) ) );
    },

    loadConveyer: function(f){
        return new Conveyer( vector(f.x*5 + f.w*5 , f.y*5 ), sizeVector(f.w*2.5,2) );
    },

    loadMovingPlatform: function(f){

        var vectors = this.getVectors(f);
        var endpos = vector(f.ex*5 + vectors.size.w, f.ey*5 + vectors.size.h);
        var triggerpos = vector(f.tx*5, f.ty*5);

        if(f.switched == true){
            return new SwitchedMovingPlatform( vectors.pos, vectors.size, endpos, f.time, triggerpos );
        } else {
            return new MovingPlatform( vectors.pos, vectors.size, endpos, f.time, true );
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

            m.setTopPos( vector( m.worldpos.x - m.physicssize.w*SCALE,currenty*SCALE ) );
        }
    },

    loadLadder: function( f, canvas ){

        var pos = vector( (f.x * 5) + 2.5, (f.y * 5) + (f.h * 2.5) );
        var worldpos = Vector2.toWorld(pos);

        var drawsize = sizeVector(20, f.h * SCALE * 2.5 );
        canvas.save();
        canvas.translate( worldpos.x,  worldpos.y);

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


        return new Ladder( vector( (f.x * 5) + 2.5, (f.y * 5) + (f.h * 2.5) ), sizeVector(1,f.h*2.5) );
    },

    loadSupport: function( d , canvas ){

        var draw_temp = new Canvas( sizeVector(600,600))


        var ax = d.x;


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

        canvas.drawImage( draw_temp.getImage() , Vector2.toWorld( vector(d.x*5 - 10, d.y*5) ) );

    },

    loadEnemy: function(d){
      if(d.type == "gumball") return new Gumball( vector(d.x * 5, d.y * 5), vector(d.x * 5, d.y * 5) );
      if(d.type == "chomper") return new Chomper(   vector(d.x * 5, d.y * 5) );
      if(d.type == "creeper") return new Creeper(   vector(d.x * 5, d.y * 5) );
    },

    loadFragmentSource: function(d){
        return new FragmentSource( vector(d.x * 5,d.y * 5), vector(d.vx,d.vy), d.type, d.frequency)
    },

    loadEnemySource: function(es){
        if(es != null) return new EnemySource( vector(es.x * 5,es.y * 5), 400, 4 );
    },

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

                var vectors = this.getVectors(f);
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
                canvas.drawImage( draw_temp.getImage(), vector( f.worldpos.x - drawsize.w/2 , f.worldpos.y - drawsize.h/2 ) )
                // canvas.setFill("blue")
                // console.log(f.physicspos.x - drawsize.w/2 , f.physicspos.y - drawsize.h/2)
                // canvas.solidRect( f.worldpos.x - drawsize.w/2 , f.worldpos.y - drawsize.h/2 , 50, 50);

            }
        }


    },

    drawBrick: function(floors,canvas){

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

    addPlatformShadows: function(floors,canvas,zones){
        canvas.setFill( 'rgba(0,0,0,0.6)' );
        for (var i = 0; i < floors.length; i++) {
            var f = floors[i];
            for (var j = 0; j < floors.length; j++) {
                var f2 = floors[j];
                if(f != f2 && f.physicssize.w >= 5 && f2.physicssize.w >= 5){
                    if(f.physicspos.y+f.physicssize.h > f2.physicspos.y - f2.physicssize.h && f.physicspos.y-f.physicssize.h <= f2.physicspos.y + f2.physicssize.h){
                        for(var x = f.physicspos.x - f.physicssize.w; x < f.physicspos.x + f.physicssize.w; x+=5){
                            if(x >= f2.physicspos.x - f2.physicssize.w && x < f2.physicspos.x + f2.physicssize.w){
                                var loc = Vector2.toGrid( new Vector2(x,f2.physicspos.y + f2.physicssize.h));

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
        var data = this.database.getLevel( index );

        level.name = data.name;

        console.log(data.start);


        var levelPhysicsSize = sizeVector( data.width * 5, data.height * 5);
        var levelSize = sizeVector( data.width * 5 * SCALE, data.height * 5 * SCALE );
        var startpos  = Vector2.gridToPhysics( data.start );
        var endpos    = Vector2.gridToPhysics( data.end );

        // console.log(startpos);

        //startpos goes from a world value? (in the json data), to a physics position, to a draw position, to a b2vec2 in the level.js
        //clean this up


        level.weather.setAmount(data.weather)
        level.setEnd( endpos );
        level.setSize( levelPhysicsSize );


        var ambientLight = level.ambientLight = data.ambientLight;
        var darkness = ambientLight.darkness;

        var floorcanvas  = level.canvas[3];

        // draw doors
        if(data.start.type == "door") level.canvas[3].drawImage( images.doodad.door,      vector(startpos.x * SCALE - 90, startpos.y * SCALE - 160 ) );
        if(data.end.type   == "door") level.canvas[3].drawImage( images.doodad.door_open, vector(endpos.x   * SCALE - 150, endpos.y   * SCALE - 160 ) );

        // draw supports and doodads
        for( var i = 0; i < data.supports.length; i++) { this.loadSupport( data.supports[i], level.canvas[3]                     ) }
        for( var i = 0; i < data.doodads.length;  i++) { this.loadDoodad(  data.doodads[i] , level.canvas[data.doodads[i].depth] ) }

        //TODO: only need to do this if new setting is different
        // set up backdrop
        if(data.setting == "exterior") level.canvas[0].canvas.style.backgroundImage = "url('images/sunset.jpg')";
        if(data.setting == "interior") level.canvas[0].canvas.style.backgroundImage = "url('images/factory.jpg')";

        // tint doors and non-interactive doodads (before adding any platforms etc)
        floorcanvas.tint( ambientLight  , 0.4+darkness );


        var _this = this;

        function Add( dataCol, levelCol, func ){
            for( var i = 0; i < dataCol.length; i++){
                levelCol.add( func( dataCol[i], floorcanvas ) );
            }
        }



        // draw floors
        for( var i = 0; i < data.jumpboxes.length;          i++) {  level.floors.add(              this.loadJumpBox(           data.jumpboxes[i]          , floorcanvas ) ) }
        for( var i = 0; i < data.conveyers.length;          i++) {  level.floors.add(              this.loadConveyer(          data.conveyers[i ]         , floorcanvas ) ) }
        for( var i = 0; i < data.ladders.length;            i++) {  level.floors.add(              this.loadLadder(            data.ladders[i]            , floorcanvas ) ) }
        for( var i = 0; i < data.platforms.length;          i++) {  level.floors.add(              this.loadPlatform(          data.platforms[i]          , floorcanvas ) ) }
        // NOW ADD ALL OTHER GAME OBJECTS - THESE ARE NOT DRAWN NOW BUT NEED TO BE ADDED TO MANAGERS
        for( var i = 0; i < data.triggeredplatforms.length; i++) {  level.triggeredplatforms.add(  this.loadMovingPlatform(    data.triggeredplatforms[i] ) ) }
        for( var i = 0; i < data.enemies.length;            i++) {  level.enemies.add(             this.loadEnemy(             data.enemies[i]            ) ) }
        for( var i = 0; i < data.fragmentsources.length;    i++) {  level.fragmentSources.add(     this.loadFragmentSource(    data.fragmentsources[i]    ) ) }
        for( var i = 0; i < data.enemysources.length;       i++) {  level.enemySources.add(        this.loadEnemySource(       data.enemysources[i]       ) ) }

        this.drawMovingPlatforms( level.triggeredplatforms.getCollection(), level.floors.getCollection(), floorcanvas )

        this.drawBrick( level.floors.getCollection(), floorcanvas )
        this.addPlatformShadows( level.floors.getCollection(), floorcanvas, level.nolandzones)
        this.drawLedges( level.floors.getCollection(), floorcanvas )


        // TINT CANVASES
        level.canvas[0].tint( ambientLight  , 0.7+darkness );
        level.canvas[1].fill( rgba(ambientLight.r,ambientLight.g,ambientLight.b,0.3) );
        level.canvas[1].tint( ambientLight  , 0.5+darkness );
        level.canvas[2].tint( ambientLight  , 0.5+darkness );
        level.canvas[3].tint( ambientLight  , 0.3+darkness );
        level.canvas[5].tint( ambientLight  , 0.5+darkness );

        // this.initPlayer( startpos, level.floors.getCollection() );

        level.setStart(startpos, this.findClosestPlatform( startpos, level.floors.getCollection() ) );
        //


    },

});
