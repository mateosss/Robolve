var InfoGold = Text.extend({
  hud: null, // Hud to which the InfoGold is appended

  ctor: function(hud, options) {
    this._super(options);
    this.hud = hud;
    this.refresh();
  },
  toString: () => "InfoGold",
  refresh: function() {
    let previousGold = parseInt(this.getString());
    let gold = this.hud.level.base.money;
    this.setup({text: gold});

    let diff = gold - previousGold;
    if (!diff) return; // End the function here if there was no gold before
    if (diff > 0) {
      this.diffFeedback = new Text({text: "+" + diff, x: "center", top: "56px", fontSize: 56, color: cc.color(76, 175, 80), shadow: [cc.color(56,142,60), cc.size(0, -6), 0]});
    } else if (diff < 0) {
      this.diffFeedback = new Text({text: diff, x: "center", top: "56px", fontSize: 56, color: cc.color(244, 67, 54), shadow: [cc.color(211,47,47), cc.size(0, -6), 0]});
    }
    this.parent.addChild(this.diffFeedback);
    let slideDown = new cc.EaseIn(new cc.MoveBy(1, cc.p(_.randint(-64, 64), -_.randint(64, 256))), 3);
    let fadeOut = new cc.EaseIn(new cc.FadeOut(1), 3);
    let spawn = new cc.Spawn([slideDown, fadeOut]);
    let destroy = new cc.RemoveSelf();
    let actArray = [spawn, destroy];
    this.diffFeedback.runAction(new cc.Sequence(actArray));
  }
});
