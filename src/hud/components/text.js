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
      lineHeight: null, // line height in pixels
      width: "0px", // text bounding width in pixels, 0px for no limits
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
    this.text.hAlign = options.hAlign !== undefined ? options.hAlign : this.text.hAlign;
    this.text.vAlign = options.vAlign !== undefined ? options.vAlign : this.text.vAlign;
    this.text.color = options.color || this.text.color;
    this.text.shadow = options.shadow || this.text.shadow;
    this.text.lineHeight = options.lineHeight || this.text.lineHeight;
    this.text.width = options.width || this.text.width;

    this.setString(this.text.text);
    this.setFontName(r.fonts[this.text.fontName].name);
    this.setFontSize(this.text.fontSize);
    this.setTextHorizontalAlignment(this.text.hAlign);
    this.setTextVerticalAlignment(this.text.vAlign);
    this.setTextColor(this.text.color);
    if (this.text.shadow) this.enableShadow(...this.text.shadow);
    if (this.text.lineHeight) this.getVirtualRenderer().setLineHeight(this.text.lineHeight);
    let width = this.displayManager.calc(this.text.width);
    if (width) this.boundingWidth = width;
    this.displayManager.setup(options);
  },
  toString: () => "Text"
});
