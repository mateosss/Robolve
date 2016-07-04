var Deffense = cc.Sprite.extend({
  level: null,//Level where this object is placed
  target: null,//Target robot to fire
  pointing: null,//Looking direction TODO
  animAttackSpeed: 1.0,//Attack speed animation

  //Possible (p) stats
  pRange: {0: 100, 1: 2000},
  pTerrain: {0: 'walk',1: 'fly'},
  pDamage: {0: 25, 1: 50, 2:75},
  pAttackSpeed: {0: 0.5, 1: 1.0, 2: 1.5},

  //Stats (s)
  sRange: null,
  sDamage: null,
  sAttackSpeed: null,

  //Initial values
  element: null,
  range: null,
  terrain: null,
  damage: null,
  attackSpeed: null,

  ctor:function(level, element, range, terrain, damage, attackSpeed) {
    //Defines the initial values and stats by searching on possible stats
    this._super(res.deffense);
    this.level = level;

    this.element = element;
    this.range = range;
    this.terrain = terrain;
    this.damage = damage;
    this.attackSpeed = attackSpeed;

    this.sRange = this.pRange[this.range];
    this.sDamage = this.pDamage[this.damage];
    this.sAttackSpeed = this.pAttackSpeed[this.attackSpeed];

    this.debug();

    this.scheduleUpdate();
  },
  toString: function(){
    return "Deffense";
  },
  getTarget: function(){
    //This function returns the robot to which this deffense has to attack
    /*
    detectar que robots estan en el rango de esta torre
    TODO detectar que robot esta mas cerca de la base y en el rango
    */

    //Looks for robots in tower range
    inRange = [];
    for (var i = 0; i < this.level.robots.length; i++) {
      var deffenseCenter = this.getAnchorPointInPoints();
      deffenseCenter = this.convertToWorldSpace(deffenseCenter);
      deffenseCenter = this.level.map.convertToNodeSpace(deffenseCenter);
      var robotCenter = this.level.robots[i].getPosition();
      var distance = cc.pDistance(deffenseCenter, robotCenter);
      if (distance <= this.sRange) {
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
    console.log(target);
  },
  debug: function(){
    //comment and uncomment this lines to debug or not
    this.debugRange();
    this.debugCenter();
  },
  debugRange: function(){
    //draws a circle from the deffense center to debug ranges
    // var pos = this.getAnchorPointInPoints();
    var pos = this.getAnchorPointInPoints();
    var radius = this.sRange / this.level.map.CHILD_SCALE;
    var color = cc.color(1, 179, 255, 100);
    var circle = new cc.DrawNode();
    circle.drawDot(pos, radius, color);
    circle.setName("debugCircle");
    this.addChild(circle, -1);
  },
  debugCenter: function(){
    //draws a circle from the deffense center to debug ranges
    var pos = this.getAnchorPointInPoints();
    var radius = 10;
    var color = cc.color(200, 0, 200, 255);
    var circle = new cc.DrawNode();
    circle.drawDot(pos, radius, color);
    circle.setName("debugCenter");
    this.addChild(circle, 999);
  },
  counter: 0.0,
  update: function(delta){
    if (this.counter < this.sAttackSpeed) {
      this.counter += delta;
    } else {
      this.counter = 0.0;
      this.fire(this.getTarget());
    }
  }
});

var ammo;
