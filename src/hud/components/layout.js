var Layout = ccui.Layout.extend({
  displayManager: null, // Manages the size and location of this component
  ctor: function(options) {
    this._super();
    this.displayManager = new DisplayManager(this, options);
    this.setup(options);
  },
  setup: function(options) {
    this.displayManager.setup(options);
  },
  toString: () => "Layout"
});
