var Base = cc.Sprite.extend({
  level: null, // Level where this object is placed
  money: 1200, // Player money
  cLife: null, // Current life
  sLife: null, // Initial life
  cTilePos: null, // Current Tile Position
  ctor: function(level, life){
    this._super(res.base);
    this.level = level;
    this.sLife = this.cLife = life;
    this.setAnchorPoint(0.5, 0.1);
    this.createHealthBar();
    this.debug();
  },
  toString: function(){
    return "Base";
  },
  debug: function(){
    // Creates a debugger for verbose information directly on the canvas
    this.debugger = new Debugger(this);
    this.debugger.methods = [ // Modify debug information on canvas
      { method: this.debugger.debugAnchor },
      // { method: this.debugger.debugRange },
    ];
    this.debugger.debug();
  },
  createHealthBar: function(){
    //TODO Repeating from robot, maybe has to go in debugger
    //Creates two rectangles for representing the healtbar
    var originB = cc.p(-60, 0);
    var originF = cc.p(-56, 4);
    var destinationB = cc.p(60, 30);
    var destinationF = cc.p(56, 26);
    var fillColorB = cc.color(0, 0, 0, 255);
    var fillColorF = cc.color(0, 200, 100, 255);

    var back = new cc.DrawNode();
    var front = new cc.DrawNode();
    back.drawRect(originB, destinationB, fillColorB, 0, fillColorB);
    front.drawRect(originF, destinationF, fillColorF, 0, fillColorF);
    front.setAnchorPoint(0.0, 0.0);
    front.setPosition(this.getAnchorPointInPoints());
    back.setPosition(this.getAnchorPointInPoints());
    back.setRotationY(30);
    front.setRotationY(30);
    back.y += 112;
    front.y += 112;
    front.setName("hpbar");
    this.addChild(back, 10);
    this.addChild(front, 11);
  },
  updateHealthBar: function(){
    //updates the healthbar length with the sLife stat
    var hpbar = this.getChildByName("hpbar");
    hpbar.setScaleX(this.cLife / this.sLife);
  },
  hurt: function(robot){
    //This function calculates the total damage of the bullet depending on the
    //Robot, and do some things in reaction
    var totalDamage = robot.sDamage;
    this.cLife -= totalDamage;
    if (this.cLife <= 0) {
      this.life = 0;
      this.kill();
    }
    this.updateHealthBar();
    return totalDamage;
  },
  kill: function(){
    cc.director.runScene(new cc.TransitionFlipX(1.5, new Menu("Game Over")));
  },
});
