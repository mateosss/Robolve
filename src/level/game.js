var GameLevel = cc.Scene.extend({
  ctor: function(mapRes) {
    this._super();
    this.mapRes = mapRes;
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
