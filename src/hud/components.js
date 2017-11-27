// TODO deberia tener una clase abstracta color, que guarde la paleta de colores
// y pueda acceder a las diferentes tonalidades de los colores facilmente

// TODO hacer que todas las propiedades sean strings y darse cuenta con regex o parecido
// si son %, px, rem, vw, vh, o lo que sea tipo css.

// TODO display manager is being executed twice (first time and after being added as a child)
// should look for a way to prevent that duplication, sometimes like with InfoGold, that
// inherits from Text, it is being executed three times

var DisplayManager = cc.Class.extend({
  owner: null, // The real ccui object that has the display manager and will be affected by it
  x: "0px", // x position, accepts negative for starting from right
  y: "0px", // y position, accepts negative for starting from top
  top: "0px", // top offset
  right: "0px", // right offset
  bottom: "0px", // bottom offset
  left: "0px", // left offset
  width: "100pw", // width
  height: "100ph", // height
  padding: "0px", // padding
  scale: 1, // scale of the node, useful when adjusting texture size

  ctor: function(owner, options) {
    // Expects the owner of the displayManager, and an object with its attributes
    // Setup must be called in the owner class, this is just a configuration call
    this.owner = owner;
    this.x = options.x || this.x;
    this.y = options.y || this.y;
    this.top = options.top || this.top;
    this.right = options.right || this.right;
    this.bottom = options.bottom || this.bottom;
    this.left = options.left || this.left;
    this.height = options.height || this.width;
    this.width = options.width || this.height;
    this.padding = options.padding || this.padding;
    this.scale = options.scale || this.scale;

    // Overrides the setParent function of the owner, so when owner is added
    // as a child of another node, it automatically executes setup.
    owner.setParent = function(parent) {
      cc.Node.prototype.setParent.call(owner, parent);
      this.setup({});
    };
  },

  setup: function(options) {
    // Call this whenever you want to change your owner's properties
    // If you have more attributes for your specific object, implement a custom
    // setup class in there that expects an 'options' object, use the custom
    // attributes from there, and send it back to this function (see Panel.setup)
    // for reference.

    let x = this.x = options.x || this.x;
    let y = this.y = options.y || this.y;
    let top = this.top = options.top || this.top;
    let right = this.right = options.right || this.right;
    let bottom = this.bottom = options.bottom || this.bottom;
    let left = this.left = options.left || this.left;
    let height = this.height = options.height || this.height;
    let width = this.width = options.width || this.width;
    let padding = this.padding = options.padding || this.padding;
    let scale = this.scale = options.scale || this.scale;

    let w = this.getParentWidth();
    let h = this.getParentHeight();

    padding = this.propToPix(padding);
    height = this.propToPix(height) / scale - padding * 2 / scale;
    width = this.propToPix(width) / scale - padding * 2 / scale;

    if (x === "center") {
      x = (w - this.owner.width) / 2; // TODO backup
      // x = (w - width) / 2; // TODO this should be here instead, see y==="center" section
    } else {
      x = this.propToPix(x);
      x = (x >= 0 ? x : w + x) + padding;
    }

    if (y === "center") {
      y = (h - this.owner.height) / 2; // TODO backup

      // y = (h - height) / 2;
      // TODO This should be the real line, but it is a pretty big problem
      // when this line is used the default height value is 100ph, but in Text
      // objects that's not true, because after setting everything here, cocos
      // will replace the height with whatever the fontSize determines.
      // A solution for this could be to make a converter from the current component
      // values before it having a displayManager (I am not even sure if that's the real problem)
      // This should be applied in the case of x==="center" too.
    } else {
      y = this.propToPix(y);
      y = (y >= 0 ? y : h + y) + padding;
    }

    y += this.propToPix(bottom) - this.propToPix(top);
    x += this.propToPix(left) - this.propToPix(right);

    this.owner.scale = scale;
    this.owner.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
    this.owner.setContentSize(width, height);
    this.owner.setPositionType(ccui.Widget.POSITION_ABSOLUTE);
    this.owner.setPosition(x, y);

  },
  getParentWidth: function() {
    // Returns this.owner.parent's width, or screen dimensions if none
    return this.owner && this.owner.parent ? this.owner.parent.width : cc.winSize.width;
  },
  getParentHeight: function() {
    // Returns this.owner.parent's height, or screen dimensions if none
    return this.owner && this.owner.parent ? this.owner.parent.height : cc.winSize.height;
  },
  propToPix: function(prop) {
    // Translate a property into the final pixels that the display manager will use
    // AApx: Real screen pixels,
    // AArem = 16px * AA
    // AAvw = cc.winSize.width * 0.01
    // AAvh = cc.winSize.height * 0.01
    // AAvmin = AA * (vw > vh ? vh : vw)
    // AAvmax = AA * (vw > vh ? vw : vh)
    // AApw = this.owner.parent.width * 0.01
    // AAph = this.owner.parent.height * 0.01
    // AApmin = AA * (pw > ph ? ph : pw)
    // AApmax = AA * (pw > ph ? pw : ph)
    // TODO: AA% = AApw (AAph if property is height, top or bottom)
    // TODO make component property calc(), i.e. calc(100vw - 120px)
    prop = prop.match(/(-?\d+(?:\.?\d+)?)(?: *)?(.*)/);
    let magnitude = parseFloat(prop[1]);
    let unit = prop[2];
    if (isNaN(magnitude)) throw _.format("DisplayManager - {}: {} has an incorrect magnitude", this.owner.toString(), prop[0]);
    switch (unit) {
      case "px": return magnitude;
      case "rem": return magnitude * 16;
      case "vw": return magnitude * cc.winSize.width * 0.01;
      case "vh": return magnitude * cc.winSize.height * 0.01;
      case "vmin": {
        let w = cc.winSize.width;
        let h = cc.winSize.height;
        return magnitude * (w > h ? h : w) * 0.01;
      }
      case "vmax": {
        let w = cc.winSize.width;
        let h = cc.winSize.height;
        return magnitude * (w > h ? h : w) * 0.01;
      }
      case "pw": return magnitude * this.getParentWidth() * 0.01;
      case "ph": return magnitude * this.getParentHeight() * 0.01;
      case "pmin": {
        let w = this.getParentWidth();
        let h = this.getParentHeight();
        return magnitude * (w > h ? h : w) * 0.01;
      }
      case "pmax": {
        let w = this.getParentWidth();
        let h = this.getParentHeight();
        return magnitude * (w > h ? w : h) * 0.01;
      }
      default:
        throw _.format("DisplayManager - {}: {} has an incorrect unit", this.owner.toString(), prop[0]);
    }
  },
  toString: () => "DisplayManager"
});

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

