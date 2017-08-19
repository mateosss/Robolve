var InfoGold = cc.LabelTTF.extend({
  hud: null, // Hud to which the InfoGold is appended
  prefix: "Gold:", // The static prefix label

  ctor: function(hud) {
    this._super();
    this.hud = hud;
    let s = cc.winSize;

    var prefix = new cc.LabelTTF(this.prefix, "Arial", 32, cc.size(s.width, 32), cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);//TODO width hardcoded
    prefix.setAnchorPoint(0, 0);
    prefix.setPosition(cc.p(0, 32));
    this.addChild(prefix);

    this.setString(this.hud.level.base.money);
    this.setFontName("Arial");
    this.setFontSize(32);
    this.setDimensions(cc.size(s.width, 32));
    this.setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
    this.setAnchorPoint(0, 0);
    this.setPosition(cc.p(0, 32));
  },
  toString: () => "InfoGold",
  refresh: function() {
    this.setString(this.hud.level.base.money + "");
  }
});
