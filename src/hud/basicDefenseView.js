var BasicDefenseView = Dialog.extend({
  selectedDefense: null,
  hud: null,

  // UI Components Structure

  titleContainer: null,
  titleElement: null,
  titleText: null,
  titleRepair: null,
  titleDestroy: null,
  titleClose: null,

  statsContainer: null,
  statsMain: null,
  statsMainLeft: null,
  statsMainRight: null,
  statsLife: null,
  statsRange: null,
  statsDamage: null,
  statsAttackSpeed: null,

  ctor: function(hud, options, selectedDefense) {

    this.selectedDefense = selectedDefense;

    options.type = "empty";
    options.width = options.width || "100pmin";
    options.height = options.height || "280px";
    options.paddingHorizontal = options.paddingHorizontal || "11px";
    options.x = options.x || "center";
    options.y = options.y || "140px";
    options.bgImage = r.ui.grey;

    this._super(hud, options);

    this.titleContainer = new Layout({height: "80px", width: "100pw", y: "-80px"});
    this.titleContainer.addTo(this);
    this.titleElement = new Button({left: "11px", top:"11px", button: "pink", width: "100ph", icon: "robot", scale:0.75});
    this.titleElement.addTo(this.titleContainer);
    this.titleText = new Text({text: "Manage Defense", hAlign:cc.TEXT_ALIGNMENT_LEFT, bottom: "12px", width:"40pw", x: "100ph + 22px", y: "center", top: cc.sys.isNative ? "8px" : "13px", fontSize: 32});
    this.titleText.addTo(this.titleContainer);
    this.titlePrice = new Text({text: _.format("Improve for ${}", rb.prices.increaseStat), bottom:"-16px", x: "100ph + 22px", y: "center", top: cc.sys.isNative ? "8px" : "13px", fontSize: 24});
    this.titlePrice.addTo(this.titleContainer);
    this.titleRepair = new Button({x: "-200ph + -78.4px + -11px", top:"11px", button: "green", width: "100ph", icon: "wrench", scale:0.75});
    this.titleRepair.addTo(this.titleContainer);
    this.titleRepair.setVisible(false);
    this.titleDestroy = new Button({x: "-100ph + -78.4px", top:"11px", button: "red", width: "100ph", icon: "delete", scale:0.75});
    this.titleDestroy.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => this.dismiss(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);


    this.statsContainer = new Layout({height: "200px"});
    this.statsContainer.addTo(this);
    this.statsMain = new Panel({bgImage: r.ui.panel_in, height: "100ph", width: "100pw", padding: "11px", x: "center"});
    this.statsMain.addTo(this.statsContainer);
    this.statsMainLeft = new Layout({width: "50pw"});
    this.statsMainLeft.addTo(this.statsMain);
    this.statsMainRight = new Layout({left: "50pw", width: "50pw", right:"32px"});
    this.statsMainRight.addTo(this.statsMain);
    this.statsLife = new StatTweak("Defense", "life", {y:"84px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", height:"68px", fontSize: 36});
    this.statsLife.addTo(this.statsMainLeft);
    this.statsRange = new StatTweak("Defense", "range", {y:"16px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", height:"68px", fontSize: 36});
    this.statsRange.addTo(this.statsMainLeft);
    this.statsDamage = new StatTweak("Defense", "damage", {y:"84px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", height:"68px", fontSize: 36});
    this.statsDamage.addTo(this.statsMainRight);
    this.statsAttackSpeed = new StatTweak("Defense", 'attackSpeed', {y:"16px", scale: 0.6, padding: "11px", paddingHorizontal: "36px", height:"68px", fontSize: 36});
    this.statsAttackSpeed.addTo(this.statsMainRight);
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
    let titleElementOptions = {
      electric: {button: "yellow", icon: "flash"},
      fire: {button: "orange", icon: "fire"},
      water: {button: "blue", icon: "water"},
    }[defense.element];
    this.titleElement.setup(titleElementOptions);
    this.titleText.setup({text: _.format("{} Defense", _.capitalize(defense.element))});
    let hud = this.getParent();
    this.titleDestroy.setup({
      callback: () => {
        this.dismiss();
        hud.alert("Recycle Defense", _.format("Are you sure you want to delete this defense for {} bucks? You just think about money don't you?", rb.prices.destroyDefense), () => {
          defense.die();
          hud.ig.addGold(rb.prices.destroyDefense);
          hud.dialog.dismiss();
        });
      }
    });
    let isDamaged = !defense.isRepaired();
    this.titleRepair.setVisible(isDamaged);
    if (isDamaged) {
      this.titleRepair.setup({
        callback: () => {
          this.dismiss();
          defense.level.character.goRepair(defense);
        }
      });
    }
  },

  toString: () => "BasicDefenseView"
});
