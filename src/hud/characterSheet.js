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

  STATS: [ // TODO Should get the stats of the character programatically, here are hardcoded
        {stat: 'sSpeed', description: "In units per second", unit: " U/sec", rightZeros: 0},
        {stat: 'sBuildRange', description: "In units round", unit: " U", rightZeros: 0},
        {stat: 'sBuildTime', description: "In seconds per new defense", unit: " sec", rightZeros: 2},
        {stat: 'sImproveTime', description: "In seconds per improvement", unit: " sec", rightZeros: 2},
        {stat: 'sRepairAmount', description: "Defense HP repaired per second", unit: " HP/sec", rightZeros: 0},
        {stat: 'sAttackRange', description: "In units round", unit: " U", rightZeros: 0},
        {stat: 'sAttackSpeed', description: "Amount of hits per second", unit: "/sec", rightZeros: 2},
        {stat: 'sDamage', description: "Damage per hit", unit: "/hit", rightZeros: 0},
  ],
  ctor: function(hud, options, char) {

    this.char = char;

    options.type = "empty";
    options.width = options.width || "70pmin";
    options.height = options.height || this.STATS.length * 50 + 140 + "px";
    options.paddingHorizontal = options.paddingHorizontal || "11px";
    options.x = options.x || "center";
    options.y = options.y || "center";
    options.bgImage = r.ui.blueGray;

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

    for (var i = 0; i < this.STATS.length; i++) {
      let sStat = this.STATS[i].stat;
      let Stat = this.STATS[i].stat.substr(1);
      let ypos = (this.STATS.length - 1 - i) * 50;
      this["stats" + Stat + "Label"] = new Text({text: _.formatVarName(Stat), width: "100pw", y: ypos + "px", bottom: "20px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px", fontSize: 28});
      this["stats" + Stat + "Label"].addTo(this.statsMain);
      this["stats" + Stat + "Description"] = new Text({text: this.STATS[i].description, width: "100pw", y: ypos + "px", bottom: "7px", hAlign: cc.TEXT_ALIGNMENT_LEFT, paddingHorizontal: "22px", fontSize: 18});
      this["stats" + Stat + "Description"].addTo(this.statsMain);
      this["stats" + Stat + "Value"] = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "128px", paddingVertical: "2px", height: "48px", x: "-128px + -22px", y: ypos + "px", bottom: "16px", textFontSize: 80});
      this["stats" + Stat + "Value"].addTo(this.statsMain);
    }
  },

  show: function() {
    this.refresh();
    this._super();
  },

  refresh: function() { // Refreshes stat texts based on character real stats
    for (var i = 0; i < this.STATS.length; i++) {
      let sStat = this.STATS[i].stat;
      let Stat = this.STATS[i].stat.substr(1);
      let unit = this.STATS[i].unit;
      let rightZeros = this.STATS[i].rightZeros;
      this["stats" + Stat + "Value"].setup({text: _.format("{}" + unit, this.char[sStat].toFixed(rightZeros))});
    }
  },

  toString: () => "CharSheet"
});
