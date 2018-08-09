var Robot = Computer.extend({
  // TODO definir valores reales // TODO apply fuzzy logic
  STATS: new Map([
    ['turnProb', {0: 0.25, 1: 0.5, 2: 0.9}],
    ['life', {0: 1000, 1: 1500, 2: 2500}],
    ['element', {
      electric: "Electro",
      fire: "Fire",
      water: "Water"
    }],
    ['range', {0: 75, 1: 150}],
    ['terrain', {0: 'walk'}],
    ['speed', {0: 0.35, 1: 0.75, 2: 1.0}],
    ['damage', {0: 50, 1: 75, 2: 150}],
    ['attackSpeed', {0: 0.5, 1: 1.0, 2: 2.0}],
  ]),
  PARTS: { // Necessary info for the parts to make a robot
    head: {plural: "heads", z: 2, partName: robot => robot.element + ["Weak", "Normal", "Strong"][robot.damage]},
    middle: {plural: "middles", z: 1, partName: robot => robot.element + ["Weak", "Normal", "Strong"][robot.life]},
    arml: {plural: "armsl", z: 3, partName: robot => robot.element + ["Mele", "Range"][robot.range] + "L"},
    armr: {plural: "armsr", z: 0, partName: robot => robot.element + ["Mele", "Range"][robot.range] + "R"},
    legl: {plural: "legsl", z: 0, partName: robot => robot.element + "L"},
    legr: {plural: "legsr", z: 0, partName: robot => robot.element + "R"},
  },
  STATES: [ // Possible states for this robot
    rb.states.robot.walk, // The first is the state executed on startup
    rb.states.robot.still,
    rb.states.robot.attack,
    rb.states.robot.die
  ],

  spawnIndex: null, // Tells the order in which it was spawned in the map
  ctor: function(level, dna) {
    //TODO que funcione el balanceo, poder hacer que un robot sea de tipo +1 y eso
    // TODO creo que este hack ya no es necesario por Robot.prototype.STATS, croe que nadie lo usa, quitar
    if (arguments.length === 0) return; // Hack for getting only the properties defined above
    this._super.apply(this, arguments);
    this.setTouchEvent();
    this.scheduleUpdate();
  },
  toString: () => "Robot",
  setTouchEvent: function() {
    easyTouchEnded(this, function(robot) {
      if (robot.getNumberOfRunningActions() === 0) {
        var increase = new cc.ScaleBy(0.05, 1.2);
        var decrease = new cc.ScaleBy(0.15, 1 / 1.2);
        robot.runAction(new cc.Sequence(increase, decrease));
        robot.level.character.goAttack(robot);
      }
    }, { options: { priority: ee.EE_INDIVIDUAL } });
  },
  getTarget: function() {
    // This function returns the defense to which this robot has to attack

    //Looks for defenses or the base in robot range
    var inRange = this.level.defenses.concat(this.level.base).filter(function(target) {
      return this.getDistanceTo(target) <= this.sRange && target.sLife > 0 && target.isBuilt();
    }, this);
    //if no defense in range return null
    if (inRange.length === 0) {
      this.target = null;
      if (this.sm.isInState('attack')) this.sm.setState('walk');
      return null;
    }
    //If there are defenses in range proceed to detect which of them is closest
    var closestDistance = 0;
    var closestTarget = null;
    inRange.forEach(function(target) {
      var distance = this.getDistanceTo(target);
      if (closestDistance === 0 || distance < closestDistance) {
        closestDistance = distance;
        closestTarget = target;
      }
    }, this);
    this.target = closestTarget;
    return this.target;
  },
  debug: function() {
    // Creates a debugger for verbose information directly on the canvas
    this.debugger = new Debugger(this);
    this.debugger.methods = [ // Modify this to add debug information
      { method: this.debugger.debugAnchor },
      { method: this.debugger.debugRange },
      { method: this.debugger.debugText, options: {
        text: JSON.stringify([this.sAttackSpeed, (1 / (this.sAttackSpeed * 6)).toFixed(2)]),
        dimensions: cc.size(256, 256),
        fontSize: 24,
        hAlignment: cc.TEXT_ALIGNMENT_LEFT,
        position: cc.p(this.getAnchorPointInPoints().x, this.getAnchorPointInPoints().y + 128)
      } },
    ];
    this.debugger.debug();
  },
  drop: function() { // Drops a pickable item to the ground
    let level = this.level;
    if (level.willDrop > 1 && level.remainingItemsToDrop.length > 0 && Math.random() < 0.25) {
      level.willDrop--;
      this.dropRandomUnique();
    } else {
      if (Math.random() < 0.4) this.dropRandomWeightedCoin();
      else this.dropRandomGold();
    }
  },
  dropRandomUnique: function() {
    let item = this.level.popRandomDrop();
    if (item.length === 0) {
      console.warn("This shouldn't be happening, trying to drop a unique item but they are depleted");
      return this.dropRandomWeightedCoin();
    }
    new ItemPickup(this.level.map, this.getPosition(), item[0], 1);
  },
  dropRandomCoin: function() {
    let coins = Object.values(Item.prototype.getItemsByCategory("coin"));
    new ItemPickup(this.level.map, this.getPosition(), _.randchoice(coins), 1);
  },
  dropRandomWeightedCoin: function() {
    let coins = Object.values(Item.prototype.getItemsByCategory("coin"));

    let rand = Math.random();
    if (rand <= 0.4) { // 40% weighted coin
      rand = rand * (10 / 4); // 0..0.4 to 0..1, save the use of Math.random again
      let defenses = this.level.defenses;
      let dcount = {electric: 0, fire: 0, water: 0}; // Amount of defenses per element
      let tcount = defenses.length;
      defenses.forEach(d => dcount[d.element]++);
      // percentages of probability based on amount of defenses of that element
      // if you have only water defenses the you will get just water coins,
      // 1 fire 1 water, 50/50 probability, and so on
      if (rand <= dcount.electric / tcount) {
        new ItemPickup(this.level.map, this.getPosition(), coins[0], 1);
      } else if (rand > dcount.electric / tcount && rand <= dcount.fire / tcount) {
        new ItemPickup(this.level.map, this.getPosition(), coins[1], 1);
      } else if (rand > (dcount.electric + dcount.fire) / tcount && rand <= dcount.water / tcount) {
        new ItemPickup(this.level.map, this.getPosition(), coins[2], 1);
      }
    } else if (rand <= 0.6) { // 20% electric
      new ItemPickup(this.level.map, this.getPosition(), coins[0], 1);
    } else if (rand <= 0.8) { // 20% fire
      new ItemPickup(this.level.map, this.getPosition(), coins[1], 1);
    } else if (rand <= 1.0) { // 20% water
      new ItemPickup(this.level.map, this.getPosition(), coins[2], 1);
    }
  },
  dropRandomGold: function() {
    new ItemPickup(this.level.map, this.getPosition(), rb.items.gold, _.rand6intCenter(rb.prices.killRobot));
  },

  die: function() {
    if (!this.sm.isInState('die')) { // Check if it is already dying for not dropping many items
      this.drop();
      this.level.totalRobotsKilled++;
    }
    this._super();
  },
  destroy: function() {
    this.level.prevWaveRobots.push([this.getDNA(), this.getScore()]);
    this._super();
  },
  update: function(delta) {
    var target = this.getTarget();
    if (target && this.sm.isInState('walk')) this.sm.setState('attack', {target: target});
  },
});
