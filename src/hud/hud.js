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

    // Info Text
    this.it = new InfoText(this);
    this.addChild(this.it, 10);

    this.charStatus = new Button({button: "purpleRound", callback: () => {
      let char = this.level.character;
      let status = char.getStatus();
      if (status === "still") {
        this.it.message("Cancels an ongoing action if any");
      } else this.it.message(_.capitalize(status) + " canceled");
      char.sm.setDefaultState();
    }, bottom: "20px", left: "16px", height: "65ph", width: "65ph", icon:"human-child", iconFontSize: 64, scale: 0.75});
    this.charStatus.addTo(this.bottombarLayout);


    // TODO debug console
    this.openConsole = new Button({button: "indigoRound", callback: () => {this.console.visible = !this.console.visible; if (this.console.visible) this.console.textField.attachWithIME();}, x: "-250ph", bottom: "20px", right: "50px", height: "65ph", width: "65ph", icon:"console-line", iconFontSize: 72, scale: 0.75});
    this.openConsole.addTo(this.bottombarLayout);
    this.console = new Layout({y: "75ph", height: "80px", width: "80pw", x: "center"});
    this.console.addTo(this);
    this.console.background = new Panel({scale: 0.75, width: "100pw + -100ph + -11px"});
    this.console.background.addTo(this.console);
    this.console.textField = new TextField({placeholder: "Insert cheat code", width: "100pw", x: "center", y: "28px", fontSize: 32});
    this.console.textField.addTo(this.console.background);
    this.console.submit = new Button({callback: () => {
      let cmd = this.console.textField.getString();
      this.console.textField.setString("");
      eval(cmd); // jshint ignore:line
    }, button: "blue", icon: "arrow-right", height: "100ph", width: "100ph", x: "-100ph", y: "center", scale: 0.75});
    this.console.submit.addTo(this.console);
    this.console.visible = false;

    // this.save = new Button({button: "lightBlue", callback: () => {SaveLoad.save(this.inventory.inventory); this.it.message("Saved (not really :)");}, x: "-187.5ph", bottom: "20px", right: "40px", height: "65ph", width: "65ph", icon:"content-save", iconFontSize: 72, scale: 0.75});
    // this.save.addTo(this.bottombarLayout);
    this.centerMap = new Button({button: "lightBlue", callback: () => this.level.map.zoomFit(), x: "-187.5ph", bottom: "20px", right: "40px", height: "65ph", width: "65ph", icon:"image-filter-center-focus", iconFontSize: 72, scale: 0.75});
    this.centerMap.addTo(this.bottombarLayout);

    this.openInventory = new Button({button: "amber", callback: () => this.inventory.toggle(), x: "-125ph", bottom: "20px", right: "30px", height: "65ph", width: "65ph", icon:"treasure-chest", iconFontSize: 72, scale: 0.75});
    this.openInventory.addTo(this.bottombarLayout);

    this.openCharSheet = new Button({button: "pink", callback: () => this.cs.toggle(), x: "-62.5ph", bottom: "20px", right: "20px", height: "65ph", width: "65ph", icon:"robot", iconFontSize: 72, scale: 0.75});
    this.openCharSheet.addTo(this.bottombarLayout);

    // Defense Details
    // this.dd = new DefenseDetails(this);
    // this.addChild(this.dd);

    this.dialog = new Dialog(this, {type:"confirm", width: "80vw", height: "35vh", x: "center", y: "center"});
    this.dialog.addTo(this, 25);

    this.waveText = new Badge({bgImage: r.ui.panel_out, text: _.format("Wave\n{}/{}", 1, this.level.cWave + 1, this.level.wavesCounts.length), textFontSize: 72, bottom: "20px", left: "16px + 5px + 65ph", height: "50ph", width: "100ph", y: "11px", scale: 0.35});
    this.waveText.addTo(this.bottombarLayout);
    let text = this.waveText.getTitleRenderer();
    text.setLineHeight(72);
    text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    this.waveText.refresh = () => {
      this.waveText.setup({text: _.format("Wave\n{}/{}", this.level.cWave + 1, this.level.wavesCounts.length)});
      if (cc.sys.isNative) text.y += 16.5;
    };
    this.waveText.refresh();

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

    this.equipbar = new EquipBar(this, this.level.character.inventory);
    this.equipbar.addTo(this);

    this.pauseBackdrop = new cc.LayerColor(cc.color(38, 50, 56, 127));
    this.pauseBackdrop.visible = false;
    this.pauseBackdrop.opacity = 0;
    this.addChild(this.pauseBackdrop, 20);

    this.pauseMenu = new PauseMenu(this, {});
    this.pauseMenu.addTo(this, 21);

    this.tutorialDialog = new TutorialDialog(this, {});
    this.tutorialDialog.addTo(this, 22);

    this.pauseButton = new Button({button: "orange", callback: () => this.togglePause(), y: "-72px", x: "-72px", top: "11px", right: "33px + 72px", height: "72px", width: "72px", icon:"pause", iconFontSize: 96, scale: 0.5});
    this.pauseButton.addTo(this, 21);

    // TODO XXX Remove
    window.tutorialDialog = this.tutorialDialog; // jshint ignore:line
    window.pauseMenu = this.pauseMenu; // jshint ignore:line
    window.pauseButton = this.pauseButton; // jshint ignore:line
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
    window.charStatus = this.charStatus; // jshint ignore:line
    window.waveText = this.waveText; // jshint ignore:line
    window.button = this.button; // jshint ignore:line
    window.layout = this.bottombarLayout; // jshint ignore:line
    window.preview = this.preview; // jshint ignore:line
    window.pinkbutton = this.pinkbutton; // jshint ignore:line

    return true;
  },
  togglePause: function() {
    if (this.level.isPaused) {
      this.pauseMenu.dismiss();
      this.level.resumeGame();
      this.pauseButton.setup({icon: "pause", button: "orange"});
      let fadeout = new cc.FadeTo(0.1, 0);
      let hide = new cc.Hide();
      this.pauseBackdrop.runAction(new cc.Sequence([fadeout, hide]));
    } else {
      this.pauseMenu.show();
      this.level.pauseGame();
      this.pauseButton.setup({icon: "play", button: "blue"});
      let show = new cc.Show();
      let fadein = new cc.FadeTo(0.1, 127);
      this.pauseBackdrop.runAction(new cc.Sequence([show, fadein]));
    }
  },
  alert: function(title, text, confirm, cancel) {
    this.dialog.setup({title: title, text: text, okCallback: confirm, cancelCallback: cancel});
    this.dialog.show();
  },
  toString: function() {
    return "Hud";
  },
});
