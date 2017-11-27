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
    this.goldbar = new Panel({width: "270px", height: "140px", padding: "11px", y: "-140px"});
    this.goldbar.addTo(this);

    this.gi = new Icon({icon:"coin", x: "center", y: "center", right: "75px", bottom: "5px", fontSize: 72, shadow: [cc.color(255,160,0), cc.size(0, -6), 0], color: cc.color(255,194,7)});
    this.gi.addTo(this.goldbar);

    this.ig = new InfoGold(this, {x: "center", y:"center", fontSize: 56, left:"30px", shadow: [cc.color(176,190,197), cc.size(0, -6), 0]});
    this.ig.addTo(this.goldbar);

    window.ig = this.ig; // XXX
    window.gi = this.gi;
    window.goldbar = this.goldbar;

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
    // TODO make component property calc(), to calculate here calc(100vw - 120px)
    // this.layout = new Panel({width: "81.94444444444444vw", height: "140px", padding: "11px"});
    // this.layout.addTo(this);
    // window.layout = this.layout;

    return true;
  },
  toString: function() {
    return "Hud";
  },
});
