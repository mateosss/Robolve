var Dialog = Panel.extend({
  dialog: null, // dialog specififc properties, check ctor
  displayManager: null, // Manages the size and location of this component
  inScreen: true, // tells wether the dialog is being shown

  titlebar: null, // Dialog internal elements, access to their setup by dialog.component.setup
  title: null,
  close: null,
  mainPanel: null,
  text: null,
  buttonbar: null,
  ok: null,
  cancel: null,

  ctor: function(options) {
    this.dialog = this.dialog || {
      title: options.title || "Dialog Title",
      // Text maximum length is about 200-250 letters, if you want more, implement a scroll view here.
      text: options.text || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      type: options.type || "confirm", // basic, confirm, empty
      okText: options.okText || "Ok",
      cancelText: options.cancelText || "Cancel",
      okCallback: options.okCallback || (() => {this.dismiss();}), // use this for the basic type button
      cancelCallback: options.cancelCallback || (() => {this.dismiss();}),
      empty: options.empty || false,
    };
    options.bgImage = options.bgImage || r.ui.grey;
    this._super(options);

    if (this.dialog.type !== "empty") {

      this.titlebar = new Layout({height: "17.5ph", width: "100pw", y: "-17.5ph"});
      this.titlebar.addTo(this);
      this.title = new Text({text: this.dialog.title, x: "center", y: "center", top: cc.sys.isNative ? "0px" : "5px", fontSize: 42});
      this.title.addTo(this.titlebar);
      this.close = new Button({callback: () => this.dismiss(), width: "100ph", padding: "11px", button: "red", icon: "close", x: "-100ph", scale: 0.5});
      this.close.addTo(this.titlebar);

      this.mainPanel = new Panel({bgImage: r.ui.panel_in_nuts, height: "62.5ph", width: "100pw", padding: "11px", y: "-75.5ph"});
      this.mainPanel.addTo(this);
      this.text = new Text({text: this.dialog.text, x:"center", y:"center", lineHeight: 32, bottom: cc.sys.isNative ? "5px" : "0px"});
      this.text.setTextAreaSize(cc.size(this.mainPanel.width - 72, this.mainPanel.height - 56));
      this.text.addTo(this.mainPanel);

      this.buttonbar = new Layout({height: "20ph", padding: "11px"});
      this.buttonbar.addTo(this);

      if (this.dialog.type === "basic") {
        this.ok = new Button({callback: this.dialog.okCallback, button: "green", text: this.dialog.okText, height:"21.5pw", padding: "11px", textFontSize: 42});
        this.ok.addTo(this.buttonbar);
      } else if (this.dialog.type === "confirm") {
        this.ok = new Button({callback: this.dialog.okCallback, button: "green", text: this.dialog.okText, width: "40pw", height:"21.5pw", x:"-40pw", padding: "11px", textFontSize: 42});
        this.ok.addTo(this.buttonbar);
        this.cancel = new Button({callback: this.dialog.cancelCallback, button: "red", text: this.dialog.cancelText, width: "40pw", height:"21.5pw", padding: "11px", textFontSize: 42});
        this.cancel.addTo(this.buttonbar);
      } else {
        throw _.format("{} is not a correct dialog type", this.dialog.type);
      }
    }

    this.dismiss(true);
  },
  setup: function(options) {
    this.dialog.title = options.title !== undefined ? options.title : this.dialog.title;
    this.dialog.text = options.text !== undefined ? options.text : this.dialog.text;
    this.dialog.okCallback = options.okCallback !== undefined ? options.okCallback : this.dialog.okCallback;
    if (this.title) this.title.setup({text: this.dialog.title});
    if (this.text) this.text.setup({text: this.dialog.text});
    if (this.ok) this.ok.setup({callback: this.dialog.okCallback});
    this._super(options);
  },
  show: function(instant) {
    if (this.inScreen) return;
    if (instant) {
      this.visible = true;
      this.setup({right: "0vw"});
    } else {
      this.visible = true;
      let move = new cc.EaseBackOut(new cc.MoveBy(0.2, cc.p(cc.winSize.width, 0)), 3);
      let invisible = new cc.CallFunc(() => {this.setup({right: "0vw"});});
      this.runAction(new cc.Sequence([move, invisible]));
    }
    this.inScreen = true;
  },
  dismiss: function(instant) {
    if (!this.inScreen) return;
    if (instant) {
      this.visible = false;
      this.setup({right: "100vw"});
    } else {
      let move = new cc.EaseBackIn(new cc.MoveBy(0.2, cc.p(-cc.winSize.width, 0)), 3);
      let invisible = new cc.CallFunc(() => {this.visible = false; this.setup({right: "100vw"});});
      this.runAction(new cc.Sequence([move, invisible]));
    }
    this.inScreen = false;
  },
  toString: () => "Dialog"
});
