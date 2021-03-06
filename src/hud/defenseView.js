// TODO Not in use

var DefenseView = Dialog.extend({

  selectedDefense: null, // null for a new defense, TODO allow defense modification (a.k.a only works if selectedDefense is null)

  level: 1,
  element: "fire", // Default stats for a new defense
  life: 0,
  range: 0,
  damage: 0,
  attackSpeed: 0,
  amount: rb.prices.createDefense,

  // UI Components Structure

  titleContainer: null,
  titleLevel: null,
  titleText: null,
  titleClose: null,

  previewContainer: null,
  previewTitle  : null,
  previewMain: null,

  elementContainer: null,
  elementTitle: null,
  elementButtons: null,
  elementFire: null,
  elementWater: null,
  elementElectric: null,

  amountContainer: null,
  amountTitle: null,
  amountBar: null,
  amountGi: null,
  amountIg: null,

  levelContainer: null,
  levelTitle: null,
  levelButtons: null,
  levelLeft: null,
  levelCenter: null,
  levelRight: null,

  statsContainer: null,
  statsTitle: null,
  statsMain: null,
  statsLife: null,
  statsRange: null,
  statsDamage: null,
  statsAttackSpeed: null,

  buildContainer: null,
  buildButton: null,

  ctor: function(options, selectedDefense) {

    this.selectedDefense = selectedDefense; // TODO Make it possible to create a defense from defenseView (the case where selectedDefense is null)

    options.type = "empty";
    options.width = "90pmin";
    options.height = "112.5pmin";
    options.x = "center";
    options.y = "center";
    options.bgImage = r.ui.blueGray;

    this._super(options);

    this.titleContainer = new Layout({height: "15ph + -11px", width: "100pw", y: "-15ph + 11px"});
    this.titleContainer.addTo(this);
    // this.titleContainer.debug(); // XXX Remove debug
    this.titleLevel = new Button({button: "yellowRound", text: "4", textFontSize: 72, scale9: false, x: "11px", top: "11px"});
    this.titleLevel.addTo(this.titleContainer);
    this.titleText = new Text({text: "New Defense", x: "center", y: "center", top: cc.sys.isNative ? "0px" : "5px", fontSize: 56});
    this.titleText.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => this.dismiss(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);


    this.previewContainer = new Layout({height: "40ph", width: "50pw", y: "11px + 45ph"});
    this.previewContainer.addTo(this);
    // this.previewContainer.debug(); // XXX Remove debug
    this.previewTitle = new Text({text: "Preview", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.previewTitle.addTo(this.previewContainer);
    this.previewMain = new Panel({bgImage: r.ui.panel_in_nuts, height: "100ph + -33px", width: "100pw", padding: "11px", x: "center"}); // TODO real defense preview
    this.previewMain.addTo(this.previewContainer);


    this.elementContainer = new Layout({height: "20ph", width: "50pw", y: "11px + 25ph"});
    this.elementContainer.addTo(this);
    // this.elementContainer.debug(); // XXX Remove debug
    this.elementTitle = new Text({text: "Element", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.elementTitle.addTo(this.elementContainer);
    this.elementButtons = new Layout({x: "center", padding: "11px", height: "100ph + -39px"});
    this.elementButtons.addTo(this.elementContainer);
    this.elementWater = new Button({button: "blue", width: "100ph", icon: "water", padding: "11px", scale: 0.8});
    this.elementWater.addTo(this.elementButtons);
    this.elementFire = new Button({button: "deepOrange", width: "100ph", icon: "fire", x: "100ph", padding: "11px", scale: 0.8});
    this.elementFire.addTo(this.elementButtons);
    this.elementElectric = new Button({button: "yellow", width: "100ph", icon: "flash", x: "200ph", padding: "11px", scale: 0.8});
    this.elementElectric.addTo(this.elementButtons);


    this.amountContainer = new Layout({height: "25ph", width: "50pw", y: "11px"});
    this.amountContainer.addTo(this);
    // this.amountContainer.debug(); // XXX Remove debug
    this.amountTitle = new Text({text: "Amount", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.amountTitle.addTo(this.amountContainer);
    this.amountBar = new Panel({padding: "11px", height: "100ph + -39px"});
    this.amountBar.addTo(this.amountContainer);
    this.amountGi = new Icon({icon:"coin", x: "center", y: "center", right: "75px", bottom: "5px", fontSize: 72, shadow: [cc.color(255,160,0), cc.size(0, -6), 0], color: cc.color(255,194,7)});
    this.amountGi.addTo(this.amountBar);
    this.amountIg = new InfoGold(3250, {x: "center", y:"center", fontSize: 56, left:"30px", shadow: [cc.color(176,190,197), cc.size(0, -6), 0]});
    this.amountIg.addTo(this.amountBar);


    this.levelContainer = new Layout({height: "20ph", width: "50pw", x: "-50pw", y: "11px + 65ph"});
    this.levelContainer.addTo(this);
    // this.levelContainer.debug(); // XXX Remove debug
    this.levelTitle = new Text({text: "Level", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.levelTitle.addTo(this.levelContainer);
    this.levelButtons = new Layout({x: "center", height: "100ph + -39px", top: "5px"});
    this.levelButtons.addTo(this.levelContainer);
    // this.levelButtons.debug();
    this.levelLeft = new Button({button: "pinkRound", icon: "arrow-left", scale9: false, y: "center", x: "center", right: "50ph + 30ph + 11px", height:"60ph", width: "60ph"});
    this.levelLeft.addTo(this.levelButtons);
    this.levelCenter = new Button({button: "pinkRound", text: "4", textFontSize: 72, scale9: false, x: "50pw + -50ph", width: "100ph"});
    this.levelCenter.addTo(this.levelButtons);
    this.levelRight = new Button({button: "pinkRound", icon: "arrow-right", scale9: false, y: "center", x: "center", left: "50ph + 30ph + 11px", height:"60ph", width: "60ph"});
    this.levelRight.addTo(this.levelButtons);


    this.statsContainer = new Layout({height: "45ph", width: "50pw", x: "-50pw", y: "11px + 20ph"});
    this.statsContainer.addTo(this);
    // this.statsContainer.debug(); // XXX Remove debug
    this.statsTitle = new Text({text: "Stats", x: "center", y: "-50px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 32});
    this.statsTitle.addTo(this.statsContainer);
    this.statsMain = new Panel({bgImage: r.ui.panel_in, height: "100ph + -33px", width: "100pw", padding: "11px", x: "center"});
    this.statsMain.addTo(this.statsContainer);
    this.statsLife = new StatTweak("Defense", "life", {y:"220px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", width:"100pw", height:"68px", fontSize: 36});
    this.statsLife.addTo(this.statsMain);
    this.statsRange = new StatTweak("Defense", "range", {y:"152px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", width:"100pw", height:"68px", fontSize: 36});
    this.statsRange.addTo(this.statsMain);
    this.statsDamage = new StatTweak("Defense", "damage", {y:"84px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", width:"100pw", height:"68px", fontSize: 36});
    this.statsDamage.addTo(this.statsMain);
    this.statsAttackSpeed = new StatTweak("Defense", 'attackSpeed', {y:"16px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", width:"100pw", height:"68px", fontSize: 36});
    this.statsAttackSpeed.addTo(this.statsMain);

    this.buildContainer = new Layout({height: "20ph", width: "50pw", x: "-50pw", y: "11px"});
    this.buildContainer.addTo(this);
    // this.buildContainer.debug(); // XXX Remove debug
    this.buildButton = new Button({button: "green", text: "Build", padding: "11px", callback: () => this.dismiss()});
    this.buildButton.addTo(this.buildContainer);
  },

  build: function() { // Hides the defense view and lets the player locate the tweaked new defense
    let hud = this.getParent();
    hud.it.message("Place " + _.capitalize(this.element) + " Tower - $" + rb.prices.createDefense);
    let terrain = 0; // TODO Terrain is here just because it is needed in the old game style, change when new gameplay is designed
    let customDefense = new Defense(hud.level, this.life, this.element, this.range, terrain, this.damage, this.attackSpeed);
    customDefense.retain();
    customDefense.isDummy = true;
    hud.level.showDummyDefense(customDefense);
    if (!hud.ds.ok.inScreen) {
      hud.ds.ok.show();// TODO Make a new confirmation input which is more appealing and better coded
      hud.ds.cancel.show();
    }
  },

  buildConfirm: function() {
    // TODO
  },

  show: function(defense) {
    this._super();
    this.setSelectedDefense(defense);
  },

  setSelectedDefense: function(defense) {
    this.selectedDefense = defense;
    this.statsLife.setComputer(defense);
    this.statsRange.setComputer(defense);
    this.statsDamage.setComputer(defense);
    this.statsAttackSpeed.setComputer(defense);
  },

  toString: () => "DefenseView"
});
