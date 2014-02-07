var gNotification = cc.NotificationCenter.getInstance();
var gSpriteFrameCache = cc.SpriteFrameCache.getInstance();

var gSharedEngine = cc.AudioEngine.getInstance();

var MUSIC_BACKGROUND  = "res/audio/musicByFoxSynergy.mp3";
var EFFECT_BUTTON_CHICK  = "res/audio/effect_buttonClick.ogg";
var EFFECT_GAME_FAIL  = "res/audio/effect_game_fail.ogg";
var EFFECT_GAME_WIN  = "res/audio/effect_game_pass.ogg";
var EFFECT_PATTERN_UN_SWAP  = "res/audio/effect_unswap.ogg";
var EFFECT_PATTERN_CLEAR  = "res/audio/effect_clearPattern.ogg";
var EFFECT_PATTERN_BOMB  = "res/audio/effect_bombPattern.ogg";
var EFFECT_TIME_WARN  = "res/audio/effect_timewarning.ogg";

var g_ressources = [
    {src:"background.jpg"},
    {src:"logo.png"},

    {src:"btnStartGameDown.png"},
    {src:"btnStartGameNor.png"},

    {src:"ProgressBarFront.png"},
    {src:"ProgressBarBack.png"},

    //{src:"baseResource.png"} ,
    //{src:"baseResource.plist"},
    {src:"PatternBg.png"},

    {src:"star.png"},
    {src:"btnResultRestart.png"},
    {src:"btnResultRestartDown.png"},

    {src:MUSIC_BACKGROUND},
    {src:EFFECT_BUTTON_CHICK},
    {src:EFFECT_GAME_FAIL},
    {src:EFFECT_GAME_WIN},
    {src:EFFECT_PATTERN_UN_SWAP},
    {src:EFFECT_PATTERN_CLEAR},
    {src:EFFECT_PATTERN_BOMB},
    {src:EFFECT_TIME_WARN}
];

var gScoreData = {lastScore:0,bestScore:0};

var eGameMode = {
    Invalid : -1,
    Challenge:0,
    Timer:1,
    Count:2
};
var gGameMode = eGameMode.Challenge;

gScoreData.setLastScore = function(score){
    this.lastScore = score;

    if (score > this.bestScore)
    {
        this.bestScore = score;
        sys.localStorage.setItem('bestScore',this.bestScore);
    }
    sys.localStorage.setItem('lastScore',this.lastScore);
};

gScoreData.initData = function(){
    if( sys.localStorage.getItem('gameData') == null){
        sys.localStorage.setItem('bestScore','0');
        sys.localStorage.setItem('lastScore','0');

        sys.localStorage.setItem('gameData',33) ;
        return;
    }

    this.bestScore = parseInt(sys.localStorage.getItem('bestScore'));
};

