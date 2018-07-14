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

    this.gridContainer = new Panel({bgImage: r.ui.panel_in, height: "100ph", width: "70pw", padding: "11px"});
    this.gridContainer.addTo(this.midContainer);
    // this.gridContainer.debug(); // XXX
    this.gridScrollContainer = new Layout({paddingVertical: "11px"});
    this.gridScrollContainer.addTo(this.gridContainer);
    // this.gridScrollContainer.debug();
    this.gridScroll = new ScrollLayout({innerHeight: "100pw", innerWidth: "100pw", height: "100ph + -5px"});
    this.gridScroll.addTo(this.gridScrollContainer);
    // this.gridScroll.debug();

    let amountOfCells = inventory.capacity;
    let cells = [];
    for (var i = 0; i < amountOfCells; i++) {
      cells.push(new Panel({bgImage: r.ui.panel_in_soft, padding: "4px"}));
    }
    this.grid = new Grid(cells, {cols: 5, padding: "11px", paddingHorizontal: "5px", height: "100ph + -11px"});
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

    this.show(inventory);
  },

  show: function() {
    this._super();
    this.refresh();
  },

  refresh: function() {
    // TODO Refresh grid with inventory capacity
    let inv = this.inventory;

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
        cell.itemThumb = new Badge({bgImage: inv.items[i].item.image, scale9: false, padding: "13px",});
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
    let cell = this.grid.cells[i];
    while (cell.item != null && i < this.grid.cells.length) {
      cell.item = null;
      cell.quantity = null;
      cell.itemThumb.removeFromParent();
      cell.itemQuantity.removeFromParent();
      cell = this.grid.cells[++i];
    }
  },

  toString: () => "InventoryView"
});
