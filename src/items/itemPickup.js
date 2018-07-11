var ItemPickup = cc.Sprite.extend({
  item: null, // Item reference
  quantity: 1, // Quantity of the item to pickup
  map: null, // Map reference

  ctor: function(map, position, item, quantity) {
    this.map = map;
    this.item = item;
    this.quantity = quantity || this.quantity;

    this._super(item.image);
    this.setPosition(position);
    map.addChild(this, 3000);

    this.setTouchEvent();
    this.drop();
  },

  drop: function() {
    // TODO animate a drop from the robot
    const DROP_HEIGHT = 128;
    let targetPosition = this.getPosition();
    // this.setPosition(targetPosition.x, targetPosition.y + 128);
    this.setScale(0);
    let up = new cc.EaseBackOut(new cc.MoveTo(0.2, cc.p(targetPosition.x, targetPosition.y + DROP_HEIGHT)));
    let grow = new cc.EaseBackOut(new cc.ScaleTo(0.2, 1), 3);
    let spawn = new cc.Spawn(up, grow);
    let drop = new cc.EaseBounceOut(new cc.MoveTo(0.2, targetPosition), 3);
    let actArray = [spawn, drop];
    this.runAction(new cc.Sequence(actArray));
  },

  pickup: function() {
    if (this.getNumberOfRunningActions() === 0) {
      let fly = new cc.EaseBackIn(new cc.MoveTo(0.2, this.map.level.character.getPosition()), 3);
      let shrink = new cc.EaseBackIn(new cc.ScaleBy(0.2, 0.5), 3);
      let destroy = new cc.RemoveSelf();
      let addGold = new cc.CallFunc(() => this.map.level.hud.ig.addGold(this.quantity));
      let actArray = [new cc.Spawn([fly, shrink]), destroy, addGold];
      this.runAction(new cc.Sequence(actArray));
    }
  },

  setTouchEvent: function() {
    easyTouchEnded(this, (pick) => pick.pickup());
  },

  toString: () => "ItemPickup",
});
