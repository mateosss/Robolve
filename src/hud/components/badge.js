// The same as a button, but without touch event, and with customizable bgImage

var Badge = Button.extend({
  badge: null, // badge specififc properties, check ctor
  ctor: function(options) {
    this.badge = this.badge || {
      bgImage: r.ui.panel,
    };
    this._super(options);
    this.setTouchEnabled(false);
  },
  setup: function(options) {
    this._super(options);
    this.badge.bgImage = options.bgImage || this.badge.bgImage;
    this.loadTextureNormal(this.badge.bgImage);
  },
  toString: () => "Badge"
});
