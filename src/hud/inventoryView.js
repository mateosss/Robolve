var InventoryView = Dialog.extend({
  inventory: null, // The inventory object to which this view repreents
  hud: null, // The parent hud
  COLS: 5, // Amount of columns of the grid
  selectedStack: null, // Current stack reference being showed in info sidebar
  selectedStackGridCell: null, // Current stack UI representation
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
    options.y = options.y || "140px";
    options.bgImage = r.ui.blueGray;

    this._super(hud, options);

    this.titleContainer = new Layout({height: "48px", width: "100pw", y: "-48px"});
    this.titleContainer.addTo(this);
    this.titleElement = new Badge({bgImage: r.ui.amber, scale9: false, left: "11px", top:"11px", width: "100ph", icon: "treasure-chest", iconFontSize: 72});
    this.titleElement.addTo(this.titleContainer);
    this.titleText = new Text({text: "Inventory", width:"100pw + -24px + -78.4px + -78.4px", x: "100ph + 22px", y: "center", top: cc.sys.isNative ? "8px" : "13px", fontSize: 32});
    this.titleText.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => this.dismiss(), width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);

    this.midContainer = new Layout({height: "100ph + -48px"});
    this.midContainer.addTo(this);

    this.gridContainer = new Panel({bgImage: r.ui.panel_in, height: "100ph", width: "70pw", padding: "11px"});
    this.gridContainer.addTo(this.midContainer);
    this.gridScrollContainer = new Layout({paddingVertical: "11px"});
    this.gridScrollContainer.addTo(this.gridContainer);

    let amountOfCells = inventory.capacity;
    let cells = [];
    let cols = this.COLS;
    for (let i = 0; i < amountOfCells; i++) cells.push(new Panel({bgImage: r.ui.panel_in_soft, padding: "4px"}));

    this.gridScroll = new ScrollLayout({innerHeight: (100 / cols) * Math.ceil(amountOfCells / cols) + "pw", innerWidth: "100pw", height: "100ph + -5px"});
    this.gridScroll.addTo(this.gridScrollContainer);

    this.grid = new Grid(cells, {cols: cols, padding: "11px", paddingHorizontal: "5px", height: "100ph + -11px"});
    this.grid.addTo(this.gridScroll);
    this.grid.setup({}); // TODO Don't know why it is needed

    this.info = new Layout({height: "100ph", width: "30pw + 11px", padding: "11px", paddingVertical: "11px", x: "-30pw + -22px"});
    this.info.addTo(this.midContainer);

    this.infoContainer = new Layout({visible: false});
    this.infoContainer.addTo(this.info);
    this.infoImageContainer = new Panel({height: "60pw", width: "60pw", x: "center", y: "-60pw"});
    this.infoImageContainer.addTo(this.infoContainer);
    this.infoImage = new Badge({bgImage: r.items.gold, padding: "20ph", height: "60ph", scale9: false});
    this.infoImage.addTo(this.infoImageContainer);
    this.infoName = new Text({text: "Gold", x: "center", fontSize: 24, y: (this.infoContainer.height - 160) + "px" , bottom: cc.sys.isNative ? "5px" : "0px"});
    this.infoName.addTo(this.infoContainer);
    this.infoTextContainer = new Panel({bgImage: r.ui.panel_out, y: "-48px + -60pw + -24px + -11px", height: "48px", scale: 0.5});
    this.infoTextContainer.addTo(this.infoContainer);
    this.infoText = new Text({text: "This is definitely some sample text", lineHeight: 36, fontSize: 36, width: "100pw", vAlign: cc.VERTICAL_TEXT_ALIGNMENT_CENTER, bottom: cc.sys.isNative ? "5px" : "0px"});
    this.infoText.setTextAreaSize(cc.size(this.infoTextContainer.width, this.infoTextContainer.height));
    this.infoText.addTo(this.infoTextContainer);

    this.infoStatsContainer = new Panel({bgImage: r.ui.panel_in_soft, y: "0px", height: "60ph + -48px + -18px + -11px"});
    this.infoStatsContainer.addTo(this.infoContainer);
    this.infoStatsScroll = new ScrollLayout({left: "11px", width: "100pw + -11px", height: "100ph + -6px", scrollBarVisible: false});
    this.infoStatsScroll.addTo(this.infoStatsContainer);

    // Create all possible stats invisible, innerHeight of infoStatsScroll and what elements are visible and with what text will be set afterwards in the refresh method
    let stats = Object.keys(rb.characterStats);
    for (let i = 0; i < stats.length; i++) {
      this["infoStats[" + stats[i] + "]Label"] = new Text({text: rb.characterStats[stats[i]].name, width: "100pw", hAlign: cc.TEXT_ALIGNMENT_LEFT, fontSize: 18});
      this["infoStats[" + stats[i] + "]Label"].addTo(this.infoStatsScroll);
      this["infoStats[" + stats[i] + "]Value"] = new Badge({bgImage: r.ui.panel_in_soft, text: "—", scale: 0.3, width: "64px", height: "32px", x: "-64px + -11px", textFontSize: 56});
      this["infoStats[" + stats[i] + "]Value"].addTo(this.infoStatsScroll);
    }

    this.infoNoSelection = new Text({text: "Select an item from your inventory grid to watch its properties.", width: "100pw", fontSize: 18, y: "center"});
    this.infoNoSelection.addTo(this.info);

    this.show(); // REMOVE XXX
  },

  show: function() {
    this._super();
    this.unselectStack();
    this.refresh();
  },

  refresh: function() {
    let inv = this.inventory;

    // Check if inv.capacity and inv.items.length are not synced and then sync them
    if (inv.items.length > inv.capacity) this.hud.level.character.setInventoryCapacity(inv.capacity);

    // Save inventory to disk // TODO not very well thought inventory save behaviour
    SaveLoad.save(inv);

    // Update amount of cells with inventory capacity
    let cols = this.COLS;
    let rowsBefore = Math.ceil(this.grid.cells.length / cols);
    if (inv.capacity < this.grid.cells.length) {
      for (let i = this.grid.cells.length - 1; inv.capacity <= i; i--) {
        this.grid.cells.pop().removeFromParent();
      }
    } else if (inv.capacity > this.grid.cells.length) {
      for (let i = this.grid.cells.length; i < inv.capacity; i++) {
        this.grid.addCell(new Panel({bgImage: r.ui.panel_in_soft, padding: "4px"}));
      }
    }
    let rowsAfter = Math.ceil(this.grid.cells.length / cols);
    if (rowsBefore !== rowsAfter) { // Update container height to row height
      this.gridScroll.setup({innerHeight: (100 / cols) * Math.ceil(this.grid.cells.length / cols) + "pw", innerWidth: "100pw", height: "100ph + -5px"});
      this.grid.setup({});
      this.grid.setup({});
    }


    // Update first inv.length items of grid
    for (var i = 0; i < inv.items.length; i++) {
      let cell = this.grid.cells[i];

      let gridItem = cell.item; // Reference
      let gridItemQuantity = cell.quantity; // Value
      let invItem = inv.items[i].item; // Reference
      let invItemQuantity = inv.items[i].quantity; // Value

      if (!cell.item) { // Empty cell, initialize it
        cell.item = inv.items[i]; // Saves the {item: Item, quantity: Number} pair reference
        cell.quantity = inv.items[i].quantity; // The quantity *value* to compare later
        let ii = i; // A little hack with scopes
        cell.itemThumb = new Badge({callback: (thumb) => { // jshint ignore:line
          // TODO use this comment later
          // this.hud.level.character.dropStack(ii);
          // this.hud.ig.refresh();
          if (thumb.getNumberOfRunningActions() === 0) {
            let up = new cc.EaseBackOut(new cc.MoveBy(0.1, cc.p(0, 32)));
            let down = new cc.EaseBounceOut(new cc.MoveBy(0.2, cc.p(0, -32)), 3);
            let inhale = new cc.EaseElastic(new cc.MoveTo(0.2, cc.p(thumb.x, thumb.y + 4)));
            let exhale = new cc.EaseElastic(new cc.MoveTo(0.2, cc.p(thumb.x, thumb.y - 4)));
            let breath = new cc.CallFunc(() => thumb.runAction(new cc.RepeatForever(new cc.Sequence(inhale, exhale)))); // HACK: for some reason it is not possible to sequence a finite time action and then a RepeatForever
            let sequence = new cc.Sequence([up, down, breath]);
            thumb.runAction(sequence);
            this.setSelectedStack(this.inventory.items[ii], cell);
          }
        }, bgImage: inv.items[i].item.image, scale9: false, height: "80ph", padding: "10ph",});
        cell.itemThumb.addTo(cell);
        cell.itemQuantity = new Text({text: inv.items[i].quantity, fontSize: 24, x: "center", top: "5px"});
        cell.itemQuantity.addTo(cell);
      } else if (gridItem === invItem && gridItemQuantity !== invItemQuantity) { // Same item on filled cell, with different quantity, update it
        cell.quantity = invItemQuantity;
        cell.itemQuantity.setup({text: invItemQuantity});
      } else if (gridItem !== invItem) { // New item on filled cell, update cell ui
        cell.item = inv.items[i];
        cell.quantity = inv.items[i].quantity;
        cell.itemThumb.setup({bgImage: inv.items[i].item.image});
        cell.itemQuantity.setup({text: inv.items[i].quantity});
      } // else nothing has changed at all
    }

    // Remove all items outside this for (inv.length)
    if (i < this.grid.cells.length) {
      let cell = this.grid.cells[i];
      while (cell.item != null && i < this.grid.cells.length) {
        cell.item = null;
        cell.quantity = null;
        cell.itemThumb.removeFromParent();
        cell.itemQuantity.removeFromParent();
        if (++i < this.grid.cells.length) cell = this.grid.cells[i];
      }
    }

    // Item Selected info
    let somethingToDisplay = !!this.selectedStack;
    this.infoContainer.setup({visible: somethingToDisplay});
    this.infoNoSelection.setup({visible: !somethingToDisplay});
    if (somethingToDisplay) {
      // image, name and description
      let selectedItem = this.selectedStack.item;
      this.infoImage.setup({bgImage: selectedItem.image});
      this.infoName.setup({text: selectedItem.name});
      this.infoText.setup({text: selectedItem.description});

      // mods
      let mods = selectedItem.mods;
      let hasMods = mods !== null;
      this.infoStatsContainer.setup({visible: hasMods});
      if (hasMods) {
        const HEIGHT = 34;
        let allStats = Object.keys(rb.characterStats);
        let modStats = Object.keys(mods);
        this.infoStatsScroll.setup({innerHeight: modStats.length * HEIGHT + "px + 11px"});
        let j = 0;
        for (let i = 0; i < allStats.length; i++) {
          if (_.in(allStats[i], modStats)) {
            this["infoStats[" + allStats[i] + "]Label"].setup({visible: true, text: rb.characterStats[allStats[i]].name, y: (-HEIGHT * (j + 1)) + "px"});
            this["infoStats[" + allStats[i] + "]Value"].setup({visible: true, text: mods[allStats[i]], y: (-HEIGHT * (j + 1)) + "px"});
            j++;
          } else {
            this["infoStats[" + allStats[i] + "]Label"].setup({visible: false});
            this["infoStats[" + allStats[i] + "]Value"].setup({visible: false});
          }
        }
        this.infoStatsScroll.jumpToPercentVertical(500);
      }
    }


  },

  setSelectedStack: function(stack, gridCell) { // Set selectedStack to show in the info sideview, stack is the reference to an inventory.items element, and gridCell is its representation
    if (this.selectedStack) this.selectedStackGridCell.itemThumb.stopAllActions();
    this.selectedStack = stack;
    this.selectedStackGridCell = gridCell;
    this.refresh();
  },

  unselectStack: function() {
    this.setSelectedStack(null, null);
  },

  toString: () => "InventoryView"
});
