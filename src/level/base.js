var Base = Defense.extend({
  part: null, // TODO Hack, for not using Parts, and using a single part, see assembleParts in this file, should be fixed when sprites for Base are generated

  STATS: new Map([ // TODO this should be different combinations that can be purchased
    ['life', {0: 15000}],
    ['element', { electric: "Electro" }],
    ['range', {0: 500}],
    ['terrain', {0: 'walk'}],
    ['damage', {0: 30}],
    ['attackSpeed', {0: 15.0}],
  ]),

  ctor: function(level){
    let baseDna = [0, "electric", 0, 0, 0, 0]; // TODO DNA of the base hardcoded
    this._super(level, baseDna);
    this.setBuilt();
    this.scale = 1.5;
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

  assembleParts: function() { // TODO Hack for getting Part to work with Base, should be removed when there are real bases sprites
    if (!this.part) {
      this.part = new cc.Sprite(r.base);
      this.part.setAnchorPoint(0.5, 0.1);
      this.addChild(this.part);
    }
  },

  createHealthBar: function(){
    // TODO Repeating from robot, maybe has to go in debugger
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
  setTouchEvent: function() {
    easyTouchEnded(this, function(base) {
      if (base.getNumberOfRunningActions() === 0) {
        var increase = new cc.ScaleBy(0.05, 1.2);
        var decrease = new cc.ScaleBy(0.15, 1 / 1.2);
        base.runAction(new cc.Sequence(increase, decrease));
        base.level.hud.it.message("Don't let those pieces of trash destroy my base");
      }
    });
  },

  die: function() {
    this._super();
    this.level.gameOver();
  },
  toString: () => "Base",
});
