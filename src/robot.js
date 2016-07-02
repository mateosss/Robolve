var Robot = cc.Sprite.extend({
  pointing: null,//A donde esta mirando
  animSpeed: 1.0,//Walk speed animation
  animAttackSpeed: 1.0,//Walk speed animation

  //Possible (p) stats
  pLife: {0: 300, 1: 400, 2: 500},
  pRange: {0: 150, 1: 500},
  pTerrain: {0: 'walk',1: 'fly'},
  pSpeed: {0: 0.1, 1: 0.2, 2: 0.3},
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

  //Las partes del robot objetos tipo Part()
  head: null,
  middle: null,
  armL: null,
  armR: null,
  legL: null,
  legR: null,
  
  ctor: function(life, element, range, terrain, speed, damage, attackSpeed){
    this._super(res.empty,0);

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
    } else {
      this.middle = new Part(res.invalidPart);
      this.sLife = this.pLife[0];
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

    this.scheduleUpdate();
  },
  walk: function(){
    this.x -= this.sSpeed;
    this.y -= this.sSpeed / 2;
  },
  update: function(){
    this.walk();
  },
});

var Part = cc.Sprite.extend({
  ctor:function(partImage) {
    this._super(partImage);
  },
});
