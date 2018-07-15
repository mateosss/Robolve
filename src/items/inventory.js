var Inventory = cc.Class.extend({
  items: null, // List of stacks of the form {item: Item, quantity: Number} objects
  capacity: 24, // Max capacity of the inventary

  ctor: function() {
    this.items = [];
  },
  addItem: function(item, quantity) { // returns wether it was added or not
    let itemInInventory = _.revFind(this.items, i => i.item.isEqual(item));
    if (itemInInventory) {
      let limit = item.stackLimit;
      let amountOfNewStacks = Math.ceil((itemInInventory.quantity + quantity) / limit) - 1;
      if (this.items.length + amountOfNewStacks <= this.capacity) { // It can be stored
        if (itemInInventory.quantity + quantity < limit) { // No need to create another stack
          itemInInventory.quantity += quantity;
        } else { // Should create another stack, using quantity as remainder items to fill in
          // fill current stack first
          quantity -= limit - itemInInventory.quantity;
          itemInInventory.quantity = limit;
          // fill the rest
          while (quantity > 0) {
            let add = quantity > limit ? limit : quantity;
            this.items.push({item: item, quantity: add});
            quantity -= add;
          }
        }
        return true;
      } else return false;
    } else {
      let limit = item.stackLimit;
      let amountOfNewStacks = Math.ceil((quantity) / limit);
      if (this.items.length + amountOfNewStacks <= this.capacity) {
        // fill the stacks
        while (quantity > 0) {
          let add = quantity > limit ? limit : quantity;
          this.items.push({item: item, quantity: add});
          quantity -= add;
        }
        return true;
      } else return false;
    }
  },
  removeItem: function(item, quantity) {
    this.addItem(item, -quantity); // TODO should remove the item when quantity === 0
  },

  canAdd: function(item, quantity) { // TODO the logic of this function is dependant on the addItem one, be sure to update both simultaneously
    let itemInInventory = _.revFind(this.items, i => i.item.isEqual(item));
    if (itemInInventory) {
      let limit = item.stackLimit;
      let amountOfNewStacks = Math.ceil((itemInInventory.quantity + quantity) / limit) - 1;
      return this.items.length + amountOfNewStacks <= this.capacity;
    } else {
      let limit = item.stackLimit;
      let amountOfNewStacks = Math.ceil((quantity) / limit);
      return this.items.length + amountOfNewStacks <= this.capacity;
    }
  },

  getItemQuantity: function(item) {
    return this.items.reduce((t, i) => t + (i.item.isEqual(item) ? i.quantity : 0), 0);
  },

  toString: () => "Inventory",
});
