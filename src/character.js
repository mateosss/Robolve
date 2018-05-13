var Character = cc.Sprite.extend({
  sm: null, // Character StateMachine
  STATES: [ // Possible states for this robot
    rb.states.character.still, // default state
    rb.states.character.move,
    rb.states.character.build,
  ],

  // Stats
  speed: 1,
  buildRange: 75,
  buildTime: 5,

  pointing: 2, // Looking direction 0:North, 1:East, 2:South, 3:West
  target: null, // Target defense/robot/position of the character
  ctor: function() {
    this._super(r.character);
    window.c = this; // XXX
    this.setAnchorPoint(0.5, 0.0);
    this.sm = new StateMachine(this);
    this.scheduleUpdate();
  },
  goBuild: function(defense) {
    this.sm.setState('move');
    this.setTarget(defense);
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
    this.x += this.speed * dir.x;
    this.y += (this.speed / 2) * dir.y;
  },
  getDistanceTo: function(to) { return cc.pDistance(this, to); },
  getCurrentRange: function() { // returns a range to use based on the current target
    if (!this.target) return -1;
    else if (this.target instanceof Defense) return this.buildRange;
    else return this.speed; // Default range for reaching a point
  },
  isTargetInRange: function() {
    if (!this.target) return false;
    let target = cc.p(this.target.x, this.target.y); // Target may be a point or a node
    return this.getDistanceTo(this.target) < this.getCurrentRange();
  },
  update: function() {
    if (this.isTargetInRange() && this.sm.isInState('move')){
      if (this.target instanceof Defense) this.sm.setState('build');
      else this.sm.setDefaultState();
    }
  },
  toString: () => "Character"
});
