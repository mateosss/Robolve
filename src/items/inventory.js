var Inventory = cc.Class.extend({
  items: null, // List of {item: Item, quantity: Number} objects
  capacity: 24, // Max capacity of the inventary

  ctor: function() {
    this.items = [];
  },
  addItem: function(item, quantity) {
    let itemInInventory = this.items.find(i => i.item.isEqual(item));
    if (itemInInventory) itemInInventory.quantity += quantity;
    else {
      if (this.items.length < this.capacity) {
        this.items.push({item: item, quantity: quantity});
      } else {
        // TODO Inform the player that there is not enough room
        console.log("Your inventory is full");
      }
    }
  },
  toString: () => "Inventory",
});
