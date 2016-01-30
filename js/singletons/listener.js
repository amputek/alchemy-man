function CreateListener(){
	var listener = new Box2D.Dynamics.b2ContactListener();

	ledge = function(character,other){
		if(other instanceof IceBlock && character.getBottom() <= other.getTop() + 5) return true;
		return character.getBottom() <= other.getTop();
	}

	getData = function(fixture){
		return fixture.GetBody().GetUserData();
	};

	iceBlock = function(character, other, contact){
		if(character instanceof Character){
			if( character.isFrozen() ) contact.SetEnabled(false)
		}
	}

	//----------------------\\
	//-----	PROJECTILE -----\\
	//----------------------\\

	projectile = function(projectile, other, contact){
		contact.SetEnabled(false);
		if( projectile instanceof Potion ){
			if( other instanceof TriggerPoint )  		    Potion_TriggerPoint(                    projectile , other )
			if( other instanceof PlatformTriggerPoint ) Potion_PlatformTriggerPoint(            projectile , other )
			if( other instanceof Character && other instanceof Player == false )				    gameplay.detonatePotionOnCharacter( projectile , other )
			if( other instanceof Floor   )				      gameplay.detonatePotionOnFloor(			projectile , other )
		}
		if( projectile instanceof Gum ){
			if( other instanceof Floor )                Gum_Floor(                    projectile, other )
			if( other instanceof Player )               Gum_Player(                   projectile, other )
		}
	}

	Potion_TriggerPoint = function(potion,triggerpoint){
		potion.kill();
		triggerpoint.spawner.kill();
	}

	Potion_PlatformTriggerPoint = function(potion,triggerpoint){
		// potion.kill();
		// contact.SetEnableilld(false)
		triggerpoint.trigger();
	}

	Gum_Player = function( gum , player ){
		player.getHit(1);
		gum.kill();
		gameplay.addExplosion( gum , "gumball", null)
	}

	Gum_Floor = function( gum, floor ){
		gameplay.addExplosion( gum , "gumball", floor );
		gum.kill();
	}



	// ------------------
	// 			FRAGMENT
	// ------------------

	fragment = function(fragment, other,contact){
		if( other instanceof Floor     ) gameplay.fragmentOnFloor( fragment, other );
		if( other instanceof Fragment  ) contact.SetEnabled(false)
		if( other instanceof Character ) gameplay.fragmentOnCharacter( fragment, other );
		contact.SetEnabled(false)
	}


	// CHARACTEr

	character = function( character, other, contact ){
		if(character instanceof GroundCharacter){
			if(other instanceof Floor) Character_Floor( character, other, contact )
		}
		if(character instanceof ClimbingCharacter){
			if(other instanceof Ladder) Character_Ladder( character, other, contact )
		}
		if(character instanceof Gumball){
			if( other instanceof Gumball ) Gumball_Gumball( character, other )
			if( other instanceof Floor   ) Gumball_Floor( character, other )
			if( other instanceof Player  ) contact.SetEnabled(false)
		}
		if( character instanceof Chomper ){
			if( other instanceof Floor     ) character.turn();
			if( other instanceof Character ) contact.SetEnabled(false);
			if( other instanceof Chomper   ) Chomper_Chomper( character, other );
		}
		if(character instanceof Player ){
			if( other instanceof PlatformTriggerPoint ){


				other.trigger();

				contact.SetEnabled(false);
			}
			if( other instanceof Gumball              ) contact.SetEnabled(false)
		}
		if( other instanceof Character ) contact.SetEnabled( false )
	}

	Character_Floor =  function( character, floor, contact ){
		if( floor instanceof Floor && ledge(character,floor) ) character.addPlatform(floor);
	}

	Character_Ladder =  function( character, ladder, contact ){
		contact.SetEnabled(false);
		character.ladder( true , character.physicspos.y < ladder.getTop() + 5 , ladder );
	}


	Gumball_Gumball = function( a, b ){
		if(a.state == "dying" || b.state == "dying"){
			a.getHit(5);
			b.getHit(5);
		}
	}

	Gumball_Floor = function( gumball, floor ){
		if(gumball.state == "dying") gumball.state = "dead"
	}

	Chomper_Chomper = function( a, b){
		a.turn();
		b.turn();
	}



	// OVERRRIDE LISTENER METHODS
	listener.BeginContact = function(contact){
		var a = getData( contact.GetFixtureA() );
		var b = getData( contact.GetFixtureB() );
		if( a instanceof Character )  character(  a , b , contact );
		if( b instanceof Character )  character(  b , a , contact );
		if( a instanceof Fragment )   fragment(   a , b , contact );
		if( b instanceof Fragment )   fragment(   b , a , contact );
		if( a instanceof Projectile ) projectile( a , b , contact );
		if( b instanceof Projectile ) projectile( b , a , contact );
		if( a instanceof IceBlock )   iceBlock(   b , a , contact );
		if( b instanceof IceBlock )   iceBlock(   a , b , contact );
	};

	listener.EndContact = function(contact){
		var a = getData( contact.GetFixtureA() );
		var b = getData( contact.GetFixtureB() );

		contact.SetEnabled(true);

		var character = null;
		var other = null;
		if( a instanceof Character){
			character = a;
			other = b;
		} else if( b instanceof Character){
			character = b;
			other = a;
		}

		if( character !== null ){
			if( character instanceof GroundCharacter   && other instanceof Floor )	character.removePlatform( other );
			if( character instanceof ClimbingCharacter && other instanceof Ladder)	character.ladder(false, character.physicspos.y < other.physicspos.y-other.physicssize.h+5, other);
		}
	};


	listener.PreSolve = function(contact, oldManifold){
		var a = getData( contact.GetFixtureA() );
		var b = getData( contact.GetFixtureB() );

		var character = null;
		var other = null;
		if( a instanceof Character){
			character = a;
			other = b;
		} else if( b instanceof Character){
			character = b;
			other = a;
		}

		if(a instanceof Character && b instanceof Character) contact.SetEnabled(false)

		if( character !== null ){
			if( other instanceof Character ) contact.SetEnabled(false)
			if( other instanceof Ladder) contact.SetEnabled(false);
			if( character instanceof Gumball && other instanceof Platform ) contact.SetEnabled(false)
			if( other instanceof IceBlock && character.isFrozen() ) contact.SetEnabled(false);
		}

		if( a instanceof Projectile           || b instanceof Projectile           ) contact.SetEnabled(false);
		if( a instanceof TriggerPoint         || b instanceof TriggerPoint         ) contact.SetEnabled(false);
		if( a instanceof PlatformTriggerPoint || b instanceof PlatformTriggerPoint ) contact.SetEnabled(false);
	};

	return listener;
}
