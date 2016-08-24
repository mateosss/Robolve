var Hud = cc.Layer.extend({
  level: null,

  dd: null, // Deffense Details
  ddElement: null,
  ddRange: null,
  ddTerrain: null,
  ddDamage: null,
  ddAttackSpeed: null,

  ds: null, // Deffense Selector
  dsBtnOk: null,
  dsBtnCancel: null,
  dsLabel: null,
  dsDeffens: null,

  ctor: function(level) {
    this._super();
    this.level = level;
    var s = cc.winSize;
    var center = cc.p(s.width / 2, s.height / 2); // Screen center

    // Deffense Selector
    var dsSize = cc.size(s.width, 128); // deffenseSelector Height // TODO 128 hardcoded
    var dsPos = cc.p(0, 0); // deffenseSelector Position//TODO 128 esta hardcodeado, igual que el 3, fijarse si se puede centrar mejor, con alguna funcion de cocos
    this.ds = new ccui.ListView();
    this.ds.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.ds.setTouchEnabled(true);
    this.ds.setContentSize(dsSize);
    this.ds.setPosition((this.ds.width - 3 * 96) / 2, 0); // TODO TOO MUCH HARDCODE
    this.addChild(this.ds);
    var buttons = [
      new ccui.Button(res.ui.redBtnM, res.ui.redBtnDM),
      new ccui.Button(res.ui.blueBtnM, res.ui.blueBtnDM),
      new ccui.Button(res.ui.yellowBtnM, res.ui.yellowBtnDM)
    ];
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].pressedActionEnabled = true;
      buttons[i].setPosition(cc.p(0,300));
      this.ds.addChild(buttons[i]);
    }

    // Deffense Details
    var ddSize = cc.size(s.width, 192); // deffenseDetails // TODO Height 256 hardcoded
    var ddPos = cc.p(0, dsSize.height + dsPos.y); // deffenseDetails Position in function of deffenseSelectorPos
    this.dd = new ccui.ListView();
    this.dd.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.dd.setTouchEnabled(true); // TODO do i really need this?
    this.dd.setBounceEnabled(true);
    this.dd.setContentSize(ddSize);
    this.dd.setPosition(ddPos);
    this.dd.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.dd.setBackGroundColor(new cc.color(10, 10, 40));
    this.dd.setBackGroundColorOpacity(80);
    // this.dd.setBackGroundImage(res.ui.blueBtnS);
    // this.dd.setBackGroundImageScale9Enabled(true);
    // this.dd.setBackGroundImageOpacity(0.001);
    this.addChild(this.dd);

    // for (i = 0; i < 3; i++) {
    // pElement
    // pRange
    // pTerrain
    // pDamage
    // pAttackSpeed
    var column = new PropertySelector(this.dd, this.level.deffenses[0], 'range');
    this.dd.pushBackCustomItem(column);
    // }
    return true;
  },
});

var PropertySelector = ccui.Layout.extend({
  deffense: null,
  property: null,
  ctor: function(parent, deffense, property) {
    this._super();
    this.deffense = deffense;
    this.property = property;
    pProperty = 'p' + property[0].toUpperCase() + property.slice(1);
    sProperty = 's' + property[0].toUpperCase() + property.slice(1);

    var colPos = this.getAnchorPointInPoints();
    // this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    // this.setBackGroundColor(new cc.color(0, 0, 0));
    // this.setBackGroundColorOpacity(80);
    this.setContentSize(64, parent.height);

    var background = new ccui.Layout();
    background.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    background.setBackGroundColor(new cc.color(0, 0, 0));
    background.setBackGroundColorOpacity(200);
    background.setContentSize(this.width * 0.75 - 4, this.getContentSize().height - background.getSize().height - 16);
    background.setPosition(this.width / 2 - background.width / 2, 8);

    //pNameLabel property name label TODO

    var pValue = this.deffense[pProperty][this.deffense[this.property]];
    var pValueLabel = new ccui.Text(pValue, "Arial", background.width / 2);
    pValueLabel.setAnchorPoint(0, 0);
    pValueLabel.setPosition(4, background.height / 2 - pValueLabel.height / 2); // TODO 4 hardcodeado
    background.addChild(pValueLabel, 99);

    this.addChild(background);

    var downBtn = new ccui.Button(res.ui.minusBtnS, res.ui.minusBtnDS);
    downBtn.setAnchorPoint(0, 0);
    downBtn.setPosition(this.width / 2 - downBtn.width / 2, 8);
    downBtn.pressedActionEnabled = true;
    downBtn.setContentSize(cc.size(this.width, this.width));
    this.addChild(downBtn);


    var upBtn = new ccui.Button(res.ui.plusBtnS, res.ui.plusBtnDS);
    upBtn.setAnchorPoint(0, 0);
    upBtn.setPosition(this.width / 2 - upBtn.width / 2, this.getContentSize().height - upBtn.getSize().height - 8);
    upBtn.pressedActionEnabled = true;
    upBtn.setContentSize(cc.size(this.width, this.width));
    this.addChild(upBtn);
  }
});
