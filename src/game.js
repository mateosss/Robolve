var TAG_TILE_MAP = 1;

var GameLevel = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var level = new Level();
    this.addChild(level);
  }
});

var Hud; //TODO

var Level = cc.Layer.extend({//TODO Ir archivando historial de oleadas
  map: null,
  base: null,
  robots: [],
  deffenses: [],
  ctor:function () {
    this._super();
    this.map = new TiledMap(res.maps.map1);
    this.addChild(this.map, 1, TAG_TILE_MAP);

    // Set base
    var base = new Base(this, 500);
    this.setBase(base);

    // Add Robot
    life = 2; //0,1,2
    range = 0;//0,1
    element = "water";//water,fire,electric
    terrain = 0;//0,1
    speed = 2;//0,1,2
    damage = 0;//0,1,2
    attackSpeed = 1;//0,1,2
    var customRobot = new Robot(this, life, element, range, terrain, speed, damage, attackSpeed);
    this.addRobot(customRobot);
    // Add Deffense
    range = 0;//0,1
    element = "water";//water,fire,electric
    terrain = 0;//0,1
    damage = 2;//0,1,2
    attackSpeed = 1;//0,1,2
    var customDeffense = new Deffense(this, element, range, terrain, damage, attackSpeed);
    this.addDeffense(customDeffense);

    // TODO mejorar el sistema en general que sea mas prolijo y DRY
    // TODO Better zoom (zoom where the mouse is or where the touch is made)
    // TODO# ZOOM NOT WORKING WITH TOUCHSCREEN
    // TODO Better zoom with lerp
    // TODO Add parallax background to the map
    // TODO pasar update y movemap a map
    // TODO cc.ScrollView fijarse si eso puede facilitar el tema del scroll
    if ('touches' in cc.sys.capabilities){
      cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesMoved: function (touches, event) {
          // TODO hacer padre que tenga moveButton, zoomButton map y herede aca
          // TODO Update pasarlo al map, por que update cosas suyas
          this.map = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
          var touch = touches[0];
          var delta = touch.getDelta();
          this.map.positionTarget.x += delta.x;
          this.map.positionTarget.y += delta.y;
          if (touches.length > 1) {
            zoomDelta = delta.y*0.001;
            zoom = this.map.scale + zoomDelta;
            if (zoom >= 0.15 && zoom <= 1.0) {
              this.map.scale = zoom;
            }
          }
        }
      }, this);
    } else if ('mouse' in cc.sys.capabilities){
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
                // mapCenter = this.map.convertToWorldSpaceAR(this.map.getAnchorPoint());
                // difference = cc.pSub(mapCenter, this.clickLocation);
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
      }, this);}
      this.scheduleUpdate();
      return true;
    },
    toString: function(){
      return "Level";
    },
    addRandomRobot: function(){
      //Add Robot
      life = Math.floor((Math.random() * 3)); //0,1,2
      range = Math.floor((Math.random() * 2));//0,1
      elements = ['electric', 'water', 'fire'];
      element = elements[Math.floor((Math.random() * 3))];//water,fire,electric
      terrain = Math.floor((Math.random() * 2));
      speed = Math.floor((Math.random() * 3));
      damage = Math.floor((Math.random() * 3));
      attackSpeed = Math.floor((Math.random() * 3));
      var customRobot = new Robot(this, life, element, range, terrain, speed, damage, attackSpeed);
      this.addRobot(customRobot);
    },
    addRandomDeffense: function(){
      //TODO las defensas van a ser por partes?
    },
    setBase: function(base){
      this.map.spawn(base, 7);
      this.base = base;
    },
    addRobot: function(robot){
      this.map.spawn(robot, 6);
      this.robots.push(robot);
    },
    addDeffense: function(deffense){
      //TODO que las cosas se spameen no en un layer hardcodeado como 5
      //si no que tenga relacion con el eje y en el que estan mientras mas alto
      //menos se van a mostrar, para que de un sentido mas uniforme de volumen
      //Tambien se puede buscar como hacer eso con isometric maps en cocos 2d
      //Capaz que ya existe
      this.map.spawn(deffense, 5);
      this.deffenses.push(deffense);
    },
    counter:0,
    update: function(){
      var deletion = false;
      for (var i = 0; i < this.robots.length; i++) {
        if (this.robots[i].destroy) {
          this.robots[i].removeFromParent();
          delete this.robots[i];
          deletion = true;
        }
      }
      if (deletion) {
        this.robots = this.robots.filter(function(robot){return robot !== undefined;});
      }

      // if (this.counter >= 180) {//TODO sacar esto
      //   this.counter = 0;
      //   this.addRandomRobot();
      // } else {
      //   this.counter += 1;
      // }
    },
  });
