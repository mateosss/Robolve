// TODO less and more button

var Progress = Panel.extend({
  progress: null, // dialog specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component

  bar: null,
  text: null,

  selectedValue: 0, // If using predefinedValues this will have the index of the current one

  ctor: function(options) {
    this.progress = this.progress || {
      text: options.text || "{}%", // text to apply _.format(text, percent)
      percentage: options.percentage || 0,
      fontName: options.fontName || r.getDefaultFont(),
      fontSize: options.text || 32,
      predefinedValues: options.predefinedValues || null // array with predefined values to set with setValue
    };
    options.bgImage = options.bgImage || r.ui.panel_in_soft;
    this._super(options);

    this.bar = new Panel({padding: "6px", top: "2px", width: cc.lerp(4, 100, this.progress.percentage / 100) + "pw", bgImage: r.ui.pink, scale: 0.6});
    this.bar.addTo(this);

    this.text = new Text({text: _.format(this.progress.text, this.progress.percentage), x: "center", y: "center", bottom: "2px", top: cc.sys.isNative ? "0px" : "5px", fontSize: this.progress.fontSize, fontName: this.progress.fontName});
    this.text.addTo(this);
  },
  setup: function(options) {
    this.progress.percentage = options.percentage !== undefined ? options.percentage : this.progress.percentage;
    this.progress.text = options.text !== undefined ? options.text : this.progress.text;
    this.progress.predefinedValues = options.predefinedValues || this.progress.predefinedValues;
    if (this.bar) this.bar.setup({width: cc.lerp(4, 100, this.progress.percentage / 100) + "pw"});
    if (this.text && !this.progress.predefinedValues) this.text.setup({text: _.format(this.progress.text, this.progress.percentage)});
    this._super(options);
  },
  setPercent: function(value) {
    this.progress.percentage = value;
    this.setup({});
  },
  setValue: function(i) {
    this.selectedValue = i;
    let values = this.progress.predefinedValues;
    this.setPercent((i + 1) * 100 / values.length);
    this.text.setup({text: _.format(this.progress.text, values[i])});
  },
  nextValue: function() {
    if (this.selectedValue + 1 < this.progress.predefinedValues.length) this.setValue(this.selectedValue + 1);
  },
  previousValue: function() {
    if (this.selectedValue - 1 >= 0) this.setValue(this.selectedValue - 1);
  },
  toString: () => "Dialog"
});
