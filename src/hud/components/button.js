var Button = ccui.Button.extend({
  button: null, // button specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component
  text: null, // the button title
  icon: null, // the button icon
  ctor: function(options) {
    this.button = this.button || {
      button: "green", // color, colorRound
      callback: () => cc.log("Button pressed."),
      text: "",
      textFontName: "baloo",
      textFontSize: 56,
      textColor: cc.color(255, 255, 255),
      icon: "",
      iconFontSize: 64,
      iconAlign: "left", // left, right, only works if there is text // TODO right option
      iconColor: cc.color(255, 255, 255),
      scale9: true,
    };
    this._super();
    this.setAnchorPoint(0, 0);
    this.displayManager = new DisplayManager(this, options);
    this.setup(options);

    this.addTouchEventListener(function(button, event) {
      if (this.isHighlighted()) {
        if (button.icon) button.icon.setup({bottom: "0ph"});
        if (button.text) button.text.y -= 7.375; //TODO the 7.375 is very hardcoded, it refers to the button sprite fake 3d height
        return true;
      }
      else {
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
    this.button.scale9 = options.scale9 !== undefined ? options.scale9 : this.button.scale9;

    this.setScale9Enabled(this.button.scale9);
    if (!this.button.scale9) options.scale = this.displayManager.calc(options.height || this.displayManager.height ) / new cc.Sprite(r.ui[this.button.button]).width;
    this.loadTextures(r.ui[this.button.button], r.ui[this.button.button + "P"], r.ui[this.button.button + "P"], ccui.Widget.LOCAL_TEXTURE);
    if (callbackChange) this.addClickEventListener(this.button.callback);

    this.displayManager.setup(options);

    if (this.button.text) {
      this.setTitleText(this.button.text);
      this.setTitleFontName(r.fonts[this.button.textFontName].name);
      this.setTitleFontSize(this.button.textFontSize);
      this.setTitleColor(this.button.textColor);

      if (!this.text) this.text = this.getTitleRenderer();
      this.text.y += 5; // TODO Doesn't correct the text in the levelCenter button of DefenseView
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
