var TAG_PLANE = 12345;
var TAG_STAR = 11111;
var TAG_HEART = 22222;
var TAG_ENEMY_PLANE = 33333;


var audioEngine = cc.AudioEngine.getInstance();

var Plane = cc.Sprite.extend({
    _radius:12, // collide radius
    _rotation:0,
    _updateSpeed:0,
    _auraOrb:null,
    _bubbleOrb:null,
    _orbs:[],

    ctor:function(){
		this._super();
		this.initWithFile(s_red_plane);
		this.setAnchorPoint(cc.p(0.5,0.5));
    },
    onEnter:function(){
    	
		this.addOrb('bubble');
	 
    },

    update:function(dt){

		// var RotateAction  = cc.RotateTo.create(0.01,this._rotation);
		// var moveAction = cc.MoveBy.create(60, cc.p((90-this._rotation)/15,0));
		// var actions = cc.Sequence.create(RotateAction,moveAction);
		// cc.log("rotation", this._rotation);
		// this.runAction(actions); // duration must be smaller than dt??
		this.setPositionX(this.getPositionX() + (90-this._rotation)/5);
    },
    
    getUpdateSpeed:function(){
		if (this._rotation < 90) {
		    this._updateSpeed = this._rotation / 5 ;
		}
		if (this._rotation > 91) {
		    this._updateSpeed = (180 -  this._rotation) / 5 ;
		}	

		return this._updateSpeed;
    },

    addOrb:function(type){

    	switch(type) {
    		case 'aura':
    			if (!this._auraOrb) {
		 			this._auraOrb = new auraOrb(); //cc.Sprite.create(s_gameWall);//new GameWall();
					this.addChild(this._auraOrb,-2);
					this._auraOrb.setAnchorPoint(cc.p(0.5,0.5));
					var oContentsize = this._auraOrb.getContentSize();
					this._auraOrb.setPosition(cc.p(-oContentsize.with/2,-oContentsize.height/2));

					this._orbs.push(this._auraOrb);
		 		}

		 		break;

		 	case 'bubble':
    			if (!this._bubbleOrb) {
		 			this._bubbleOrb = new bubbleOrb(); //cc.Sprite.create(s_gameWall);//new GameWall();
					this.addChild(this._bubbleOrb,-2);
					this._bubbleOrb.setAnchorPoint(cc.p(0.5,0.5));
					var oContentsize = this._bubbleOrb.getContentSize();
					this._bubbleOrb.setPosition(cc.p(-oContentsize.with/2,-oContentsize.height/2));

					this._orbs.push(this._bubbleOrb);
		 		}

		 		break;

		 	
		 	default:
		 		break;
    	}
 		

    },

    removeOrb:function(type){

    	switch(type) {
    		case 'aura':
    			if (this._auraOrb) {
		 			this._auraOrb.setVisible(false);
		 			this._auraOrb.removeFromParent(true);
					this._auraOrb = null;
		 		}

		 		break;

		 	case 'bubble':
    			if (this._bubbleOrb) {
		 			this._bubbleOrb.setVisible(false);
		 			this._bubbleOrb.removeFromParent(true);
					this._bubbleOrb = null;
		 		}

		 		break;

		 	default:
		 		break;
    	}
 		
    },

    addRotation:function(d){
		this._rotation += d;
		this.setRotation(this._rotation);
    },
 
    checkHitEdge: function () {
		var hit = false;
        var winSize = cc.Director.getInstance().getWinSize();
		var curPosX = this.getPositionX();
		if (curPosX > (winSize.width - this._radius - 22) ||  curPosX < this._radius) {
		    hit = true;
		}

		return hit;
    },

    collide: function (gameObject) {
		var oContentsize = gameObject.getContentSize();
		var oPos = gameObject.getPosition();
		var curPos = this.getPosition();
			       
		return this.ComputeCollision(oContentsize.width, oContentsize.height, 
			this._radius, 
			Math.abs(oPos.x - curPos.x), Math.abs(oPos.y -curPos.y));
    },
 
    ComputeCollision:function(w, h, r, rx, ry) {
        var dx = Math.min(rx, w * 0.5);
        var dx1 = Math.max(dx, -w * 0.5);
        var dy = Math.min(ry, h * 0.5);
        var dy1 = Math.max(dy, -h * 0.5);

        return (dx1 - rx) * (dx1 - rx) + (dy1 - ry) * (dy1 - ry) <= r * r;
    }
});

var EnemyPlane = Plane.extend({
	ctor:function(color){
		this._super();
		if (color == 'green') {
			this.initWithFile(s_paper_plane_dark_green);
		} else { //if () {
			this.initWithFile(s_paper_plane_light_orange);
		}
		
		this.setAnchorPoint(cc.p(0.5,0.5));
    }
});

