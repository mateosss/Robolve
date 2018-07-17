// TODO Make a saver that supports versioning, and version migration
// Currently the save and load structure, conversions and properties are very hardcoded

// This static class is responsible for saving all user data

var SaveLoad = {
  version: "alfa",

  save: function(inventory) {
    let version = this.version;
    let items = inventory.items.map(i => {
      let itemFiltered = _.pick(i.item, ["name", "description", "image", "stackLimit", "consumable", "equipable", "mods"]);
      itemFiltered = _.objMap(itemFiltered, (k, v) => [k, v !== Infinity ? v : "Infinity"]); // Convert Infinity value to string
      let quantity = i.quantity !== Infinity ? i.quantity : "Infinity";
      return {item: itemFiltered, quantity: quantity};
    });

    let data = {version: version, items: items};

    cc.sys.localStorage.setItem("save", JSON.stringify(data)); // TODO: Save property name hardcoded
  },

  load: function(inventory) {
    let raw = cc.sys.localStorage.getItem("save");
    let data = raw ? JSON.parse(raw) : {items: []};
    data.items.forEach(i => i.item.stackLimit = Number(i.item.stackLimit)); // "Infinity" to Infinity
    inventory.items = data.items.map(stack => ({item: new Item(stack.item), quantity: Number(stack.quantity)}));
  },

  toString: () => "Saver",
};
