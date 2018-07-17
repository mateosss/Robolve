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
    this.setScale(72 / this.getTexture().height); // 72 pixles is the sprite  height on the level floor
    this.setTouchEvent();
    this.drop();
  },

  drop: function() {
    // TODO animate a drop from the robot
    const DROP_HEIGHT = 128;
    let targetPosition = this.getPosition();
    // this.setPosition(targetPosition.x, targetPosition.y + 128);
    let initialScale = this.scale;
    this.setScale(0);
    let up = new cc.EaseBackOut(new cc.MoveTo(0.2, cc.p(targetPosition.x, targetPosition.y + DROP_HEIGHT)));
    let grow = new cc.EaseBackOut(new cc.ScaleTo(0.2, initialScale), 3);
    let spawn = new cc.Spawn(up, grow);
    let drop = new cc.EaseBounceOut(new cc.MoveTo(0.2, targetPosition), 3);
    let actArray = [spawn, drop];
    this.runAction(new cc.Sequence(actArray));
  },

  pickup: function() {
    let character = this.map.level.character;
    if (this.getNumberOfRunningActions() === 0) {
      let canPick = character.inventory.canAdd(this.item, this.quantity);
      let inventoryButton = this.map.level.hud.openInventory;

      if (!canPick) {
        let burn = new cc.TintTo(0.1, 255, 160, 130);
        let shake = cc.Sequence.create(
          new cc.MoveBy(0.1, cc.p(10, 0)),
          new cc.MoveBy(0.1, cc.p(-20, 0)),
          new cc.MoveBy(0.1, cc.p(20, 0)),
          new cc.MoveBy(0.1, cc.p(-10, 0))
        );
        let calm = new cc.TintTo(0.2, 255, 255, 255);
        let spawn = new cc.Spawn([shake, calm]);
        let actArray = new cc.Sequence([burn, spawn]);
        inventoryButton.runAction(actArray);
        this.runAction(actArray.clone());
        this.map.level.hud.it.message("There's no room for that in your bag");
        return;
      }

      let fly = new cc.EaseBackIn(new cc.MoveTo(0.2, this.map.convertToNodeSpace(inventoryButton.getPosition())), 3);
      let shrink = new cc.EaseBackIn(new cc.ScaleBy(0.2, 0.5), 3);
      let destroy = new cc.RemoveSelf();
      let addItem;
      if (this.item.isEqual(rb.items.gold)) addItem = new cc.CallFunc(() => this.map.level.hud.ig.addGold(this.quantity));
      else addItem = new cc.CallFunc(() => character.inventory.addItem(this.item, this.quantity));
      let refreshInventory = new cc.CallFunc(() => this.map.level.hud.inventory.refresh());

      let inventoryButtonReact = new cc.CallFunc(() => {
        let up = new cc.EaseBackOut(new cc.MoveBy(0.2, cc.p(0, 128)));
        let down = new cc.EaseBounceOut(new cc.MoveBy(0.2, cc.p(0, -128)), 3);
        inventoryButton.runAction(new cc.Sequence(up, down));
      });

      let actArray = [new cc.Spawn([fly, shrink]), destroy, addItem, refreshInventory, inventoryButtonReact];
      this.runAction(new cc.Sequence(actArray));
    }
  },

  setTouchEvent: function() {
    easyTouchEnded(this, (pick) => pick.pickup());
  },

  toString: () => "ItemPickup",
});
