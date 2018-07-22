var EquipBar = Panel.extend({
  hud: null,
  inventory: null,
  // UI Components structure
  slotsContainer: null,
  slots: null, // panels which containes an item and itemThumb property,
  ctor: function(hud, inventory) {
    this.hud = hud;
    this.inventory = inventory;

    const SLOT_HEIGHT = 72;
    this.slots = new Array(inventory.equipedCapacity);
    const TOTAL_HEIGHT = SLOT_HEIGHT * this.slots.length;

    this._super({bgImage: r.ui.panel_out, height: TOTAL_HEIGHT + "px + 22px", width: SLOT_HEIGHT + "px + 10px", x: -SLOT_HEIGHT + "px + -11px", y: -TOTAL_HEIGHT + "px + -22px", right: "11px", top: "11px"});
    this.slotsContainer = new Layout({bottom: "11px", height: "100ph + -11px", padding: "5px"});
    this.slotsContainer.addTo(this);
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i] = new Panel({y: (this.slots.length - i - 1)  * SLOT_HEIGHT + "px", height: "100pw", width: "100pw", bgImage: r.ui.panel_in_soft_light, padding: "2px"});
      this.slots[i].addTo(this.slotsContainer);
      this.slots[i].itemThumb = new Badge({visible: false, bgImage: r.items.default, scale9: false, height: "80ph", padding: "10ph"});
      this.slots[i].itemThumb.addTo(this.slots[i]);
      this.slots[i].item = null;
    }
  },

  refresh: function() {
    let stacks = this.inventory.equiped;
    for (let i = 0; i < this.slots.length; i++) {
      if (i < stacks.length) {
        this.slots[i].item = stacks[i];
        this.slots[i].itemThumb.setup({visible: true, bgImage: stacks[i].item.image});
      } else {
        this.slots[i].item = null;
        this.slots[i].itemThumb.setup({visible: false, bgImage: r.empty});
      }
    }
  },

  toString: () => "EquipBar",
});
