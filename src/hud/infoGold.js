var InfoGold = Text.extend({
  hud: null, // Hud to which the InfoGold is appended

  ctor: function(hud, options) {
    this._super(options);
    this.hud = hud;
    this.refresh();
  },
  toString: () => "InfoGold",
  addGold: function(amount) {
    if (!amount) return; // End the function here if you are adding nothing
    this.hud.level.base.gold += amount;
    this.refresh();
    if (amount > 0) {
      this.diffFeedback = new Text({text: "+" + amount, x: "center", left: _.randint(-16, 16)+"px", top: "72px", fontSize: 56, color: cc.color(76, 175, 80), shadow: [cc.color(56,142,60), cc.size(0, -6), 0]});
    } else if (amount < 0) {
      this.diffFeedback = new Text({text: amount, x: "center", left: _.randint(-16, 16)+"px", top: "72px", fontSize: 56, color: cc.color(244, 67, 54), shadow: [cc.color(211,47,47), cc.size(0, -6), 0]});
    }
    this.parent.addChild(this.diffFeedback);
    let fadeIn = new cc.MoveBy(0.1, cc.p(0, 32));
    let slideDown = new cc.EaseIn(new cc.MoveBy(1, cc.p(_.randint(-64, 64), -_.randint(64, 256))), 3);
    let fadeOut = new cc.EaseIn(new cc.FadeOut(1), 3);
    let spawn = new cc.Spawn([slideDown, fadeOut]);
    let destroy = new cc.RemoveSelf();
    let actArray = [fadeIn, spawn, destroy];
    this.diffFeedback.runAction(new cc.Sequence(actArray));

  },
  removeGold: function(amount) {
    this.addGold(-amount);
  },
  refresh: function() {
    this.setup({text: this.hud.level.base.gold});
  }
});