var Item = cc.Sprite.extend({
    ctor:function(){
		this._super();
		this.initWithFile(s_heart);
		this.setAnchorPoint(cc.p(0.5,0.5));
	},
    move:function(){	 
		var acMoveUp = cc.MoveTo.create(0,cc.p(0,10));
        var acDelay = cc.DelayTime.create(1);
        var acMoveDown = cc.MoveTo.create(0,cc.p(0,0));
        var action = cc.Sequence.create(acMoveUp,acDelay,acMoveDown);

		this.runAction(cc.RepeatForever.create(action));
    },
    checkIfOutOfScreen:function(){
		var curPosY = this.getPositionY();
		if(curPosY >= g_winSize.height){
		}
    },

    remove:function(){
    	this.setVisible(false);
		this.removeFromParent(true);
	}
});

var Heart = Item.extend({
	ctor:function(color){
		this._super();
		this.initWithFile(s_heart); 
		this.setAnchorPoint(cc.p(0.5,0.5));

		this.name = "Heart";
    }
});

var Star = Item.extend({
	ctor:function(color){
		this._super();
		this.initWithFile(s_star_item); 
		this.setAnchorPoint(cc.p(0.5,0.5));

		this.name = "Star";
    }
});

var Orb = Item.extend({
	_checked:false,
    ctor:function(color){
		this._super();
		this.initWithFile(s_normal_orb); 
		this.setAnchorPoint(cc.p(0.5,0.5));
		this.duration = 20000;
		this.start = Date.now();
    },

    update:function(){
    	this.now = Date.now();
    	if (this.now - this.start > this.duration){
    		//time out orb

    	}
    },
    resetBoard:function(){
		this._checked = false;
    },
    setChecked:function(){
		this._checked = true;
    },
    isChecked:function(){
		return this._checked;
	}
});

var auraOrb = Orb.extend({
	ctor:function(color){
		this._super();
		this.initWithFile(s_aura_orb); 
		this.setAnchorPoint(cc.p(0.5,0.5));

		this.name = "auraOrb";
    } 
});

var bubbleOrb = Orb.extend({
	ctor:function(color){
		this._super();
		this.initWithFile(s_bubble_orb); 
		this.setAnchorPoint(cc.p(0.5,0.5));

		this.name = "bubbleOrb";
    } 
});

var GameCloud = cc.Sprite.extend({
    onEnter:function(){
		this._super();
		this.initWithFile(s_gameCloud);
		// var moveUp = cc.MoveBy.create(1,cc.p(0,10));
		// this.runAction(cc.RepeatForever.create(moveUp));
    },
    checkIfOutOfScreen:function(){
		var curPosY = this.getPositionY();
		if(curPosY >= g_winSize.height){
		}
    }
});

var GameBoard = cc.Sprite.extend({
    _checked:false,
    ctor:function(){
		this._super();
		this.initWithFile(s_gameBoard);
		// this.setContentSize(g_winSize);
		// var moveUp = cc.MoveBy.create(1, cc.p(0,20));
		// this.runAction(cc.RepeatForever.create(moveUp));

		// cc.log("contentsize & winsize", [this.getContentSize(), g_winSize]);
    },
    resetBoard:function(){
		this._checked = false;
    },
    setChecked:function(){
		this._checked = true;
    },
    isChecked:function(){
		return this._checked;
	}
});

var GameWall = cc.Sprite.extend({
    ctor:function(){
		this._super();
		this.initWithFile(s_gameWall);
	//	this.setAnchorPoint(cc.p(0,0));
		// this.setContentSize(cc.size(g_winSize.width, g_winSize.height);
		this.setPosition(cc.p(0,0));
		this.setScaleX(1.1);
		this.setContentSize(g_winSize);
    }
});

