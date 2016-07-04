var Deffense = cc.Sprite.extend({
  level: null,//Level where this object is placed
  pointing: null,//Looking direction TODO
  animAttackSpeed: 1.0,//Attack speed animation

  //Possible (p) stats
  pRange: {0: 700, 1: 2000},
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
    inRange = [];
    for (var i = 0; i < this.level.robots.length; i++) {
      distance = cc.pDistance(
        this.getPosition(),
        this.level.robots[i].getPosition()
      );
      if (distance <= this.sRange) {
        console.log("INRANGE");
      }
      console.log(distance);
    }
    return "PATO";
  },
  fire: function(target){
    // console.log(target);
  },
  debug: function(){
    //comment and uncomment this lines to debug or not
    this.debugRange();
  },
  debugRange: function(){
    //draws a circle from the deffense center to debug ranges
    var pos = this.getPosition();
    console.log(this.scale);
    var radius = this.sRange / this.scale;
    var color = cc.color(1, 179, 255, 100);
    var circle = new cc.DrawNode();
    circle.drawDot(pos, radius, color);
    circle.setName("debugCircle");
    this.addChild(circle, -1);
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
