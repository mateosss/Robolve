var Panel = ccui.Layout.extend({
  panel: null, // panel specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component
  ctor: function(options) {
    this.panel = this.panel || {bgImage: r.panel};
    this._super();
    this.displayManager = new DisplayManager(this, options);
    this.setup(options);
  },
  setup: function(options) {
    this.panel.bgImage = options.bgImage || this.panel.bgImage;
    this.panel.layoutType = options.layoutType || this.panel.layoutType;

    this.setBackGroundImage(this.panel.bgImage);
    this.setBackGroundImageScale9Enabled(true);

    this.displayManager.setup(options);
  },
  toString: () => "Panel"
});
