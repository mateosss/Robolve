var Robot = cc.Sprite.extend({
  level: null,//Level where this object is placed
  destroy: false,//If true level will delete this robot
  pointing: null,//Looking direction TODO
  animSpeed: 1.0,//Walk speed animation
  animAttackSpeed: 1.0,//Attack speed animation
  cLife: null, //Current Life

  //Possible (p) stats //TODO definir valores reales //TODO apply fuzzy logic
  pLife: {0: 300, 1: 400, 2: 500},
  pElement: {
    "electric": cc.color(255, 231, 0 ,255),
    "fire": cc.color(227, 43, 0, 255),
    "water": cc.color(1, 179, 255, 255)
  },
  pRange: {0: 150, 1: 500},
  pTerrain: {0: 'walk',1: 'fly'},
  pSpeed: {0: 0.1, 1: 0.5, 2: 0.9},
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
      console.log("Life value incorrect, setting 0");
    }

    if (this.range in this.pRange) {
      this.armL = new Part(res.parts.arms[this.element + this.range + "L"]);
      this.armR = new Part(res.parts.arms[this.element + this.range + "R"]);
      this.sRange = this.pRange[this.range];
    } else {
      this.armL = new Part(res.invalidPart);
      this.armR = new Part(res.invalidPart);
      this.sRange = this.pRange[0];
      console.log("Range value incorrect, setting 0");
    }

    if (this.terrain in this.pTerrain) {
      this.legL = new Part(res.parts.legs[this.pTerrain[this.terrain] + 'L']);
      this.legR = new Part(res.parts.legs[this.pTerrain[this.terrain] + 'R']);
    } else {
      this.legL = new Part(res.invalidPart);
      this.legR = new Part(res.invalidPart);
      console.log("Terrain value incorrect");
    }

    if (this.speed in this.pSpeed) {
      this.sSpeed = this.pSpeed[this.speed];
      this.animSpeed = this.pSpeed[this.speed];
    } else {
      this.sSpeed = this.pSpeed[0];
      this.animSpeed = this.pSpeed[0];
      console.log("Speed value incorrect, setting 0");
    }

    if (this.damage in this.pDamage) {
      this.sDamage = this.pDamage[this.damage];
      this.head = new Part(res.parts.heads[this.element + this.damage]);
    } else {
      this.sDamage = this.pDamage[0];
      this.head = new Part(res.invalidPart);
      console.log("Damage value is incorrect, setting 0");
    }

    if (this.attackSpeed in this.pAttackSpeed) {
      this.sAttackSpeed = this.pAttackSpeed[this.attackSpeed];
    } else {
      this.sAttackSpeed = this.pAttackSpeed[0];
      console.log("Attack Speed value incorrect, setting 0");
    }

    this.addChild(this.head,2);
    this.addChild(this.middle,1);
    this.addChild(this.armL,3);
    this.addChild(this.armR,0);
    this.addChild(this.legL,0);
    this.addChild(this.legR,0);

    this.createHealthBar();

    this.debug();

    this.scheduleUpdate();
  },
  toString: function(){
    return "Robot";
  },
  createHealthBar: function(){
    //Creates two rectangles for representing the healtbar
    //TODO rotate 30 degrees and skewY to simulate perspective on hpbar
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
    back.y += 500;
    front.y += 500;
    front.setName("hpbar");
    this.addChild(back, 10);
    this.addChild(front, 11);
  },
  updateHealthBar: function(){
    //updates the healthbar length with the sLife stat
    var hpbar = this.getChildByName("hpbar");
    hpbar.setScaleX(this.cLife / this.sLife);
  },
  walk: function(){
    //moves the robot by the speed
    //TODO move using this.pointing property
    this.x -= this.sSpeed;
    this.y -= this.sSpeed / 2;
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
  update: function(delta){
    this.walk();
  },
});

var Part = cc.Sprite.extend({
  ctor:function(partImage) {
    this._super(partImage);
  },
  toString: function(){
    return "Part";
  },
});
