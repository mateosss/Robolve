var PropertySelector = ccui.Layout.extend({
  property: null,
  pValueLabel: null,
  ctor: function(parent, property) {
    // TODO HARDCODE EVERYWHERE
    this._super();
    this.property = property;

    var colPos = this.getAnchorPointInPoints();
    this.setContentSize(64, parent.height);

    var background = new ccui.Layout();
    background.setContentSize(this.width * 0.75 - 4, this.height - 32); //TODO hardcode
    background.setPosition(this.width / 2 - background.width / 2, 8);
    this.addChild(background);

    var pName = this.property[0].toUpperCase() + this.property.slice(1);
    var pNameLabel = new ccui.Text(pName, r.getDefaultFont(), background.width / 3);
    pNameLabel.setAnchorPoint(0, 0);
    pNameLabel.setPosition(0, background.height);
    background.addChild(pNameLabel, 99);

    this.pValueLabel = new ccui.Text("--", r.getDefaultFont(), background.width / 2);
    this.pValueLabel.setAnchorPoint(0, 0);
    this.pValueLabel.setPosition(4, background.height / 2 - this.pValueLabel.height / 2); // TODO hardcode
    background.addChild(this.pValueLabel, 99);

    var downBtn = new Button({
      callback: _.wrap(function(downBtn) {
        var d = upBtn.getParent().getParent().getParent().defense; //Defense // TODO asco
        var p = upBtn.getParent().property; //Property name
        var pProp = d.getPossibleStats(p);
        var prop = d[p];
        var sProp = pProp[prop];

        var sortedKeys = Object.keys(pProp).sort();
        var canMinimize = sortedKeys.indexOf(prop.toString()) > 0;
        if (canMinimize) {
          var hasBudget = d.level.base.gold >= rb.prices.decreaseStat;
          if (hasBudget) {
            var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) - 1];
            d.changeStat(p, parseInt(improvement) || improvement);
            d.factoryReset(true);
            d.level.hud.ig.removeGold(rb.prices.decreaseStat);
            upBtn.getParent().refresh();
            d.level.hud.it.message("Tower " + p[0].toUpperCase() + p.slice(1) + " to: " + pProp[d[p]]);
          } else {
            d.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.decreaseStat));
            d.level.hud.ig.notEnoughGold();
          }
        } else {
          d.level.hud.it.message(_.format("You only can go up for ${}", rb.prices.decreaseStat));
        }
      }, downBtn), button: "blue", icon: "chevron-down", width: "48px", height: "48px", x: "center", y: "8px", scale:0.5, left:"24px",
    });
    downBtn.addTo(this);

    var upBtn = new Button({
      callback: () => {
        var d = upBtn.getParent().getParent().getParent().defense; //Defense // TODO asco
        var p = upBtn.getParent().property;  //Property name
        var pProp = d.getPossibleStats(p);
        var prop = d[p];
        var sProp = pProp[prop];

        var sortedKeys = Object.keys(pProp).sort();
        var canMaximize = sortedKeys.indexOf(prop.toString()) < sortedKeys.length - 1;
        if (canMaximize) {
          var hasBudget = d.level.base.gold >= rb.prices.increaseStat;
          if (hasBudget) {
            var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) + 1];
            d.changeStat(p, parseInt(improvement) || improvement);
            d.level.hud.ig.removeGold(rb.prices.increaseStat);
            d.factoryReset(true);
            upBtn.getParent().refresh();
            d.level.hud.it.message("Tower " + p[0].toUpperCase() + p.slice(1) + " to: " + pProp[d[p]]);
          } else {
            d.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.increaseStat));
            d.level.hud.ig.notEnoughGold();
          }
        } else {
          d.level.hud.it.message(_.format("You only can go down for ${}", rb.prices.increaseStat));
        }
      }, button: "blue", icon: "chevron-up", width: "48px", height: "48px", x: "center", y: "-64px", scale:0.5, left:"24px"
    });
    upBtn.addTo(this);
  },
  refresh: function() {
    let defense = this.getParent().getParent().defense;
    this.pValueLabel.setString(defense.getDefaultStat(this.property));
  },

});
