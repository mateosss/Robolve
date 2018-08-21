var BasicDefenseSelector = cc.Node.extend({
  hud: null,
  main: null, // Main dialog with element buttons

  titleContainer: null,
  titleText: null,
  titlePrice: null,
  titleClose: null,

  buttonContainer: null, // Main dialog with element buttons
  buttons: null, // List of three buttons

  confirm: null, // Confirmation after selection
  confirmOk: null,
  confirmCancel: null,

  ctor: function(hud, options) {
    this._super();
    this.x = cc.winSize.width / 2;
    this.hud = hud;

    this.main = new Dialog(hud, {type:"empty", bgImage: r.ui.panel_out, width: "376px", height: "228px", x: "center", y: "140px"});
    this.main.addTo(this);

    this.titleContainer = new Layout({height: "66px", width: "100pw", y: "-66px"});
    this.titleContainer.addTo(this.main);
    this.titleText = new Text({text: "New Defense", x: "center", y: "center", bottom: "12px", top: cc.sys.isNative ? "8px" : "13px", fontSize: 32});
    this.titleText.addTo(this.titleContainer);
    this.titlePrice = new Text({text: _.format("${}", rb.prices.createDefense), x: "center", y: "center", bottom:"-16px", top: cc.sys.isNative ? "8px" : "13px", fontSize: 24});
    this.titlePrice.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => this.dismiss(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);

    this.buttonContainer = new Panel({bgImage: r.ui.panel_in_nuts, height: "154px",  x:"center", padding: "4px", bottom:"7px"});
    this.buttonContainer.addTo(this.main);

    this.buttons = [
        new Button({button: "yellow", width: "96px", height: "96px", icon: "flash", bottom: "24px", x:"0px", left:"28px"}),
        new Button({button: "deepOrange", width: "96px", height: "96px", icon: "fire", bottom: "24px", x: "96px", left: "40px"}),
        new Button({button: "blue", width: "96px", height: "96px", icon: "water", bottom: "24px", x: "192px", left: "52px"}),
    ];
    let types = Object.keys(Robot.prototype.getPossibleStats("element"));
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].bdsType = types[i]; // Special bdsType basicDefenseSelector Type propertys, useful in the createDefense function
      this.buttons[i].addTo(this.buttonContainer);
    }

    this.confirm = new Dialog(hud, {type:"empty", bgImage: r.ui.panel , width: "272px", height: "152px", x: "center", y: "140px"});
    this.confirm.addTo(this);
    this.confirmOk = new Button({callback: () => this.confirmDefenseCreation(), button: "green", width: "96px", height: "96px", icon: "check", x: "-104px", right: "24px", bottom:"28px"});
    this.confirmOk.addTo(this.confirm);
    this.confirmCancel = new Button({callback: () => this.showMain(), button: "red", width: "96px", height: "96px", icon: "close", x:"0px", left:"24px", bottom: "28px"});
    this.confirmCancel.addTo(this.confirm);

    this.confirm.dismiss = _.sequence(this.confirm,
      this.confirm.dismiss,
      () => this.hud.level.removeDummyDefense()
    );
  },
  addTo: function(parent, z, tag) {
    // Use this component.addTo(parent) instead of parent.addChild(component)
    // So the setup function is executed after the addChild. Isn't necessary
    // If you are not using parent-dependant properties like ph or pw
    cc.Node.prototype.addChild.call(parent, this, z || null, tag || null);
    this.setup({});
  },
  setup: function(options) {
    let createDefense = function(btn, level, type) {
      let bds = btn;
      while (bds.toString() !== "BasicDefenseSelector") bds = bds.getParent(); // Search for basicDefenseSelector in parent three
      let hud = bds.getParent();

      hud.it.message("Tell me where, and I'll do my thing");
      let life = 0;//0,1,2
      let range = 0;//0,1,2
      let element = type;//water,fire,electric
      let terrain = 0;//0,1
      let damage = 0;//0,1,2
      let attackSpeed = 0;//0,1,2
      let customDefense = new Defense(level, life, element, range, terrain, damage, attackSpeed, true);
      customDefense.retain();
      level.showDummyDefense(customDefense);
      if (!bds.confirm.inScreen) bds.showConfirm();
    };
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].setup({callback: _.wrap(createDefense, this.buttons[i], this.getParent().level /* hud.level */, this.buttons[i].bdsType)});
    }
  },
  confirmDefenseCreation: function() {
    /// TODO ALL THIS CODE IS REPEATED FROM GAME.JS and MAP.JS
    let hud = this.hud;
    let level = hud.level;
    if (!level.dummyDefense || level.dummyDefense.getNumberOfRunningActions() !== 0) return;
    let pos = level.map.tileCoordFromChild(cc.pCompOp(level.dummyDefense.getPosition(), Math.round));
    let canBePlaced = level.dummyDefense.canBePlacedOn(pos);
    if (canBePlaced.result && level.character.getGold() >= rb.prices.createDefense) {
      level.character.goBuild(level.dummyDefense);
      let newDefense = level.dummyToDefense();
      hud.ds.confirm.dismiss(); // This doesn't only hides the bds, this also clears the dummy defense from map
      hud.ig.removeGold(rb.prices.createDefense);
      hud.it.message(canBePlaced.cause);
    } else {
      if (canBePlaced.result) {
        hud.it.message("You seem pretty broke");
        hud.ig.notEnoughGold();
      } else {
        hud.it.message(canBePlaced.cause);
      }
    }
  },
  show: function() {
    this.showMain();
  },
  showMain: function() {
    this.main.show();
  },
  showConfirm: function() {
    this.confirm.show();
  },
  dismiss: function() {
    this.main.dismiss();
    this.confirm.dismiss();
  },
  toString: () => "BasicDefenseSelector",
});
