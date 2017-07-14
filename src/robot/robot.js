var Robot = cc.Sprite.extend({
  level: null, // Level where this object is placed
  pointing: 2, // Looking direction 0:North, 1:East, 2:South, 3:West
  cAnimation: null, // Current cc.Action being played
  cTilePos: cc.p(0, 0), // Current tile Position of the robot // TODO estoy hardcodeando esto
  cStates: null, // [] array with applied states, from older to newer
  states: null, // [] Automatically generated array, with all the STATES instances
  creationTime: null,
  hitsReceived: 0,
  infligedDamage: 0,

  // STATS constant defines the structure of this Robot based class
  // Take into account that if for example turnProb is in STATS, the properties
  // turnProb and sTurnProb will be created directly on the object, with
  // turnProb having the gene, and sTurnProb the current real stat the robot
  // is having that can be modified and resetted by setDefaultStat
  // TODO definir valores reales // TODO apply fuzzy logic
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
  PARTS: { // Necessary info for the parts to make a robot
    head: {plural: "heads", z: 2, partName: robot => robot.element + ["Weak", "Normal", "Strong"][robot.damage]},
    middle: {plural: "middles", z: 1, partName: robot => ["weak", "normal", "strong"][robot.life]},
    arml: {plural: "armsl", z: 3, partName: robot => robot.element + ["Mele", "Range"][robot.range] + "L"},
    armr: {plural: "armsr", z: 0, partName: robot => robot.element + ["Mele", "Range"][robot.range] + "R"},
    legl: {plural: "legsl", z: 0, partName: robot => ["walk", "fly"][robot.terrain] + "L"},
    legr: {plural: "legsr", z: 0, partName: robot => ["walk", "fly"][robot.terrain] + "R"},
  },
  STATES: [ // Possible states for this robot
    rb.states.robot.still,
    rb.states.robot.walk,
    rb.states.robot.attack
  ],

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
    for (let i = 0; i < this.STATS.size; i++) {
      this[this.STATS.getki(i)] = dna[i];
    }

    this.states = [];
    this.cStates = [];
    for (let i = 0; i < this.STATES.length; i++) {
      this.states.push(new State(this.STATES[i]));
    }

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
    var dna = [];
    this.STATS.forEach((possibles, stat) => {dna.push(this[stat]);});
    return dna;
  },
  buildRobot: function() {
    // Builds the robot, by creating all the parts
    Object.keys(this.PARTS).forEach(part => {
      this[part] = new Part(this, part);
      this.addPart(this[part]);
    });
  },
  resetStats: function() { // sets the initial value to all stats in sStats
    this.STATS.forEach((possibles, stat) => {this.setDefaultStat(stat);});
  },
  getParts: function() { // Return all Part objects from which the robot is made
    var parts = [];
    for (var part in this.PARTS) {
      parts.push(this[part]);
    }
    return parts;
  },
  allParts: function(func) { // executes a function for every part
    this.getParts().forEach(func, this);
  },
  addPart: function(part) { // Adds a part to the robot as a child in the correct zindex
    this.addChild(part, this.PARTS[part.type].z);
  },
  setAnimation: function(animation, speed) { // Expects a string with the name of an animation to reproduce, and reproduce it in every robot part
    this.cAnimation = animation;
    this.allParts(function(part) { part.setAnimation(animation, speed); });
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
  getState: function(state) { // Gets a state from STATES by name
    if (typeof state === 'string') state = this.states.find(aState => aState.name == state);
    return state;
  },
  addState: function(state) { // adds a state to cStates and starts it, expects a state or a string with its name
    this.getState(state).start(this);
  },
  removeState: function(state) { // removes a state from cStates and ends it, expects a state or a string with its name
    this.getState(state).end();
  },
  setState: function(state) { // stops all states and add the provided one
    this.cStates.forEach(function(state) { this.removeState(state); }, this);
    this.addState(state);
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
      this.allParts(function(part) { part.setFlippedX(this.pointing % 2); });
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
        text: JSON.stringify([this.sAttackSpeed, (1 / (this.sAttackSpeed * 6)).toFixed(2)]),
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
      // this.debugger.debugTile(this.level.map, {stop: true});// TODO stop doesn't work
      // this.debugger.debugText(this, {
      //   // text: "time: " + this.livedTimeScore().toFixed(4) + "\n" +
      //   // text: "time: " + this.firstHurtTimeScore().toFixed(4) + "\n" +
      //   text: "received: " + this.hitsReceivedScore().toFixed(4) + "\n" +
      //   "infliged: " + this.infligedDamageScore().toFixed(4) + "\n" +
      //   "distance: " + this.distanceToBaseScore().toFixed(4) + "\n" +
      //   "score: " + this.getScore().toFixed(4) + "\n"
      // });
      // this.debugger.debugTile(this.level.map, {tile:this.level.map.rectFromTile(this.cTilePos)});
      this.counter = 0.0;
      this.fire(base);
    }

    if (this.checkNewTile()) {
      this.turn(this.canTurn(this.cTilePos));
    }

    if (!base) {
      this.walk();
    }
  },
});
