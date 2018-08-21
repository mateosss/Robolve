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

    let Class = rb.global[computer.toString()]; // toString will return class name if computer or the same string if string
    _.assert(Defense.prototype.STATS.has(stat), _.format("{} doesn't have {} stat", computer.toString(), stat));

    this._super(_.concat(
      { buttons: {previous: { visible: false }}, predefinedValues: Object.values(Class.prototype.getPossibleStats(stat)), text: _.formatVarName(stat) + ": {}"},
      options || {y:"20ph", x:"center", width:"80pw", height:"96px"}
    ));

    if (this.computer instanceof Computer) this.syncSelectedValue();
  },

  setComputer: function(computer) {
    this.computer = computer;
    this.setValue(this.computer[this.stat]);
  },

  previousValue: function() {
    let c = this.computer;

    _.assert(c instanceof Computer, _.format("{} computer in statTweak of stat {} is not a computer", c, this.stat));

    let hasBudget = c.level.character.getGold() >= rb.prices.decreaseStat;

    if (hasBudget) {
      let canMinimizeTo = this._super(); // Can Minimize? see StatTweak.nextValue
      if (canMinimizeTo !== false) {
        let p = this.stat;
        let pProp = c.getPossibleStats(p);
        let newStatIndex = Object.keys(pProp).sort()[canMinimizeTo]; // The sort is to ensure key order
        c.changeStat(p, _.tryParseInt(newStatIndex));
        c.level.hud.ig.removeGold(rb.prices.decreaseStat);
        c.level.hud.it.message(_.format("Tower {} changed to {}", _.formatVarName(p), pProp[c[p]]));
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
    let c = this.computer;

    _.assert(c instanceof Computer, _.format("{} computer in statTweak of stat {} is not a computer", c, this.stat));

    if (c.sm.isInState('improve')) {
      c.level.hud.it.message("Take it easy, I'm on it");
      this.cantChange();
      return;
    } else if (c.sm.isInState('repair')) {
      c.level.hud.it.message("I'm doing something here wait a minute");
      this.cantChange();
      return;
    }

    let hasBudget = c.level.character.getGold() >= rb.prices.increaseStat;

    if (hasBudget) {
      let canMaximizeTo = this._super(); // Can Maximize? Execute Progress.nextValue that returns a boolean saying wether it could go to the next value
      if (canMaximizeTo !== false) {
        let p = this.stat;  // Stat name
        let pProp = c.getPossibleStats(p); // Possible stats
        let newStatIndex = Object.keys(pProp).sort()[canMaximizeTo]; // The sort is to ensure key order
        c.changeStat(p, _.tryParseInt(newStatIndex));
        c.level.hud.ig.removeGold(rb.prices.increaseStat);
        c.level.hud.it.message("That improvement will look finna woke");
        c.sm.setState('improve');
        c.level.character.goImprove(c);
      } else {
        c.level.hud.it.message("Damn, it is never good enough for you, is it?");
      }
    } else {
      c.level.hud.it.message("You're just a kid spending money aren't ya");
      c.level.hud.ig.notEnoughGold();
      this.cantChange();
    }
  }

});
