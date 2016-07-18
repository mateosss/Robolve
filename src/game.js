var TAG_TILE_MAP = 1;

var GameLevel = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var level = new Level();
    this.addChild(level);
  }
});

var Hud; //TODO

var Level = cc.Layer.extend({ // TODO Ir archivando historial de oleadas
  map: null,
  base: null,

  crossoverRate: 0.7, //the influence of the strongest parent to let its genes
  mutationRate: 1 / 8, // 8 gens in a robot, one mutation per subject aprox.

  robots: [], // Current robots in map
  deffenses: [], // Current deffenses in map

  wavesCounts: [], // Defined by the map, amount of robots per wave
  wavesIntervals: [], // Defined by the map, amount of time between waves
  waveQuery: [], // Robots in this array, has to spawn in this wave
  waveDelay: null, // Delay before a new wave is spawned
  SPAWN_TIME: 0.8, // Seconds between spawns
  lastWave: false, // True if the game is on the last wave
  cWave: null, // Current wave position
  ctor:function () {
    this._super();
    this.map = new TiledMap(this, res.maps.map1);
    this.addChild(this.map, 1, TAG_TILE_MAP);
    this.wavesCounts =  this.map.getProperties().wavesCounts.split(",").map(Number);
    this.wavesIntervals = this.map.getProperties().wavesIntervals.split(",").map(Number);
    this.prepareNextWave();

    // Set base
    var base = new Base(this, 500);
    this.setBase(base);

    // Add Robot
    turnProb = 1; //0,1,2
    life = 2; //0,1,2
    range = 0;//0,1
    element = "water";//water,fire,electric
    terrain = 0;//0,1
    speed = 2;//0,1,2
    damage = 0;//0,1,2
    attackSpeed = 1;//0,1,2
    var customRobot = new Robot(this, turnProb, life, element, range, terrain, speed, damage, attackSpeed);
    this.addRobot(customRobot);

    // Add Deffense
    range = 0;//0,1
    element = "water";//water,fire,electric
    terrain = 0;//0,1
    damage = 2;//0,1,2
    attackSpeed = 2;//0,1,2
    var customDeffense = new Deffense(this, element, range, terrain, damage, attackSpeed);
    this.addDeffense(customDeffense);

    // TODO mejorar el sistema en general que sea mas prolijo y DRY
    // TODO Better zoom (zoom where the mouse is or where the touch is made)
    // TODO# ZOOM NOT WORKING WITH TOUCHSCREEN
    // TODO Better zoom with lerp
    // TODO Add parallax background to the map
    // TODO pasar update y movemap a map
    // TODO cc.ScrollView fijarse si eso puede facilitar el tema del scroll
    if ('touches' in cc.sys.capabilities) {
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
    } else if ('mouse' in cc.sys.capabilities) {
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
        onMouseDown: function(event) {
          this.pressed = event.getButton();
          this.clickLocation = event.getLocation();

        },
        onMouseUp: function(event) {
          this.pressed = -1;
        },
        onMouseMove: function(event) {
          if (this.pressed != -1) {
            this.map = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
            if(this.pressed == this.moveButton) {
              delta = event.getDelta();
              // targetX = this.map.positionTarget.x + delta.x;
              // targetY = this.map.positionTarget.y + delta.y;
              this.moveMap(delta.x, delta.y);
            }
            else if(this.pressed == this.zoomButton) {
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
          console.info("scroll");
        },
      }, this);
    }
    this.scheduleUpdate();
    return true;
  },
  toString: function() {
    return "Level";
  },
  getRandomRobot: function() {
    //Add Robot
    turnProb = Math.floor((Math.random() * 3)); //0,1,2
    life = Math.floor((Math.random() * 3)); //0,1,2
    range = Math.floor((Math.random() * 2));//0,1
    elements = ['electric', 'water', 'fire'];
    element = elements[Math.floor((Math.random() * 3))];//water,fire,electric
    terrain = Math.floor((Math.random() * 2));
    speed = Math.floor((Math.random() * 3));
    damage = Math.floor((Math.random() * 3));
    attackSpeed = Math.floor((Math.random() * 3));
    var customRobot = new Robot(this, turnProb, life, element, range, terrain, speed, damage, attackSpeed);
    return customRobot;
  },
  getRandomDeffense: function() {
    //TODO las defensas van a ser por partes?
  },
  setBase: function(base) {
    this.map.spawn(base, 7);
    this.base = base;
  },
  addRobot: function(robot) {
    this.map.spawn(robot, 6);
    this.robots.push(robot);

    debug = new Debugger();//TODO sacar despues las cosas de debug
    debug.debugText(this, {text: "Robots Count: " + this.robots.length});
  },
  addDeffense: function(deffense) {
    //TODO que las cosas se spameen no en un layer hardcodeado como 5
    //si no que tenga relacion con el eje y en el que estan mientras mas alto
    //menos se van a mostrar, para que de un sentido mas uniforme de volumen
    //Tambien se puede buscar como hacer eso con isometric maps en cocos 2d
    //Capaz que ya existe | si existe pregunta de stackoverflow en algunlado
    //del codigo
    this.map.spawn(deffense, 5);
    this.deffenses.push(deffense);
  },
  prepareNextWave: function() { //TODO llenarlo con robotsw random? no serian robots pensados mejor?=
    if (this.cWave === null) {
      this.cWave = 0;
    } else {
      if (this.cWave < this.wavesCounts.length - 1) {
        this.cWave += 1;
      } else {
        this.lastWave = true;
        return;
      }
    }
    var robotsAmount = this.wavesCounts[this.cWave];
    for (var i = 0; i < robotsAmount; i++) {
      var toBornRobot = this.getRandomRobot();
      toBornRobot.retain();
      this.waveQuery.push(toBornRobot);
    }
    this.waveDelay = this.wavesIntervals[this.cWave];
  },
  crossover: function(p1, p2, sonsCount) { //TODO implementar mutacion, y que el robot sea equilibrado
    // Crossovers two DNAs from robot.getDNA(), p1 is the stronget parent
    sonsCount = sonsCount || 2;
    sons = [];
    for (var j = 0; j < sonsCount; j++) {
      var sonBorn = false;
      while (!sonBorn) {
        var son = [];
        for (var i = 0; i < p1.length; i++) {
            var gen;
            if (Math.random() < this.crossoverRate) { // p1 wins the gen
              gen = p1[i];
            } else { // p2 wins the gen
              gen = p2[i];
            }
            son.push(gen);
        }
        equalToP1 = son.join() == p1.join();
        equalToP2 = son.join() == p2.join();
        equalToSon = false;
        for (var k = 0; k < sons.length; k++) {
          if (son.join() == sons[k].join()) {
            equalToSon = true;
            break;
          }
        }
        if (!(equalToP1 || equalToP2 || equalToSon)) {
          sonBorn = true;
          sons.push(son);
        }
      }
    }
    return [p1, p2, sons];
  },
  counter:0,
  update: function(delta) {
    //Check for robot death
    var deletion = false;
    for (var i = 0; i < this.robots.length; i++) {//TODO hacer de esto una funcion que el robot llame cuando se muere para mejorar rendimiento
      if (this.robots[i].destroy) {
        this.robots[i].release();
        this.robots[i].removeFromParent();
        delete this.robots[i];
        deletion = true;
      }
    }
    if (deletion) {
      this.robots = this.robots.filter(function(robot) {return robot !== undefined;});
      debug.debugText(this, {text: "Robots Count: " + this.robots.length});
    }

    // Controls the delay between spawns
    if (this.counter >= this.waveDelay) {
      if (this.waveDelay != this.SPAWN_TIME) {
        this.waveDelay = this.SPAWN_TIME;
      }
      this.counter = 0;
      if (this.waveQuery.length > 0) {
        this.addRobot(this.waveQuery[this.waveQuery.length - 1]);
        this.waveQuery.pop();
      } else {
        this.prepareNextWave();
      }
    } else {
      this.counter += delta;
    }

    if (this.lastWave && this.robots.length === 0) {
      console.info("YOU WIN");
    }
  },
});
