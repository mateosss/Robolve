var PropertySelector = ccui.Layout.extend({
  property: null,
  pValueLabel: null,
  ctor: function(parent, property) {
    // TODO HARDCODE EVERYWHERE
    this._super();
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
    background.setContentSize(this.width * 0.75 - 4, this.getContentSize().height - 32); //TODO 32 hardcoded
    background.setPosition(this.width / 2 - background.width / 2, 8);
    this.addChild(background);

    var pName = this.property[0].toUpperCase() + this.property.slice(1);
    var pNameLabel = new ccui.Text(pName, "Arial", background.width / 3);
    pNameLabel.setAnchorPoint(0, 0);
    pNameLabel.setPosition(0, background.height);
    background.addChild(pNameLabel, 99);

    this.pValueLabel = new ccui.Text("--", "Arial", background.width / 2);
    this.pValueLabel.setAnchorPoint(0, 0);
    this.pValueLabel.setPosition(4, background.height / 2 - this.pValueLabel.height / 2); // TODO 4 hardcodeado
    background.addChild(this.pValueLabel, 99);

    var downBtn = new ccui.Button(r.ui.minusBtnS, r.ui.minusBtnDS);
    downBtn.setAnchorPoint(0, 0);
    downBtn.setPosition(this.width / 2 - downBtn.width / 2, 8);
    downBtn.pressedActionEnabled = true;
    downBtn.setTouchEnabled(true);
    downBtn.setContentSize(cc.size(this.width, this.width));
    easyTouchButton(downBtn, function(downBtn){
      var d = upBtn.getParent().getParent().getParent().getParent().ddDefense; //Defense
      var p = upBtn.getParent().property;  //Property name
      var pProp = d['p' + p[0].toUpperCase() + p.slice(1)]; // possible stats(properties)
      var prop = d[p];
      var sProp = pProp[prop];

      var sortedKeys = Object.keys(pProp).sort();
      var canMinimize = sortedKeys.indexOf(prop.toString()) > 0;
      if (canMinimize) {
        var cost = 100;
        var hasBudget = d.level.base.money >= cost; // TODO 50 hardcoded
        if (hasBudget) {
          var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) - 1];
          d[p] = parseInt(improvement) || improvement;
          d.refreshStats();
          d.level.base.money -= cost;
          d.level.hud.ig.refresh();
          upBtn.getParent().refresh();
          d.level.hud.it.message("Tower " + p[0].toUpperCase() + p.slice(1) + " to: " + pProp[d[p]]);
        } else {
          d.level.hud.it.message("You don't have 100 bucks");
        }
      } else {
        d.level.hud.it.message("You only can go up for $100");
      }
    });
    this.addChild(downBtn);

    var upBtn = new ccui.Button(r.ui.plusBtnS, r.ui.plusBtnDS);
    upBtn.setAnchorPoint(0, 0);
    upBtn.setPosition(this.width / 2 - upBtn.width / 2, this.getContentSize().height - upBtn.getSize().height - 24);//TODO 24 hardcode
    upBtn.pressedActionEnabled = true;
    upBtn.setTouchEnabled(true);
    upBtn.setContentSize(cc.size(this.width, this.width));
    easyTouchButton(upBtn, function(upBtn){
      var d = upBtn.getParent().getParent().getParent().getParent().ddDefense; //Defense
      var p = upBtn.getParent().property;  //Property name
      var pProp = d['p' + p[0].toUpperCase() + p.slice(1)]; // possible stats(properties)
      var prop = d[p];
      var sProp = pProp[prop];

      var sortedKeys = Object.keys(pProp).sort();
      var canMaximize = sortedKeys.indexOf(prop.toString()) < sortedKeys.length - 1;
      if (canMaximize) {
        var cost = 100;
        var hasBudget = d.level.base.money >= cost; // TODO 50 hardcoded
        if (hasBudget) {
          var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) + 1];
          d[p] = parseInt(improvement) || improvement;
          d.level.base.money -= cost;
          d.refreshStats();
          d.level.hud.ig.refresh();
          upBtn.getParent().refresh();
          d.level.hud.it.message("Tower " + p[0].toUpperCase() + p.slice(1) + " to: " + pProp[d[p]]);
        } else {
          d.level.hud.it.message("You don't have 100 bucks");
        }
      } else {
        d.level.hud.it.message("You only can go down for $100");
      }
    });
    this.addChild(upBtn);
  },
  refresh: function() {
    var defense = this.getParent().getParent().getParent().ddDefense;
    var pProperty = 'p' + this.property[0].toUpperCase() + this.property.slice(1);
    var pValue = defense[pProperty][defense[this.property]];
    this.pValueLabel.setString(pValue);
  },

});
