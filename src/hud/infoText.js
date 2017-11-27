var InfoText = cc.LabelTTF.extend({
  hud: null, // hud parent to which the information text is appended

  ctor: function(hud) {
    this._super();
    this.hud = hud;

    let s = cc.winSize;
    this.setString("Defense Selector");
    this.setFontName(r.getDefaultFont());
    this.setFontSize(32);
    this.setDimensions(cc.size(s.width, 48));
    this.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    this.setAnchorPoint(0, 0);
    this.setPosition(cc.p(0, this.hud.ds.height + this.hud.ds.y));
  },
  toString: () => "InfoText",
  message: function(message, duration) {
    duration = duration || 3;
    this.setOpacity(0);
    var changeText = new cc.CallFunc((it, msg) => it.setString(msg), this, message);
    var appear = new cc.FadeIn(0.2);
    var delay = new cc.DelayTime(duration);
    var disappear = new cc.FadeOut(0.2);
    var actArray = [changeText, appear, delay, disappear];
    this.runAction(new cc.Sequence(actArray));
  }
});
