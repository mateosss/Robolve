
var MainMenu = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var layer = new Menu();
    this.addChild(layer);
  }
});

var Menu = cc.Layer.extend({
  sprite:null,
  ctor:function () {
    this._super();

    var size = cc.winSize;
    var tapLabel = new cc.LabelTTF("Tap to Start", "Arial", 38);
    tapLabel.x = size.width / 2;
    tapLabel.y = size.height / 2 + 200;
    this.addChild(tapLabel, 5);

    this.sprite = new cc.Sprite(res.HelloWorld_png);
    this.sprite.attr({
      x: size.width / 2,
      y: size.height / 2
    });
    this.addChild(this.sprite, 0);

    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function (touches, event) {
        cc.director.runScene(new GameLevel());
      },
    }, this);

    return true;
  }
});
