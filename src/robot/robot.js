var Robot = Computer.extend({
  // TODO definir valores reales // TODO apply fuzzy logic
  STATS: new Map([
    ['turnProb', {0: 0.25, 1: 0.5, 2: 0.9}],
    ['life', {0: 500, 1: 600, 2: 700}],
    ['element', {
      electric: "Electro",
      fire: "Fire",
      water: "Water"
    }],
    ['range', {0: 75, 1: 150}],
    ['terrain', {0: 'walk',1: 'fly'}],
    ['speed', {0: 0.35, 1: 0.75, 2: 1.0}],
    ['damage', {0: 5, 1: 15, 2:20}],
    ['attackSpeed', {0: 0.5, 1: 1.0, 2: 2.0}],
  ]),
  PARTS: { // Necessary info for the parts to make a robot
    head: {plural: "heads", z: 2, partName: robot => robot.element + ["Weak", "Normal", "Strong"][robot.damage]},
    middle: {plural: "middles", z: 1, partName: robot => ["weak", "normal", "strong"][robot.life]},
    arml: {plural: "armsl", z: 3, partName: robot => robot.element + ["Mele", "Range"][robot.range] + "L"},
    armr: {plural: "armsr", z: 0, partName: robot => robot.element + ["Mele", "Range"][robot.range] + "R"},
    legl: {plural: "legsl", z: 0, partName: robot => ["walk", "fly"][robot.terrain] + "L"},
    legr: {plural: "legsr", z: 0, partName: robot => ["walk", "fly"][robot.terrain] + "R"},
  },
  STATES: [ // Possible states for this robot
    rb.states.robot.walk, // The first is the state executed on startup
    rb.states.robot.still,
    rb.states.robot.attack,
    rb.states.robot.die
  ],

  ctor: function(level, dna) {
    //TODO que funcione el balanceo, poder hacer que un robot sea de tipo +1 y eso
    if (arguments.length === 0) return; // Hack for getting only the properties defined above
    this._super.apply(this, arguments);
    this.scheduleUpdate();
  },
  toString: function() {
    return "Robot";
  },
  getTarget: function() {
    // This function returns the defense to which this robot has to attack

    //Looks for defenses or the base in robot range
    var inRange = this.level.defenses.concat(this.level.base).filter(function(target) {
      return this.getDistanceTo(target) <= this.sRange;
    }, this);
    //if no defense in range return null
    if (inRange.length === 0) {
      this.target = null;
      if (this.isInState('attack')) this.setState('walk');
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
  destroy: function() {
    this.level.prevWaveRobots.push([this.getDNA(), this.getScore()]);
    this.level.hud.ig.addGold(30);
    this._super();
  },
  counter: 0.0, // TODO counter is being used in the attack state but it is not clear if it is here
  update: function(delta) {
    var target = this.getTarget();
    if (target && this.isInState('walk')) this.setState('attack', {target: target});
  },
});
