// TODO deberia usar LabelTTF en vez de ccui.Text por el fillColor

// TODO deberia tener una clase abstracta color, que guarde la paleta de colores
// y pueda acceder a las diferentes tonalidades de los colores facilmente

var DisplayManager = cc.Class.extend({
  owner: null, // The real ccui object that has the display manager and will be affected by it
  x: 0, // x position in vw %, accepts negative for starting from right
  y:  0, // y position in vh %, accepts negative for starting from top
  width: 100, // width in vw %
  height: 100, // height in vh %
  padding: 0, // padding in vw %
  scale: 1, // scale of the node, useful when adjusting texture size

  ctor: function(owner, {
    x = this.x,
    y = this.y,
    width = this.width,
    height = this.height,
    padding = this.padding,
    scale = this.scale,
  } = {}) {
    // Expects the owner of the displayManager, and an object with its attributes
    // Setup must be called in the owner class, this is just a configuration call
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.padding = padding;
    this.scale = scale;

    // Overrides the setParent function of the owner, so when owner is added
    // as a child of another node, it automatically executes setup.
    owner.setParent = function(parent) {
      cc.Node.prototype.setParent.call(owner, parent);
      this.setup({});
    };
  },

  setup: function({
    x = this.x,
    y = this.y,
    width = this.width,
    height = this.height,
    padding = this.padding,
    scale = this.scale,
  } = {}) {
    // Call this whenever you want to change your owner's properties
    // If you have more attributes for your specific object, implement a custom
    // setup class in there that expects an 'options' object, use the custom
    // attributes from there, and send it back to this function (see Panel.setup)
    // for reference.

    // Use owner.parent's width and height percentages, or screen dimensions if none
    let vw = (this.owner && this.owner.parent ? this.owner.parent.width : cc.winSize.width) / 100;
    let vh = (this.owner && this.owner.parent ? this.owner.parent.height : cc.winSize.height) / 100;

    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.padding = padding;
    this.scale = scale;

    padding = padding * vw;
    height = (height * vh) / scale - padding * 2 / scale;
    width = (width * vw) / scale - padding * 2 / scale;
    if (x === "center") {
      x = (vw * 100 - this.owner.width) / 2;
    } else {
      x = (x >= 0 ? x * vw : 100 * vw + x * vw) + padding;
    }

    if (y === "center") {
      y = (vh * 100 - this.owner.height) / 2;
    } else {
      y = (y >= 0 ? y * vh : 100 * vh + y * vh) + padding;
    }

    this.owner.scale = scale;
    this.owner.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
    this.owner.setContentSize(width, height);
    this.owner.setPositionType(ccui.Widget.POSITION_ABSOLUTE);
    this.owner.setPosition(x, y);

  },
  toString: () => "DisplayManager"
});

var Panel = ccui.Layout.extend({
  panel: { // Default values
    bgImage: r.panel,
  },
  displayManager: null, // Manages the size and location of this component
  ctor: function(options) {
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


var Text = ccui.Text.extend({
  text: { // Default values
    text: "",
    fontName: "Baloo",
    fontSize: 32,
    hAlign: cc.TEXT_ALIGNMENT_CENTER,
    vAlign: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
    color: cc.color(255, 255, 255),
    shadow: null, // list with color, offset, blurradius
  },
  displayManager: null, // Manages the size and location of this component
  ctor: function(options) {
    this._super();
    this.setAnchorPoint(0, 0);
    this.displayManager = new DisplayManager(this, options);
    this.setup(options);
  },
  setup: function(options) {
    this.text.text = options.text || this.text.text;
    this.text.fontName = options.fontName || this.text.fontName;
    this.text.fontSize = options.fontSize || this.text.fontSize;
    this.text.hAlign = options.hAlign || this.text.hAlign;
    this.text.vAlign = options.vAlign || this.text.vAlign;
    this.text.color = options.color || this.text.color;
    this.text.shadow = options.shadow || this.text.shadow;

    this.setString(this.text.text);
    this.setFontName(this.text.fontName);
    this.setFontSize(this.text.fontSize);
    this.setTextHorizontalAlignment(this.text.hAlign);
    this.setTextVerticalAlignment(this.text.vAlign);
    this.setTextColor(this.text.color);
    if (this.text.shadow) this.enableShadow(...this.text.shadow);

    this.displayManager.setup(options);

    // if (this.parent) { // XXX Delete
    //   let d = new Debugger();
    //   d.debugRect(this.parent, {stop:true});
    //   window.dtext = d.debugRect(this.parent, {rect: this,lineColor:cc.color(0,255,0)});
    // }
  },
  toString: () => "Text"
});
