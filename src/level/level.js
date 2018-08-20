var Level = cc.LayerGradient.extend({ // TODO Ir archivando historial de oleadas
  hud: null,
  map: null,
  character: null,
  base: null,
  speed: 1, // Keep speed on 1 for normal speed, modify it with setSpeed for accelerate
  crossoverRate: 0.7, //the influence of the strongest parent to let its genes
  mutationRate: 1 / 8, // 8 gens in a robot, one mutation per subject aprox. TODO, make the 8 not hardcoded
  isPaused: false,

  robots: [], // Current robots in map
  defenses: [], // Current defenses in map
  dummyDefense: null,
  prevWaveRobots: [], // [DNA, score] of the previous wave robots

  wavesCounts: [], // Defined by the map, amount of robots per wave
  wavesIntervals: [], // Defined by the map, amount of time between waves
  waveQuery: [], // Robots in this array, has to spawn in this wave
  waveDelay: null, // Delay before a new wave is spawned
  spawn_time: 2, // Seconds between spawns
  lastWave: false, // True if the game is on the last wave
  cWave: null, // Current wave position

  totalRobotsSpawned: 0,
  totalRobotsKilled: 0, // Increased from Robot
  totalItems: 0, // Saves the total items to drop in a level
  remainingItemsToDrop: null, // The remaining unique items to drop
  willDrop: 0, // Counter that if it is greater than 1, it is  very likely to drop a unique item from remainingItemsToDrop
  ctor:function (mapRes) {
    // this._super(cc.color(25, 25, 50), cc.color(50, 50, 100));
    // this._super(cc.hexToColor("#4FC3F7"), cc.hexToColor("#0288D1"));
    this._super(cc.hexToColor("#005ca8"), cc.hexToColor("#619ce0"));
    this.map = new TiledMap(this, mapRes);
    this.addChild(this.map, 1);

    this.setSpeed(this.speed);

    // Drop Chunk Setup
    this.remainingItemsToDrop = Object.values(Item.prototype.getItemsByCategory("unique"));
    this.totalItems = this.remainingItemsToDrop.length;

    //Prepare wave info
    this.wavesCounts =  this.map.getProperties().wavesCounts.split(",").map(Number);
    this.wavesIntervals = this.map.getProperties().wavesIntervals.split(",").map(Number);
    this.prepareNextWave();


    // Set base
    var base = new Base(this);
    this.setBase(base);

    // Character initialization
    let character = new Character(this);
    this.setCharacter(character);

    // Add Robot
    // turnProb = 1; //0,1,2
    // life = 2; //0,1,2
    // element = "water";//water,fire,electric
    // range = 0;//0,1
    // terrain = 0;//0,1
    // speed = 1;//0,1,2
    // damage = 0;//0,1,2
    // attackSpeed = 1;//0,1,2
    // var customRobot = new Robot(this, turnProb, life, element, range, terrain, speed, damage, attackSpeed);

    // Add Robot by DNA
    // var dna = [2, 2, "water", 0, 0, 2, 0, 1];
    // var customRobot = new Robot(this, dna);
    // customRobot.retain();
    // this.addRobot(customRobot);

    // defense 0,0 walk RED
    // life = 2;//0,1,2
    // range = 0;//0,1,2
    // element = "fire";//water,fire,electric
    // terrain = 1;//0,1
    // damage = 0;//0,1,2
    // attackSpeed = 0;//0,1,2
    // var customDefense = new Defense(this, life, element, range, terrain, damage, attackSpeed);
    // this.map.placeOnTile(customDefense, cc.p(0,5));
    // this.defenses.push(customDefense);
    //

    // life = 2;//0,1,2
    // range = 0;//0,1,2 BLUE
    // element = "water";//water,fire,electric
    // terrain = 1;//0,1
    // damage = 0;//0,1,2
    // attackSpeed = 0;//0,1,2
    // var customDefense1 = new Defense(this, life, element, range, terrain, damage, attackSpeed);
    // this.map.placeOnTile(customDefense1, cc.p(19,5));
    // this.defenses.push(customDefense1);
    //
    // // Add Defense
    // life = 2;//0,1,2
    // range = 1;//0,1,2
    // element = "electric";//water,fire,electric
    // terrain = 0;//0,1
    // damage = 2;//0,1,2
    // attackSpeed = 2;//0,1,2
    // customDefense = new Defense(this, life, element, range, terrain, damage, attackSpeed);
    // this.addDefense(customDefense);

    var mapDefenses = this.map.getMapDefenses();
    for (var d = 0; d < mapDefenses.length; d++) {
      this.map.placeOnTile(mapDefenses[d].defense, mapDefenses[d].position);
      this.defenses.push(mapDefenses[d].defense);
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
          this.map = event.getCurrentTarget().map;
          let delta;
          if (touches.length > 1) {
            delta = cc.pMidpoint(touches[0].getDelta(), touches[1].getDelta());
            let initialDistance = cc.pDistance(touches[0].getPreviousLocation(), touches[1].getPreviousLocation());
            let currentDistance = cc.pDistance(touches[0].getLocation(), touches[1].getLocation());
            let zoomDelta = (currentDistance - initialDistance) * 0.001;
            this.map.zoomMap(zoomDelta);
          } else {
            delta = touches[0].getDelta();
          }
          this.map.moveMap(delta.x, delta.y);
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
              var delta = event.getDelta();
              this.map.moveMap(delta.x, delta.y);
            }
            else if(this.pressed == this.zoomButton) {
              var zoomDelta = event.getDelta().y * 0.001;
              this.map.zoomMap(zoomDelta);
            }
          }
        },
        onMouseScroll: function(event) {
          this.map = event.getCurrentTarget().map;
          var zoomDelta = event.getScrollY() * (cc.sys.isNative ? 0.04 : 0.0001);
          this.map.zoomMap(zoomDelta);
        },
      }, this);
    }
    this.scheduleUpdate();
    return true;
  },
  popRandomDrop: function() {
    let pop = _.randint(0, this.remainingItemsToDrop.length - 1);
    return this.remainingItemsToDrop.splice(pop, 1);
  },
  toString: function() {
    return "Level";
  },
  setSpeed: function(speed) {
    this.speed = speed;
    this.refreshSpeed();
  },
  refreshSpeed: function() {
    // TODO this won't work properly after startup because of states
    // States save properties for later use, but don't have into account the level speed

    // update time between robots
    this.spawn_time = this.spawn_time / this.speed;
    // update time between waves
    for (var i = 0; i < this.wavesIntervals.length; i++) {
      this.wavesIntervals[i] = this.wavesIntervals[i] / this.speed;
    }
    // update robot stats related to time
    var rob = _.props(Robot).STATS;
    for (i in rob.get('speed')) {
      rob.get('speed')[i] *= this.speed;
      rob.get('attackSpeed')[i] *= this.speed;
    }
    var def = _.props(Defense).STATS;
    for (i in def.get('attackSpeed')) {
      def.get('attackSpeed')[i] *= this.speed;
    }
    this.robots.forEach(r=>r.resetStats());
    this.defenses.forEach(d=>d.resetStats());
  },
  getRandomRobot: function() {
    //Add Robot
    let dna = [];
    Robot.prototype.STATS.forEach(p => dna.push(_.randchoice(_.mapNumbers(Object.keys(p)))));
    return new Robot(this, dna);
  },
  getRandomDefense: function() {
    let dna = [];
    Defense.prototype.STATS.forEach(p => dna.push(_.randchoice(_.mapNumbers(Object.keys(p)))));
    return new Defense(this, dna);
  },
  setBase: function(base) {
    this.map.spawn(base, null, 7);
    this.base = base;
    this.base.x += 64; // HACK
    this.base.y += 32; // HACK
  },
  setCharacter: function(character) {
    this.map.spawn(character, null, 7);
    this.character = character;
  },
  addRobot: function(robot) {
    robot.spawnIndex = ++this.totalRobotsSpawned;
    this.map.spawn(robot, null, 6);
    this.robots.push(robot);
    // debug = new Debugger();//TODO sacar despues las cosas de debug
    // debug.debugText(this, {text: "Robots Count: " + this.robots.length});
  },
  addDefense: function(defense) {
    //TODO que las cosas se spameen no en un layer hardcodeado como 5
    //si no que tenga relacion con el eje y en el que estan mientras mas alto
    //menos se van a mostrar, para que de un sentido mas uniforme de volumen
    //Tambien se puede buscar como hacer eso con isometric maps en cocos 2d
    //Capaz que ya existe | si existe pregunta de stackoverflow en algunlado
    //del codigo
    this.map.spawn(defense, null, 5);
    this.defenses.push(defense);
  },
  showDummyDefense: function(defense) { // TODO when the map doesn't fill all the space, there are problems when selecting a tile that is outside the map
    this.removeDummyDefense();
    this.dummyDefense = defense;
    var ms = this.map.getMapSize();
    var pos = cc.p(ms.width / 2, ms.height / 2);
    this.map.placeOnTile(this.dummyDefense, pos);
    var color;
    var tint;

    if (this.dummyDefense.canBePlacedOn(pos).result && this.character.getGold() >= rb.prices.createDefense) {
      color = cc.color(0, 255, 100, 50);
    } else {
      color = cc.color(255, 50, 50, 50);
    }
    tint = new cc.TintTo(0.2, color.r, color.g, color.b);
    this.dummyDefense.runAction(tint);
    // this.map.selectTile(pos, color);
  },
  removeDummyDefense: function() {
    if (this.dummyDefense) {
      this.dummyDefense.removeFromParent();
      this.dummyDefense.release();
      this.dummyDefense = null;
      // this.map.debugger.debugTile(this.map, {stop: true});
    }
  },
  dummyToDefense: function() {
    let newDefense = this.dummyDefense;
    newDefense.setColor(cc.color(255, 255, 255));
    this.defenses.push(newDefense);
    newDefense.retain(); // Retain is needed I don't remeber why
    newDefense.isDummy = false;
    this.removeDummyDefense();
    this.map.addChild(newDefense);
    newDefense.factoryReset(); // This makes possible to the idle animation to execute the idle animation
    newDefense.realDefenseInit();
    return newDefense;
  },
  prepareNextWave: function() {// TODO no estoy teniendo en cuenta el orden en el que salen
    this.willDrop += this.totalItems / this.wavesCounts.length;
    var robotsAmount;
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

        this.prevWaveRobots.sort(function(a, b) { return b[1] - a[1]; });

        //Debugear avg score
        console.log("Average fitScore prev wave: " + (this.prevWaveRobots.reduce((t, e) => t + e[1], 0) / this.prevWaveRobots.length));

        //crear array dnaWaveQuery con esos agarrados
        var dnaWaveQuery = this.prevWaveRobots.slice(0, Math.ceil((robotsAmount / 4) + 1));
        // bucle agarrando dos al azar de ese cuarto+1 segun su score
        var toAdd = [];
        var rouleteSorting = function(dna) { return [dna[0], dna[1] * Math.random()]; };
        while (dnaWaveQuery.length + toAdd.length < robotsAmount) {
          var randomised = dnaWaveQuery.map(rouleteSorting);
          randomised.sort(function(a, b) { return b[1] - a[1]; });
          if (randomised.length === 1) randomised.push(randomised[0]); // duplicate subject if there is only one
          // hacerles crossover para que den un hijo
          var son = this.crossover(randomised[0][0], randomised[1][0], 1)[2][0];
          // agregar ese hijo a la dnawavequery
          toAdd.push(son);
          // cortar el bucle cuando se alcance el robotsAumount
        }
        dnaWaveQuery = dnaWaveQuery.map(function(a) { return a[0]; });
        dnaWaveQuery = dnaWaveQuery.concat(toAdd);
        var auxWaveQuery = [];
        for (var j = 0; j < dnaWaveQuery.length; j++) {
          var dnaRobot = new Robot(this, dnaWaveQuery[j]);
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
    if (this.hud) this.hud.waveText.refresh();
  },
  crossover: function(p1, p2, sonsCount) { //TODO GA que el robot sea equilibrado
    // Crossovers two DNAs from robot.getDNA(), p1 is the strongest parent
    sonsCount = sonsCount || 2;
    var possible = [];
    _.props(Robot).STATS.forEach(oPossibles => possible.push(
      _.mapNumbers(Object.keys(oPossibles))
    ));
    var sons = [];
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
        var equalToP1 = son.join() == p1.join();
        var equalToP2 = son.join() == p2.join();
        var equalToSon = false;
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
        if (!(equalToSon)) { //TODO esto es un test ¿puede nacer igual a un padre? ¿esta naciendo dos veces si es igual a un padre?
          sonBorn = true;
          sons.push(son);
        }
      }
    }
    return [p1, p2, sons];
  },
  mutate: function(gen, possibles) {
    // Mutates a gen within the possibles array
    var leftPossibles = possibles.length > 1 ? possibles.filter(function(a) { return a != gen; }) : possibles;
    var mutatedGen = leftPossibles[Math.floor((Math.random() * leftPossibles.length))];
    return mutatedGen;
  },
  endGame: function() {
    _.revEach(this.defenses, d => d.destroy());
    _.revEach(this.robots, r => r.destroy());
    _.revEach(this.waveQuery, q => q.release());
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
  pauseGame: function() {
    let recursivePause = (node) => {
      node.pause();
      let children = node.children;
      for (var child of children) recursivePause(child);
    };
    recursivePause(this);
    this.isPaused = true;
  },
  resumeGame: function() {
    let recursiveResume = (node) => {
      node.resume();
      let children = node.children;
      for (var child of children) recursiveResume(child);
    };
    recursiveResume(this);
    this.isPaused = false;
  },
  counter:0,
  update: function(delta) {// TODO buscar todos los updates del juego y tratar de simplificarlos al maximo, fijarse de usar custom schedulers
    // Controls the delay between spawns
    if (this.counter >= this.waveDelay) {
      if (this.waveDelay != this.spawn_time) {
        this.waveDelay = this.spawn_time;
      }
      this.counter = 0;
      if (this.waveQuery.length > 0) {
        this.addRobot(this.waveQuery.pop());
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
