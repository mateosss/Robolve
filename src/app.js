console.log("Robolve Start");

var MainMenu = cc.Scene.extend({
  ctor: function(text) {
    this._super();
    this.text = text;
  },
  onEnter: function() {
    this._super();
    var layer = new Menu(this.text);
    this.addChild(layer);
  }
});
