// This represents a robot part, like an arm, the head, etc

var Part = cc.Sprite.extend({
  PARTS: { // Necessary info for the possible parts in the robot
    head: {plural: "heads", zIndex: 2, name: function(robot) {return robot.element + ["Weak", "Normal", "Strong"][robot.damage];}},
    middle: {plural: "middles", zIndex: 1, name: function(robot) {return ["weak", "normal", "strong"][robot.life];}},
    arml: {plural: "armsl", zIndex: 3, name: function(robot) {return robot.element + ["Mele", "Range"][robot.range] + "L";}},
    armr: {plural: "armsr", zIndex: 0, name: function(robot) {return robot.element + ["Mele", "Range"][robot.range] + "R";}},
    legl: {plural: "legsl", zIndex: 0, name: function(robot) {return ["walk", "fly"][robot.terrain] + "L";}},
    legr: {plural: "legsr", zIndex: 0, name: function(robot) {return ["walk", "fly"][robot.terrain] + "R";}},
  },
  robot: null, // The parent robot
  type: null, // The part type, it can be: head, middle, arml, armr, legl or legr
  dAnimation: "still", // The default animation, should be a 1 frame animation, used for generating the part
  cAnimation: null, // The current animation that is being played
  ctor:function(robot, type) {
    if (arguments.length === 0) return; // Hack for getting only the properties defined above
    this.robot = robot;
    this.type = type;
    this._super(cc.spriteFrameCache.getSpriteFrame(this.getDefaultSprite()));
    this.setAnchorPoint(0.5, 0.1);
  },
  toString: function() {
    return "Part";
  },
  getName: function() { // Returns the name of the sprite based on parent robot dna. e.g: electricRangeL
    return this.PARTS[this.type].name(this.robot);
  },
  getSpriteAction: function(totalFrames, string, speed) {
    // totalFrames: total numbers of the animation frame
    // string: a string like "armsl/walk/electricRangeL_{}.png" to fill with frame number
    // speed: every speed seconds, the frame of the action will change
    var frames = [];
    for (var i = 1; i <= totalFrames; i++) {
      var newFrame = _.format(string, i);
      frames.push(cc.spriteFrameCache.getSpriteFrame(newFrame));
    }
    var animation = new cc.Animation(frames, speed);
    var action = new cc.RepeatForever(new cc.Animate(animation));
    return action;
  },
  getSpritePlaceholder: function(animation) {
    return this.PARTS[this.type].plural + "/" + animation + "/" + this.getName() + "_{}.png";
  },
  getDefaultSprite: function() {
    return _.format(this.getSpritePlaceholder(this.dAnimation), 1);
  },
  setAnimation: function(actionName) {
    if (actionName === this.cAnimation) return;
    var speed = (1 / 16) / this.robot.sSpeed; // TODO This animation speed is the same for all animations even atack
    var action = this.getSpriteAction(
      r.animations[actionName], this.getSpritePlaceholder(actionName), speed
    );
    this.stopAllActions();
    this.runAction(action);
    this.cAnimation = actionName;
  }
});
