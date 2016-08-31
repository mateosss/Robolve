var TAG_TILE_MAP = 1;

var GameLevel = cc.Scene.extend({
  ctor: function(mapRes, firstTime) {
    this._super();
    this.mapRes = mapRes;
    this.firstTime = firstTime;
  },
  onEnter:function () {
    this._super();
    var level = new Level(this.mapRes, this.firstTime);
    var hud = new Hud(level);
    level.hud = hud;
    this.addChild(level);
    this.addChild(hud);
  }
});

var Level = cc.LayerGradient.extend({ // TODO Ir archivando historial de oleadas
  hud: null,
  map: null,
  base: null,
  SPEED: 1, // Keep speed on 1 for normal speed, increase for accelerate
  crossoverRate: 0.7, //the influence of the strongest parent to let its genes
  mutationRate: 1 / 8, // 8 gens in a robot, one mutation per subject aprox. TODO, make the 8 not hardcoded

  robots: [], // Current robots in map
  deffenses: [], // Current deffenses in map
  dummyDeffense: null,
  prevWaveRobots: [], // [DNA, score] of the previous wave robots

  wavesCounts: [], // Defined by the map, amount of robots per wave
  wavesIntervals: [], // Defined by the map, amount of time between waves
  waveQuery: [], // Robots in this array, has to spawn in this wave
  waveDelay: null, // Delay before a new wave is spawned
  SPAWN_TIME: 0.8, // Seconds between spawns
  lastWave: false, // True if the game is on the last wave
  cWave: null, // Current wave position
  ctor:function (mapRes, firstTime) {
    this._super(cc.color(25, 25, 50), cc.color(50, 50, 100));
    this.map = new TiledMap(this, mapRes);
    this.addChild(this.map, 1, TAG_TILE_MAP);

    // <Set level speed
    this.SPAWN_TIME = this.SPAWN_TIME / this.SPEED;
    for (var i = 0; i < this.wavesIntervals.length; i++) {
      this.wavesIntervals[i] = this.wavesIntervals[i] / this.SPEED;
    }
    if (firstTime) { //
      rob = new Robot();
      for (var value in rob.pSpeed) {
        rob.pSpeed[value] = rob.pSpeed[value] * this.SPEED;
        rob.pAttackSpeed[value] = rob.pAttackSpeed[value] * this.SPEED;
      }
      def = new Deffense();
      for (value in def.pAttackSpeed) {
        def.pAttackSpeed[value] = def.pAttackSpeed[value] * this.SPEED;
      }
    }
    // Set level speed>
    //Prepare wave info
    this.wavesCounts =  this.map.getProperties().wavesCounts.split(",").map(Number);
    this.wavesIntervals = this.map.getProperties().wavesIntervals.split(",").map(Number);
    this.prepareNextWave();

    // Set base
    var base = new Base(this, 500);
    this.setBase(base);

    // Add Robot
    // turnProb = 1; //0,1,2
    // life = 2; //0,1,2
    // element = "water";//water,fire,electric
    // range = 0;//0,1
    // terrain = 0;//0,1
    // speed = 1;//0,1,2
    // damage = 0;//0,1,2
    // attackSpeed = 1;//0,1,2
    // var customRobot = new Robot(this, false, turnProb, life, element, range, terrain, speed, damage, attackSpeed);

    // Add Robot by DNA
    // var dna = [2, 2, "water", 0, 0, 2, 0, 1];
    // var customRobot = new Robot(this, dna);
    // customRobot.retain();
    // this.addRobot(customRobot);

    // deffense 0,0 walk RED
    // range = 0;//0,1,2
    // element = "fire";//water,fire,electric
    // terrain = 1;//0,1
    // damage = 0;//0,1,2
    // attackSpeed = 0;//0,1,2
    // var customDeffense = new Deffense(this, element, range, terrain, damage, attackSpeed);
    // this.map.placeOnTile(customDeffense, cc.p(0,5));
    // this.deffenses.push(customDeffense);
    //
    // range = 0;//0,1,2 BLUE
    // element = "water";//water,fire,electric
    // terrain = 1;//0,1
    // damage = 0;//0,1,2
    // attackSpeed = 0;//0,1,2
    // var customDeffense1 = new Deffense(this, element, range, terrain, damage, attackSpeed);
    // this.map.placeOnTile(customDeffense1, cc.p(19,5));
    // this.deffenses.push(customDeffense1);
    //
    // // Add Deffense
    // range = 1;//0,1,2
    // element = "electric";//water,fire,electric
    // terrain = 0;//0,1
    // damage = 2;//0,1,2
    // attackSpeed = 2;//0,1,2
    // customDeffense = new Deffense(this, element, range, terrain, damage, attackSpeed);
    // this.addDeffense(customDeffense);

    var mapDeffenses = this.map.getMapDeffenses();
    for (var d = 0; d < mapDeffenses.length; d++) {
      this.map.placeOnTile(mapDeffenses[d].deffense, mapDeffenses[d].position);
      this.deffenses.push(mapDeffenses[d].deffense);
    }


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
          this.map = event.getCurrentTarget().map;
          var touch = touches[0];
          var delta = touch.getDelta();
          // this.map.moveMap(delta.x, delta.y);
          this.map.positionTarget.x += delta.x;
          this.map.positionTarget.y += delta.y;
          if (touches.length > 1) {
            zoomDelta = delta.y*0.001;
            this.map.zoomMap(zoomDelta);
            // zoom = this.map.scale + zoomDelta;
            // if (zoom >= 0.15 && zoom <= 1.0) {
            //   this.map.scale = zoom;
            // }
          }
        }
      }, this);
    } else if ('mouse' in cc.sys.capabilities) {
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        moveButton: cc.EventMouse.BUTTON_LEFT,
        zoomButton: cc.EventMouse.BUTTON_RIGHT,
        map: null,
        onMouseDown: function(event) {
          this.pressed = event.getButton();
          this.clickLocation = event.getLocation();
        },
        onMouseUp: function(event) {
          this.pressed = -1;
        },
        onMouseMove: function(event) {
          if (this.pressed != -1) {
            this.map = event.getCurrentTarget().map;
            if(this.pressed == this.moveButton) {
              delta = event.getDelta();
              this.map.moveMap(delta.x, delta.y);
            }
            else if(this.pressed == this.zoomButton) {
              var zoomDelta = event.getDelta().y * 0.001;
              this.map.zoomMap(zoomDelta);
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
    elements = ['electric', 'water', 'fire'];
    range = Math.floor((Math.random() * 2));//0,1
    element = elements[Math.floor((Math.random() * 3))];//water,fire,electric
    terrain = Math.floor((Math.random() * 2));
    speed = Math.floor((Math.random() * 3));
    damage = Math.floor((Math.random() * 3));
    attackSpeed = Math.floor((Math.random() * 3));
    var customRobot = new Robot(this, false, turnProb, life, element, range, terrain, speed, damage, attackSpeed);
    return customRobot;
  },
  getRandomDeffense: function() {
    //TODO las defensas van a ser por partes?
  },
  setBase: function(base) {
    this.map.spawn(base, null, 7);
    this.base = base;
  },
  addRobot: function(robot) {
    this.map.spawn(robot, null, 6);
    this.robots.push(robot);

    // debug = new Debugger();//TODO sacar despues las cosas de debug
    // debug.debugText(this, {text: "Robots Count: " + this.robots.length});
  },
  addDeffense: function(deffense) {
    //TODO que las cosas se spameen no en un layer hardcodeado como 5
    //si no que tenga relacion con el eje y en el que estan mientras mas alto
    //menos se van a mostrar, para que de un sentido mas uniforme de volumen
    //Tambien se puede buscar como hacer eso con isometric maps en cocos 2d
    //Capaz que ya existe | si existe pregunta de stackoverflow en algunlado
    //del codigo
    this.map.spawn(deffense, null, 5);
    this.deffenses.push(deffense);
  },
  showDummyDeffense: function(deffense) {
    if (this.dummyDeffense) {
      this.dummyDeffense.removeFromParent();
      this.dummyDeffense.release();
      this.dummyDeffense = null;
    }
    this.dummyDeffense = deffense;
    var ms = this.map.getMapSize();
    var pos = cc.p(ms.width / 2, ms.height / 2);
    this.map.placeOnTile(this.dummyDeffense, pos);
    var color;
    var tint;

    if (this.dummyDeffense.canBePlacedOn(pos).result && this.base.money >= 300) { //TODO 300 deffense price hardcoded TODO
      color = cc.color(0, 255, 100, 50);
    } else {
      color = cc.color(255, 50, 50, 50);
    }
    tint = new cc.TintTo(0.2, color.r, color.g, color.b);
    this.dummyDeffense.runAction(tint);
    this.map.selectTile(pos, color);
  },
  prepareNextWave: function() {// TODO no estoy teniendo en cuenta el orden en el que salen
    if (this.cWave === null) { // First random wave
      this.cWave = 0;
      robotsAmount = this.wavesCounts[this.cWave];
      for (var i = 0; i < robotsAmount; i++) {
        var toBornRobot = this.getRandomRobot();
        toBornRobot.retain(); // Cocos 2d hack
        this.waveQuery.push(toBornRobot);
      }
    } else { // GA Based next wave
      if (this.cWave < this.wavesCounts.length - 1) {
        this.cWave += 1;
        robotsAmount = this.wavesCounts[this.cWave];
        //Agarrar 1/4 + 1 de los mejores prevWaveRobots
        this.prevWaveRobots.sort(function(a, b) {return b[1] - a[1];});

        //Debugear avg score
        total = 0;
        count = 0;
        this.prevWaveRobots.forEach(function(e){total+=e[1];count+=1;});
        console.log("Average fitScore prev wave: " + total/count);
        //crear array dnaWaveQuery con esos agarrados
        var dnaWaveQuery = this.prevWaveRobots.slice(0, Math.ceil((robotsAmount / 4) + 1));
        // bucle agarrando dos al azar de ese cuarto+1 segun su score
        var toAdd = [];
        rouleteSorting = function(dna){return [dna[0], dna[1] * Math.random()];};
        while (dnaWaveQuery.length + toAdd.length < robotsAmount) {
          var randomised = dnaWaveQuery.map(rouleteSorting);
          randomised.sort(function(a, b) {return b[1] - a[1];});
          // hacerles crossover para que den un hijo
          var son = this.crossover(randomised[0][0], randomised[1][0], 1)[2][0];
          // agregar ese hijo a la dnawavequery
          toAdd.push(son);
          // cortar el bucle cuando se alcance el robotsAumount
        }
        dnaWaveQuery = dnaWaveQuery.map(function(a) {return a[0];});
        dnaWaveQuery = dnaWaveQuery.concat(toAdd);
        var auxWaveQuery = [];
        for (var j = 0; j < dnaWaveQuery.length; j++) {
          dnaRobot = new Robot(this, dnaWaveQuery[j]);
          dnaRobot.retain();
          auxWaveQuery.push(dnaRobot);
        }
        this.waveQuery = auxWaveQuery;
        this.prevWaveRobots = [];
      } else {
        this.lastWave = true;
        return;
      }
    }
    this.waveDelay = this.wavesIntervals[this.cWave];
  },
  crossover: function(p1, p2, sonsCount) { //TODO GA que el robot sea equilibrado
    // Crossovers two DNAs from robot.getDNA(), p1 is the strongest parent
    sonsCount = sonsCount || 2;
    var possible = [
      [0, 1, 2], //pTurnProb
      [0, 1, 2], //pLife
      ["electric", "fire", "water"], //pElement
      [0, 1], //pRange
      [0, 1], //pTerrain
      [0, 1, 2], //pSpeed
      [0, 1, 2], //pDamage
      [0, 1, 2], //pAttackSpeed
    ];
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
          if (Math.random() <= this.mutationRate) { // check mutation
            gen = this.mutate(gen, possible[i]);
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
        if (!(equalToSon)) { //TODO esto es un test
          sonBorn = true;
          sons.push(son);
        }
      }
    }
    return [p1, p2, sons];
  },
  mutate: function(gen, possibles) {
    // Mutates a gen within the possibles array
    var leftPossibles = possibles.filter(function(a) {return a != gen;});
    var mutatedGen = leftPossibles[Math.floor((Math.random() * leftPossibles.length))];
    return mutatedGen;
  },
  kill: function(robot) {
    // Kills a robot
    var deletion = false;
    var i = this.robots.indexOf(robot);
    if (i != -1) {
      this.prevWaveRobots.push([robot.getDNA(), robot.getScore()]);
      this.robots[i].release();
      this.robots[i].removeFromParent();
      this.robots.splice(i, 1);
      deletion = true;
      this.base.money += 50;
      this.hud.ig.refresh();
    }
    // if (deletion) {
    //   debug.debugText(this, {text: "Robots Count: " + this.robots.length});
    // }
    return deletion;
  },
  killDeffense: function(deffense) {
    // Kills a deffense
    var deletion = false;
    var i = this.deffenses.indexOf(deffense);
    if (i != -1) {
      this.deffenses[i].removeAllChildren();
      this.deffenses[i].removeFromParent();
      this.deffenses[i].release();
      this.deffenses.splice(i, 1);
      deletion = true;
    }
    return deletion;
  },
  endGame: function() {
    for (var i = 0; i < this.deffenses.length; i++) {
      this.killDeffense(this.deffenses[i]);
    }
    for (i = 0; i < this.robots.length; i++) {
      this.kill(this.robots[i]);
    }
    for (i = 0; i < this.waveQuery.length; i++) {
      this.waveQuery[i].release();
    }
    this.waveQuery = [];
    this.removeAllChildren();
  },
  gameOver: function() {
    this.endGame();
    cc.director.runScene(new cc.TransitionFade(1.5, new MainMenu("Game Over")));
  },
  winGame: function() {
    this.endGame();
    cc.director.runScene(new cc.TransitionFade(1.5, new MainMenu("You Win")));
  },
  counter:0,
  update: function(delta) {// TODO buscar todos los updates del juego y tratar de simplificarlos al maximo, fijarse de usar custom schedulers
    // Controls the delay between spawns
    if (this.counter >= this.waveDelay) {
      if (this.waveDelay != this.SPAWN_TIME) {
        this.waveDelay = this.SPAWN_TIME;
      }
      this.counter = 0;
      if (this.waveQuery.length > 0) {
        this.addRobot(this.waveQuery[this.waveQuery.length - 1]);
        this.waveQuery.pop();
      } else if (!this.lastWave && this.robots.length === 0) {
        this.prepareNextWave();
      }
    } else {
      this.counter += delta;
    }

    if (this.lastWave && this.robots.length === 0) {
      this.winGame();
    }
  },
});
