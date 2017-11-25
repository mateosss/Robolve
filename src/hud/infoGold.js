var InfoGold = Text.extend({
  hud: null, // Hud to which the InfoGold is appended

  ctor: function(hud, options) {
    this._super(options);
    this.hud = hud;
    this.refresh();
  },
  toString: () => "InfoGold",
  refresh: function() {
    this.setup({text: this.hud.level.base.money});
  }
});
