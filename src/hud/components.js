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

      x = x >= 0 ? x * vw : 100 * vw + x * vw;
      y = y >= 0 ? y * vh : 100 * vh + y * vh;
      height = (height * vh) / scale;
      width = (width * vw) / scale;
      padding = padding * vw;

      this.owner.scale = scale;
      this.owner.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
      this.owner.setContentSize(width - padding * 2 / scale, height - padding * 2 / scale);
      this.owner.setPositionType(ccui.Widget.POSITION_ABSOLUTE);
      this.owner.setPosition(x + padding, y + padding);
    },
    toString: () => "DisplayManager"
});

var Panel = ccui.Layout.extend({
  panel: { // Default values
    bgImage: r.panel,
    layoutType: ccui.Layout.LINEAR_HORIZONTAL,
  },
  ctor: function(options) {
      this._super();
      this.displayManager = new DisplayManager(this, options);
      this.setup(options);
  },
  setup: function(options) {
      let bgImage = options.bgImage || this.panel.bgImage;
      let layoutType = options.layoutType || this.panel.layoutType;
      this.displayManager.setup(options);
      this.setBackGroundImage(bgImage);
      this.setBackGroundImageScale9Enabled(true);
      this.setLayoutType(layoutType);
    },
  toString: () => "Panel"
});

var Text = ccui.Text.extend({
  ctor: function({text = "", fontName = "Baloo", fontSize = 32,
    hAlign = cc.TEXT_ALIGNMENT_CENTER, vAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
    sizeType = ccui.Widget.SIZE_PERCENT, size = cc.p(1, 1),
    positionType = ccui.Widget.POSITION_PERCENT, position = cc.p(0.5, 0.5)
  } = {}) {

    this._super(text, fontName, fontSize);
    this.setTextHorizontalAlignment(hAlign);
    this.setTextVerticalAlignment(vAlign);

    this.setSizeType(sizeType);
    if (sizeType === ccui.Widget.SIZE_PERCENT) {
      this.setSizePercent(size);
    } else if (sizeType === ccui.Widget.SIZE_ABSOLUTE) {
      this.setContentSize(size);
    }

    this.setPositionType(positionType);
    if (positionType === ccui.Widget.POSITION_PERCENT) {
      if (cc.sys.isNative) {
        /* TODO Hay un bug extraño, no es culpa mía creo, pero basicamente no funciona
        el setPositionPercent apenás se usa, la propiedad xPercent se resetea a 0
        siempre, pero si lo hago desde la consola del navegador funciona bien */
        /* Para solventarlo por ahora chequeo si estoy nativo y si es así procedo
        normalmente, si no, si estoy en browser, pongo un timeout para que se
        ejecute esa línea después de que todo esté bien */
        this.setPositionPercent(position);
      } else {
        // TODO ver como solucionar esto o ver de mandar hacer un issue o hacer el commit yo
        window.setTimeout(() => this.setPositionPercent(position), 1000);
      }
    } else if (positionType === ccui.Widget.POSITION_ABSOLUTE) {
      this.setPosition(position);
    }

    this.enableShadow(cc.color(176,190,197), cc.size(0, -6), 0);

  },

  toString: () => "Text"

});
