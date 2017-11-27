var GameLevel = cc.Scene.extend({
  ctor: function(mapRes, firstTime) {
    this._super();
    this.mapRes = mapRes;
    this.firstTime = firstTime;
  },
  onEnter:function () {
    this._super();
    var level = new Level(this.mapRes, this.firstTime);
    var hud = new Hud(level);
    level.hud = hud;
    this.addChild(level);
    this.addChild(hud);
  }
});
