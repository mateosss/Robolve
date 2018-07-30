var Character = cc.Sprite.extend({
  level: null, // Level where this character is placed
  sm: null, // Character StateMachine
  inventory: null,
  STATES: [ // Possible states for this robot
    rb.states.character.still, // default state
    rb.states.character.move,
    rb.states.character.build,
    rb.states.character.repair,
    rb.states.character.improve,
    rb.states.character.attack,
  ],

  // Stats
  sSpeed: 2.0, // Speed of movement in units per second
  sBuildRange: 75, // Range for starting to build/repair/improve in units
  sBuildTime: 10.0, // Amount of seconds that it takes to build an new defense
  sImproveTime: 5.0, // Amount of seconds that it takes to improve a defense's stat
  sRepairAmount: 50, // Amount of life healed (repaired) to a defense in one second
  sAttackRange: 75, // Attack range in units, it is used half of this for reaching a target, and then this one is used
  sAttackSpeed: 1.0, // Amount of hits per seconds to a robot
  sDamage: 50, // Amount of damage per hit

  pointing: 2, // Looking direction 0:North, 1:East, 2:South, 3:West
  target: null, // Target defense/robot/position of the character
  cAnimation: "still", // current animation name
  ctor: function(level) {
    this._super(r.character);
    this.setAnimation("still");
    this.level = level;
    this.setAnchorPoint(0.5, 0.0);
    this.sm = new StateMachine(this);

    this.inventory = new Inventory();
    SaveLoad.load(this.inventory);
    if (this.inventory.items.length === 0) { // TODO Not very well thought behaviour of inventory loading
      this.inventory.addItem(rb.items.gold, rb.prices.initialGold);
    }

    this.scheduleUpdate();
  },

  setPointing: function(x, y) { // sets this.pointing based on movement vector (x, y), and if needed calls setAnimation
    let dir; // dir = 0: North, 1: East, 2: South, 3: West
    if (x >= 0 && y > 0) dir = 0;
    else if (x >= 0 && y <= 0) dir = 1;
    else if (x < 0 && y <= 0) dir = 2;
    else if (x < 0 && y > 0) dir = 3;

    if (this.pointing === dir) return;

    let changeBack = (dir === 0 || dir === 3) !== (this.pointing === 0 || this.pointing === 3);
    this.pointing = dir;
    if (changeBack) this.setAnimation(this.cAnimation);
    else this.setFlippedX(dir % 2 === 1);
  },
  setAnimation: function(name, speed) {
    let dir = this.pointing;
    let isBack = dir === 0 || dir === 3;
    this.setFlippedX(dir % 2 === 1);
    let frames = [];
    for (let i = 1; i <= rb.animations.character[name]; i++) {
      let newFrame = name + "_" + (isBack ? "back_" : "") + _.zfill(i, 4) + ".png";
      frames.push(cc.spriteFrameCache.getSpriteFrame(newFrame));
    }
    let animation = new cc.Animation(frames, speed || 1 / 16);
    let action = new cc.RepeatForever(new cc.Animate(animation));
    this.stopAllActions();
    this.runAction(action);
    this.cAnimation = name;
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

  // Inventory related
  dropStack: function(stackIndex) { // Drops an item from an inventory grid cell to the ground
    let stack = this.inventory.items[stackIndex];
    this.inventory.items.splice(stackIndex, 1);
    new ItemPickup(this.level.map, this.getPosition(), stack.item, stack.quantity);
    this.level.hud.inventory.unselectStack();
    this.level.hud.inventory.refresh();
  },

  equipStack: function(stackIndex) {
    if (this.inventory.equiped.length < this.inventory.equipedCapacity) {
      // TODO All the implementation of equiped items is broken, but in particular I am sending all equiped items to the start of the inventory
      // which is a very weird thing
      let newIndex = this.inventory.getFirstNonEquipedStackIndex();
      _.swap(this.inventory.items, newIndex, stackIndex);
      let stack = this.inventory.items[newIndex];
      this.inventory.equiped.push(stack);
      stack.item.equip(this);

      this.level.hud.equipbar.refresh();
      let thumb = this.level.hud.inventory.grid.cells[newIndex].itemThumb; // TODO Asco
      thumb.button.callback(thumb, true); // TODO the true is for forcing a refresh
      return true;
    } else {
      this.level.hud.it.message("There's no room for more mods");
      return false;
    }
  },
  unequipStack: function(stackIndex) {
    // TODO All the implementation of equiped items is broken, but in particular I am sending all equiped items to the start of the inventory
    // which is a very weird thing
    _.assert(stackIndex < this.inventory.equiped.length, "This stack doesnt seem to be equiped");
    let firstNonEquiped = this.inventory.getFirstNonEquipedStackIndex();
    let newIndex = firstNonEquiped < 0 ? 0 : firstNonEquiped - 1;
    _.swap(this.inventory.items, newIndex, stackIndex);

    let stack = this.inventory.items[newIndex];
    this.inventory.equiped.splice(stackIndex, 1);
    stack.item.unequip(this);

    this.level.hud.equipbar.refresh();
    let thumb = this.level.hud.inventory.grid.cells[newIndex].itemThumb; // TODO Asco
    thumb.button.callback(thumb, true); // TODO the true is for forcing a refresh
  },

  setInventoryCapacity: function(capacity) {
    let removedStacks = this.inventory.setCapacity(capacity);
    for (var i = 0; i < removedStacks.length; i++) {
      new ItemPickup(this.level.map, this.getPosition(), removedStacks[i].item, removedStacks[i].quantity);
    }
  },

  getGold: function() {
    return this.inventory.getItemQuantity(rb.items.gold);
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
    let dir = cc.pSub(target, this);
    this.setPointing(dir.x, dir.y);
    this.target = target;
  },
  cleanTarget: function() {
    // TODO Clear hud indication made by setTarget
    this.target = null;
  },

  move: function() {
    if (!this.target) this.sm.setDefaultState();
    let dir = cc.pNormalize(cc.pSub(this.target, this));
    this.setPointing(dir.x, dir.y);
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
