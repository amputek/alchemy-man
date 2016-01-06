


var Input = Class.$extend({
    __init__: function(){

        debug.log("Setting Up Input");


        this.allowControl = true;

        this.pressed = [];
        this.pressed.right = false;
        this.pressed.left = false;
        // this.pressed.s = false;
        this.pressed.leftmouse = false;
        this.reticule = element('reticule');
        this.mousepos = this.startpos = this.offsetpos = {x:0,y:0};
        this.shootAngle = 0;
        this.timeHeld = 30;
        this.wrapper = element('wrapper');
        this.wrapperoffset = {x:wrapper.offsetLeft, y:wrapper.offsetTop};

        reticule.style.webkitTransform = "translate3d(" + (this.wrapperoffset.x+100) + "px," + (this.wrapperoffset.y+100) + "px,0px)";

        this.wheelcooldown = 0;
    },

    addDomEvents: function(){
        $(document).mousedown( input.mouseDown );
        $(document).mouseup(   input.mouseUp   );
        $(document).mousemove( input.mouseMove );
        $(document).keydown(   input.keyDown   );
        $(document).keyup(     input.keyUp     );
        $(document).mousewheel(input.wheel     );
    },



    wheel : function(e){
        if(input.wheelcooldown <= 0){
            var delta = e.deltaY;
            if( delta > 15  ){
                if( playerweapon.currentlySelected == "fire" ){
                    playerweapon.make( true, "ice")
                    input.wheelcooldown = 60;
                    setTimeout(function(){ input.wheelcooldown = 0 }, 200)
                } else if( playerweapon.currentlySelected == "ice" ){
                    playerweapon.make( true, "acid")
                    input.wheelcooldown = 60;
                    setTimeout(function(){ input.wheelcooldown = 0 }, 200)
                } else if( playerweapon.currentlySelected == "acid" ){
                    playerweapon.make( true, "fire")
                    input.wheelcooldown = 60;
                    setTimeout(function(){ input.wheelcooldown = 0 }, 200)
                }
            } else if( delta < -15){
                if( playerweapon.currentlySelected == "fire" ){
                    playerweapon.make( true, "acid")
                    input.wheelcooldown = 60;
                    setTimeout(function(){ input.wheelcooldown = 0 }, 200)
                } else if( playerweapon.currentlySelected == "ice" ){
                    playerweapon.make( true, "fire")
                    input.wheelcooldown = 60;
                    setTimeout(function(){ input.wheelcooldown = 0 }, 200)
                } else if( playerweapon.currentlySelected == "acid" ){
                    playerweapon.make( true, "ice")
                    input.wheelcooldown = 60;
                    setTimeout(function(){ input.wheelcooldown = 0 }, 200)
                }
            }
        }
    },

    keyDown : function(e) {
        var code = e.keyCode;

        if(input.allowControl){
            if(code == 32){
                e.preventDefault();
                player.start('jump');
            } else if(code == 87){
                player.climb(1, -1);
            } else if(code == 83){
                player.climb(1, 1);
                // input.pressed.s = true;
            } else if(code == 68){
                player.start('right');
                input.pressed.right = true;
            } else if(code == 65){
                player.start('left');
                input.pressed.left = true;
            } else if(code == 49){
                playerweapon.make(true, "fire");
            } else if(code == 50){
                playerweapon.make(true, "ice");
            } else if(code == 51){
                playerweapon.make(true, "acid");
            }
        }
    },

    keyUp : function(e) {
        if(input.allowControl){
            var code = e.keyCode;
            if(code == 32){
                e.preventDefault();
                player.stop('jump');
            } else if(code == 87){
                player.climb(0, -1);
            } else if(code == 83){
                player.climb(0, 1)
                // input.pressed.s = false;
            } else if(code == 68){
                player.stop('right');
                input.pressed.right = false;
            } else if(code == 65){
                player.stop('left');
                input.pressed.left = false;
            } else if(code == 49){
                playerweapon.make(false,null);
            } else if(code == 50){
                playerweapon.make(false,null);
            } else if(code == 51){
                playerweapon.make(false,null);
            }
            if (input.pressed.left === true) player.start('left');
            if (input.pressed.right === true) player.start('right');
        }
    },

    mouseDown : function(e){
        if(input.inBound()){
            if(e.target.className != "button"){
                if(input.allowControl){
                    if (e.which === 1 && playerweapon.currentlySelected != null && playerweapon.cooldown <= 0) {
                        input.pressed.leftmouse = true;
                        this.timeHeld = 30;
                        input.mouseMove(e);
                        player.aim();
                    }
                }
            }
        }
    },

    mouseUp : function(e) {
        if(input.inBound()){
            if(e.target.className != "button"){
                if(input.allowControl){
                    if (e.which == 1 && playerweapon.currentlySelected != null && playerweapon.cooldown <= 0) {
                        input.timeHeld = 30;
                        input.pressed.leftmouse = false;

                        currentLevel.projectiles.add( player.shoot(input.shootAngle) );
                    }
                }
            }
        }
    },

    inBound: function(){
        return (input.mousepos.x > 0 && input.mousepos.y > 0 && input.mousepos.x < 1080 && input.mousepos.y < 540);
    },

    mouseMove : function(e){
        input.mousepos = {x: (e.pageX - input.wrapperoffset.x), y: (e.pageY - input.wrapperoffset.y)};
        if(input.inBound()) reticule.style.webkitTransform = "translate3d(" + e.pageX + "px," + e.pageY + "px,0px)";
    }
});

window.onresize = function(e) {
    input.wrapperoffset = {x:input.wrapper.offsetLeft, y:input.wrapper.offsetTop};
}
