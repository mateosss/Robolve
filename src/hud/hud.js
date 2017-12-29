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

    // Defense Selector
    this.ds = new DefenseSelector(this);
    this.addChild(this.ds, 1);

    // Info Text
    this.it = new InfoText(this);
    this.addChild(this.it);

    // Defense Details
    this.dd = new DefenseDetails(this);
    this.addChild(this.dd);

    this.dialog = new Dialog({type:"confirm", width: "80vw", height: "35vh", x: "center", y: "center"});
    this.dialog.addTo(this);

    // Bottom bar
    this.bottombar = new Layout({width: "100vw", height: "140px"});
    this.bottombar.addTo(this);

    this.layout = new Panel({width: "100pw + -200ph + 22px", padding: "11px"});
    this.layout.addTo(this.bottombar, -1);

    this.preview = new DefenseView({});
    this.preview.addTo(this);

    this.pinkbutton = new Button({button: "pink", callback: () => this.preview.show(), width:"100ph", icon:"robot", padding:"11px", left:"11px", x: "-200ph", iconFontSize: 72});
    this.pinkbutton.addTo(this.bottombar);

    this.button = new Button({callback: () => this.dialog.show(), width:"100ph", icon:"plus", padding:"11px", x: "-100ph", iconFontSize: 72});
    this.button.addTo(this.bottombar);

    // this.progress1 = new Progress({color: "orange", buttons: true, y:"center", x:"center", bottom: "128px", width:"70pw", height:"96px", predefinedValues:["electric", "fire", "water", "air"], text:"selected element: {}", selectedValue:1});
    // this.progress1.addTo(this);
    // this.progress2 = new Progress({y:"center", x:"center", width:"70pw", height:"96px", percentage: 100, });
    // this.progress2.addTo(this);
    // this.progress = new Progress({color:"blue", buttons: true, y:"center", x:"center", top: "128px", width:"70pw", height:"96px", predefinedValues:["electric", "fire", "water", "air"], text:"Selected: {}", selectedValue:1});
    // this.progress.addTo(this);

    window.ds = this.ds; // XXX
    window.hud = this;
    window.progress = this.progress;
    window.dialog = this.dialog;
    window.dd = this.dd;
    window.ig = this.ig;
    window.gi = this.gi;
    window.goldbar = this.goldbar;
    window.bottombar = this.bottombar;
    window.button = this.button;
    window.layout = this.layout;
    window.preview = this.preview;
    window.pinkbutton = this.pinkbutton;

    return true;
  },
  alert: function(title, text, confirm) {
    this.dialog.setup({title: title, text: text, okCallback: confirm});
    this.dialog.show();
  },
  toString: function() {
    return "Hud";
  },
});
