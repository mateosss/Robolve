var Hud = cc.Layer.extend({
  ds: null, // Deffense Selector
  dsBtnOk: null,
  dsBtnCancel: null,
  dsLabel: null,
  dsDeffens: null,

  ctor: function() {
    this._super();

    var s = cc.winSize;
    var center = cc.p(s.width / 2, s.height / 2); // Screen center
    var dsSize = cc.size(s.width, 128); // deffenseSelector Height
    var dsPos = cc.p(0, 0); // deffenseSelector Position

    this.ds = new ccui.ListView();
    this.ds.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.ds.setTouchEnabled(true);
    // this.ds.setBounceEnabled(true);
    this.ds.setContentSize(dsSize);
    this.ds.setPosition(cc.p((s.width - 3 * 128) / 2, 0)); //TODO 128 esta hardcodeado, igual que el 3, fijarse si se puede centrar mejor, con alguna funcion de cocos
    this.addChild(this.ds);

    for (var i = 0; i < 3; i++) {
      var button = new ccui.Button(res.ui.blueBtn, res.ui.blueBtnS);
      this.ds.pushBackCustomItem(button);
    }

    return true;
  },
});
