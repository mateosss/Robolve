// TODO this is a basic scrollLayout, there are lots of  displayManager props like padding
// that would be very useful to use with the inner layout, which is the  one
// that clips the content while scrolling, see how to do that if needed.

var ScrollLayout = ccui.ScrollView.extend({
  displayManager: null, // Manages the size and location of this component
  scrollLayout: null, // ScrollLayout specific setup options
  ctor: function(options) {
    this.scrollView = this.scrollView || {
      innerWidth: options.width || "100pw",
      innerHeight: options.height || "100ph",
    };
    this._super();
    this.displayManager = new DisplayManager(this, options);
    this.setup(options);

    // TODO this two lines could be optional, see Panel component
    this.setSwallowTouches(true); // TODO This works great if below the dialog is a button, but if there is something using easyEvents it doesn't work as expected
    this.setTouchEnabled(true);

    this.setDirection(ccui.ScrollView.DIR_VERTICAL);
    this.setBounceEnabled(true);
    this.setInertiaScrollEnabled(false);
  },
  setup: function(options) {
    this.scrollView.innerHeight = options.innerHeight !== undefined ? options.innerHeight : this.scrollView.innerHeight;
    this.scrollView.innerWidth = options.innerWidth !== undefined ? options.innerWidth : this.scrollView.innerWidth;

    this.displayManager.setup(options);

    let w = this.displayManager.calc(this.scrollView.innerWidth);
    let h = this.displayManager.calc(this.scrollView.innerHeight);
    this.setInnerContainerSize(cc.size(w, h));

    // TODO hardcoded options, add to this.scrollView if needed
    this.setScrollBarWidth(5);
    this.setScrollBarColor(cc.color(84, 110, 122));
    this.setScrollBarOpacity(255);
  },
  toString: () => "Layout"
});
