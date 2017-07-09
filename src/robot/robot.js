var Robot = cc.Sprite.extend({
  level: null, // Level where this object is placed
  pointing: 2, // Looking direction 0:North, 1:East, 2:South, 3:West
  cAction: null, // Current cc.Action being played
  cTilePos: cc.p(0, 0), // Current tile Position of the robot // TODO estoy hardcodeando esto
  state: null, // robot state (attack, walk, still...)
  creationTime: null,
  hitsReceived: 0,
  infligedDamage: 0,

  // STATS constant defines the structure of this Robot based class
  // Take into account that if for example turnProb is in STATS, the properties
  // turnProb and sTurnProb will be created directly on the object, with
  // turnProb having the gene, and sTurnProb the current real stat the robot
  // is having that can be modified and resetted by setDefaultStat
  STATS: new Map([
    ['turnProb', {0: 0.25, 1: 0.5, 2: 0.9}],
    ['life', {0: 500, 1: 600, 2: 700}],
    ['element', {
      electric: cc.color(255, 231, 0 ,255),
      fire: cc.color(227, 43, 0, 255),
      water: cc.color(1, 179, 255, 255)
    }],
    ['range', {0: 75, 1: 150}],
    ['terrain', {0: 'walk',1: 'fly'}],
    ['speed', {0: 0.35, 1: 0.75, 2: 1.0}],
    ['damage', {0: 5, 1: 15, 2:20}],
    ['attackSpeed', {0: 0.5, 1: 1.0, 2: 2.0}],
  ]),

  //Possible (p) stats // TODO definir valores reales // TODO apply fuzzy logic XXX
  // pTurnProb: {0: 0.25, 1: 0.5, 2: 0.9},
  // pLife: {0: 500, 1: 600, 2: 700},
  // pElement: {
  //   "electric": cc.color(255, 231, 0 ,255),
  //   "fire": cc.color(227, 43, 0, 255),
  //   "water": cc.color(1, 179, 255, 255)
  // },
  // pRange: {0: 75, 1: 150},
  // pTerrain: {0: 'walk',1: 'fly'},
  // pSpeed: {0: 0.35, 1: 0.75, 2: 1.0}, // TODO PORQUE?!?!?! velocidades 0.88 - 0.93 traen el bug donde el robot se va del mapa (0,10) Y velocidad 0.1, hace que para linux y android tengan tambien el bug, pero el javascript si.
  // pDamage: {0: 5, 1: 15, 2:20},
  // pAttackSpeed: {0: 0.5, 1: 1.0, 2: 2.0},

  //Initial values XXX
  // turnProb: null,
  // life: null,
  // element: null,
  // range: null,
  // terrain: null,
  // speed: null,
  // damage: null,
  // attackSpeed: null,

  // genes: new Map(), // The genes from the dna that matches the STATS constant's properties
  // // Example of genes on runtime
  // // genes: new Map([ // This constant defines the dna of this Robot based class
  // //   ['turnProb', 1],
  // //   ['life', 2],
  // //   ['element', 'electric']
  // //   ['range', 1],
  // //   ['terrain', 0],
  // //   ['speed', 2],
  // //   ['damage', 1],
  // //   ['attackSpeed', 0],
  // // ]),

  //Stats (s) XXX
  // sTurnProb: null,
  // sLife: null,
  // sRange: null,
  // sSpeed: null,
  // sDamage: null,
  // sAttackSpeed: null,

  // stats: new Map(), // Current stats values, can be reseted to match the genes with setDefaultStat function
  // // Example of stats on runtime
  // // stats: new Map([ // This constant defines the dna of this Robot based class
  // //   ['turnProb', 0.5],
  // //   ['life', 700],
  // //   ['element', cc.color(255, 231, 0 ,255)]
  // //   ['range', 150],
  // //   ['terrain', 'walk'],
  // //   ['speed', 1.0],
  // //   ['damage', 15],
  // //   ['attackSpeed', 0.5],
  // // ]),
  //cLife: null, // Current Life XXX

  //Part objects
  head: null,
  middle: null,
  arml: null,
  armr: null,
  legl: null,
  legr: null,

  // ctor: function(level, dna, turnProb, life, element, range, terrain, speed, damage, attackSpeed) { XXX
  ctor: function(level, dna) {
    // Can be used by sending a dna array, with corresponding values for every property
    // or by sending every property individually after a false dna
    // The constructor sets the level, creationTime, and all the initial stats,
    // after that it determines which sprites corresponds to every robot part and
    // it assembles the robot sprite by sprite. It also sets the real stats based
    // on the initial parameters
    //TODO que funcione el balanceo, poder hacer que un robot sea de tipo +1 y eso

    if (arguments.length === 0) return; // Hack for getting only the properties defined above
    this._super(r.empty);
    this.setAnchorPoint(0.5, 0.0);
    this.level = level;
    this.creationTime = new Date().getTime();
    dna = dna || Array.prototype.slice.call(arguments, 2);
    for (var i = 0; i < this.STATS.size; i++) {
      this[this.STATS.getki(i)] = dna[i];
    }
    // this.turnProb = dna[0]; XXX
    // this.life = dna[1];
    // this.element = dna[2];
    // this.range = dna[3];
    // this.terrain = dna[4];
    // this.speed = dna[5];
    // this.damage = dna[6];
    // this.attackSpeed = dna[7];

    this.resetStats();
    this.buildRobot();
    this.createHealthBar();
    this.setState("walk");
    // this.debug();
    this.scheduleUpdate();
  },
  toString: function() {
    return "Robot";
  },
  getStat: function(stat) {
    return this['s' + _.capitalize(stat)];
  },
  setStat: function(stat, value) {
    this['s' + _.capitalize(stat)] = value;
  },
  getDefaultStat: function(stat) { // Returns the original stat
    return this.STATS.get(stat)[this[stat]];
  },
  setDefaultStat: function(stat) { // Provide an stat name or stat index to reset it, to the default given by the genes
    this.setStat(stat, this.getDefaultStat(stat));
  },
  getPossiblesStat: function(stat) { // Returns the possible values that a stat can have
    return this.STATS.get(stat);
  },
  getDNA: function() {
    // var dna = [ XXX
    //   this.turnProb,
    //   this.life,
    //   this.element,
    //   this.range,
    //   this.terrain,
    //   this.speed,
    //   this.damage,
    //   this.attackSpeed,
    // ];
    var dna = [];
    this.STATS.forEach(function(possibles, stat) {
      dna.push(this[stat]);
    });
    return dna;
  },
  buildRobot: function() {
    // Builds the robot, by creating all the parts
    Object.keys(_.props(Part).PARTS).forEach(function(part) {
      this[part] = new Part(this, part);
      this.addPart(this[part]);
    }, this);
  },
  resetStats: function() { // sets the initial value to all stats in sStats
    this.STATS.forEach(function(possibles, stat) {
      this.setDefaultStat(stat);
    }, this);

    // this.sTurnProb = this.pTurnProb[this.turnProb]; XXX
    // this.sLife = this.pLife[this.life];
    // this.cLife = this.sLife;
    // this.sRange = this.pRange[this.range];
    // this.sSpeed = this.pSpeed[this.speed];
    // this.sDamage = this.pDamage[this.damage];
    // this.sAttackSpeed = this.pAttackSpeed[this.attackSpeed];
  },
  getParts: function() { // Return all Part objects from which the robot is made
    return [
      this.head,
      this.middle,
      this.arml,
      this.armr,
      this.legl,
      this.legr,
    ];
  },
  allParts: function(func) { // executes a function for every part
    this.getParts().forEach(func, this);
  },
  addPart: function(part) { // Adds a part to the robot as a child in the correct zindex
    this.addChild(part, part.PARTS[part.type].zIndex);
  },
  setAnimation: function(animation) { // Expects a string with the name of an animation to reproduce, and reproduce it in every robot part
    this.cAction = animation;
    this.allParts(function(part) {part.setAnimation(animation);});
  },
  createHealthBar: function() { //TODO crear una buena health bar que sea independiente del tamaño del sprie
    //Creates two rectangles for representing the healtbar
    var originB = cc.p(-30, 0);
    var originF = cc.p(-28, 2);
    var destinationB = cc.p(30, 15);
    var destinationF = cc.p(28, 13);
    var fillColorB = cc.color(0, 0, 0, 255);
    var fillColorF = this.sElement;

    var back = new cc.DrawNode();
    var front = new cc.DrawNode();
    back.drawRect(originB, destinationB, fillColorB, 0, fillColorB);
    front.drawRect(originF, destinationF, fillColorF, 0, fillColorF);
    back.y += 224;
    front.y += 224;
    back.x += 15;
    front.x += 15;
    back.setRotationY(30);
    front.setRotationY(30);
    front.setName("hpbar");
    this.addChild(back, 10);
    this.addChild(front, 11);
  },
  updateHealthBar: function() {
    // Updates the healthbar length with the sLife stat
    var hpbar = this.getChildByName("hpbar");
    hpbar.setScaleX(this.sLife / this.getDefaultStat('life'));
  },
  fire: function(target) {//TODO repetido en defensa hacer buena clase padre
    // This funcitons is executed when the robot attacks something
    if (target) {
      this.setState("attack");
      this.infligedDamage += target.hurt(this);
    }
  },
  setState: function(state) { // TODO too basic, probably will need improvements in the future, investigate finite state machine
    if (this.state === state) return;
    this.setAnimation(state);
    this.state = state;
  },
  getTarget: function() {//TODO otra vez se repite en defensa
    // This function returns if there is a target to attack in the robot range
    var distance = this.getDistanceTo(this.level.base);
    if (distance <= this.sRange) {
      return this.level.base;
    } else {
      return false;
    }
  },
  getDistanceTo: function(target) {
    // Get distance to another object in the map
    var robotCenter = this.getPosition();
    var targetCenter = target.getPosition();
    var distance = cc.pDistance(robotCenter, targetCenter);
    return distance;
  },
  checkNewTile: function() {
    // This function is executed every frame to check if the robot is on a new
    // tile, and refresh this.cTilePos to represent it.
    //TODO esto es horrible alguien haga algo al respecto!!!!
    var currTilePos = this.level.map.tileCoordFromChild(this);
    if (this.cTilePos && !cc.pointEqualToPoint(currTilePos, this.cTilePos)) {
      if (!(this.canTurn(currTilePos) !== false &&
      [0,3].indexOf(this.pointing) != -1) ||
      this.y >= this.level.map.getMidPointFromTile(currTilePos).y + (this.level.map.getTileSize().height / 2) - this.getPossiblesStat('speed')[this.speed]) {//TODO no habia una solucion menos horrible?
        this.cTilePos = currTilePos;
        return true;
      }
    }
    return false;
  },
  canTurn: function(tilePos) {
    //TODO only check in the middle of the tile
    // Returns what direction the robot can turn if it can or false
    var tile = this.level.map.getLayer("Background").getTileGIDAt(tilePos);
    var tileProps = this.level.map.getPropertiesForGID(tile) || {};
    var turnable = tileProps.hasOwnProperty('turn');
    if (turnable) {
      var turnDirections = tileProps.turn.split(",");
      if (turnDirections instanceof Array) {
        return turnDirections.map(Number);
      }
    }
    return false;
  },
  turn: function(turnDirections) {
    // Changes the direction with the presented logic in account
    if (turnDirections) {
      var self = this;
      var back = this.pointing + (this.pointing < 2 ? 2 : -2);
      var canBack = turnDirections.indexOf(back) != -1;
      var possibleTurn = turnDirections.filter(function(dir) {
        return dir != self.pointing && dir != back;
      });
      var newDirection = null;
      //si this.pointing esta en la turnTile
      if (turnDirections.indexOf(this.pointing) != -1) {
        //si hay un lugar al que doblar y mi random dice que doble
        if (possibleTurn.length > 0 && Math.random() < this.sTurnProb) {
          //doblar a alguno de esos lugares al azar
          newDirection = possibleTurn[
            Math.floor((Math.random() * possibleTurn.length))
          ];
        } else {
          newDirection = this.pointing;
        }
        //si this.pointing no esta en las turnDirections
      } else {
        //si hay un lugar al que doblar
        if (possibleTurn.length > 0) {
          //doblar a alguno de esos lugares al azar
          newDirection = possibleTurn[
            Math.floor((Math.random() * possibleTurn.length))
          ];
        } else {
          //volver por donde vine si puedo si no seguir derecho
          newDirection = canBack ? back : this.pointing;
        }
      }
      this.pointing = newDirection;
      this.allParts(function(part){part.setFlippedX(this.pointing % 2);});
    }
  },
  walk: function() {
    // Moves the robot by its speed in a pointing direction
    if (this.pointing === 0) {
      xDirection = 1;
      yDirection = 1;
    } else if (this.pointing == 1) {
      xDirection = 1;
      yDirection = -1;
    } else if (this.pointing == 2) {
      xDirection = -1;
      yDirection = -1;
    } else if (this.pointing == 3) {
      xDirection = -1;
      yDirection = 1;
    } else {
      xDirection = 1;
      yDirection = 1;
      cc.log("Bad robot pointing, setting 0");
    }
    this.x += this.sSpeed * xDirection;
    this.y += (this.sSpeed / 2) * yDirection;
  },
  hurt: function(defense) {
    // This function calculates the total damage of the received attack depending
    // on the defense properties, and do some things in reaction
    this.hitsReceived += 1;
    var elementMod = 1;
    if (this.element == "electric") {
      if (defense.element == "electric") {elementMod = 1;}
      else if (defense.element == "fire") {elementMod = 2;}
      else if (defense.element == "water") {elementMod = 0.5;}
    }
    else if (this.element == "fire") {
      if (defense.element == "electric") {elementMod = 0.5;}
      else if (defense.element == "fire") {elementMod = 1;}
      else if (defense.element == "water") {elementMod = 2;}
    }
    else if (this.element == "water") {
      if (defense.element == "electric") {elementMod = 2;}
      else if (defense.element == "fire") {elementMod = 0.5;}
      else if (defense.element == "water") {elementMod = 1;}
    }
    var totalDamage = defense.sDamage * elementMod;
    this.sLife -= totalDamage;
    if (this.sLife <= 0) {
      this.sLife = 0;
      this.die();
    } else {
      this.updateHealthBar();
    }
    return totalDamage;
  },
  die: function() {
    // Call the level kill function to kill this robot
    this.level.kill(this);
  },
  livedTimeScore: function() {
    // Returns a float, being 0.0 == 0 ms, 1.0 lived more or equal ms to maxTime
    var maxTime = 120000;
    var lived = new Date().getTime() - this.creationTime;
    if (lived > maxTime) {
      return 1;
    }
    var score =  lived / maxTime;
    return score;
  },
  hitsReceivedScore: function() {
    // Returns a float, being 0.0 == 0 ms, 1.0 lived more or equal ms to maxTime
    var maxHits = this.getPossiblesStat('life')[2] / (new Defense().pDamage[0] * 0.5);
    var score = 0;
    var hitsReceived = this.hitsReceived;
    score =  hitsReceived / maxHits;
    return score;
  },
  infligedDamageScore: function() {
    // Returns a float, being 0.0 == 0 damage, 1.0 == all the base health
    var maxDamage = this.level.base.sLife;
    var damage = this.infligedDamage;
    if (damage >= maxDamage) {
      return 1;
    }
    var score = damage / maxDamage;
    return score;
  },
  distanceToBaseScore: function() {
    // Returns a float, being 0.0 == more than maxDistance, 1.0 == 0 distance
    var maxDistance = 2000;
    var distance = Math.floor(this.getDistanceTo(this.level.base));
    if (distance >= maxDistance) {
      return 0;
    }
    var score = 1 - ((1.0 / maxDistance) * distance);
    return score;
  },
  getScore: function() {
    // Returns the fit score for the GA, represents how good the robots fits
    // var livedTimeScore = this.livedTimeScore() * 0.10;
    // var firstHurtTimeScore = this.firstHurtTimeScore() * 0.25;
    var hitsReceivedScore = this.hitsReceivedScore() * 0.25;
    var infligedDamageScore = this.infligedDamageScore() * 0.5;
    var distanceToBaseScore = this.distanceToBaseScore() * 0.25;
    // var score = livedTimeScore + infligedDamageScore + distanceToBaseScore;
    // var score = firstHurtTimeScore + infligedDamageScore + distanceToBaseScore;
    var score = hitsReceivedScore + infligedDamageScore + distanceToBaseScore;
    return score;
  },
  debug: function() {
    // Creates a debugger for verbose information directly on the canvas
    this.debugger = new Debugger(this);
    this.debugger.methods = [ // Modify this to add debug information
      { method: this.debugger.debugAnchor },
      { method: this.debugger.debugRange },
      { method: this.debugger.debugText, options: {
        text: JSON.stringify(this.cTilePos),
        dimensions: cc.size(256, 256),
        fontSize: 24,
        hAlignment: cc.TEXT_ALIGNMENT_LEFT,
        position: cc.p(this.getAnchorPointInPoints().x, this.getAnchorPointInPoints().y + 128)
      } },
    ];
    this.debugger.debug();
  },
  counter: 0.0,
  update: function(delta) {
    // Executed every frame
    var base = this.getTarget();
    if (this.counter < 1 / this.sAttackSpeed) {
      this.counter += delta;
    } else {
      this.counter = 0.0;
      this.fire(base);
    }

    if (this.checkNewTile()) {
      // this.debugger.debugTile(this.level.map, {stop: true});// TODO stop doesn't work
      // this.debugger.debugText(this, {
      //   // text: "time: " + this.livedTimeScore().toFixed(4) + "\n" +
      //   // text: "time: " + this.firstHurtTimeScore().toFixed(4) + "\n" +
      //   text: "time: " + this.hitsReceivedScore().toFixed(4) + "\n" +
        // "damage: " + this.infligedDamageScore().toFixed(4) + "\n" +
      //   "distance: " + this.distanceToBaseScore().toFixed(4) + "\n" +
      //   "score: " + this.getScore().toFixed(4) + "\n"
      // });
      // this.debugger.debugTile(this.level.map, {tile:this.level.map.rectFromTile(this.cTilePos)});
      this.turn(this.canTurn(this.cTilePos));
    }

    if (!base) {
      this.walk();
    }
  },
});
