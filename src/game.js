var GameLevel = cc.Node.extend({
  onEnter:function () {
    this._super();
    var layer = new Level();
    this.addChild(layer);
  }
});

var Level = cc.Layer.extend({
  sprite:new cc.Sprite(res.map),
  ctor:function () {
    this._super();

    var size = cc.winSize;
    var tapLabel = new cc.LabelTTF("Tap to Exit", "Arial", 38);
    tapLabel.x = size.width / 2;
    tapLabel.y = size.height / 2 + 200;
    this.addChild(tapLabel, 99);

    this.sprite = new cc.Sprite(res.map);
    this.sprite.attr({
      x: size.width / 2,
      y: size.height / 2
    });
    this.addChild(this.sprite, 0);

    //Add Robot
    life = -1; //-1,0,1
    element = "water";//water,fire,electric
    range = -1;//-1,1
    terrain = -1;//-1,1
    speed = 0;//-1,0,1
    damage = -1;//-1,0,1
    attackSpeed = 0;//-1,0,1

    customRobot = new Robot(life, element, range, terrain, speed, damage, attackSpeed);
    customRobot.x = size.width / 2;//TODO sacar
    customRobot.y = size.height / 2;//TODO sacar
    customRobot.scale = 0.125;//TODO sacar
    this.addChild(customRobot, 6);

    customRobot1 = new Robot(1, "fire", range, terrain, speed, 1, attackSpeed);
    customRobot1.x = (size.width / 2) + 64;//TODO sacar
    customRobot1.y = (size.height) / 2;//TODO sacar
    customRobot1.scale = 0.125;//TODO sacar
    this.addChild(customRobot1, 6);

    customRobot2 = new Robot(1, "fire", range, terrain, speed, -1, attackSpeed);
    customRobot2.x = (size.width / 2) + 64*2;//TODO sacar
    customRobot2.y = (size.height) / 2;//TODO sacar
    customRobot2.scale = 0.125;//TODO sacar
    this.addChild(customRobot2, 6);

    customRobot3 = new Robot(-1, "water", range, terrain, speed, 1, attackSpeed);
    customRobot3.x = (size.width / 2) + 64*3;//TODO sacar
    customRobot3.y = (size.height) / 2;//TODO sacar
    customRobot3.scale = 0.125;//TODO sacar
    this.addChild(customRobot3, 6);

    customRobot5 = new Robot(5, "fire", range, terrain, speed, 5, attackSpeed);
    customRobot5.x = (size.width / 2) - 64;//TODO sacar
    customRobot5.y = (size.height) / 2;//TODO sacar
    customRobot5.scale = 0.125;//TODO sacar
    this.addChild(customRobot5, 6);

    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function (touches, event) {
        cc.director.runScene(new MainMenu());
      },
    }, this);
    return true;
  }
});