var GameLayer = cc.Layer.extend({
    _wall1:null,
    _wall2:null,
    _cloud:null, //TODO
    _plane:null,
    _boards:[],
    _orb:[],
 	_items:[],
    _score:0,
  	_distance:0,
    _bestScore:0,
    _labelScore:null,
    isPressed:false,

    ctor:function(){
		this._super();
		/*
        if( 'keyboard' in sys.capabilities ) {
	    	cc.log("keyboard ok");
           this.setKeyboardEnabled(true);
        } else {
            cc.log("KEYBOARD Not supported");
        }*/

        if( 'touches' in sys.capabilities ) {
		    this.setTouchEnabled(true);
		    cc.log("touches ok");
		}
		if( 'mouse' in sys.capabilities ) {
		    this.setMouseEnabled(true);
		    cc.log("mouse ok");
		}

		////////////////////////////////////////////////////////////////////////////////
		// walls
		this._wall1 = new GameWall();
		this.addChild(this._wall1,-1);
		this._wall1.setAnchorPoint(cc.p(0,0));
		this._wall1.setPosition(cc.p(0,0));

		this._wall2 = new GameWall(); //cc.Sprite.create(s_gameWall);//new GameWall();
		this.addChild(this._wall2,-2);
		this._wall2.setAnchorPoint(cc.p(0,1));
		this._wall2.setPosition(cc.p(0,0));

		////////////////////////////////////////////////////////////////////////////////
		// cloud
		this._cloud = new GameCloud();
		this._cloud.setPosition(cc.p(g_winSize.width/2, 0));
		
		this.addChild(this._cloud,1);

		////////////////////////////////////////////////////////////////////////////////
		// boards
		for(var i = 0;i <3;i++){
		    this._boards[i] = new GameBoard();
		    this._boards[i].setPosition(cc.p((Math.random() * g_winSize.width),
						     (i-2) * g_winSize.height/ 2));
		    this.addChild(this._boards[i],2);
		}
 
		////////////////////////////////////////////////////////////////////////////////
		// plane
		this._plane = new Plane();
		this._plane.setPosition(cc.p(g_winSize.width/2, g_winSize.height - 90));
		this._plane.collide(this._cloud);
		this.addChild(this._plane,3, TAG_PLANE);

		this._labelScore = cc.LabelTTF.create("Score:0",  'Arial', 32, cc.size(320,32), cc.TEXT_ALIGNMENT_LEFT);
		this._labelScore.setColor(new cc.Color3B(0,0,255));
		this.addChild(this._labelScore,7);
		this._labelScore.setAnchorPoint(cc.p(0,0));
		this._labelScore.setPosition(cc.p(20, g_winSize.height - 32));

		////////////////////////////////////////////////////////////////////////////////
		// music
		audioEngine.preloadMusic(s_sound_bg);
		audioEngine.preloadEffect(s_sound_over);
		this.scheduleOnce(function(){audioEngine.playMusic(s_sound_bg,true);});

		// update
		this.schedule(this.update,0.1);
		// this.scheduleUpdate();

    },

    addOrb :function(){
    	/////////////////////////////////////////////////////////////////////////////////
		// orb
		for (var i = 0;i <3;i++) {
		    this._orb[i] = new Orb();
		    this._orb[i].setPosition(cc.p((Math.random() * g_winSize.width),
						     (i-2) * g_winSize.height/ 2));
		    this.addChild(this._orb[i],2);
		}

	},

	addHeart :function(){
    	/////////////////////////////////////////////////////////////////////////////////
		// add item in game 
		this._heart = new Heart();
		this._heart.setPosition(cc.p((Math.random() * g_winSize.width), (Math.random() * g_winSize.height/2) ));
	
		this.addChild(this._heart, 2, TAG_HEART);
	},

	addStar :function(){
   
		this._star = new Star();
		this._star.setPosition(cc.p((Math.random() * g_winSize.width), (Math.random() * g_winSize.height/2)));
	
		this.addChild(this._star, 2, TAG_STAR);

	},

    update:function(dt){
		// cc.log("dt",dt);
		// var plane = this.getChildByTag(TAG_PLANE); // for test purpose

		this._plane.update(dt);

		// update background
		var updateSpeed = this._plane.getUpdateSpeed();
		// cc.log("updateSpeed", updateSpeed);
		this._cloud.setPositionY(this._cloud.getPositionY() + updateSpeed);
		this._wall1.setPositionY(this._wall1.getPositionY() + updateSpeed);
		this._wall2.setPositionY(this._wall2.getPositionY() + updateSpeed);
		
		if (this._wall1.getPositionY() >= g_winSize.height) {
		    this._wall1.setPositionY(0);
		}
		if (this._wall2.getPositionY() >= g_winSize.height) {
		    this._wall2.setPositionY(0);
		}

		// hold press
		if (pressPosition) {
			this.locationTapped(pressPosition);
		}
		
		////////////////////////////////////////////////////////////////////////////////
		// collision check
		if(this._plane.checkHitEdge()){
		    this.onGameOver();
		}
		
		// update score and check collision with board
		for(var i = 0;i < this._boards.length;i++){
		    var bd = this._boards[i];
		    var curPosY = bd.getPositionY();
		    bd.setPositionY(curPosY + updateSpeed + 10);

		    if (!bd.isChecked()) {
				if(curPosY > g_winSize.height -95){
				    this._score += 100;
				    this._distance += 100;
				    bd.setChecked();
				}
		    }
		    
		    if (curPosY > g_winSize.height ) {
				bd.setPositionY(- g_winSize.height / 2);
				bd.resetBoard();
				var randomX = Math.floor(Math.random()* g_winSize.width);
				bd.setPositionX(randomX);
		    }
		    if(this._plane.collide(bd)){
				this.onGameOver();
		    }

		    if (this._distance > 0 && this._distance % 1000 == 0) {
		    	this.addStar();
		    }

		    if (this._distance > 0 && this._distance % 500 == 0) {
		    	this.addHeart();
		    }
		}

		// add Orb 
		if (this._star) {
			this.addOrb('bubble');
	 
			this._star.remove();
			this._star = null;
		}

		if (this._heart) {
			this.addOrb('aura');
	 
			this._heart.remove();
			this._heart = null;
		}

		// orb logic
		var count_visible = 0;
		for (var i = 0;i < this._orb.length;i++) {

			var bd = this._orb[i];
		    var curPosY = bd.getPositionY();
		    bd.setPositionY(curPosY + updateSpeed + 10);
 
 			if (!bd.isChecked()) {
				if(curPosY > g_winSize.height -95){
				    this._score += 20;
				    bd.setChecked();
				}
		    }

		    if (curPosY > g_winSize.height ) {
				bd.setPositionY(- g_winSize.height / 2);
				bd.resetBoard();
				var randomX = Math.floor(Math.random()*10);
				if (randomX > 5) {
					bd.setPositionX(randomX);
				}
				else {
					bd.setVisible(false);
				}
		    }

		    var isVisible = bd.isVisible();
		    if (isVisible) {
		    	count_visible += 1;
		    }
		}

		// reset visible orbs
		if (count_visible == this._orb.length) {
			for (var i = 0;i < this._orb.length;i++) {
				var bd = this._orb[i];
				bd.setVisible(true);
			}
		}

		////////////////////////////////////////////////////////////////////////////////
		// score
		this._labelScore.setString("Score: " + this._score);
    },

    onGameOver:function(){
		// explosion effect
		this._plane.setVisible(false);
		var p = cc.Sprite.create(s_red_plane_explode);
		this.addChild(p,20);
		p.setPosition(this._plane.getPosition());

		// stop actions and music
		this.stopAllActions();
		this.unscheduleAllCallbacks();
		
		audioEngine.stopMusic();
		audioEngine.playEffect(s_sound_over);
		
		//update bestscore
		if(this._score > this._bestScore){
		    this._bestScore = this._score;
		}
		
		// Home or Replay
		cc.MenuItemFont.setFontName("Arial");
		var menuMain = cc.MenuItemFont.create("Main Menu", this.onGotoMainMenu, this);
		var menuAgain =  cc.MenuItemFont.create("Replay", this.onReplay, this);
		menuMain.setColor(new cc.Color3B(0,0,255));
		menuAgain.setColor(new cc.Color3B(0,0,255));
		var menu = cc.Menu.create(menuMain,menuAgain);
		menu.alignItemsVertically();
		this.addChild(menu, 20);
		menu.setPosition(g_winSize.width/2, g_winSize.height/2);
		
    },

    onReplay:function(){
		// cc.log("sur", audioEngine.isFormatSupported("mp3")); // OMG

		audioEngine.playMusic(s_sound_bg,true);
		// cc.log("volume",audioEngine.getMusicVolume() );
		
		var s = new GameScene();
		g_director.replaceScene(s);

    },

    onGotoMainMenu:function(){
		var director = cc.Director.getInstance();
		director.popScene();
    },

    locationTapped:function(location) {
    	var planePos = this._plane.getPosition();
    	if(location.x < planePos.x){
		    if (this._plane._rotation < 180) {
				this._plane.addRotation(15);
		    }
		}
		else {
		    if (this._plane._rotation > 0) {
				this._plane.addRotation(-15);
		    }
		}
	},

	onMouseDown:function( event ) {
		if (this.isPressed) {
			return false;
		}
		var location = event.getLocation();
    	pressPosition = location;
    	//this.locationTapped(location);
	}, 

	onMouseUp:function (event) {
		if (this.isPressed) {
			this.isPressed = !this.isPressed;
			pressPosition = null;
		}
	    var location = event.getLocation();
	    pressPosition = location;
    	//this.locationTapped(location);
	},
	 
	onTouchesEnded:function (touches, event) {
	    if (touches.length <= 0)
	        return;
	    var touch = touches[0];
	    var location = touch.getLocation();
	   	pressPosition = location;
    	// this.locationTapped(location);
	},
/*
    onKeyUp:function(key) {
		// cc.log("Key up:" + key);
    },

    onKeyDown:function(key) {
        // cc.log("Key down:" + key);
		// TODO:cc.Key.left? check API
		if(key == 37){
		    if (this._plane._rotation < 180) {
				this._plane.addRotation(18);
		    }
		}
		// right key
		if(key == 39){
		    if (this._plane._rotation > 0) {
				this._plane.addRotation(-18);
		    }
		}
    },
*/
    onTouchBegan:function () {
        return true;
    }

});

var GameScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

