var Robot = cc.Sprite.extend({
  level: null, //Level where this object is placed
  destroy: false, //If true level will delete this robot
  pointing: 2, //Looking direction 0:North, 1:East, 2:South, 3:West
  animSpeed: 1.0, //Walk speed animation
  animAttackSpeed: 1.0, //Attack speed animation
  cLife: null, //Current Life
  cTurn: 1, //Current probability of turning of the robot

  //Possible (p) stats //TODO definir valores reales //TODO apply fuzzy logic
  pLife: {0: 300, 1: 400, 2: 500},
  pElement: {
    "electric": cc.color(255, 231, 0 ,255),
    "fire": cc.color(227, 43, 0, 255),
    "water": cc.color(1, 179, 255, 255)
  },
  pRange: {0: 50, 1: 150},
  pTerrain: {0: 'walk',1: 'fly'},
  // pSpeed: {0: 0.1, 1: 0.5, 2: 0.5},
  pSpeed: {0: 5, 1: 15, 2: 30},//TODO DELETE uncomment above
  pDamage: {0: 5, 1: 15, 2:20},
  pAttackSpeed: {0: 0.5, 1: 1.0, 2: 1.5},

  //Stats (s)
  sLife: null,
  sRange: null,
  sSpeed: null,
  sDamage: null,
  sAttackSpeed: null,

  //Initial values
  life: null,
  element: null,
  range: null,
  terrain: null,
  speed: null,
  damage: null,
  attackSpeed: null,

  //Part objects
  head: null,
  middle: null,
  armL: null,
  armR: null,
  legL: null,
  legR: null,

  ctor: function(level, life, element, range, terrain, speed, damage, attackSpeed){
    //TODO que funcione el balanceo, poder hacer que un robot sea de tipo +1 y eso
    this._super(res.empty);

    this.setAnchorPoint(0.5, 0.0);

    this.level = level;

    this.life = life;
    this.element = element;
    this.range = range;
    this.terrain = terrain;
    this.speed = speed;
    this.damage = damage;
    this.attackSpeed = attackSpeed;

    if (this.life in this.pLife){
      this.middle = new Part(res.parts.middles[this.life]);
      this.sLife = this.pLife[this.life];
      this.cLife = this.sLife;
    } else {
      this.middle = new Part(res.invalidPart);
      this.sLife = this.pLife[0];
      this.cLife = this.sLife;
      console.warn("Life value incorrect, setting 0");
    }

    if (this.range in this.pRange) {
      this.armL = new Part(res.parts.arms[this.element + this.range + "L"]);
      this.armR = new Part(res.parts.arms[this.element + this.range + "R"]);
      this.sRange = this.pRange[this.range];
    } else {
      this.armL = new Part(res.invalidPart);
      this.armR = new Part(res.invalidPart);
      this.sRange = this.pRange[0];
      console.warn("Range value incorrect, setting 0");
    }

    if (this.terrain in this.pTerrain) {
      this.legL = new Part(res.parts.legs[this.pTerrain[this.terrain] + 'L']);
      this.legR = new Part(res.parts.legs[this.pTerrain[this.terrain] + 'R']);
    } else {
      this.legL = new Part(res.invalidPart);
      this.legR = new Part(res.invalidPart);
      console.warn("Terrain value incorrect");
    }

    if (this.speed in this.pSpeed) {
      this.sSpeed = this.pSpeed[this.speed];
      this.animSpeed = this.pSpeed[this.speed];
    } else {
      this.sSpeed = this.pSpeed[0];
      this.animSpeed = this.pSpeed[0];
      console.warn("Speed value incorrect, setting 0");
    }

    if (this.damage in this.pDamage) {
      this.sDamage = this.pDamage[this.damage];
      this.head = new Part(res.parts.heads[this.element + this.damage]);
    } else {
      this.sDamage = this.pDamage[0];
      this.head = new Part(res.invalidPart);
      console.warn("Damage value is incorrect, setting 0");
    }

    if (this.attackSpeed in this.pAttackSpeed) {
      this.sAttackSpeed = this.pAttackSpeed[this.attackSpeed];
    } else {
      this.sAttackSpeed = this.pAttackSpeed[0];
      console.warn("Attack Speed value incorrect, setting 0");
    }

    this.addChild(this.head, 2);
    this.addChild(this.middle, 1);
    this.addChild(this.armL, 3);
    this.addChild(this.armR, 0);
    this.addChild(this.legL, 0);
    this.addChild(this.legR, 0);

    this.createHealthBar();

    this.debug();

    this.scheduleUpdate();
  },
  toString: function(){
    return "Robot";
  },
  createHealthBar: function(){
    //Creates two rectangles for representing the healtbar
    //TODO La healthbar se ve mal compilado para linux y android
    var originB = cc.p(-100, 0);
    var originF = cc.p(-95, 5);
    var destinationB = cc.p(100, 50);
    var destinationF = cc.p(95, 45);
    var fillColorB = cc.color(0, 0, 0, 255);
    var fillColorF = this.pElement[this.element];

    var back = new cc.DrawNode();
    var front = new cc.DrawNode();
    back.drawRect(originB, destinationB, fillColorB);
    front.drawRect(originF, destinationF, fillColorF);
    front.setAnchorPoint(0.0, 0.0);
    back.y += 900;
    front.y += 900;
    back.x += 30;
    front.x += 30;
    back.setRotationY(30);
    front.setRotationY(30);
    front.setName("hpbar");
    this.addChild(back, 10);
    this.addChild(front, 11);
  },
  updateHealthBar: function(){
    //updates the healthbar length with the sLife stat
    var hpbar = this.getChildByName("hpbar");
    hpbar.setScaleX(this.cLife / this.sLife);
  },
  fire: function(target){//TODO repetido en defensa hacer buena clase padre
    if (target) {
      target.hurt(this);
    }
  },
  getTarget: function(){//TODO otra vez se repite en defensa
    var robotCenter = this.getAnchorPointInPoints();
    robotCenter = this.convertToWorldSpace(robotCenter);
    robotCenter = this.level.map.convertToNodeSpace(robotCenter);
    var baseCenter = this.level.base.getPosition();
    var distance = cc.pDistance(robotCenter, baseCenter);
    if (distance <= this.sRange) {
      return this.level.base;
    } else {
      return false;
    }
  },
  canTurn: function(){
    //Returns what direction the robot can turn if it can or false
    var currTilePos = this.level.map.tileCoordFromChild(this);
    var tile = this.level.map.getLayer("Background").getTileGIDAt(currTilePos);
    var tileProps = this.level.map.getPropertiesForGID(tile) || {};
    var turnable = tileProps.hasOwnProperty('turn');
    if (turnable) {
      var turnDirections = tileProps.turn.split(",");
      if (turnDirections instanceof Array) {
        return turnDirections.map(Number);
      }
    }
    return false;
  },
  turn: function(turnDirections){
    if (turnDirections) {
      newDirection = Math.floor((Math.random() * turnDirections.length));
      this.pointing = turnDirections[newDirection];
    }
    return false;
  },
  walk: function(){
    //moves the robot by the speed in a direction
    //TODO move using this.pointing property
    if (this.pointing === 0) {
      xDirection = 1;
      yDirection = 1;
    } else if (this.pointing == 1) {
      xDirection = 1;
      yDirection = -1;
    } else if (this.pointing == 2) {
      xDirection = -1;
      yDirection = -1;
    } else if (this.pointing == 3) {
      xDirection = -1;
      yDirection = 1;
    } else {
      xDirection = 1;
      yDirection = 1;
      console.warn("Bad robot orientation, setting 0");
    }
    this.x += this.sSpeed * xDirection;
    this.y += (this.sSpeed / 2) * yDirection;
  },
  hurt: function(deffense){
    //This function calculates the total damage of the bullet depending on the
    //Tower, and do some things in reaction
    //#TODO daño en funcion del elemento
    this.cLife -= deffense.sDamage;
    if (this.cLife <= 0) {
      this.life = 0;
      this.kill();
    }
    this.updateHealthBar();
  },
  kill: function(){
    //In the next frame the level will remove the robots with destroy==true
    this.destroy = true;
  },
  getScore: function(){
    //#TODO definir que es lo que te da el score. cuanto vive solamente?
    // o tambien cuanto daño hace, que tan cerca de la base llega,
    //si todavia no murio cuanto va viviendo
  },
  debug: function(){
    // Creates a debugger for verbose information directly on the canvas
    this.debugger = new Debugger(this);
    this.debugger.methods = [ // Modify this to add debug information
      { method: this.debugger.debugAnchor },
    ];
    this.debugger.debug();
  },
  counter: 0.0,
  update: function(delta){
    var base = this.getTarget();
    if (this.counter < this.sAttackSpeed) {
      this.counter += delta;
    } else {
      this.counter = 0.0;
      this.fire(base);
    }

    this.turn(this.canTurn());

    if (!base) {
      this.walk();
    }
  },
});

var Part = cc.Sprite.extend({
  ctor:function(partImage) {
    this._super(partImage);
    this.setAnchorPoint(0.5, 0.1);
  },
  toString: function(){
    return "Part";
  },
});
