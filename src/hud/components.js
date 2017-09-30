var Panel = ccui.Layout.extend({
  panel: { // Default values
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    margin: 0,
    scale: 1,
    bgImage: r.panel,
    layoutType: ccui.Layout.LINEAR_HORIZONTAL,
  },
  ctor: function(options) {
      this._super();
      this.setup(options);
  },
  setup: function({
      x = this.panel.x,
      y = this.panel.y,
      width = this.panel.width,
      height = this.panel.height,
      margin = this.panel.margin,
      scale = this.panel.scale,
      bgImage = this.panel.bgImage,
      layoutType = this.panel.layoutType,
    } = {}) {

      let vw = cc.winSize.width / 100;
      let vh = cc.winSize.height / 100;

      this.panel.margin = margin;
      this.panel.x = x;
      this.panel.y = y;
      this.panel.height = height;
      this.panel.width = width;
      this.panel.scale = scale;

      margin = margin * vw;
      x = (x * vw);
      y = (y * vh);
      height = (height * vh) / scale;
      width = (width * vw) / scale;
      this.scale = scale;

      this.setBackGroundImage(bgImage);
      this.setBackGroundImageScale9Enabled(true);
      this.setLayoutType(layoutType);
      this.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
      this.setContentSize(width - margin * 2 / scale, height - margin * 2 / scale);
      this.setPositionType(ccui.Widget.POSITION_ABSOLUTE);
      this.setPosition(x + margin, y + margin);
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

  },

  toString: () => "Text"

});
