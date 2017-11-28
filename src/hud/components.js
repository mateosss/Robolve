// TODO deberia tener una clase abstracta color, que guarde la paleta de colores
// y pueda acceder a las diferentes tonalidades de los colores facilmente

// TODO hacer que todas las propiedades sean strings y darse cuenta con regex o parecido
// si son %, px, rem, vw, vh, o lo que sea tipo css.

// TODO display manager is being executed twice (first time and after being added as a child)
// should look for a way to prevent that duplication, sometimes like with InfoGold, that
// inherits from Text, it is being executed three times

// The display manager is an object that helps in positioning and sizin components
// WARNING: When you add a component as a child of parent don't use parent.addChild(component)
// use component.addTo(parent) instead
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
  debug: false, // true for showing a square with the rect of the component

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
    this.height = options.height || this.height;
    this.width = options.width || this.width;
    this.padding = options.padding || this.padding;
    this.scale = options.scale || this.scale;

    owner.addTo = function(parent, z, tag) {
      // Use this component.addTo(parent) instead of parent.addChild(component)
      // So the setup function is executed after the addChild.
      cc.Node.prototype.addChild.call(parent, this, z || null, tag || null);
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

    let debugChange = this.debug !== options.debug;
    let debug = this.debug = options.debug !== undefined ? options.debug : this.debug;

    let w = this.getParentWidth();
    let h = this.getParentHeight();

    padding = this.propToPix(padding);
    height = this.propToPix(height) / scale - padding * 2 / scale;
    width = this.propToPix(width) / scale - padding * 2 / scale;

    if (x === "center") {
      // TODO this if is a little weird, it's here because text objects don't respect
      // the width and heights displayManager gives them, cocos2d after the setup
      // overwrites their sizes with the ones given by the fontSize and the string
      // the nodes have, so I just check if the owner is a ccui.Text instace
      // and if so, I just use the real owner previous width instead of the given in options
      // also aplicable in the y === "center" section
      if (this.owner instanceof ccui.Text) x = (w - this.owner.width) / 2;
      else x = (w - width) / 2;
    } else {
      x = this.propToPix(x);
      x = (x > 0 || Object.is(x, +0) ? x : w + x) + padding;
    }

    if (y === "center") {
      // See x==="center" section for explanation of this if statement
      if (this.owner instanceof ccui.Text)y = (h - this.owner.height) / 2;
      else y = (h - height) / 2;
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

    if (this.owner.parent && debugChange) {
      let d = new Debugger();
      d.debugRect(this.owner, {stop:true});
      d.debugRect(this.owner, {stop:true}); // This double line is needed
      if (this.debug){
        d.debugRect(this.owner, {lineColor:cc.color(0,255,0), fillColor: cc.color(0, 0, 0, 0), lineWidth: 2});
        if (!(this.owner instanceof ccui.Text)) d.debugRect(this.owner, {fillColor: cc.color(0, 0, 0, 0), lineWidth: 2, rect: cc.rect(-padding, -padding, width + padding * 2 / scale, height + padding * 2 / scale), lineColor:cc.color(255,0,0)});
      }
    }

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

var Dialog = Panel.extend({
  ctor: function(options) {
    this._super(options);
  },
  toString: () => "Dialog"
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
    this.text.text = options.text !== undefined ? options.text : this.text.text;
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
  },
  toString: () => "Text"
});

var Button = ccui.Button.extend({
  button: null, // button specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component
  text: null, // the button title
  icon: null, // the button icon
  ctor: function(options) {
    this.button = this.button || {
      button: "green",
      callback: () => console.log("Button pressed."),
      text: "",
      textFontName: "baloo",
      textFontSize: 56,
      textColor: cc.color(255, 255, 255),
      icon: "",
      iconFontSize: 72,
      iconAlign: "left", // left, right, only works if there is text // TODO right option
      iconColor: cc.color(255, 255, 255),
    };
    this._super();
    this.setAnchorPoint(0, 0);
    this.setScale9Enabled(true);
    this.displayManager = new DisplayManager(this, options);
    this.setup(options);

    this.addTouchEventListener(function(button, event) {
      if (event === ccui.Widget.TOUCH_BEGAN) {
        if (button.icon) button.icon.setup({bottom: "0ph"});
        if (button.text) button.text.y -= 7.375; //TODO the 7.375 is very hardcoded, it refers to the button sprite fake 3d height
        return true;
      }
      else if (event === ccui.Widget.TOUCH_ENDED || event === ccui.Widget.TOUCH_CANCELED) { // TODO when pressing and moving the touch outside the button, the icon stay down but the button gets high again
        if (button.icon) button.icon.setup({bottom: "7.375px"});
        if (button.text) button.text.y += 7.375;
        return true;
      }
      return false;
    }, this);
  },
  setup: function(options) {
    this.button.button = options.button || this.button.button;
    let callbackChange = this.button.callback !== options.callback;
    this.button.callback = options.callback || this.button.callback;
    this.button.text = options.text !== undefined ? options.text : this.button.text;
    this.button.textFontName = options.textFontName || this.button.textFontName;
    this.button.textFontSize = options.textFontSize || this.button.textFontSize;
    this.button.textColor = options.textColor || this.button.textColor;
    this.button.icon = options.icon !== undefined ? options.icon : this.button.icon;
    this.button.iconFontSize = options.iconFontSize || this.button.iconFontSize;
    let iconAlignChange = this.button.iconAlign !== options.iconAlign;
    this.button.iconAlign = options.iconAlign || this.button.iconAlign;
    this.button.iconColor = options.iconColor || this.button.iconColor;

    this.loadTextures(r.u[this.button.button], r.u[this.button.button + "P"], r.u[this.button.button + "P"], ccui.Widget.LOCAL_TEXTURE);
    if (callbackChange) this.addClickEventListener(this.button.callback, this);

    this.displayManager.setup(options);

    if (this.button.text) {
      this.setTitleText(this.button.text);
      this.setTitleFontName(this.button.textFontName);
      this.setTitleFontSize(this.button.textFontSize);
      this.setTitleColor(this.button.textColor);

      if (!this.text) this.text = this.getTitleRenderer();
    }


    if (this.button.icon) {
      if (!this.icon) {
        this.icon = new Icon({ icon: this.button.icon, y: "center", x: "center", bottom: "7.375px", fontSize: this.button.iconFontSize, color: this.button.iconColor });
        this.icon.addTo(this);
      } else {
        this.icon.setup({ icon: this.button.icon, fontSize: this.button.iconFontSize, color: this.button.iconColor });
      }
      if (iconAlignChange && this.button.text) {
        if (this.button.iconAlign === "left") {
          let spacing = (this.height - this.icon.height) / 2;
          this.icon.setup({x: "0px", left: spacing + "px"});
          this.text.setAnchorPoint(0, 0.5);
          this.text.x = this.icon.width + spacing * 2;
        } else if (this.button.iconAlign === "right") {
          // TODO make this if needed
        } else {
          throw _.format("{} is a wrong iconAlign option", this.button.iconAlign);
        }
      }
    }
  },
  toString: () => "Button"
});

var Icon = Text.extend({
  icons: {
    '': '',
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
    'check': '\ue81c',
    'close': '\ue81d',
    'fire': '\ue81e',
    'water': '\ue81f',
    'chevron-down': '\ue820',
    'chevron-up': '\ue821',
  },
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
    options.text = this.icons[this.icon.icon];
    options.fontName = "icons";
    this._super(options);
  },
  setup: function(options) {
    this.icon.icon = options.icon !== undefined ? options.icon : this.icon.icon;
    options.text = this.icons[this.icon.icon];
    if (options.text === undefined) throw(_.format("{} is not a valid icon name", this.icon.icon));
    this._super(options);
  },
  toString: () => "Icon",
});
