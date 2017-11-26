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
    // this.goldbar = new Panel({width: 37.5, height: 10.9375, padding: 1.5277777777777777, y: -10.9375});
    this.goldbar = new Panel({width: "37.5vw", height: "10.9375vh", padding: "1.5277777777777777vw", y: "-10.9375vh"});
    this.addChild(this.goldbar, 10);

    // this.gi = new Icon({icon:"coin", x: "center", y: "center", right: 30, bottom: 4, fontSize: 72, shadow: [cc.color(255,160,0), cc.size(0, -6), 0], color: cc.color(255,194,7)});
    this.gi = new Icon({icon:"coin", x: "center", y: "center", right: "30vw", bottom: "4vh", fontSize: 72, shadow: [cc.color(255,160,0), cc.size(0, -6), 0], color: cc.color(255,194,7)});
    this.goldbar.addChild(this.gi);

    // this.gi2 = new Text({text:"\ue806", fontName:"icons", x: 7, y: "center", fontSize: 56, shadow: [cc.color(255,160,0), cc.size(0, -6), 0], color: cc.color(255,194,7)});
    // this.gi2 = new Text({text:"$", x: 12, y: "center", fontSize: 56, shadow: [cc.color(0,100,100), cc.size(0, -6), 0], color: cc.color(0,194,7)});
    // this.goldbar.addChild(this.gi2); //XXX delete these three comments

    // this.ig = new InfoGold(this, {x: 30, y:"center", fontSize: 56, shadow: [cc.color(176,190,197), cc.size(0, -6), 0]});
    // this.ig = new InfoGold(this, {x: "center", y:"center", fontSize: 56, left:12, shadow: [cc.color(176,190,197), cc.size(0, -6), 0]});
    this.ig = new InfoGold(this, {x: "center", y:"center", fontSize: 56, left:"12vw", shadow: [cc.color(176,190,197), cc.size(0, -6), 0]});
    this.goldbar.addChild(this.ig);

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
    // this.layout = new Panel({width: 81.94444444444444, height: 10.9375, padding: 1.5277777777777777});
    this.layout = new Panel({width: "81.94444444444444vw", height: "10.9375vh", padding: "1.5277777777777777vw"});
    this.addChild(this.layout, 10);
    window.layout = this.layout;

    return true;
  },
  toString: function() {
    return "Hud";
  },
});
