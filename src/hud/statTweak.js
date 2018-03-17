// Progress bar that associates a computer and a stat name, and the progress bar buttons directly modify that computer stat

// TODO Generalize for computers instead of only defenses

var StatTweak = Progress.extend({
  stat: null, // The stat name which this selector modifies
  defense: null, // The defense to which this selector modifies // TODO Should be computer

  ctor: function(defense, stat, options) {
    // defense: Defense to modify stat
    // stat: the stat name to modify
    // options: options object for the UI Component Progress
    this.defense = defense;
    this.stat = stat;
    this._super(_.concat(
      { buttons: true, predefinedValues: Object.values(Defense.prototype.getPossibleStats(stat)), text: _.formatVarName(stat) + ": {}", selectedValue:0 },
      options || {y:"20ph", x:"center", width:"80pw", height:"96px"}
    ));
  },

  previousValue: function() {
    let d = rb.dev.getDefense(); // XXX Remove
    let hasBudget = d.level.base.gold >= rb.prices.increaseStat;

    if (hasBudget) {
      let canMinimizeTo = this._super(); // Can Minimize? see StatTweak.nextValue
      if (canMinimizeTo !== false) {
        let p = this.stat;
        let pProp = d.getPossibleStats(p);
        let newStatIndex = Object.keys(pProp).sort()[canMinimizeTo]; // The sort is to ensure key order
        d.changeStat(p, parseInt(newStatIndex) || newStatIndex);
        d.factoryReset(true);
        d.level.hud.ig.removeGold(rb.prices.increaseStat);
        d.level.hud.it.message(_.format("Tower {} changed to {}", _.capitalize(p), pProp[d[p]]));
      } else {
        d.level.hud.it.message(_.format("You only can go up for ${}", rb.prices.decreaseStat));
      }
    } else {
      d.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.decreaseStat));
      d.level.hud.ig.notEnoughGold();
      this.cantChange();
    }
  },

  nextValue: function() {
    let d = rb.dev.getDefense(); // XXX Remove
    let hasBudget = d.level.base.gold >= rb.prices.increaseStat;

    if (hasBudget) {
      let canMaximizeTo = this._super(); // Can Maximize? Execute Progress.nextValue that returns a boolean saying wether it could go to the next value
      if (canMaximizeTo !== false) {
        let p = this.stat;  // Stat name
        let pProp = d.getPossibleStats(p); // Possible stats
        let newStatIndex = Object.keys(pProp).sort()[canMaximizeTo]; // The sort is to ensure key order
        d.changeStat(p, parseInt(newStatIndex) || newStatIndex);
        d.factoryReset(true);
        d.level.hud.ig.removeGold(rb.prices.increaseStat);
        d.level.hud.it.message(_.format("Tower {} changed to {}", _.capitalize(p), pProp[d[p]]));
      } else {
        d.level.hud.it.message(_.format("You only can go down for ${}", rb.prices.increaseStat));
      }
    } else {
      d.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.increaseStat));
      d.level.hud.ig.notEnoughGold();
      this.cantChange();
    }
  }

});
