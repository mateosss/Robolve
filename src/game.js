var TAG_TILE_MAP = 1;

var GameLevel = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var layer = new Level();
    this.addChild(layer);
  }
});

var Hud; //TODO

var Level = cc.Layer.extend({
  map: null,
  ctor:function () {
    this._super();
    this.map = new Map(res.maps.map1);
    this.addChild(this.map, 1, TAG_TILE_MAP);
    this.scheduleUpdate();
    // var size = cc.winSize;
    // var tapLabel = new cc.LabelTTF("Tap to Exit", "Arial", 38);
    // tapLabel.x = size.width / 2;
    // tapLabel.y = size.height / 2 + 200;
    // this.addChild(tapLabel, 99);
    //
    // this.sprite = new cc.Sprite(res.map);
    // this.sprite.attr({
    //   x: size.width / 2,
    //   y: size.height / 2
    // });
    // this.addChild(this.sprite, 0);
    //
    // //Add Robot
    // life = -1; //-1,0,1
    // element = "water";//water,fire,electric
    // range = -1;//-1,1
    // terrain = -1;//-1,1
    // speed = 0;//-1,0,1
    // damage = -1;//-1,0,1
    // attackSpeed = 0;//-1,0,1
    //
    // customRobot = new Robot(life, element, range, terrain, speed, damage, attackSpeed);
    // customRobot.x = size.width / 2;//TODO sacar
    // customRobot.y = size.height / 2;//TODO sacar
    // customRobot.scale = 0.125;//TODO sacar
    // this.addChild(customRobot, 6);
    //
    // customRobot1 = new Robot(1, "fire", range, terrain, speed, 1, attackSpeed);
    // customRobot1.x = (size.width / 2) + 64;//TODO sacar
    // customRobot1.y = (size.height) / 2;//TODO sacar
    // customRobot1.scale = 0.125;//TODO sacar
    // this.addChild(customRobot1, 6);
    //
    // customRobot2 = new Robot(1, "fire", range, terrain, speed, -1, attackSpeed);
    // customRobot2.x = (size.width / 2) + 64*2;//TODO sacar
    // customRobot2.y = (size.height) / 2;//TODO sacar
    // customRobot2.scale = 0.125;//TODO sacar
    // this.addChild(customRobot2, 6);
    //
    // customRobot3 = new Robot(-1, "water", range, terrain, speed, 1, attackSpeed);
    // customRobot3.x = (size.width / 2) + 64*3;//TODO sacar
    // customRobot3.y = (size.height) / 2;//TODO sacar
    // customRobot3.scale = 0.125;//TODO sacar
    // this.addChild(customRobot3, 6);
    //
    // customRobot5 = new Robot(5, "fire", range, terrain, speed, 5, attackSpeed);
    // customRobot5.x = (size.width / 2) - 64;//TODO sacar
    // customRobot5.y = (size.height) / 2;//TODO sacar
    // customRobot5.scale = 0.125;//TODO sacar
    // this.addChild(customRobot5, 6);
    //
    // cc.eventManager.addListener({
    //   event: cc.EventListener.TOUCH_ONE_BY_ONE,
    //   onTouchBegan: function (touches, event) {
    //     cc.director.runScene(new MainMenu());
    //     return true;
    //   },
    // }, this);

    // TODO Better zoom (zoom where the mouse is or where the touch is made)
    // TODO# ZOOM NOT WORKING WITH TOUCHSCREEN
    // TODO Better zoom with lerp
    // TODO Add parallax background to the map
    // TODO pasar update y movemap a map
    if ('touches' in cc.sys.capabilities){
      cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesMoved: function (touches, event) {
          // TODO hacer padre que tenga moveButton, zoomButton map y herede aca
          // TODO Update pasarlo al map, por que update cosas suyas
          var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
          var touch = touches[0];
          var delta = touch.getDelta();
          node.positionTarget.x += delta.x;
          node.positionTarget.y += delta.y;
        }
      }, this);
    } else if ('mouse' in cc.sys.capabilities)
    cc.eventManager.addListener({
      event: cc.EventListener.MOUSE,
      moveButton: cc.EventMouse.BUTTON_LEFT,
      zoomButton: cc.EventMouse.BUTTON_RIGHT,
      map: null,
      moveMap: function(x, y) {
        mapHalfWidth = (this.map.width * this.map.scale)/2;
        mapHalfHeight = (this.map.height)/2;

        maxLeft = winSize.width - 50 - mapHalfWidth;
        maxRight = 0 + 50 + mapHalfWidth;
        maxDown = winSize.height + 50 - mapHalfHeight;
        maxUp = 0 - 50 + mapHalfHeight;

        newX = this.map.positionTarget.x + x;
        newY = this.map.positionTarget.y + y;

        if (newX < maxLeft) {
          newX = maxLeft;
        }
        if (newX > maxRight) {
          newX = maxRight;
        }

        if (newY < maxDown) {
          newY = maxDown;
        }
        if (newY > maxUp) {
          newY = maxUp;
        }
        this.map.positionTarget.x = newX;
        this.map.positionTarget.y = newY;

        // if (this.map.x > maxBorderLeft){
        //     this.map.positionTarget.x = maxBorderLeft;
        // } else {
        //   this.map.positionTarget += x;
        // }

        // if (targetX > -(this.map.width * this.map.scale)/2 + winSize.width - 50 &&
        // targetX < (this.map.width * this.map.scale)/2 + 50) {
        //
        // }
        // if (targetY > -(this.map.height * this.map.scale)/2 + winSize.height - 50 &&
        // targetY < (this.map.height * this.map.scale)/2 + 50) {
        //   // this.map.positionTarget.y += y;
        // }
        // this.map.positionTarget.x = targetX;
        // this.map.positionTarget.y = targetY;
      },
      onMouseDown: function(event){
        this.pressed = event.getButton();
        this.clickLocation = event.getLocation();

      },
      onMouseUp: function(event){
        this.pressed = -1;
      },
      onMouseMove: function(event){
        if (this.pressed != -1) {
          this.map = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
          if(this.pressed == this.moveButton){
            delta = event.getDelta();
            // targetX = this.map.positionTarget.x + delta.x;
            // targetY = this.map.positionTarget.y + delta.y;
            this.moveMap(delta.x, delta.y);
          }
          else if(this.pressed == this.zoomButton){
            zoomDelta = event.getDeltaY()*0.001;
            zoom = this.map.scale + zoomDelta;
            if (zoom >= 0.15 && zoom <= 1.0) {
              this.map.scale = zoom;
              mapCenter = this.map.convertToWorldSpaceAR(this.map.getAnchorPoint());
              difference = cc.pSub(mapCenter, this.clickLocation);
              // TODO para que funcione el zoom hacia algo
              // obtener la posicion en el mapa de mi click
              // setear esa posicion como el anchor point
              // escalar desde ahi
              // dejar el anchor point donde estaba
              // this.moveMap(difference.x * zoomDelta * 10, 0);
            }
          }
        }
      },
      onMouseScroll: function(event) {
        console.log("scroll");
      },
    }, this);
    return true;
  },
  update: function(deltaTime){
    this.map.x = (this.map.positionTarget.x - this.map.x) * deltaTime * 16 + this.map.x;
    this.map.y = (this.map.positionTarget.y - this.map.y) * deltaTime * 16 + this.map.y;
  },
});
