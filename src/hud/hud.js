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
    this.goldbar = new Panel({width: 37.5, height: 10.9375, padding: 1.5277777777777777, y: -10.9375});
    this.addChild(this.goldbar, 10);

    this.gi = new Icon({icon:"coin", x: 7, y: 16, fontSize: 72, shadow: [cc.color(255,160,0), cc.size(0, -6), 0], color: cc.color(255,194,7)});
    this.goldbar.addChild(this.gi);

    this.ig = new InfoGold(this, {x: 38, y:"center", fontSize: 56, shadow: [cc.color(176,190,197), cc.size(0, -6), 0]});
    this.goldbar.addChild(this.ig);

    window.ig = this.ig; // XXX
    window.gi = this.gi;

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
    // this.layout = new Panel({width: 81.94444444444444, height: 10.9375, padding: 1.5277777777777777});
    // this.addChild(this.layout, 10);
    // window.layout = this.layout;

    return true;
  },
  toString: function() {
    return "Hud";
  },
});
