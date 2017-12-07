var DefenseView = Dialog.extend({
  ctor: function(options) {
    this.dialog = this.dialog || {
      title: options.title || "Defense View",
      text: "",
      type: "confirm", // basic, confirm
      okText: options.okText || "Next",
      cancelText: options.cancelText || "Previous",
      okCallback: options.okCallback || (() => {console.log("Next");}), // use this for the basic type button
      cancelCallback: options.cancelCallback || (() => {console.log("Previous");}),
    };
    this._super(options);

    DefensePreview.addTo(this.mainPanel);
  },
  setup: function(options) {
    this._super(options);
  },
  toString: () => "DefenseView"
});
