var Character = cc.Sprite.extend({
  sm: null, // Character StateMachine
  STATES: [ // Possible states for this robot
    rb.states.character.still, // default state
    rb.states.character.move,
    rb.states.character.build,
    rb.states.character.attack,
  ],

  // Stats
  sSpeed: 4.0,
  sBuildRange: 75,
  sBuildTime: 5.0,
  sAttackRange: 150,
  sAttackSpeed: 2.0,
  sDamage: 100,

  pointing: 2, // Looking direction 0:North, 1:East, 2:South, 3:West
  target: null, // Target defense/robot/position of the character
  ctor: function() {
    this._super(r.character);
    window.c = this; // XXX
    this.setAnchorPoint(0.5, 0.0);
    this.sm = new StateMachine(this);
    this.scheduleUpdate();
  },

  // Action Triggers
  goBuild: function(defense) {
    this.sm.setState('move');
    this.setTarget(defense);
  },
  goAttack: function(robot) {
    this.sm.setState('move');
    this.setTarget(robot);
  },

  setTarget: function(target) {
    // TODO indicate by hud the target selected
    this.target = target;
  },
  cleanTarget: function() {
    // TODO Clear hud indication made by setTarget
    this.target = null;
  },

  move: function() {
    if (!this.target) this.sm.setDefaultState();
    let dir = cc.pNormalize(cc.pSub(this.target, this));
    this.x += this.sSpeed * dir.x;
    this.y += (this.sSpeed / 2) * dir.y;
  },
  getDistanceTo: function(to) { return cc.pDistance(this, to); },
  getCurrentRange: function() { // returns a range to use based on the current target
    if (!this.target) return -1;
    else if (this.target instanceof Defense) return this.sBuildRange;
    else if (this.target instanceof Robot) return this.sAttackRange;
    else return this.sSpeed; // Default range for reaching a point
  },
  isTargetInRange: function() {
    if (!this.target) return false;
    let target = cc.p(this.target.x, this.target.y); // Target may be a point or a node
    return this.getDistanceTo(this.target) < this.getCurrentRange();
  },
  attack: function(target) {
    if (target) target.hurt(this);
  },
  update: function() {
    if (this.isTargetInRange() && this.sm.isInState('move')){
      if (this.target instanceof Defense) this.sm.setState('build');
      else if (this.target instanceof Robot) this.sm.setState('attack', {target: this.target});
      else this.sm.setDefaultState();
    }
  },
  toString: () => "Character"
});
