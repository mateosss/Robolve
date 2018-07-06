var CharacterSheet = Dialog.extend({
  char: null, // Character
  hud: null,

  // UI Components Structure

  titleContainer: null,
  titleElement: null,
  titleText: null,
  titleDestroy: null,
  titleClose: null,

  statsContainer: null,
  statsMain: null,
  statsSpeed: null,
  statsBuildRange: null,
  statsBuildTime: null,
  statsAttackRange: null,
  statsAttackSpeed: null,
  statsDamage: null,

  ctor: function(hud, options, char) {

    this.char = char;

    options.type = "empty";
    options.width = options.width || "70pmin";
    options.height = options.height || "490px";
    options.paddingHorizontal = options.paddingHorizontal || "11px";
    options.x = options.x || "center";
    options.y = options.y || "center";
    options.bgImage = r.ui.grey;

    this._super(hud, options);

    this.titleContainer = new Layout({height: "80px", width: "100pw", y: "-80px"});
    this.titleContainer.addTo(this);
    this.titleElement = new Button({left: "11px", top:"11px", button: "pink", width: "100ph", icon: "robot", scale:0.75});
    this.titleElement.addTo(this.titleContainer);
    this.titleText = new Text({text: "Characater", hAlign:cc.TEXT_ALIGNMENT_CENTER, width:"100pw", y: "center", top: cc.sys.isNative ? "8px" : "13px", fontSize: 32});
    this.titleText.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => this.dismiss(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);


    this.statsContainer = new Layout({height: "100ph + -80px"});
    this.statsContainer.addTo(this);
    this.statsMain = new Panel({bgImage: r.ui.panel_in, height: "100ph", width: "100pw", padding: "11px", x: "center"});
    this.statsMain.addTo(this.statsContainer);
    this.statsSpeedLabel = new Text({text: "Speed", width: "100pw", y: "300px", bottom: "11px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px"});
    this.statsSpeedLabel.addTo(this.statsMain);
    this.statsSpeedValue = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: "300px", bottom: "16px", textFontSize: 80});
    this.statsSpeedValue.addTo(this.statsMain);
    this.statsBuildRangeLabel = new Text({text: "Build Range", width: "100pw", y: "250px", bottom: "11px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px"});
    this.statsBuildRangeLabel.addTo(this.statsMain);
    this.statsBuildRangeValue = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: "250px", bottom: "16px", textFontSize: 80});
    this.statsBuildRangeValue.addTo(this.statsMain);
    this.statsBuildTimeLabel = new Text({text: "Build Time", width: "100pw", y: "200px", bottom: "11px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px"});
    this.statsBuildTimeLabel.addTo(this.statsMain);
    this.statsBuildTimeValue = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: "200px", bottom: "16px", textFontSize: 80});
    this.statsBuildTimeValue.addTo(this.statsMain);
    this.statsRepairAmountLabel = new Text({text: "Repair Amount", width: "100pw", y: "150px", bottom: "11px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px"});
    this.statsRepairAmountLabel.addTo(this.statsMain);
    this.statsRepairAmountValue = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: "150px", bottom: "16px", textFontSize: 80});
    this.statsRepairAmountValue.addTo(this.statsMain);
    this.statsAttackRangeLabel = new Text({text: "Attack Range", width: "100pw", y: "100px", bottom: "11px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px"});
    this.statsAttackRangeLabel.addTo(this.statsMain);
    this.statsAttackRangeValue = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: "100px", bottom: "16px", textFontSize: 80});
    this.statsAttackRangeValue.addTo(this.statsMain);
    this.statsAttackSpeedLabel = new Text({text: "Attack Speed", width: "100pw", y: "50px", bottom: "11px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px"});
    this.statsAttackSpeedLabel.addTo(this.statsMain);
    this.statsAttackSpeedValue = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: "50px", bottom: "16px", textFontSize: 80});
    this.statsAttackSpeedValue.addTo(this.statsMain);
    this.statsDamageLabel = new Text({text: "Damage", width: "100pw", y: "0px", bottom: "11px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px"});
    this.statsDamageLabel.addTo(this.statsMain);
    this.statsDamageValue = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: "0px", bottom: "16px", textFontSize: 80});
    this.statsDamageValue.addTo(this.statsMain);
  },

  show: function() {
    this.refresh();
    this._super();
  },

  refresh: function() { // Refreshes stat texts based on character real stats
    this.statsSpeedValue.setup({text: _.format("{} u / s", this.char.sSpeed),});
    this.statsBuildRangeValue.setup({text: _.format("{} units", this.char.sBuildRange),});
    this.statsBuildTimeValue.setup({text: _.format("{} % / s", this.char.sBuildTime),});
    this.statsRepairAmountValue.setup({text: _.format("{} hp / s", this.char.sRepairAmount),});
    this.statsAttackRangeValue.setup({text: _.format("{} units", this.char.sAttackRange),});
    this.statsAttackSpeedValue.setup({text: _.format("{} / s", this.char.sAttackSpeed),});
    this.statsDamageValue.setup({text: _.format("{} hp", this.char.sDamage),});
  },

  toString: () => "CharSheet"
});
