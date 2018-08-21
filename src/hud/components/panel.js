var Panel = ccui.Layout.extend({
  panel: null, // panel specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component
  ctor: function(options) {
    this.panel = this.panel || {bgImage: r.ui.panel};
    this._super();
    this.setSwallowTouches(options.swallow !== undefined ? options.swallow : true); // TODO This works great if below the dialog is a button, but if there is something using easyEvents it doesn't work as expected
    this.setTouchEnabled(options.swallow !== undefined ? options.swallow : true);
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
