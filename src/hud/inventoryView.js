var InventoryView = Dialog.extend({
  inventory: null, // The inventory object to which this view repreents
  hud: null, // The parent hud

  // UI Components Structure

  titleContainer: null,
  titleElement: null,
  titleText: null,
  titleClose: null,

  midContainer: null,
  gridContainer: null,
  infoContainer: null,


  ctor: function(hud, inventory, options) {

    this.inventory = inventory;

    options.type = "empty";
    options.width = options.width || "100pmin";
    options.height = options.height || "420px";
    options.paddingHorizontal = options.paddingHorizontal || "11px";
    options.x = options.x || "center";
    options.y = options.y || "center";
    options.bgImage = r.ui.grey;

    this._super(hud, options);

    this.titleContainer = new Layout({height: "80px", width: "100pw", y: "-80px"});
    this.titleContainer.addTo(this);
    this.titleElement = new Button({left: "11px", top:"11px", button: "yellow", width: "100ph", icon: "treasure-chest", scale: 0.75});
    this.titleElement.addTo(this.titleContainer);
    this.titleText = new Text({text: "Inventory", width:"100pw + -24px + -78.4px + -78.4px", x: "100ph + 22px", y: "center", top: cc.sys.isNative ? "8px" : "13px", fontSize: 32});
    this.titleText.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => this.dismiss(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);

    this.midContainer = new Layout({height: "100ph + -80px"});
    this.midContainer.addTo(this);
    // this.midContainer.debug(); // XXX
    this.gridContainer = new Panel({bgImage: r.ui.panel_in_nuts, height: "100ph", width: "70pw", padding: "11px"});
    this.gridContainer.addTo(this.midContainer);
    // this.gridContainer.debug(); // XXX
    this.infoContainer = new Layout({height: "100ph", width: "30pw + 11px", padding: "11px", x: "-30pw + -22px"});
    this.infoContainer.addTo(this.midContainer);
    // this.infoContainer.debug(); // XXX
    this.infoImageContainer = new Panel({height: "60pw", width: "60pw", x: "center", y: "-60pw"});
    this.infoImageContainer.addTo(this.infoContainer);
    // this.infoImageContainer.debug(); // XXX
    this.infoImage = new Badge({bgImage: r.items.gold, padding: "22px", scale: 1.25, x: "center", y: "center"});
    this.infoImage.addTo(this.infoImageContainer);
    // this.infoImage.debug(); // XXX
    this.infoName = new Text({text: "Gold", x: "center", fontSize: 24, y: (this.infoContainer.height - 160) + "px" , bottom: cc.sys.isNative ? "5px" : "0px"});
    this.infoName.addTo(this.infoContainer);
    // this.infoName.debug(); // XXX
    this.infoText = new Text({text: "This is some sample text, definitely. You can use this item to win the game.", x:"center", lineHeight: 18, fontSize: 18, bottom: cc.sys.isNative ? "5px" : "0px"});
    this.infoText.setTextAreaSize(cc.size(this.infoContainer.width, this.infoContainer.height - 160));
    this.infoText.addTo(this.infoContainer);
    // this.infoText.debug(); // XXX

    this.show(inventory);
  },

  show: function(inventory) {
    this._super();
    this.setInventory(inventory);
  },

  setInventory: function(inventory) {
    this.inventory = inventory;
    // this.statsLife.setComputer(defense);
    // this.statsRange.setComputer(defense);
    // this.statsDamage.setComputer(defense);
    // this.statsAttackSpeed.setComputer(defense);
    // let titleElementOptions = {
    //   electric: {button: "yellow", icon: "flash"},
    //   fire: {button: "orange", icon: "fire"},
    //   water: {button: "blue", icon: "water"},
    // }[defense.element];
    // this.titleElement.setup(titleElementOptions);
    // this.titleText.setup({text: _.format("{} Defense", _.capitalize(defense.element))});
    // let hud = this.getParent();
    // this.titleDestroy.setup({
    //   callback: () => {
    //     this.dismiss();
    //     hud.alert("Recycle Defense", _.format("Are you sure you want to delete this defense for {} bucks? You just think about money don't you?", rb.prices.destroyDefense), () => {
    //       defense.die();
    //       hud.ig.addGold(rb.prices.destroyDefense);
    //       hud.dialog.dismiss();
    //     });
    //   }
    // });
    // let isDamaged = !defense.isRepaired();
    // this.titleRepair.setVisible(isDamaged);
    // if (isDamaged) {
    //   this.titleRepair.setup({
    //     callback: () => {
    //       this.dismiss();
    //       defense.level.character.goRepair(defense);
    //     }
    //   });
    // }
  },

  toString: () => "InventoryView"
});
