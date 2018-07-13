var Inventory = cc.Class.extend({
  items: null, // List of pairs (item. quantity)

  ctor: function() {
    this._super();
    this.items = [];
  },

  toString: () => "Inventory",
});
