var Item = cc.Class.extend({
  // Properties of the item
  name: null,
  description: null, // Detailed description of the item
  image: null, // The sprite path
  stackLimit: 1, // Can be Infinity
  consumable: false, // Like a potion or a powerup
  equipable: false, // Like an armor or a weapon
  mods: null, // Object with property names to modify, ex: {"inventory.capacity": 2, "sBuildRange": 50} for adding 2 slots to the inventory and 50 units to build range

  hash: null, // String that describes this item uniquely, use this for comparing items

  ctor: function(item) {
    this.name = item.name || this.name;
    this.description = item.description || this.description;
    this.image = item.image || this.image;
    this.stackLimit = item.stackLimit || this.stackLimit;
    this.consumable = item.consumable || this.consumable;
    this.equipable = item.equipable || this.equipable;
    this.mods = item.mods || {};

    this.hash = this.getHash();
  },

  getHash: function(item) {
    // Function to generate hash, it only uses the properties that are unique to this item
    // If item !== undefined, then it works as a static function for generating the item-hash of any object
    item = item || this;
    return this.name + this.description + this.image + this.stackLimit + this.consumable + this.equipable;
  },

  isEqual: function(item) {
    return item.hash === this.hash;
  },

  consume: function() {
    // TODO: For consumable items
  },

  use: function(who, how) { // to who to apply the mods, and how to apply them, how is a function like how(previousValue, modValue, who)
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
});
