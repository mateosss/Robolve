// TODO less and more button

var Progress = Panel.extend({
  progress: null, // dialog specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component

  bar: null,
  text: null,
  previous: null,
  next: null,

  ctor: function(options) {
    this.progress = this.progress || {
      text: options.text || "{}%", // text to apply _.format(text, percent)
      percentage: options.percentage || 0,
      fontName: options.fontName || r.getDefaultFont(),
      fontSize: options.fontSize || 32,
      predefinedValues: options.predefinedValues || null, // array with predefined values to set with setValue
      selectedValue: options.selectedValue || 0, // If using predefinedValues this will have the index of the current one
      buttons: options.buttons || false, // If using change buttons
    };
    options.bgImage = options.bgImage || r.ui.panel_in_soft;
    this._super(options);

    this.bar = new Panel({padding: "6px", top: "2px", width: cc.lerp(4, 100, this.progress.percentage / 100) + "pw", bgImage: r.ui.pink, scale: 0.6});
    this.bar.addTo(this);

    this.text = new Text({text: _.format(this.progress.text, [this.progress.percentage], true), x: "center", y: "center", bottom: "2px", top: cc.sys.isNative ? "0px" : "5px", fontSize: this.progress.fontSize, fontName: this.progress.fontName});
    this.text.addTo(this);

    if (this.progress.buttons) {
      this.previous = new Button({callback: () => this.previousValue(), button: "pinkRound", icon: "arrow-left", right: "65ph", width: "133ph", height:"133ph", y:"center", scale9: false, scale: 1.33});
      this.previous.addTo(this);
      this.next = new Button({callback: () => this.nextValue(), button: "pinkRound", icon: "arrow-right", x: "-65ph", width: "133ph", height: "133ph", y: "center", scale9: false, scale: 1.33});
      this.next.addTo(this);
    }
  },
  setup: function(options) {
    this.progress.percentage = options.percentage !== undefined ? options.percentage : this.progress.percentage;
    this.progress.text = options.text !== undefined ? options.text : this.progress.text;
    this.progress.predefinedValues = options.predefinedValues || this.progress.predefinedValues;
    this.progress.selectedValue = options.selectedValue !== undefined ? options.selectedValue : this.progress.selectedValue;
    if (this.progress.predefinedValues) {
      if (this.bar) this.bar.setup({width: cc.lerp(4, 100, ((this.progress.selectedValue + 1)/ this.progress.predefinedValues.length)) + "pw"});
      if (this.text) this.text.setup({text: _.format(this.progress.text, [this.progress.predefinedValues[this.progress.selectedValue]], true)});
    } else {
      if (this.bar) this.bar.setup({width: cc.lerp(4, 100, this.progress.percentage / 100) + "pw"});
      if (this.text) this.text.setup({text: _.format(this.progress.text, [this.progress.percentage], true)});
    }
    this._super(options);
  },
  setPercent: function(value) {
    this.progress.percentage = value;
    this.setup({});
  },
  setValue: function(i) {
    this.progress.selectedValue = i;
    this.setup({});
  },
  getSelectedValue: function() {
    return this.progress.predefinedValues[this.progress.selectedValue];
  },
  getSelectedIndex: function() {
    return this.proress.selectedValue;
  },
  changePercent: function(value, time) { // Animated version of setPercent
    this.from = this.progress.percentage;
    this.to = value;
    this.t = time || 0.2;
    this.scheduleUpdate();
  },
  changeValue: function(i, time) { // Animated version of setValue
    this.progress.selectedValue = i;
    this.from = this.progress.percentage;
    this.to = (i + 1) * 100 / this.progress.predefinedValues.length;
    this.t = time || 0.2;
    this.scheduleUpdate();
  },
  nextValue: function() {
    if (this.progress.selectedValue + 1 < this.progress.predefinedValues.length) this.changeValue(this.progress.selectedValue + 1);
    else this.cantChange();
  },
  previousValue: function() {
    if (this.progress.selectedValue - 1 >= 0) this.changeValue(this.progress.selectedValue - 1);
    else this.cantChange();
  },
  cantChange: function() {
    let shake = cc.Sequence.create(
      new cc.MoveBy(0.1, cc.p(10, 0)),
      new cc.MoveBy(0.1, cc.p(-20, 0)),
      new cc.MoveBy(0.1, cc.p(20, 0)),
      new cc.MoveBy(0.1, cc.p(-10, 0))
    );
    this.text.runAction(shake);
  },
  cantChange2: function() { // TODO select the best shake parameters
    let shake = cc.Sequence.create(
      new cc.MoveBy(0.1, cc.p(this.displayManager.propToPix("2.5pw"), 0)),
      new cc.MoveBy(0.1, cc.p(this.displayManager.propToPix("-5pw"), 0)),
      new cc.MoveBy(0.1, cc.p(this.displayManager.propToPix("5pw"), 0)),
      new cc.MoveBy(0.1, cc.p(this.displayManager.propToPix("-2.5pw"), 0))
    );
    this.text.runAction(shake);
  },
  toString: () => "Progress",
  from: 0, // See change-like and update methods
  to: 0,
  t: 0,
  timer: 0,
  update: function(dt) {
    if (this.timer < this.t) {
      let minWidth = cc.lerp(4, 100, this.from / 100) / 100 * this.width * (1 / this.bar.scale);
      let maxWidth = (cc.lerp(4, 100, this.to / 100) / 100 * this.width - this.bar.displayManager.calc(this.bar.displayManager.padding) * 2) * (1 / this.bar.scale);
      this.timer += dt;
      let t = Math.min(1.0, this.timer / this.t);
      let newWidth = (2*t*t*t - 3*t*t + 1) * minWidth + (-2*t*t*t + 3*t*t) * maxWidth; // Cubic hermite spline
      this.bar.width = newWidth;
    } else {
      this.setPercent(this.to);
      this.timer = 0;
      this.unscheduleUpdate();
    }

  }
});
