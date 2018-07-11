var Item = cc.Class.extend({
  // Properties of the item
  name: null,
  description: null, // Detailed description of the item
  image: null, // The sprite path
  stackLimit: 1, // Can be Infinity
  consumable: false, // Like a potion or a powerup
  equipable: false, // Like an armor or a weapon

  hash: null, // String that describes this item uniquely, use this for comparing items

  ctor: function(item) {
    this.name = item.name || this.name;
    this.description = item.description || this.description;
    this.image = item.image || this.image;
    this.stackLimit = item.stackLimit || this.stackLimit;
    this.consumable = item.consumable || this.consumable;
    this.equipable = item.equipable || this.equipable;

    this.hash = this.getHash();
  },

  getHash: function() {
    // Function to generate hash, it only uses the properties that are unique to this item
    return this.name + this.description + this.image + this.stackLimit + this.consumable + this.equipable;
  },

  isEqual: function(item) {
    return item.hash == this.hash;
  },

  consume: function() {
    // TODO: For consumable items
  },

  equip: function() {
    // TODO: For equipable items
  },

  unequip: function() {
    // TODO: For equipable items
  },

  toString: () => "Item",
});
