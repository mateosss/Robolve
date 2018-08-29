var Focus = ccui.Scale9Sprite.extend({
  focused: null,
  ctor: function() {
    this._super(r.ui.highlight);
    this.setAnchorPoint(0, 0);
    this.visible = false;


  },
  focus: function(element, padding, color, anchor) {
    this.focused = element;
    this.removeFromParent();
    element.addChild(this);
    this.setAnchorPoint(anchor || element.getAnchorPoint());


    padding = padding !== undefined ? padding : 22;
    color = color || cc.hexToColor("#E91E63"); // Pink
    this.x = -padding;
    this.y = -padding;
    this.width = element.width + padding * 2;
    this.height = element.height + padding * 2;
    this.visible = true;
    this.setColor(color);
    let inhale = new cc.ScaleTo(0.2, 1.05);
    let exhale = new cc.ScaleTo(0.2, 1);
    this.runAction(new cc.RepeatForever(new cc.Sequence(inhale, exhale)));
  },
  disableFocus: function() {
    this.stopAllActions();
    this.visible = false;
    this.removeFromParent();
  },
  toString: () => "Focus",
});
