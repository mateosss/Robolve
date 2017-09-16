var Hud = cc.Layer.extend({
  // TODO El hud es muy inestable, hay mucho hardcode de numeros en pixeles, hay que
  // buscar un buen metodo para hacer menues mas estables
  level: null,

  ig: null, // Information Gold
  ds: null, // Defense Selector
  it: null, // Information Text
  dd: null, // Defense Details

  ctor: function(level) {
    this._super();
    this.level = level;

    // Gold
    this.ig = new InfoGold(this);
    this.addChild(this.ig);

    // Defense Selector
    this.ds = new DefenseSelector(this);
    this.addChild(this.ds);

    // Info Text
    this.it = new InfoText(this);
    this.addChild(this.it);

    // Defense Details
    this.dd = new DefenseDetails(this);
    this.addChild(this.dd);

    // New bottom bar
    let vw = cc.winSize.width / 100;
    let vh = cc.winSize.height / 100;
    let scale = 1.5;
    let margin = 2 * vw;
    let height = (12 * vh) / scale;
    let width = (100 * vw) / scale;

    this.layout = new ccui.Layout();
    this.layout.scale = scale;
    this.layout.setBackGroundImage(r.panel);
    this.layout.setBackGroundImageScale9Enabled(true);
    this.layout.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
    this.layout.setSizeType(ccui.Widget.SIZE_ABSOLUTE);
    this.layout.setContentSize(width - (margin * 2) / scale, height);
    this.layout.setPositionType(ccui.Widget.POSITION_ABSOLUTE);
    this.layout.setPosition(cc.p(margin, margin));
    this.addChild(this.layout, 101);

    var text = new Text("Hello ccui.Text");
    this.layout.addChild(text);

    return true;
  },
  toString: function() {
    return "Hud";
  },
});
