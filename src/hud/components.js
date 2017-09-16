var Text = ccui.Text.extend({
  ctor: function(text = "", fontName = "Baloo", fontSize = 32,
    hAlign = cc.TEXT_ALIGNMENT_CENTER, vAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
    sizeType = ccui.Widget.SIZE_PERCENT, size = cc.p(1, 1),
    positionType = ccui.Widget.POSITION_PERCENT, position = cc.p(0.5, 0.5)) {

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
