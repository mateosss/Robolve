var EquipBar = Panel.extend({
  hud: null,

  // UI Components structure
  slotsContainer: null,
  slots: null,
  ctor: function(hud) {
    this.hud = hud;

    const SLOT_HEIGHT = 72;
    this.slots = new Array(5);
    const TOTAL_HEIGHT = SLOT_HEIGHT * this.slots.length;

    this._super({bgImage: r.ui.panel_out, height: TOTAL_HEIGHT + "px + 22px", width: SLOT_HEIGHT + "px + 10px", x: -SLOT_HEIGHT + "px + -11px", y: -TOTAL_HEIGHT + "px + -22px", right: "11px", top: "11px"});
    this.slotsContainer = new Layout({bottom: "11px", height: "100ph + -11px", padding: "5px"});
    this.slotsContainer.addTo(this);
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i] = new Panel({y: i * SLOT_HEIGHT + "px", height: "100pw", width: "100pw", bgImage: r.ui.panel_in_soft_light, padding: "2px"});
      this.slots[i].addTo(this.slotsContainer);
      this.slots[i].item = new Badge({bgImage: _.randchoiceObj(rb.items).image, scale9: false, height: "80ph", padding: "10ph"});
      this.slots[i].item.addTo(this.slots[i]);
    }
  },
});
