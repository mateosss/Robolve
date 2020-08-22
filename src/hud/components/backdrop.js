var Backdrop = cc.Node.extend({
  backdrop0: null, // The backdrop squares
  backdrop1: null,
  backdrop2: null,
  backdrop3: null,
  hud: null,
  ctor: function(hud) {
    this.hud = hud;
    this.backdrop0 = new cc.LayerColor(cc.color(26, 32, 38, 100));
    this.addChild(this.backdrop0);
    this.backdrop1 = new cc.LayerColor(cc.color(255, 32, 38, 100));
    this.addChild(this.backdrop1);
    this.backdrop2 = new cc.LayerColor(cc.color(26, 255, 38, 100));
    this.addChild(this.backdrop2);
    this.backdrop3 = new cc.LayerColor(cc.color(26, 32, 255, 100));
    this.addChild(this.backdrop3);
    this.setVisible(false);
  },
  highlight: function(rect) { // Puts the backdrops around the highlighted rect
    
  },
  setVisible: function(visible) {
    this.backdrop0.visible = visible;
    this.backdrop1.visible = visible;
    this.backdrop2.visible = visible;
    this.backdrop3.visible = visible;
  },
  toString: () => "Backdrop",
});
