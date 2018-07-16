var InventoryView = Dialog.extend({
  inventory: null, // The inventory object to which this view repreents
  hud: null, // The parent hud
  COLS: 5, // Amount of columns of the grid

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

    this.gridContainer = new Panel({bgImage: r.ui.panel_in, height: "100ph", width: "70pw", padding: "11px"});
    this.gridContainer.addTo(this.midContainer);
    // this.gridContainer.debug(); // XXX
    this.gridScrollContainer = new Layout({paddingVertical: "11px"});
    this.gridScrollContainer.addTo(this.gridContainer);
    // this.gridScrollContainer.debug();

    let amountOfCells = inventory.capacity;
    let cells = [];
    let cols = this.COLS;
    for (let i = 0; i < amountOfCells; i++) cells.push(new Panel({bgImage: r.ui.panel_in_soft, padding: "4px"}));

    this.gridScroll = new ScrollLayout({innerHeight: (100 / cols) * Math.ceil(amountOfCells / cols) + "pw", innerWidth: "100pw", height: "100ph + -5px"});
    this.gridScroll.addTo(this.gridScrollContainer);
    // this.gridScroll.debug();

    this.grid = new Grid(cells, {cols: cols, padding: "11px", paddingHorizontal: "5px", height: "100ph + -11px"});
    this.grid.addTo(this.gridScroll);
    this.grid.setup({}); // TODO Don't know why it is needed


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
  },

  show: function() {
    this._super();
    this.refresh();
  },

  refresh: function() {
    let inv = this.inventory;

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
        cell.itemThumb = new Badge({callback: () => {this.hud.level.character.dropStack(ii); this.hud.ig.refresh();}, bgImage: inv.items[i].item.image, scale9: false, padding: "13px",}); // jshint ignore:line
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
  },

  toString: () => "InventoryView"
});
