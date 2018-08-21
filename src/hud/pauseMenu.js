var PauseMenu = Dialog.extend({
  hud: null,

  // UI Components Structure

  titleContainer: null,
  titleText: null,
  titleClose: null,

  mainContainer: null,
  main: null,
  buttonResume: null,
  buttonHelp: null,
  buttonQuit: null,

  ctor: function(hud, options) {

    options.type = "empty";
    options.width = options.width || "80pmin";
    options.height = options.height || "512px";
    options.paddingHorizontal = options.paddingHorizontal || "0px";
    options.x = options.x || "center";
    options.y = options.y || "center";
    options.bgImage = r.ui.blueGray;

    this._super(hud, options);

    this.titleContainer = new Layout({height: "80px", width: "100pw", y: "-80px"});
    this.titleContainer.addTo(this);
    this.titleText = new Text({text: "Pause", hAlign:cc.TEXT_ALIGNMENT_CENTER, width:"100pw", y: "center", top: cc.sys.isNative ? "8px" : "13px", fontSize: 56});
    this.titleText.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => this.hud.togglePause(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);


    this.mainContainer = new Layout({height: "100ph + -80px"});
    this.mainContainer.addTo(this);
    this.main = new Panel({bgImage: r.ui.panel_in, height: "100ph", width: "100pw", padding: "11px", x: "center"});
    this.main.addTo(this.mainContainer);

    this.buttonResume = new Button({callback: () => this.hud.togglePause(), y: "-17.5pw", x: "center", top: "55px", button: "blue", text: "Resume Game", width: "80pw", height: "20pw", scale: 0.75});
    this.buttonResume.addTo(this.main);
    this.buttonResume.icon = new Icon({fontSize: 96, icon: "play", y: "center", bottom: "5px", left: "24px"});
    this.buttonResume.icon.addTo(this.buttonResume);
    this.buttonHelp = new Button({callback: () => this.hud.tutorialDialog.show(), y: "17.5pw", x: "center", button: "green", text: "How to Play", width: "70pw", height: "17.5pw", bottom: "44px", scale: 0.75});
    this.buttonHelp.addTo(this.main);
    this.buttonHelp.icon = new Icon({fontSize: 84, icon: "help-circle-outline", y: "center", bottom: "5px", left: "21px"});
    this.buttonHelp.icon.addTo(this.buttonHelp);
    this.buttonQuit = new Button({callback: () => this.hud.alert("Are you sure?", "All your progress will be lost. Well to be honest, even if you won it would have been lost, there isn't a save functionality implemented yet.", () => this.hud.level.base.die(), () => this.hud.pauseMenu.show()), y: "0px", x: "center", button: "pink", text: "Exit to Menu", width: "70pw", height: "17.5pw", bottom: "33px", scale: 0.75});
    this.buttonQuit.addTo(this.main);
    this.buttonQuit.icon = new Icon({fontSize: 84, icon: "exit-to-app", y: "center", bottom: "5px", left: "21px"});
    this.buttonQuit.icon.addTo(this.buttonQuit);
  },
  show: function() {
    this._super.apply(this, arguments);
    if (!cc.sys.isNative || !this.main.textCorrected) {
      this.main.textCorrected = true;
      if (cc.sys.isNative) {
        this.buttonResume.text.x += 40;
        this.buttonHelp.text.x += 32;
        this.buttonQuit.text.x += 32;
      } else {
        // TODO yes, i know, there is a timeout for setting a text label position...
        // TODO repeated from menu.js
        setTimeout(() => { // jshint ignore:line
          this.buttonResume.text.x += 40;
          this.buttonHelp.text.x += 32;
          this.buttonQuit.text.x += 32;
        }, 250); // HACK: The 250 is a hack over a the timeout hack :)
      }
    }
  },
  toString: () => "PauseMenu",
});
