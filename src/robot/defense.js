var Defense = Computer.extend({
  target: null,// Target robot to fire
  animAttackSpeed: 1.0,// Attack speed animation
  isDummy: false, // If it is a dummy defense, (a.k.a. a defense preview in the map)
  STATS: new Map([
    ['life', {0: 500, 1: 600, 2: 700}],
    ['element', {
      electric: "Electro",
      fire: "Fire",
      water: "Water",
    }],
    ['range', {0: 200, 1: 300, 2: 500}],
    ['terrain', {0: 'walk', 1: 'fly'}],
    ['damage', {0: 25, 1: 50, 2:75}],
    ['attackSpeed', {0: 0.5, 1: 1.0, 2: 2.0}],
  ]),
  PARTS: { // Necessary info for the parts to make a defense
    base: {plural: "bases", z: 0, partName: defense => defense.element},
  },
  STATES: [ // Possible states for this defense
    rb.states.defense.idle,
    rb.states.defense.attack,
    rb.states.die
  ],
  ctor:function(level, life, element, range, terrain, damage, attackSpeed) {
    if (arguments.length === 0) return;
    this._super.apply(this, arguments);
    // this.debug();
    this.setAnchorPoint(0.5, 0.1); // TODO quirk because of the bad tiles proportions
    if (!this.isDummy) {
      this.setTouchEvent();
      this.scheduleUpdate();
    }
  },
  toString: function() {
    return "Defense";
  },
  setTouchEvent: function() {
    easyTouchEnded(this, function(defense) {
      if (defense.getNumberOfRunningActions() === 0) {
        if (!defense.level.dummyDefense && !defense.isDummy) {
          var increase = new cc.ScaleBy(0.1, 1.2);
          var decrease = new cc.ScaleBy(0.1, 1 / 1.2);
          defense.runAction(new cc.Sequence(increase, decrease));
          defense.level.hud.dd.show(defense);
        }
      }
    });
  },
  getTarget: function(){
    // This function returns the robot to which this defense has to attack

    //Looks for robots in tower range
    inRange = [];
    for (var i = 0; i < this.level.robots.length; i++) {
      var defenseCenter = this.getPosition();
      var robotCenter = this.level.robots[i].getPosition();
      var distance = cc.pDistance(defenseCenter, robotCenter);
      if (distance <= this.sRange && this.level.robots[i].terrain == this.terrain) {
        inRange.push(this.level.robots[i]);
      }
    }

    //if no robot in range return null
    if (inRange.length === 0) {
      this.target = null;
      return null;
    }

    //If there is robots in range proceed to detect which of them is closest
    //To the base, set it to target and return it
    var base = this.level.map.tileCoordFromChild(this.level.base);
    // var base = this.level.base.getPosition();
    var minDistanceToBase = 0;
    var closestRobotPos = null;
    inRange.filter(function(robot){
      var distanceToBase = cc.pDistance(robot.getPosition(), base);
      if (minDistanceToBase <= 0 || distanceToBase < minDistanceToBase) {
        minDistanceToBase = distanceToBase;
        closestRobotPos = robot.getPosition();
      }
      return false;
    });
    this.target = inRange.find(function(robot){
      if(cc.pointEqualToPoint(robot.getPosition(), closestRobotPos)){
        return true;
      }
    });

    return this.target;
  },
  debug: function(){
    // Creates a debugger for verbose information directly on the canvas
    this.debugger = new Debugger(this);
    this.debugger.methods = [ // Modify debug information on canvas
      // { method: this.debugger.debugAnchor },
      { method: this.debugger.debugRange },
    ];
    this.debugger.debug();
  },
  canBePlacedOn: function(tilePos) {
    var tile = this.level.map.getLayer("Background").getTileGIDAt(tilePos);
    var tileProps = this.level.map.getPropertiesForGID(tile) || {};
    var isRoad = tileProps.hasOwnProperty('road');
    if (isRoad && tileProps.road == "1") {
      return {result: false, cause: "Can't place on here"};
    } else {
      for (var i = 0; i < this.level.defenses.length; i++) {
        if (cc.pointEqualToPoint(
          this.level.map.tileCoordFromChild(this.level.defenses[i]),
          tilePos
        )) {
          return {result: false, cause: "There is already a tower there"};
        }
      }
      return {result: true, cause: "Placed - $300"}; // TODO estos mensajes no estan muy bien aca
    }
  },
  counter: 0.0,
  update: function(delta) {
    var target = this.getTarget();
    if (!this.isDummy && target && this.isInState('idle')) {
      this.setState('attack', {target: target});
    }
  }
});
