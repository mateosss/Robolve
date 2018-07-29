var Item = cc.Class.extend({
  id: null, // The unique id representing this object
  name: null,
  category: null, // The type of item gold | coin | unique
  description: null, // Detailed description of the item
  image: null, // The sprite path
  stackLimit: 1, // Can be Infinity
  equipable: false, // Like an armor or a weapon
  mods: null, // Object with property names to modify, ex: {"inventory.capacity": 2, "sBuildRange": 50} for adding 2 slots to the inventory and 50 units to build range

  ctor: function(item) {
    this.id = item.id || this.id;
    this.name = item.name || this.name;
    this.category = item.category || this.category;
    this.description = item.description || this.description;
    this.image = item.image || this.image;
    this.stackLimit = item.stackLimit || this.stackLimit;
    this.equipable = item.equipable || this.equipable;
    this.mods = item.mods || this.mods;
  },

  isEqual: function(item) {
    return item.id === this.id;
  },

  use: function(who, how) { // to who to apply the mods, and how to apply them, how is a function like how(previousValue, modValue, who)
    if (!this.mods) console.log(_.format("{} item does not have mods to use", this.mods));
    let modKeys = Object.keys(this.mods);
    let modSplitKeys = modKeys.map(k => k.split("."));
    for (let i = 0; i < modSplitKeys.length; i++) {
      let ps = modSplitKeys[i];
      let propParent = who;
      for (let j = 0; j < ps.length - 1; j++) propParent = propParent[ps[j]];
      propParent[ps[ps.length - 1]] = how(propParent[ps[ps.length - 1]], this.mods[ps.join(".")], who);
    }
  },

  equip: function(who) {
    this.use(who, (prev, mod) => prev + mod);
  },

  unequip: function(who) {
    this.use(who, (prev, mod) => prev - mod);
  },

  toString: () => "Item",

  // Static methods
  getItemsByCategory: (category) => _.objFilter(rb.items, (k, v) => v.category === category),
});
