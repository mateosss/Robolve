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
      percentageStep: options.percentageStep || 5, // If buttons but not predefined values, then previousValue and nextValue functions change percentage by this amount
      fontName: options.fontName || "baloo",
      fontSize: options.fontSize || 32,
      predefinedValues: options.predefinedValues || null, // array with predefined values to set with setValue
      selectedValue: options.selectedValue || 0, // If using predefinedValues this will have the index of the current one
      buttons: options.buttons || false, // If using change buttons
      previousCallback: options.previousCallback || (() => this.previousValue()), // previous button callback if buttons is enabled
      nextCallback: options.nextCallback || (() => this.nextValue()), // next button callback if buttons is enabled
      color: options.color || "pink"
    };
    options.bgImage = options.bgImage || r.ui.panel_in_soft;
    this._super(options);

    this.bar = new Panel({padding: "6px", top: "1px", width: cc.lerp(4, 100, this.progress.percentage / 100) + "pw", bgImage: r.ui[this.progress.color], scale: 0.6});
    this.bar.addTo(this);

    this.text = new Text({text: _.format(this.progress.text, [this.progress.percentage], true), x: "center", y: "center", bottom: "2px", top: cc.sys.isNative ? "0px" : "5px", fontSize: this.progress.fontSize, fontName: this.progress.fontName});
    this.text.addTo(this);

    if (this.progress.buttons) {
      this.previous = new Button({callback: this.progress.previousCallback, button: this.progress.color + "Round", icon: "arrow-left", right: "65ph", width: "133ph", height:"133ph", y:"center", scale9: false, scale: 1.33});
      this.previous.addTo(this);
      this.next = new Button({callback: this.progress.nextCallback, button: this.progress.color + "Round", icon: "arrow-right", x: "-65ph", width: "133ph", height: "133ph", y: "center", scale9: false, scale: 1.33});
      this.next.addTo(this);
    }
  },
  setup: function(options) {
    this._super(options);

    this.progress.percentage = options.percentage !== undefined ? options.percentage : this.progress.percentage;
    this.progress.percentageStep = options.percentageStep || this.progress.percentageStep;
    this.progress.text = options.text !== undefined ? options.text : this.progress.text;
    this.progress.predefinedValues = options.predefinedValues || this.progress.predefinedValues;
    this.progress.selectedValue = options.selectedValue !== undefined ? options.selectedValue : this.progress.selectedValue;
    this.progress.previousCallback = options.previousCallback || this.progress.previousCallback;
    this.progress.nextCallback = options.nextCallback || this.progress.nextCallback;
    let colorChange = this.progress.color !== options.color && options.color;
    this.progress.color = options.color || this.progress.color;

    if (this.progress.predefinedValues) {
      if (this.bar) this.bar.setup({width: cc.lerp(4, 100, ((this.progress.selectedValue + 1)/ this.progress.predefinedValues.length)) + "pw"});
      if (this.text) this.text.setup({text: _.format(this.progress.text, [this.progress.predefinedValues[this.progress.selectedValue]], true)});
    } else {
      if (this.bar) this.bar.setup({width: cc.lerp(4, 100, this.progress.percentage / 100) + "pw"});
      if (this.text) this.text.setup({text: _.format(this.progress.text, [this.progress.percentage], true)});
    }

    if (this.progress.buttons) { // Refreshing buttons
      if (this.previous) this.previous.setup({callback: this.progress.previousCallback});
      if (this.next) this.next.setup({callback: this.progress.nextCallback});
    }

    if (colorChange) {
      this.bar.setup({bgImage: r.ui[this.progress.color]});
      if (this.progress.buttons) {
        this.previous.setup({button: this.progress.color + "Round"});
        this.next.setup({button: this.progress.color + "Round"});
      }
    }
  },
  setPercent: function(value) {
    this.progress.percentage = value;
    this.setup({});
  },
  getPercent: function() {
    return this.progress.percentage;
  },
  setValue: function(i) { // Used when predefinedValues is on
    _.assert(i in this.progress.predefinedValues, _.format("index {} is not in [{}]", i, this.progress.predefinedValues.toString()));
    this.progress.selectedValue = i;
    this.setup({});
  },
  getSelectedValue: function() {
    return this.progress.predefinedValues[this.progress.selectedValue];
  },
  getSelectedIndex: function() {
    return this.progress.selectedValue;
  },
  changePercent: function(value, time) { // Animated version of setPercent
    if (!this.isUpdating) this.from = cc.lerp(4, 100, (this.progress.percentage) / 100) / 100 * this.width * (1 / this.bar.scale);
    this.to = (cc.lerp(4, 100, (value) / 100) / 100 * this.width - this.bar.displayManager.calc(this.bar.displayManager.padding) * 2) * (1 / this.bar.scale);
    this.time = (this.isUpdating ? this.time : 0) +  (time || 0.2);
    this.progress.percentage = value;
    this.scheduleUpdate();
    return value;
  },
  changeValue: function(i, time) { // Animated version of setValue
    if (!this.isUpdating) this.from = cc.lerp(4, 100, ((this.progress.selectedValue + 1) * 100 / this.progress.predefinedValues.length) / 100) / 100 * this.width * (1 / this.bar.scale);
    this.to = (cc.lerp(4, 100, ((i + 1) * 100 / this.progress.predefinedValues.length) / 100) / 100 * this.width - this.bar.displayManager.calc(this.bar.displayManager.padding) * 2) * (1 / this.bar.scale);
    this.time = (this.isUpdating ? this.time : 0) +  (time || 0.2);
    this.progress.selectedValue = i;
    this.scheduleUpdate();
    return i;
  },
  nextValue: function() {
    if (this.progress.predefinedValues) {
      if (this.progress.selectedValue + 1 < this.progress.predefinedValues.length) return this.changeValue(this.progress.selectedValue + 1);
      else return this.cantChange();
    } else {
      if (this.progress.percentage + this.progress.percentageStep <= 100) return this.changePercent(this.progress.percentage + this.progress.percentageStep);
      else return this.cantChange();
    }
  },
  previousValue: function() {
    if (this.progress.predefinedValues) {
      if (this.progress.selectedValue - 1 >= 0) return this.changeValue(this.progress.selectedValue - 1);
      else return this.cantChange();
    } else {
      if (this.progress.percentage - this.progress.percentageStep >= 0) return this.changePercent(this.progress.percentage - this.progress.percentageStep);
      else return this.cantChange();
    }
  },
  postChange: function() { // Override this for executing stuff after all animations and values had been correctly set

  },
  cantChange: function() {
    let shake = cc.Sequence.create(
      new cc.MoveBy(0.1, cc.p(10, 0)),
      new cc.MoveBy(0.1, cc.p(-20, 0)),
      new cc.MoveBy(0.1, cc.p(20, 0)),
      new cc.MoveBy(0.1, cc.p(-10, 0))
    );
    this.text.runAction(shake);
    return false;
  },
  toString: () => "Progress",
  scheduleUpdate: function() {
    this._super();
    this.isUpdating = true;
  },
  unscheduleUpdate: function() {
    this._super();
    this.isUpdating = false;
  },
  isUpdating: false, // Tells wether update is scheduled or not
  from: 0, // See change-like and update methods
  to: 0,
  time: 0,
  elapsed: 0,
  update: function(dt) {
    if (this.elapsed < this.time) {
      this.elapsed += dt;
      let t = Math.min(1.0, this.elapsed / this.time);
      let newWidth = (2*t*t*t - 3*t*t + 1) * this.from + (-2*t*t*t + 3*t*t) * this.to; // Cubic hermite spline
      this.bar.width = newWidth;
    } else {
      this.setup({});
      this.elapsed = 0;
      this.unscheduleUpdate();
      this.postChange();
    }

  }
});
