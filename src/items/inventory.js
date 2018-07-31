var Inventory = cc.Class.extend({
  items: null, // List of stacks of the form {item: Item, quantity: Number} objects
  capacity: 10, // Max capacity of the inventary // TODO initial capacity hardcoded
  equiped: 0, // Invariant: The first `equiped` items of the inventary are equiped
  equipedCapacity: 3, // Max  amount of items to equip

  ctor: function() {
    this.items = [];
  },
  setCapacity: function(newCapacity) { // Returns a list of removed items if any
    let res = newCapacity < this.items.length ? this.items.splice(newCapacity) : [];
    this.capacity = newCapacity;
    return res;
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
    // TODO Inverse of addItem
  },

  canAdd: function(item, quantity) { // TODO the logic of this function is dependant on the addItem one, be sure to update both simultaneously
    let itemInInventory = _.revFind(this.items, i => i.item.isEqual(item));
    if (itemInInventory) {
      let limit = item.stackLimit;
      let amountOfNewStacks = limit === Infinity ? 0 : Math.ceil((itemInInventory.quantity + quantity) / limit) - 1;
      return this.items.length + amountOfNewStacks <= this.capacity;
    } else {
      let limit = item.stackLimit;
      let amountOfNewStacks = limit === Infinity ? 1 : Math.ceil(quantity / limit);
      return this.items.length + amountOfNewStacks <= this.capacity;
    }
  },

  getItemQuantity: function(item) {
    return this.items.reduce((t, i) => t + (i.item.isEqual(item) ? i.quantity : 0), 0);
  },

  equipedIndex: function(item) {
    return this.getEquipedStacks().findIndex(s => s.item.isEqual(item));
  },

  getFirstNonEquipedStackIndex: function() {
    return this.equiped;
  },

  getEquipedStacks: function() {
    return this.items.slice(0, this.equiped);
  },

  toString: () => "Inventory",
});
