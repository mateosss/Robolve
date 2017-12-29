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
  paddingTop: "0px", //padding top
  paddingRight: "0px", //padding right
  paddingBottom: "0px", //padding bottom
  paddingLeft: "0px", //padding left
  paddingVertical: "0px", //padding vertical
  paddingHorizontal: "0px", //padding horizontal
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
    this.paddingTop = options.paddingTop || this.paddingTop;
    this.paddingRight = options.paddingRight || this.paddingRight;
    this.paddingBottom = options.paddingBottom || this.paddingBottom;
    this.paddingLeft = options.paddingLeft || this.paddingLeft;
    this.paddingVertical = options.paddingVertical || this.paddingVertical;
    this.paddingHorizontal = options.paddingHorizontal || this.paddingHorizontal;
    this.scale = options.scale || this.scale;

    owner.addTo = function(parent, z, tag) {
      // Use this component.addTo(parent) instead of parent.addChild(component)
      // So the setup function is executed after the addChild. Isn't necessary
      // If you are not using parent-dependant properties like ph or pw
      cc.Node.prototype.addChild.call(parent, this, z || null, tag || null);
      this.setup({});
    };

    owner.debug = function() {
      // Debug owner rects and padding
      this.setup({debug: !this.displayManager.debug});
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
    let paddingTop = this.paddingTop = options.paddingTop || this.paddingTop;
    let paddingRight = this.paddingRight = options.paddingRight || this.paddingRight;
    let paddingBottom = this.paddingBottom = options.paddingBottom || this.paddingBottom;
    let paddingLeft = this.paddingLeft = options.paddingLeft || this.paddingLeft;
    let paddingVertical = this.paddingVertical = options.paddingVertical || this.paddingVertical;
    let paddingHorizontal = this.paddingHorizontal = options.paddingHorizontal || this.paddingHorizontal;
    let scale = this.scale = options.scale || this.scale;

    let debugChange = this.debug !== options.debug;
    let debug = this.debug = options.debug !== undefined ? options.debug : this.debug;

    let w = this.getParentWidth();
    let h = this.getParentHeight();

    padding = this.calc(padding);
    paddingTop = this.calc(paddingTop);
    paddingRight = this.calc(paddingRight);
    paddingBottom = this.calc(paddingBottom);
    paddingLeft = this.calc(paddingLeft);
    paddingVertical = this.calc(paddingVertical);
    paddingHorizontal = this.calc(paddingHorizontal);

    height = this.calc(height) / scale - (padding * 2 + paddingVertical * 2 + paddingTop + paddingBottom) / scale;
    width = this.calc(width) / scale - (padding * 2 + paddingHorizontal * 2 + paddingRight + paddingLeft) / scale;
    if (x === "center") {
      // TODO this if is a little weird, it's here because text objects don't respect
      // the width and heights displayManager gives them, cocos2d after the setup
      // overwrites their sizes with the ones given by the fontSize and the string
      // the nodes have, so I just check if the owner is a ccui.Text instace
      // and if so, I just use the real owner previous width instead of the given in options
      // also aplicable in the y === "center" section
      if (this.owner instanceof ccui.Text) x = (w - this.owner.width) / 2;
      else x = (w  - width * scale) / 2;
    } else {
      x = this.calc(x);
      x = (x > 0 || Object.is(x, +0) ? x : w + x) + padding + paddingLeft + paddingHorizontal;
    }

    if (y === "center") {
      // See x==="center" section for explanation of this if statement
      if (this.owner instanceof ccui.Text) y = (h - this.owner.height) / 2;
      else y = (h - height * scale) / 2;
    } else {
      y = this.calc(y);
      y = (y > 0 || Object.is(y, +0) ? y : h + y) + padding + paddingBottom + paddingVertical;
    }

    y += this.calc(bottom) - this.calc(top);
    x += this.calc(left) - this.calc(right);

    this.owner.scale = scale;
    this.owner.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
    this.owner.setContentSize(width, height);
    this.owner.setPositionType(ccui.Widget.POSITION_ABSOLUTE);
    this.owner.setPosition(x, y);

    if (this.owner.parent && (debugChange || this.debug)) {
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
  calc: function(expression) {
    let props = expression.split("+").map(p => p.trim());
    let totalPixels = -0; // Yep, that -0 is on purpose
    props.forEach(p => {totalPixels += this.propToPix(p);});
    return totalPixels;
  },
  toString: () => "DisplayManager"
});
