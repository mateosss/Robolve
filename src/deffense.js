var Deffense = cc.Sprite.extend({
  level: null,// Level where this object is placed
  target: null,// Target robot to fire
  pointing: null,// Looking direction TODO
  animAttackSpeed: 1.0,// Attack speed animation
  cTilePos: null, // Current tile position
  isDummy: false, // If it is a dummy deffense, (a.k.a. a deffense preview in the map)

  // Possible (p) stats
  pElement: {
    "electric": "Electro",
    "fire": "Fire",
    "water": "Water"
    // "electric": res.ui.yellowBtnDS,
    // "fire": res.ui.redBtnDS,
    // "water": res.ui.blueBtnDS
  },
  pRange: {0: 200, 1: 300, 2:500},
  pTerrain: {0: 'walk',1: 'fly'},
  pDamage: {0: 25, 1: 50, 2:75},
  pAttackSpeed: {0: 0.5, 1: 1.0, 2: 2.0},
  // Stats (s)
  sRange: null,
  sDamage: null,
  sAttackSpeed: null,

  // Initial values
  element: null,
  range: null,
  terrain: null,
  damage: null,
  attackSpeed: null,

  ctor:function(level, element, range, terrain, damage, attackSpeed) {
    if (arguments.length === 0) {
      return;
    }
    // Defines the initial values and stats by searching on possible stats
    this.level = level;

    this.element = element;
    this.range = range;
    this.terrain = terrain;
    this.damage = damage;
    this.attackSpeed = attackSpeed;

    this.refreshStats();

    if (this.element == 'electric') {
      this._super(res.electricDeffense);
    } else if (this.element == 'fire') {
      this._super(res.fireDeffense);
    } else if (this.element == 'water') {
      this._super(res.waterDeffense);
    }

    // this.debug();
    this.setAnchorPoint(0.5, 0.1);
    if (!this.isDummy) {
      this.setTouchEvent();
      this.scheduleUpdate();
    }

  },
  toString: function() {
    return "Deffense";
  },
  refreshStats: function() {
    this.sRange = this.pRange[this.range];
    this.sDamage = this.pDamage[this.damage];
    this.sAttackSpeed = this.pAttackSpeed[this.attackSpeed];
  },
  setTouchEvent: function() {
    easyTouchEnded(this, function(deffense) {
      if (deffense.getNumberOfRunningActions() === 0) {
        if (!deffense.level.dummyDeffense && !deffense.isDummy) {
          var increase = new cc.ScaleBy(0.1, 1.2);
          var decrease = new cc.ScaleBy(0.1, 1 / 1.2);
          deffense.runAction(new cc.Sequence(increase, decrease));
          deffense.level.hud.dd.show(deffense);
        }
      }
    });
  },
  getTarget: function(){
    // This function returns the robot to which this deffense has to attack

    //Looks for robots in tower range
    inRange = [];
    for (var i = 0; i < this.level.robots.length; i++) {
      var deffenseCenter = this.getPosition();
      var robotCenter = this.level.robots[i].getPosition();
      var distance = cc.pDistance(deffenseCenter, robotCenter);
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
    var base = cc.p(0,0); //TODO use the real base object position
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
  fire: function(target){
    //TODO comprobar territorio
    if (target) {
      target.hurt(this);
    }
  },
  die: function() {
    // Call the level kill function to kill this deffense
    this.level.killDeffense(this);
    this.removeFromParent();
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
      return {result: false, cause: "Can't place on a road"};
    } else {
      for (var i = 0; i < this.level.deffenses.length; i++) {
        if (cc.pointEqualToPoint(
          this.level.map.tileCoordFromChild(this.level.deffenses[i]),
          tilePos
        )) {
          return {result: false, cause: "There is already a tower there"};
        }
      }
      return {result: true, cause: "Placed - $300"}; // TODO estos mensajes no estan muy bien aca
    }
  },
  counter: 0.0,
  update: function(delta){
    if (this.isDummy) {
      // if the deffense is not a real one, just a preview
    } else {
      if (this.counter < 1 / this.sAttackSpeed) {
        this.counter += delta;
      } else {
        this.counter = 0.0;
        this.fire(this.getTarget());
      }
    }
  }
});
