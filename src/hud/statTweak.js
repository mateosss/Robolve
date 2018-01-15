// Progress bar that associates a computer and a stat name, and the progress bar buttons directly modify that computer stat

// TODO Generalize for computers instead of only defenses

var StatTweak = Progress.extend({
  stat: null, // The stat name which this selector modifies
  defense: null, // The defense to which this selector modifies

  ctor: function(defense, stat, options) {
    this.stat = stat;
    this.defense = defense;
    this._super(_.concat(
      { buttons: true, predefinedValues: Object.values(Defense.prototype.getPossibleStats(stat)), text: _.formatVarName(stat) + ": {}", selectedValue:0 },
      options || {}
    ));
  },

  preChange: function() {
    //TODO to check for budget
  },
  postChange: function() {
    if (!this.defense) return;
    let newStatValue = this.getSelectedValue();
    let newStatIndex = _.invert(this.defense.STATS.get("element"))[newStatValue];
    this.defense.changeStat(this.stat, parseInt(newStatIndex) || newStatIndex);
    this.defense.factoryReset(true);
    this.defense.level.hud.ig.removeGold(cost);
    this.defense.level.hud.it.message("Tower " + _.formatVarName(this.stat) + " to: " + newStatValue);
  },
  previousValueOld: function() {
    this._super();

    let defense = this.defense;
    let stat = this.stat;

    if (defense) { // Modifying existing defense
      let pStat = defense.getPossibleStats(stat);
      let prop = defense[stat];

      let sortedKeys = Object.keys(pStat).sort();
      let canMinimize = sortedKeys.indexOf(prop.toString()) > 0;

      if (canMinimize) {
        let hasBudget = defense.level.base.gold >= rb.prices.increaseStat;
        if (hasBudget) {
          var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) - 1];
          defense.changeStat(stat, parseInt(improvement) || improvement);
          defense.factoryReset(true);
          defense.level.hud.ig.removeGold(rb.prices.increaseStat);
          defense.level.hud.it.message("Tower " + stat[0].toUpperCase() + stat.slice(1) + " to: " + pStat[defense[stat]]);
        } else {
          defense.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.increaseStat));
          defense.level.hud.ig.notEnoughGold();
        }
      } else {
        defense.level.hud.it.message(_.format("You only can go up for ${}", rb.prices.increaseStat));
      }
    }
  },
  nextValue: function() {
    this._super();
    // let nextCallback = () => {
    //     var d = this.getParent().getParent().defense; //Defense // TODO asco
    //     var p = this.stat;  //Stat name
    //     var pProp = d.getPossibleStats(p);
    //     var prop = d[p];
    //     var sProp = pProp[prop];
    //
    //     var sortedKeys = Object.keys(pProp).sort();
    //     var canMaximize = sortedKeys.indexOf(prop.toString()) < sortedKeys.length - 1;
    //     if (canMaximize) {
    //       var hasBudget = d.level.base.gold >= rb.prices.increaseStat;
    //       if (hasBudget) {
    //         var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) + 1];
    //         d.changeStat(p, parseInt(improvement) || improvement);
    //         d.level.hud.ig.removeGold(rb.prices.increaseStat);
    //         d.factoryReset(true);
    //         d.level.hud.it.message("Tower " + p[0].toUpperCase() + p.slice(1) + " to: " + pProp[d[p]]);
    //       } else {
    //         d.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.increaseStat));
    //         d.level.hud.ig.notEnoughGold();
    //       }
    //     } else {
    //       d.level.hud.it.message(_.format("You only can go down for ${}", rb.prices.increaseStat));
    //     }
    //   };
  }

});
