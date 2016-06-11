var Map = cc.TMXTiledMap.extend({
  positionTarget: cc.p(winSize.width/2,winSize.height/2),
  ctor: function(tmxMap){
    this._super(tmxMap);
    this.scale = 0.15;
    this.setAnchorPoint(0.5,0.5);
    var ms = this.getMapSize();
    var ts = this.getTileSize();
  }
});

var spawn;
var base;
