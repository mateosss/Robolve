// This class is the base class of the robots and defenses, main functionalities
// Of this class are: DNA, STATS, PARTS, STATES, read below for further information on each

// TODO IF NEEDED - Computer is using states like attack and die, that shouldn't be needed for every computer
// maybe there could be other sprites with parts that doesn't necessarily battle
// the solution would be to make a new class called BattleComputer that requires those two states and the hurt/die/attack/etc methods

var Computer = cc.Sprite.extend({
  level: null, // Level where this object is placed
  pointing: 2, // Looking direction 0:North, 1:East, 2:South, 3:West
  cAnimation: null, // Current cc.Action being played
  cTilePos: cc.p(0, 0), // Current tile Position of the robot // TODO estoy hardcodeando esto
  sm: null, // The computer state machine
  creationTime: null,
  hitsReceived: 0,
  infligedDamage: 0,
  mapHeght: 0, // Used in zIndex calculation
  DEBUG: false, // Set to true for executing the debug function
  // STATS constant defines the structure of this Robot based class
  // Take into account that if for example turnProb is in STATS, the properties
  // turnProb and sTurnProb will be created directly on the object, with
  // turnProb having the gene, and sTurnProb the current real stat the robot
  // is having that can be modified and resetted by setDefaultStat
  STATS: null, // Map that contains the stats of this computer and its possibilities, see Robot class
  PARTS: null, // Object that contains the parts, and part options of this computer, see Robot class
  STATES: null, // Possible states for this robot from rb.states, see Robot class
  ctor: function(level, dna) {
    // Can be used by sending a dna array, with corresponding values for every property
    // or by sending every property individually after a false dna
    // The constructor sets the level, creationTime, and all the initial stats,
    // after that it determines which sprites corresponds to every computer part and
    // it assembles the computer sprite by sprite. It also sets the real stats based
    // on the initial parameters
    this._super();
    this.setAnchorPoint(0.5, 0.0);
    this.setCascadeColorEnabled(true);
    this.setCascadeOpacityEnabled(true);
    this.level = level;
    this.creationTime = new Date().getTime();
    this.mapHeight = level.map.height;

    dna = typeof dna === 'object' ? dna : Array.prototype.slice.call(arguments, 1);
    for (let i = 0; i < this.STATS.size; i++) {
      this[this.STATS.getki(i)] = dna[i];
    }

    this.sm = new StateMachine(this);

    this.factoryReset();
  },

  // Stat section
  resetStats: function() { // sets the initial value to all stats in sStats
    this.STATS.forEach((possibles, stat) => {this.setDefaultStat(stat);});
  },
  getStat: function(stat) {
    return this['s' + _.capitalize(stat)];
  },
  setStat: function(stat, value) {
    this['s' + _.capitalize(stat)] = value;
  },
  changeStat: function(stat, newValue) { // sets a new stat maintaining the proportion that existed between the sStat and the default stat before the change, also updates the sprite parts
    var sProportion = (this.getStat(stat) / this.getDefaultStat(stat));
    this[stat] = newValue;
    var newStatValueProportioned = sProportion * this.getDefaultStat(stat);
    this.setStat(stat, newStatValueProportioned);
    this.assembleParts();
    this.sm.reanimateAllStates();
    return newStatValueProportioned;
  },
  getDefaultStat: function(stat) { // Returns the original stat
    return this.STATS.get(stat)[this[stat]];
  },
  setDefaultStat: function(stat) { // Provide an stat name or stat index to reset it, to the default given by the genes
    this.setStat(stat, this.getDefaultStat(stat));
  },
  getPossibleStats: function(stat) { // Returns the possible values that a stat can have
    return this.STATS.get(stat);
  },
  getDNA: function() {
    var dna = [];
    this.STATS.forEach((possibles, stat) => {dna.push(this[stat]);});
    return dna;
  },

  // Part section
  assembleParts: function() {
    // Creates all the parts and adds them as children
    this.getParts().forEach((part) => part.parent.removeChild(part));
    Object.keys(this.PARTS).forEach(part => {
      this[part] = new Part(this, part);
      this.addPart(this[part]);
    });
  },
  getParts: function() { // Return all Part objects from which the robot is made
    var parts = [];
    for (var part in this.PARTS) {
      if (this[part]) parts.push(this[part]);
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

  // General section
  factoryReset: function(soft) {
    this.assembleParts();
    if (!soft) {
      this.resetStats();
    }
    // TODO this two lines will bring problems because we are using factoryReset when changing stats,
    // and changing stats should not clean all states, removeAllStates and setState
    // should be inside the if (!soft) statement, and changing stats should PAUSE all
    // states and resume them, for that there should be a way of pausing states
    this.sm.removeAllStates();
    this.sm.setDefaultState();

    this.createHealthBar();
    if (this.DEBUG) this.debug();
  },
  toString: function() {
    return "Computer";
  },
  toStringP: function() { // Plural to string: if Computer -> computers,  used for getting parts sprites in Part
    return this.toString().toLowerCase() + "s";
  },
  getTarget: function() {
    // Override this method, see examples in class Robot or Defense
  },
  createHealthBar: function() { //TODO crear una buena health bar que sea independiente del tamaño del sprie
    //Creates two rectangles for representing the healtbar
    var old_back = this.getChildByName("hpbarback");
    if (old_back) {
      var old_front = this.getChildByName("hpbar");
      old_back.removeFromParent();
      old_front.removeFromParent();
    }

    var originB = cc.p(-30, 0);
    var originF = cc.p(-28, 2);
    var destinationB = cc.p(30, 15);
    var destinationF = cc.p(28, 13);
    var fillColorB = cc.color(0, 0, 0, 255);
    var fillColorF = rb.palette[this.element];

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
    back.setName("hpbarback");
    front.setName("hpbar");
    this.addChild(back, 10);
    this.addChild(front, 11);
    this.updateHealthBar();
  },
  updateHealthBar: function() {
    // Updates the healthbar length with the sLife stat
    var hpbar = this.getChildByName("hpbar");
    hpbar.setScaleX(this.sLife / this.getDefaultStat('life'));
  },
  attack: function(target) {
    // This funcitons is executed when the robot attacks something
    if (target) this.infligedDamage += target.hurt(this);
  },
  getDistanceTo: function(target) { return cc.pDistance(this, target); },
  checkNewTile: function() {
    // This function is executed every frame by the walk state to check if the
    // robot is on a new tile, and refresh this.cTilePos to represent it.
    //TODO esto es horrible alguien haga algo al respecto!!!!
    var currTilePos = this.level.map.tileCoordFromChild(this);
    if (this.cTilePos && !cc.pointEqualToPoint(currTilePos, this.cTilePos)) {
      if (!(this.canTurn(currTilePos) !== false &&
      [0,3].indexOf(this.pointing) != -1) ||
      this.y >= this.level.map.getMidPointFromTile(currTilePos).y + (this.level.map.getTileSize().height / 2) - this.getPossibleStats('speed')[this.speed]) {//TODO no habia una solucion menos horrible?
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

    var xDirection;
    var yDirection;

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
    this.zIndex = this.x + (this.mapHeight - this.y) * 128; // Same as this.refreshZOrder, made here for performance // TODO DRY Map.zOrderFromPos
  },
  refreshZOrder: function() {
    this.zIndex = TiledMap.prototype.zOrderFromPos(this);
  },
  getCustomBoundingBoxToWorld: function() {
    let rect = this.getBoundingBoxToWorld();
    let scaleh = 0.75;
    let scalew = 0.4;
    let w = rect.width;
    let h = rect.height;
    rect.width *= scalew;
    rect.height *= scaleh;
    rect.x += w * (1 - scalew) / 2;
    rect.y += h * (1 - scaleh) / 2;
    return rect;
  },
  hurt: function(attacker) {
    // This function calculates the total damage of the received attack depending
    // on the attacker properties, and does some things in reaction
    // It must return the total damage applied
    this.hitsReceived += 1;
    let ratio = 1;
    if (this.element && attacker.element) { // Apply difference if elements are present
      let mod = (a, m) => a < 0 ? m + a % m : a % m;
      let elements = ["electric", "fire", "water"];
      // ratios = [attacker == this, atacker > this, atacker < this]
      let ratios = [1, 2, 0.5];
      ratio = ratios[mod(elements.indexOf(attacker.element) - elements.indexOf(this.element), elements.length)];
    }
    var totalDamage = attacker.sDamage * ratio;
    this.sLife -= totalDamage;
    if (this.sLife <= 0) {
      this.sLife = 0;
      this.die();
    } else {
      this.updateHealthBar();
    }
    return totalDamage;
  },
  destroy: function() { // Properly kills the computer from memory
    var computers = this.level[this.toStringP()];
    var i = computers.indexOf(this);
    if (i != -1) {
      this.sm.destroy();
      this.removeFromParent();
      this.release();
      computers.splice(i, 1);
    }
    return true;
  },
  isDead: function() {
    return this.sLife === 0;
  },
  die: function() {
    // Sets the die state that will reproduce some animations and then kill the computer
    this.sLife = 0;
    this.sm.setState('die');
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
    // Returns a float, being 0 == died with 0 hits, and 1 == died in the amount of hits a weak water tower would kill a strong electric robot
    let maxHits = this.getPossibleStats('life')[2] / (_.props(Defense).STATS.get('damage')[0] * 0.5);
    let hitsReceived = this.hitsReceived;
    let score =  hitsReceived / maxHits;
    return score;
  },
  infligedDamageScore: function() {
    // Returns a float, being 0.0 == 0 damage, 1.0 == the best life of a turret or more
    let maxDamage = _.last(Object.values(Defense.prototype.STATS.get("life")));
    let damage = this.infligedDamage;
    let score = damage >= maxDamage ? 1 : damage / maxDamage;
    return score;
  },
  distanceToBaseScore: function() {
    // Returns a float, being 0.0 == more than maxDistance, 1.0 == 0 distance
    let maxDistance = 2000;
    let distance = Math.floor(this.getDistanceTo(this.level.base));
    let score = distance >= maxDistance ? 0 : 1 - ((1.0 / maxDistance) * distance);
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
});
