var Robot = cc.Sprite.extend({
  pointing: null,//A donde esta mirando
  animSpeed: 1.0,//Velocidad de reproduccion de la animacion

  //Stats son int que quedan despues del random
  sLife: null,
  sSpeed: null,
  sDamage: null,
  // sRange: null,? TODO
  sAttackSpeed: null,

  //Tipos seteados del robot
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
    // var size = cc.winSize;
    // this.x = size.width / 2;//TODO sacar
    // this.y = size.height / 2;//TODO sacar
    // this.scale = 0.2;//TODO sacar

    this.life = life;
    this.element = element;
    this.range = range;
    this.terrain = terrain;
    this.speed = speed;
    this.damage = damage;
    this.attackSpeed = attackSpeed;

    switch (this.life) {
      // TODO Calcular el sLife, (con logica borrosa|fuzzy logic)
      case -1:
      middle = res.parts.middles.weak;
      break;
      case 0:
      middle = res.parts.middles.normal;
      break;
      case 1:
      middle = res.parts.middles.strong;
      break;
      default:
      middle = res.invalidPart;
      console.log("This life value is incorrect");
    }
    this.middle = new Part(middle);

    switch (this.range) {
      case -1:
      armL = res.parts.arms[this.element + "MeleL"];
      armR = res.parts.arms[this.element + "MeleR"];
      break;
      case 1:
      armL = res.parts.arms[this.element + "RangeL"];
      armR = res.parts.arms[this.element + "RangeR"];
      break;
      default:
      armL = res.invalidPart;
      armR = res.invalidPart;
      console.log("This range value is incorrect");
    }
    this.armL = new Part(armL);
    this.armR = new Part(armR);

    switch (this.terrain) {
      case -1:
      legL = res.parts.legs.walkL;
      legR = res.parts.legs.walkR;
      break;
      case 1:
      legL = res.parts.legs.flyL;
      legR = res.parts.legs.flyR;
      break;
      default:
      legL = res.invalidPart;
      legR = res.invalidPart;
      console.log("This terrain value is incorrect");
    }
    this.legL = new Part(legL);
    this.legR = new Part(legR);

    switch (this.speed) {
      // TODO
      case -1:
      speed = 0.2;
      break;
      case 0:
      speed = 0.2;
      break;
      case 1:
      speed = 0.2;
      break;
      default:
      console.log("This speed value is incorrect");
    }
    this.sSpeed = speed;
    this.animSpeed = speed;

    switch (this.damage) {
      case -1:
      head = res.parts.heads[this.element+"Weak"];
      break;
      case 0:
      head = res.parts.heads[this.element+"Normal"];
      break;
      case 1:
      head = res.parts.heads[this.element+"Strong"];
      break;
      default:
      head = res.invalidPart;
      console.log("This damage value is incorrect");
    }
    this.head = new Part(head);

    switch (this.attackSpeed) {
      // TODO
      case -1:
      break;
      case 0:
      break;
      case 1:
      break;
      default:
      console.log("This attackSpeed value is incorrect");
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
