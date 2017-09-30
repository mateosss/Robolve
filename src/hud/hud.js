var Hud = cc.Layer.extend({
  // TODO El hud es muy inestable, hay mucho hardcode de numeros en pixeles, hay que
  // buscar un buen metodo para hacer menues mas estables
  level: null,

  ig: null, // Information Gold
  ds: null, // Defense Selector
  it: null, // Information Text
  dd: null, // Defense Details

  ctor: function(level) {
    this._super();
    this.level = level;

    // Gold
    this.ig = new InfoGold(this);
    this.addChild(this.ig);

    // Defense Selector
    this.ds = new DefenseSelector(this);
    this.addChild(this.ds);

    // Info Text
    this.it = new InfoText(this);
    this.addChild(this.it);

    // Defense Details
    this.dd = new DefenseDetails(this);
    this.addChild(this.dd);

    // Bottom bar
    this.layout = new Panel({width: 100, height: 12, margin: 2});
    this.addChild(this.layout, 101);

    var text = new Text({text: "Hello ccui.Text"});
    this.layout.addChild(text);

    return true;
  },
  toString: function() {
    return "Hud";
  },
});
