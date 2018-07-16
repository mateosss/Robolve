var InfoText = cc.LabelTTF.extend({
  hud: null, // hud parent to which the information text is appended

  ctor: function(hud) {
    this._super();
    this.hud = hud;

    let s = cc.winSize;
    this.setString("Defense Selector");
    this.setFontName(r.getDefaultFont());
    this.setFontSize(32);
    let d = this.hud.bottombarLayout.getSize();
    if (!cc.sys.isNative) this.setLineHeight(32); // TODO Hack
    this.setDimensions(s.width, d.height / 2); // TODO Hardcoded dimensions
    this.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    this.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    this.setAnchorPoint(0, 0);
    this.setPosition(0, d.height); // TODO Hardcoded
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
