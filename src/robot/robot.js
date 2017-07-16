var Robot = Computer.extend({
  // TODO definir valores reales // TODO apply fuzzy logic
  STATS: new Map([
    ['turnProb', {0: 0.25, 1: 0.5, 2: 0.9}],
    ['life', {0: 500, 1: 600, 2: 700}],
    ['element', {
      electric: cc.color(255, 231, 0 ,255),
      fire: cc.color(227, 43, 0, 255),
      water: cc.color(1, 179, 255, 255)
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
    rb.states.robot.still,
    rb.states.robot.walk,
    rb.states.robot.attack
  ],

  ctor: function(level, dna) {
    //TODO que funcione el balanceo, poder hacer que un robot sea de tipo +1 y eso
    if (arguments.length === 0) return; // Hack for getting only the properties defined above
    this._super.apply(this, arguments);
    this.setState("walk");
    // this.debug();
    this.scheduleUpdate();
  },
  toString: function() {
    return "Robot";
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
  counter: 0.0,
  update: function(delta) {
    var base = this.getTarget();
    if (base && this.isInState('walk')) this.setState('attack', {base: base});
  },
});
