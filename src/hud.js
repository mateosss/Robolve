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
    var dsHeight = 128; // deffenseSelector Height
    var dsPos = cc.p(0, 0); // deffenseSelector Position

    this.ds = new ccui.ListView();
    this.ds.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.ds.setTouchEnabled(true);
    this.ds.setBounceEnabled(true);
    this.ds.setContentSize(cc.size(s.width, dsHeight));
    this.ds.setPosition(dsPos);
    this.addChild(this.ds);

    for (var i = 0; i < 5; i++) {
      var button = new ccui.Button(res.ui.blueBtn, res.ui.blueBtnS);
      this.ds.pushBackCustomItem(button);
    }

    return true;
  },
});
