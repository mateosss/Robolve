// Progress bar that associates a computer and a stat name, and the progress bar buttons directly modify that computer stat

var StatTweak = Progress.extend({
  stat: null, // The stat name which this selector modifies
  computer: null, // The computer to which this selector modifies

  ctor: function(computer, stat, options) {
    // computer: Computer to modify stat or string like "Defense", "Robot", from which to get possible stats
    // stat: the stat name to modify
    // options: options object for the UI Component Progress
    this.computer = computer;
    this.stat = stat;

    let Class = rb.global[computer.toString()];
    _.assert(Class.prototype.STATS.has(stat), _.format("{} doesn't have {} stat", computer.toString(), stat));

    this._super(_.concat(
      { buttons: true, predefinedValues: Object.values(Class.prototype.getPossibleStats(stat)), text: _.formatVarName(stat) + ": {}", selectedValue:0 },
      options || {y:"20ph", x:"center", width:"80pw", height:"96px"}
    ));
  },

  previousValue: function() {
    let c = rb.dev.getDefense(); // XXX Remove
    let hasBudget = c.level.base.gold >= rb.prices.decreaseStat;

    if (hasBudget) {
      let canMinimizeTo = this._super(); // Can Minimize? see StatTweak.nextValue
      if (canMinimizeTo !== false) {
        let p = this.stat;
        let pProp = c.getPossibleStats(p);
        let newStatIndex = Object.keys(pProp).sort()[canMinimizeTo]; // The sort is to ensure key order
        c.changeStat(p, parseInt(newStatIndex) || newStatIndex);
        c.factoryReset(true);
        c.level.hud.ig.removeGold(rb.prices.decreaseStat);
        c.level.hud.it.message(_.format("Tower {} changed to {}", _.capitalize(p), pProp[c[p]]));
      } else {
        c.level.hud.it.message(_.format("You only can go up for ${}", rb.prices.decreaseStat));
      }
    } else {
      c.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.decreaseStat));
      c.level.hud.ig.notEnoughGold();
      this.cantChange();
    }
  },

  nextValue: function() {
    let c = rb.dev.getDefense(); // XXX Remove
    let hasBudget = c.level.base.gold >= rb.prices.increaseStat;

    if (hasBudget) {
      let canMaximizeTo = this._super(); // Can Maximize? Execute Progress.nextValue that returns a boolean saying wether it could go to the next value
      if (canMaximizeTo !== false) {
        let p = this.stat;  // Stat name
        let pProp = c.getPossibleStats(p); // Possible stats
        let newStatIndex = Object.keys(pProp).sort()[canMaximizeTo]; // The sort is to ensure key order
        c.changeStat(p, parseInt(newStatIndex) || newStatIndex);
        c.factoryReset(true);
        c.level.hud.ig.removeGold(rb.prices.increaseStat);
        c.level.hud.it.message(_.format("Tower {} changed to {}", _.capitalize(p), pProp[c[p]]));
      } else {
        c.level.hud.it.message(_.format("You only can go down for ${}", rb.prices.increaseStat));
      }
    } else {
      c.level.hud.it.message(_.format("You don't have {} bucks", rb.prices.increaseStat));
      c.level.hud.ig.notEnoughGold();
      this.cantChange();
    }
  }

});