var Text = ccui.Text.extend({
  text: null, // text specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component
  ctor: function(options) {
    this.text = this.text || {
      text: "",
      fontName: "baloo",
      fontSize: 32,
      hAlign: cc.TEXT_ALIGNMENT_CENTER,
      vAlign: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
      color: cc.color(255, 255, 255),
      shadow: null, // list with color, offset, blurradius
    };
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
    this.setFontName(r.fonts[this.text.fontName].name);
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

var Icon = Text.extend({
  icons: {
    'airballoon': '\ue800',
    'arrow-left': '\ue801',
    'arrow-right': '\ue802',
    'castle': '\ue803',
    'chart-donut-variant': '\ue804',
    'cloud': '\ue805',
    'coin': '\ue806',
    'coins': '\ue807',
    'currency-eth': '\ue808',
    'database': '\ue809',
    'diamond': '\ue80a',
    'dna': '\ue80b',
    'fast-forward': '\ue80c',
    'flash': '\ue80d',
    'flask': '\ue80e',
    'google-circles': '\ue80f',
    'hexagon': '\ue810',
    'hexagon-outline': '\ue811',
    'nfc-variant': '\ue812',
    'nuke': '\ue813',
    'pause': '\ue814',
    'plus': '\ue815',
    'rewind': '\ue816',
    'robot': '\ue817',
    'skip-forward': '\ue818',
    'target': '\ue819',
    'terrain': '\ue81a',
    'weather-windy': '\ue81b',
  },
  displayManager: null, // Manages the size and location of this component
  icon: null,
  ctor: function(options) {
    this.text = this.icon = this.icon || {
      icon: "robot",
      text: "\ue817",
      fontName: "icons",
      fontSize: 32,
      hAlign: cc.TEXT_ALIGNMENT_CENTER,
      vAlign: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
      color: cc.color(255, 255, 255),
      shadow: null, // list with color, offset, blurradius
    };
    options.text = this.icons[options.icon || this.icon.icon];
    options.fontName = "icons";
    this._super(options);
  },
  setup: function(options) {
    this.icon.icon = options.icon || this.icon.icon;
    options.text = this.icons[options.icon || this.icon.icon];
    this._super(options);
  },
  toString: () => "Icon",
});
