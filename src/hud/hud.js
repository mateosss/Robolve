var Hud = cc.Layer.extend({
  level: null,
  activeDialog: null,

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
    // this.ds = new DefenseSelector(this);
    // this.addChild(this.ds, 1);
    this.ds = new BasicDefenseSelector(this, {});
    this.ds.addTo(this, 1);

    // Bottom bar
    this.bottombar = new Layout({width: "100vw", height: "140px"});
    this.bottombar.addTo(this);

    this.bottombarLayout = new Panel({width: "100pw + -100ph + 11px", padding: "11px"});
    this.bottombarLayout.addTo(this.bottombar, -1);

    this.cancelActions = new Button({button: "red", callback: () => this.level.character.sm.setDefaultState(), bottom: "20px", left: "16px", height: "65ph", width: "65ph", icon:"cancel", iconFontSize: 72, scale: 0.75});
    this.cancelActions.addTo(this.bottombarLayout);

    this.openInventory = new Button({button: "yellow", callback: () => this.inventory.show(this.level.character.inventory), x: "-125ph", bottom: "20px", right: "30px", height: "65ph", width: "65ph", icon:"treasure-chest", iconFontSize: 72, scale: 0.75});
    this.openInventory.addTo(this.bottombarLayout);

    this.openCharSheet = new Button({button: "pink", callback: () => this.cs.show(), x: "-62.5ph", bottom: "20px", right: "20px", height: "65ph", width: "65ph", icon:"robot", iconFontSize: 72, scale: 0.75});
    this.openCharSheet.addTo(this.bottombarLayout);

    // Info Text
    this.it = new InfoText(this);
    this.addChild(this.it, 10);

    // Defense Details
    this.dd = new DefenseDetails(this);
    this.addChild(this.dd);

    this.dialog = new Dialog(this, {type:"confirm", width: "80vw", height: "35vh", x: "center", y: "center"});
    this.dialog.addTo(this);


    // this.preview = new DefenseView({});
    // this.preview.addTo(this);

    this.preview = new BasicDefenseView(this, {});
    this.preview.addTo(this, -5);

    // this.pinkbutton = new Button({button: "pink", callback: () => this.preview.show(), width:"100ph", icon:"robot", padding:"11px", left:"11px", x: "-200ph", iconFontSize: 72});
    // this.pinkbutton.addTo(this.bottombar); TODO Developer view

    this.button = new Button({callback: () => this.ds.show(), width:"100ph", icon:"plus", padding:"11px", x: "-100ph", iconFontSize: 72});
    this.button.addTo(this.bottombar);

    this.cs = new CharacterSheet(this, {}, level.character);
    this.cs.addTo(this);

    this.inventory = new InventoryView(this, this.level.character.inventory, {});
    this.inventory.addTo(this);

    // TODO XXX Remove
    window.inv = this.inventory; // jshint ignore:line
    window.ds = this.ds; // jshint ignore:line
    window.cs = this.cs; // jshint ignore:line
    window.hud = this; // jshint ignore:line
    window.progress = this.progress; // jshint ignore:line
    window.dialog = this.dialog; // jshint ignore:line
    window.dd = this.dd; // jshint ignore:line
    window.ig = this.ig; // jshint ignore:line
    window.gi = this.gi; // jshint ignore:line
    window.goldbar = this.goldbar; // jshint ignore:line
    window.bottombar = this.bottombar; // jshint ignore:line
    window.cancelActions = this.cancelActions; // jshint ignore:line
    window.button = this.button; // jshint ignore:line
    window.layout = this.bottombarLayout; // jshint ignore:line
    window.preview = this.preview; // jshint ignore:line
    window.pinkbutton = this.pinkbutton; // jshint ignore:line

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
