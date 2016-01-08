

var ImageManager = Class.$extend({

	//this should take a callback?
	__init__: function( callback ){

		this.finishedLoadingCallback = callback;


		this.numImages = 0;
		this.totalImages = 0;

		this.potion = [];
		this.potion.fire       = this.createImage('images/potions/bottle_fire.png');
		this.potion.ice        = this.createImage('images/potions/bottle_ice.png');
		this.potion.poison     = this.createImage('images/potions/bottle_acid.png');
		this.potion.shine			 = this.createImage('images/potions/bottle_shine.png')

		this.gum = [];
		this.gum[0]  		= this.createImage('images/potions/gumballs/red.png');
		this.gum[1]  	  = this.createImage('images/potions/gumballs/green.png');
		this.gum[2]			= this.createImage('images/potions/gumballs/blue.png');
		this.gum[3]		  = this.createImage('images/potions/gumballs/yellow.png');

		this.player = [];
		this.player.idle         = this.createImage('images/character/idle.png');
		this.player.run          = this.createImage('images/character/run.png');
		this.player.takeoffrun   = this.createImage('images/character/takeoff-run.png');
		this.player.takeoffstill = this.createImage('images/character/takeoff-still.png');
		this.player.hover        = this.createImage('images/character/hover.png');
		this.player.landrun      = this.createImage('images/character/land-run.png');
		this.player.landstill    = this.createImage('images/character/land-still.png');
		this.player.damage       = this.createImage('images/character/damage.png');
		this.player.death        = this.createImage('images/character/death.png');
		this.player.climb        = this.createImage('images/character/climb.png');
		this.player.idle_aim 			 = this.createImage('images/character/idle_aim.png');
		this.player.idle_release 	 = this.createImage('images/character/idle_release.png');

		this.arm = [];
		this.arm.idle   			 = this.createImage('images/character/arm/idle.png');
		this.arm.run    			 = this.createImage('images/character/arm/run.png');
		this.arm.run_aim 			 = this.createImage('images/character/arm/run_aim.png');
		this.arm.run_release 	 = this.createImage('images/character/arm/run_release.png');
		this.arm.idle_aim 			 = this.createImage('images/character/arm/idle_aim.png');
		this.arm.idle_release 	 = this.createImage('images/character/arm/idle_release.png');


		this.chomper = [];
		this.chomper.idle      = this.createImage('images/enemy/idle.png')
		this.chomper.walk      = this.createImage('images/enemy/walk.png')
		this.chomper.dead      = this.createImage('images/enemy/dead.png')
		this.chomper.attack    = this.createImage('images/enemy/attack.png')

		this.gumball = [];
		this.gumball.body  		= this.createImage('images/enemy/body.png');
		this.gumball.waft  		= this.createImage('images/enemy/g-waft.png');
		this.gumball.idle			= this.createImage('images/enemy/g-idle.png');
		this.gumball.cannon		= this.createImage('images/enemy/cannon.png')

		this.creeper = [];
		this.creeper.idle 		= this.createImage('images/enemy/creeper.png');

		// ENVIRONMENT


		this.backdrop = [];
		this.backdrop.sunset      = this.createImage('images/sunset.jpg');
		this.backdrop.factory     = this.createImage('images/factory.jpg');

		this.env = [];

		this.env.support_top 	    = this.createImage('images/environment/support/support_top.png');
		this.env.support_high 	  = [];
		this.env.support_high[0]  = this.createImage('images/environment/support/support_high_0.png');
		this.env.support_high[1]  = this.createImage('images/environment/support/support_high_1.png');
		this.env.support_high[2]  = this.createImage('images/environment/support/support_high_2.png');
		this.env.support_low 		  = [];
		this.env.support_low[0]   = this.createImage('images/environment/support/support_low_0.png')
		this.env.support_low[1]   = this.createImage('images/environment/support/support_low_1.png')
		this.env.support_low[2]   = this.createImage('images/environment/support/support_low_2.png')
		this.env.support_low[3]   = this.createImage('images/environment/support/support_low_3.png')
		this.env.support_base     = this.createImage('images/environment/support/support_base.png')

		this.env.boxpile_1_1 			= [];
		this.env.boxpile_1_1[0]   = this.createImage('images/environment/ledges/boxpile_1_1_0.png')
		this.env.boxpile_1_1[1]   = this.createImage('images/environment/ledges/boxpile_1_1_1.png')
		this.env.boxpile_1_1[2]   = this.createImage('images/environment/ledges/boxpile_1_1_2.png')
		this.env.boxpile_1_1[3]   = this.createImage('images/environment/ledges/boxpile_1_1_3.png')
		this.env.boxpile_1_2 			= [];
		this.env.boxpile_1_2[0]   = this.createImage('images/environment/ledges/boxpile_1_2_0.png');
		this.env.boxpile_1_2[1]   = this.createImage('images/environment/ledges/boxpile_1_2_1.png');
		this.env.boxpile_1_2[2]   = this.createImage('images/environment/ledges/boxpile_1_2_2.png');
		this.env.boxpile_1_3      = this.createImage('images/environment/ledges/boxpile_1_3_0.png')
		this.env.boxpile_1_4      = [];
		this.env.boxpile_1_4[0]   = this.createImage('images/environment/ledges/boxpile_1_4_0.png')
		this.env.boxpile_1_4[1]   = this.createImage('images/environment/ledges/boxpile_1_4_1.png')
		this.env.boxpile_1_5      = this.createImage('images/environment/ledges/boxpile_1_5.png')
		this.env.boxpile_1_6      = this.createImage('images/environment/ledges/boxpile_1_6.png')
		this.env.boxpile_2_2	    = this.createImage('images/environment/ledges/boxpile_2_2.png')
		this.env.boxpile_2_4	    = this.createImage('images/environment/ledges/boxpile_2_4.png');
		this.env.boxpile_2_2_blur	= this.createImage('images/environment/ledges/boxpile_2_2_blur.png')
		this.env.boxpile_3_2	    = this.createImage('images/environment/ledges/boxpile_3_2a.png')
		this.env.boxpile_4_2_blur	= this.createImage('images/environment/ledges/boxpile_4_2_blur.png')
		this.env.boxpile_4_2_blur2 = this.createImage('images/environment/ledges/boxpile_4_2_blur2.png')
		this.env.conveyer			    = this.createImage('images/environment/ledges/conveyer.png');
		this.env.toyrack			    = this.createImage('images/environment/ledges/toy-rack.png')
		this.env.movingplatform   = this.createImage('images/environment/ledges/moving.png')
		this.env.scaffold         = this.createImage('images/doodods/scaffold.png')

		this.env.triggered = [];
		this.env.triggered.left             = this.createImage('images/environment/triggered/left.png' )
		this.env.triggered.right            = this.createImage('images/environment/triggered/right.png')
		this.env.triggered.main             = this.createImage('images/environment/triggered/main.png' )
		this.env.triggered.decoration_left  = this.createImage('images/environment/triggered/decoration_left.png' )
		this.env.triggered.decoration_right = this.createImage('images/environment/triggered/decoration_right.png' )
		this.env.triggered.chain            = this.createImage('images/environment/triggered/chain.png' )
		this.env.triggered.chain_bottom     = this.createImage('images/environment/triggered/chain_bottom.png' )

		this.env.brick_middle = [];
		this.env.brick_middle[0]			= this.createImage('images/environment/brick/brick_middle_0.png');
		this.env.brick_middle[1]			= this.createImage('images/environment/brick/brick_middle_1.png');
		this.env.brick_middle[2]			= this.createImage('images/environment/brick/brick_middle_2.png');
		this.env.brick_left = [];
		this.env.brick_left[0]       	= this.createImage('images/environment/brick/brick_left_0.png');
		this.env.brick_right = [];
		this.env.brick_right[0]	    	= this.createImage('images/environment/brick/brick_right_0.png');
		this.env.brick_bottom 				= [];
		this.env.brick_bottom[0]     	= this.createImage('images/environment/brick/brick_bottom_0.png');
		this.env.brick_bottom[1]     	= this.createImage('images/environment/brick/brick_bottom_1.png');
		this.env.brick_left_bottom    = this.createImage('images/environment/brick/brick_left_bottom.png');
		this.env.brick_right_bottom   = this.createImage('images/environment/brick/brick_right_bottom.png');
		this.env.brick_exposed       	= this.createImage('images/environment/brick/brick_exposed3.png');
		this.env.brick_column_middle = [];
		this.env.brick_column_middle[0] 	= this.createImage('images/environment/brick/column/brick_middle_0.png');
		this.env.brick_column_middle[1] 	= this.createImage('images/environment/brick/column/brick_middle_1.png');
		this.env.brick_column_middle[2] 	= this.createImage('images/environment/brick/column/brick_middle_2.png');
		this.env.brick_column_bottom 		  = this.createImage('images/environment/brick/column/brick_bottom.png');

		this.env.jumpbox       	= this.createImage('images/environment/jumpbox.png');

		this.env.floorboard_left = [];
		this.env.floorboard_left[0]	 = this.createImage('images/environment/floorboard/newfloorboard_left_0.png')
		this.env.floorboard_left[1]  = this.createImage('images/environment/floorboard/newfloorboard_left_1.png')
		this.env.floorboard_left[2]  = this.createImage('images/environment/floorboard/newfloorboard_left_2.png')
		this.env.floorboard_left[3]  = this.createImage('images/environment/floorboard/newfloorboard_left_3.png')
		this.env.floorboard_leftend  = this.createImage('images/environment/floorboard/newfloorboard_leftend.png')
		this.env.floorboard_right = [];
		this.env.floorboard_right[0] = this.createImage('images/environment/floorboard/newfloorboard_right_0.png');
		this.env.floorboard_right[1] = this.createImage('images/environment/floorboard/newfloorboard_right_1.png')
		this.env.floorboard_right[2] = this.createImage('images/environment/floorboard/newfloorboard_right_2.png');
		this.env.floorboard_rightend = this.createImage('images/environment/floorboard/newfloorboard_rightend.png')

		this.env.girder = this.createImage('images/environment/girder.png')

		this.env.mobspawner_alive = this.createImage('images/environment/mobspawner_new_alive.png')
		this.env.mobspawner_dead = this.createImage('images/environment/mobspawner_new_dead.png')

		this.env.mobspawner_spit   = this.createImage('images/environment/spawner/spit.png');
		this.env.mobspawner_base   = this.createImage('images/environment/spawner/base.png');
		this.env.mobspawner_feeder = this.createImage('images/environment/spawner/feeder.png');

		// DOODADS

		this.doodad = [];
		this.doodad.lampfitting_l = this.createImage('images/doodods/lampfitting_left.png');
		this.doodad.lampfitting_r = this.createImage('images/doodods/lampfitting_right.png');
		this.doodad.boiler      = this.createImage('images/doodods/boiler2.png');
		this.doodad.gen  			  = this.createImage('images/doodods/generator2.png')
		this.doodad.gen_fore	  = this.createImage('images/doodods/generator4.png')
		this.doodad.drawers     = this.createImage('images/doodods/drawers1.png')
		this.doodad.pipe_hor           = []
		this.doodad.pipe_hor[0]        = this.createImage('images/doodods/pipe/new/hor_0.png')
		this.doodad.pipe_hor[1]        = this.createImage('images/doodods/pipe/new/hor_1.png')
		this.doodad.pipe_hor[2]        = this.createImage('images/doodods/pipe/new/hor_2.png')
		this.doodad.pipe_hor[3]        = this.createImage('images/doodods/pipe/new/hor_3.png')
		this.doodad.pipe_hor[4]        = this.createImage('images/doodods/pipe/new/hor_4.png')
		this.doodad.pipe_bottom        = this.createImage('images/doodods/pipe/new/bottom.png')
		this.doodad.pipe_top           = this.createImage('images/doodods/pipe/new/top.png')
		this.doodad.pipe_vert          = []
		this.doodad.pipe_vert[0]       = this.createImage('images/doodods/pipe/new/vert_0.png')
		this.doodad.pipe_vert[1]       = this.createImage('images/doodods/pipe/new/vert_1.png')
		this.doodad.pipe_vert[2]       = this.createImage('images/doodods/pipe/new/vert_2.png')
		this.doodad.pipe_vert[3]       = this.createImage('images/doodods/pipe/new/vert_3.png')
		this.doodad.pipe_vert[4]       = this.createImage('images/doodods/pipe/new/vert_4.png')
		this.doodad.pipe_left          = this.createImage('images/doodods/pipe/new/left.png')
		this.doodad.pipe_right         = this.createImage('images/doodods/pipe/new/right.png')
		this.doodad.pipe_bottom_right  = [];
		this.doodad.pipe_bottom_right[0]  = this.createImage('images/doodods/pipe/new/bottom_right_0.png')
		this.doodad.pipe_bottom_right[1]  = this.createImage('images/doodods/pipe/new/bottom_right_1.png')
		this.doodad.pipe_bottom_right[2]  = this.createImage('images/doodods/pipe/new/bottom_right_2.png')
		this.doodad.pipe_bottom_left      = [];
		this.doodad.pipe_bottom_left[0]   = this.createImage('images/doodods/pipe/new/bottom_left_0.png')
		this.doodad.pipe_bottom_left[1]   = this.createImage('images/doodods/pipe/new/bottom_left_1.png')
		this.doodad.pipe_bottom_left[2]   = this.createImage('images/doodods/pipe/new/bottom_left_2.png')
		this.doodad.pipe_top_right        = [];
		this.doodad.pipe_top_right[0]     = this.createImage('images/doodods/pipe/new/top_right_0.png')
		this.doodad.pipe_top_right[1]     = this.createImage('images/doodods/pipe/new/top_right_1.png')
		this.doodad.pipe_top_right[2]     = this.createImage('images/doodods/pipe/new/top_right_2.png')
		this.doodad.pipe_top_left         = [];
		this.doodad.pipe_top_left[0]      = this.createImage('images/doodods/pipe/new/top_left_0.png')
		this.doodad.pipe_top_left[1]      = this.createImage('images/doodods/pipe/new/top_left_1.png')
		this.doodad.pipe_top_left[2]      = this.createImage('images/doodods/pipe/new/top_left_2.png')
		this.doodad.pile   		  = this.createImage('images/doodods/pile.png')
		this.doodad.poster = [];
		this.doodad.poster[0]		= this.createImage('images/doodods/poster_0.png');
		this.doodad.poster[1]		= this.createImage('images/doodods/poster_1.png');
		this.doodad.poster[2]		= this.createImage('images/doodods/poster_2.png');
		this.doodad.poster[3]		= this.createImage('images/doodods/poster_3.png');
		this.doodad.poster[4]		= this.createImage('images/doodods/poster_4.png');
		this.doodad.door    		= this.createImage('images/doodods/door.png');
		this.doodad.door_open		= this.createImage('images/doodods/door_open.png');
		this.doodad.bg_platform = [];
		this.doodad.bg_platform[0]	= this.createImage('images/doodods/bg_platform_0.png');
		this.doodad.bg_platform[1]	= this.createImage('images/doodods/bg_platform_1.png');
		this.doodad.bg_platform[2]	= this.createImage('images/doodods/bg_platform_2.png');
		this.doodad.lamp 			  = this.createImage('images/doodods/lamp.png');
		this.doodad.lamp_blur   = this.createImage('images/doodods/lamp_blur.png');

		this.doodad.premade		  = this.createImage('images/doodods/premade.png');

		this.doodad.crafting_used 	 = this.createImage('images/doodods/crafting/used.png');
		this.doodad.crafting_fire  	 = this.createImage('images/doodods/crafting/fire.png');
		this.doodad.crafting_ice		 = this.createImage('images/doodods/crafting/ice.png');
		this.doodad.crafting_acid		 = this.createImage('images/doodods/crafting/ice.png');


		this.doodad.lever_ground_off = this.createImage('images/doodods/lever/ground_off.png')
		this.doodad.lever_ground_on  = this.createImage('images/doodods/lever/ground_on.png')
		this.doodad.lever_wall_off   = this.createImage('images/doodods/lever/wall_off.png')
		this.doodad.lever_wall_on    = this.createImage('images/doodods/lever/wall_on.png')

		this.fx = [];

		this.fx.junk = [];
		this.fx.junk[0] 					 = this.createImage('images/fx/junk/1.png')
		this.fx.junk[1] 					 = this.createImage('images/fx/junk/2.png')
		this.fx.junk[2] 					 = this.createImage('images/potions/gumballs/red.png')
		this.fx.junk[3] 					 = this.createImage('images/potions/gumballs/blue.png')
		this.fx.junk[4] 					 = this.createImage('images/potions/gumballs/green.png')
		this.fx.junk[5] 					 = this.createImage('images/potions/gumballs/yellow.png')

		this.fx.fireR          = this.createImage('images/fx/fire/fire-r.png');
		this.fx.fireL          = this.createImage('images/fx/fire/fire-l.png');
		this.fx.firerightwall	 = this.createImage('images/fx/fire/rightwall.png');
		this.fx.fireleftwall	 = this.createImage('images/fx/fire/leftwall.png')
		this.fx.firesmall      = this.createImage('images/fx/fire/fire-small.png');
		this.fx.fire_explosion = this.createImage('images/fx/fire/explosion.png');
		this.fx.fire_explosion_gen = this.createImage('images/fx/fire/explosion-gen.png')
		this.fx.scorched 					 = this.createImage('images/fx/fire/scorched.png');

		this.fx.genericfire    = this.createImage('images/fx/fire/fire-generic.png');

		this.fx.water					 = this.createImage('images/fx/water.png');

		this.fx.acid_small		 = this.createImage('images/fx/acid/acid-small.png');
		this.fx.acid					 = this.createImage('images/fx/acid/acid.png');
		this.fx.acidleft  		 = this.createImage('images/fx/acid/acid-left.png');
		this.fx.acidright  		 = this.createImage('images/fx/acid/acid-right.png');
		this.fx.aciddrip			 = this.createImage('images/fx/acid/drip.png');
		this.fx.acid_explosion = this.createImage('images/fx/acid/explosion-small.png');
		this.fx.acid_explosion_gen = this.createImage('images/fx/acid/explosion-gen.png');

		this.fx.ember					 = this.createImage('images/fx/fire/ember.png')
		this.fx.cog 					 = this.createImage('images/fx/cog.png');
		this.fx.gumball_explosion = this.createImage('images/fx/gumball_explosion.png')

		this.fx.ice_grow        = this.createImage('images/fx/ice/grow.png');
		this.fx.ice_melt				= this.createImage('images/fx/ice/melt.png');
		this.fx.ice_frozen  		= this.createImage('images/fx/ice/frozen.png');

		this.fx.ice_shard = [];
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-0.png') )
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-1.png') )
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-2.png') )
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-3.png') )
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-4.png') )
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-5.png') )
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-6.png') )
		this.fx.ice_shard.push( this.createImage('images/fx/ice/shard-7.png') )

		this.tooltip = this.createImage('images/tooltip.png')

		this.cannon = this.createImage('images/potions/cannon.png')

	},

	createImage : function(src){
		this.totalImages++;
		return this.loadImage(src);
	},

	loadImage : function(src){
		img = new Image();

		img.src = src;

		img.onload = function(){
			images.numImages++;
			if( images.numImages === images.totalImages ) images.finishedLoadingCallback();
		}

		img.onerror = function(){
			setTimeout(function(){
				debug.log("Image at " + src + " not found")
			},1500);
		}

		return img;

	},

});
