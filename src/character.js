var Character = cc.Sprite.extend({
  level: null, // Level where this character is placed
  sm: null, // Character StateMachine
  STATES: [ // Possible states for this robot
    rb.states.character.still, // default state
    rb.states.character.move,
    rb.states.character.build,
    rb.states.character.repair,
    rb.states.character.improve,
    rb.states.character.attack,
  ],

  // Stats
  sSpeed: 4.0, // Speed of movement in units per second
  sBuildRange: 75, // Range for starting to build/repair/improve in units
  sBuildTime: 5.0, // Amount of seconds that it takes to build an new defense
  sImproveTime: 2.5, // Amount of seconds that it takes to improve a defense's stat
  sRepairAmount: 50, // Amount of life healed (repaired) to a defense in one second
  sAttackRange: 75, // Attack range in units, it is used half of this for reaching a target, and then this one is used
  sAttackSpeed: 2.0, // Amount of hits per seconds to a robot
  sDamage: 100, // Amount of damage per hit

  pointing: 2, // Looking direction 0:North, 1:East, 2:South, 3:West
  target: null, // Target defense/robot/position of the character
  ctor: function(level) {
    this._super(r.character);
    this.level = level;
    this.setAnchorPoint(0.5, 0.0);
    this.sm = new StateMachine(this);
    this.scheduleUpdate();
  },

  // Action Triggers
  goBuild: function(defense) {
    this.sm.setState('move');
    this.setTarget(defense);
  },
  goRepair: function(defense) {
    this.sm.setState('move');
    this.setTarget(defense);
  },
  goImprove: function(defense) {
    this.sm.setState('move');
    this.setTarget(defense);
  },
  goAttack: function(robot) {
    this.sm.setState('move');
    this.setTarget(robot);
  },

  getNewTarget: function() {
    // This function returns a robot inside of the character range

    //Looks for robots in character range
    let inRange = this.level.robots.filter(function(robot) {
      return this.getDistanceTo(robot) <= this.sAttackRange && robot.sLife > 0;
    }, this);

    // If there are robots in range proceed to detect which of them is closest
    // To the character, set it to target and return it
    let minDistanceToChar = 0;
    let closestRobot = null;
    inRange.forEach(function(robot) {
      let distanceToChar = cc.pDistance(robot, this);
      if (distanceToChar < minDistanceToChar || minDistanceToChar === 0) {
        minDistanceToChar = distanceToChar;
        closestRobot = robot;
      }
    }, this);
    return closestRobot;
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
    else if (this.target instanceof Robot) {
      // If moving toward target, I want to get really close for attacking, so if
      // the robot moves, I stil can hit it.
      if (this.sm.isInState('move')) return this.sAttackRange / 2;
      else return this.sAttackRange;
    }
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
    if (this.isTargetInRange() && this.sm.isInState('move')) {
      if (this.target instanceof Defense) {
        if (this.target.isBuilt()) {
          if (this.target.sm.isInState('improve')) this.sm.setState('improve');
          else this.sm.setState('repair');
        } else this.sm.setState('build');
      }
      else if (this.target instanceof Robot) this.sm.setState('attack', {target: this.target});
      else this.sm.setDefaultState();
    }
  },
  toString: () => "Character"
});
