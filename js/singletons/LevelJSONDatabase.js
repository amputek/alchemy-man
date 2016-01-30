
// CONTAINS THE RAW JSON DATA FOR EACH LEVEL
var LevelJSONDatabase = new JS.Class({

    //takes a callback function for when levels have finished loading
    initialize: function( callback ){
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
