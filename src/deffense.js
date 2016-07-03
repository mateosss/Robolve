var Deffense = cc.Sprite.extend({
  pointing: null,//Looking direction TODO
  animAttackSpeed: 1.0,//Attack speed animation

  //Possible (p) stats
  pRange: {0: 300, 1: 700},
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

  ctor:function(element, range, terrain, damage, attackSpeed) {
    this._super(res.deffense);
    this.sRange = this.pRange[this.range];
    this.sDamage = this.pDamage[this.damage];
    this.sAttackSpeed = this.pAttackSpeed[this.attackSpeed];
    this.scheduleUpdate();
  },
  toString: function(){
    return "Deffense";
  },
  update: function(){
    //TODO detect if there is any enemy close enough to shoot and shoot it
  }
});

var ammo;
