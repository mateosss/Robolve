// This represents a computer part, like an arm, the head, etc

var Part = cc.Sprite.extend({
  computer: null, // The parent computer, the same that using the parent property
  type: null, // The part type, it can be: head, middle, arml, armr, legl or legr
  dAnimation: "still", // The default animation, should be a 1 frame animation, used for generating the part
  cAnimation: null, // The current animation that is being played
  // Properties that should go in the parent PARTS property objects.
  // be carefull to not name this properties the same way as others existent in
  // a parent class of Part, or properties that could overwrite things
  plural: null, // plural name for identifying the part type
  z: null, // the zIndex at which the part spawns
  partName: null, // a function to get  the sprite name to locate the textures
  ctor:function(computer, type) {
    if (arguments.length === 0) return; // Hack for getting only the properties defined above
    this.computer = computer;
    this.type = type;
    for (var prop in computer.PARTS[type]) {
      this[prop] = computer.PARTS[type][prop];
    }
    this._super(cc.spriteFrameCache.getSpriteFrame(this.getDefaultSprite()));
    this.setAnchorPoint(0.5, 0.1);
  },
  toString: function() {
    return "Part";
  },
  getPartName: function() { // Returns the name of the sprite based on parent computer dna. e.g: electricRangeL
    return this.partName(this.computer);
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
    return this.computer.toStringP() + "/" + this.plural + "/" + animation + "/" + this.getPartName() + "_{}.png";
  },
  getDefaultSprite: function() {
    return _.format(this.getSpritePlaceholder(this.dAnimation), 1);
  },
  setAnimation: function(actionName, speed) {
    var action = this.getSpriteAction(
      rb.animations[actionName], this.getSpritePlaceholder(actionName), speed || 1
    );
    this.stopAllActions();
    this.runAction(action);
    this.cAnimation = actionName;
  }
});
