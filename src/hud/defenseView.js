var DefenseView = Dialog.extend({
  ctor: function(options) {
    options.type = "empty";
    options.width = "90pmin";
    options.height = "112.5pmin";
    options.x = "center";
    options.y = "center";
    options.bgImage = r.ui.grey;

    this._super(options);

    this.title = new Layout({height: "15ph + -11px", width: "100pw", y: "-15ph + 11px"});
    this.title.addTo(this);
    // this.title.debug(); // XXX Remove debug
    this.titleLevel = new Button({button: "yellowRound", text: "4", textFontSize: 72, scale9: false, x: "11px", y: "5px"});
    this.titleLevel.addTo(this.title);
    this.titleText = new Text({text: "New Defense", x: "center", y: "center", top: cc.sys.isNative ? "0px" : "5px", fontSize: 56});
    this.titleText.addTo(this.title);
    this.titleClose = new Button({callback: () => this.dismiss(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.title);


    this.preview = new Layout({height: "40ph", width: "50pw", y: "11px + 45ph"});
    this.preview.addTo(this);
    // this.preview.debug(); // XXX Remove debug
    this.previewTitle = new Text({text: "Preview", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.previewTitle.addTo(this.preview);
    this.previewMain = new Panel({bgImage: r.ui.panel_in_nuts, height: "100ph + -33px", width: "100pw", padding: "11px", x: "center"}); // TODO real defense preview
    this.previewMain.addTo(this.preview);


    this.element = new Layout({height: "20ph", width: "50pw", y: "11px + 25ph"});
    this.element.addTo(this);
    // this.element.debug(); // XXX Remove debug
    this.elementTitle = new Text({text: "Element", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.elementTitle.addTo(this.element);
    this.elementButtons = new Layout({x: "center", padding: "11px", height: "100ph + -39px"});
    this.elementButtons.addTo(this.element);
    this.elementWater = new Button({button: "blue", width: "100ph", icon: "water", padding: "11px", scale: 0.8});
    this.elementWater.addTo(this.elementButtons);
    this.elementFire = new Button({button: "orange", width: "100ph", icon: "fire", x: "100ph", padding: "11px", scale: 0.8});
    this.elementFire.addTo(this.elementButtons);
    this.elementElectric = new Button({button: "yellow", width: "100ph", icon: "flash", x: "200ph", padding: "11px", scale: 0.8});
    this.elementElectric.addTo(this.elementButtons);


    this.amount = new Layout({height: "25ph", width: "50pw", y: "11px"});
    this.amount.addTo(this);
    // this.amount.debug(); // XXX Remove debug
    this.amountTitle = new Text({text: "Amount", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.amountTitle.addTo(this.amount);
    this.amountBar = new Panel({padding: "11px", height: "100ph + -39px"});
    this.amountBar.addTo(this.amount);
    this.amountGi = new Icon({icon:"coin", x: "center", y: "center", right: "75px", bottom: "5px", fontSize: 72, shadow: [cc.color(255,160,0), cc.size(0, -6), 0], color: cc.color(255,194,7)});
    this.amountGi.addTo(this.amountBar);
    this.amountIg = new InfoGold(3250, {x: "center", y:"center", fontSize: 56, left:"30px", shadow: [cc.color(176,190,197), cc.size(0, -6), 0]});
    this.amountIg.addTo(this.amountBar);


    this.level = new Layout({height: "20ph", width: "50pw", x: "-50pw", y: "11px + 65ph"});
    this.level.addTo(this);
    // this.level.debug(); // XXX Remove debug
    this.levelTitle = new Text({text: "Level", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.levelTitle.addTo(this.level);
    this.levelButtons = new Layout({x: "center", height: "100ph + -39px", top: "5px"});
    this.levelButtons.addTo(this.level);
    // this.levelButtons.debug();
    this.levelLeft = new Button({button: "pinkRound", icon: "arrow-left", scale9: false, x: "22px", y: "-96px", scale: 0.6});
    this.levelLeft.addTo(this.levelButtons);
    this.levelCenter = new Button({button: "pinkRound", text: "4", textFontSize: 72, scale9: false, x: "50pw + -60px", scale: 1.25});
    this.levelCenter.addTo(this.levelButtons);
    this.levelRight = new Button({button: "pinkRound", icon: "arrow-right", scale9: false, x: "-58px + -22px", y: "-96px", scale: 0.6});
    this.levelRight.addTo(this.levelButtons);


    this.stats = new Layout({height: "45ph", width: "50pw", x: "-50pw", y: "11px + 20ph"});
    this.stats.addTo(this);
    // this.stats.debug(); // XXX Remove debug
    this.statsTitle = new Text({text: "Stats", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.statsTitle.addTo(this.stats);
    this.statsMain = new Panel({bgImage: r.ui.panel_in, height: "100ph + -33px", width: "100pw", padding: "11px", x: "center"});
    this.statsMain.addTo(this.stats);
    this.statsLife = new Progress({y:"center", scale: 0.5, padding: "11px", paddingHorizontal: "6px", width:"100pw", height:"80px", predefinedValues: Object.values(Defense.prototype.getPossibleStats("life")), text:"Life: {}", selectedValue:0, fontSize: 48});
    this.statsLife.addTo(this.statsMain);

    this.build = new Layout({height: "20ph", width: "50pw", x: "-50pw", y: "11px"});
    this.build.addTo(this);
    // this.build.debug(); // XXX Remove debug
    this.buildButton = new Button({button: "green", text: "Build", padding: "11px", callback: () => this.dismiss()});
    this.buildButton.addTo(this.build);
  },
  setup: function(options) {
    this._super(options);
  },
  toString: () => "DefenseView"
});
