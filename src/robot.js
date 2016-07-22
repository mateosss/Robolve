var Robot = cc.Sprite.extend({
  level: null, //Level where this object is placed
  pointing: 3, //Looking direction 0:North, 1:East, 2:South, 3:West
  animSpeed: 1.0, //Walk speed animation
  animAttackSpeed: 1.0, //Attack speed animation
  cLife: null, //Current Life
  cTilePos: cc.p(0, 0), //Current tile Position of the robot //TODO estoy hardcodeando esto
  creationTime: null,
  hitsReceived: 0,
  infligedDamage: 0,

  //Possible (p) stats //TODO definir valores reales //TODO apply fuzzy logic
  pTurnProb: {0: 0.25, 1: 0.5, 2: 0.9},
  pLife: {0: 300, 1: 400, 2: 500},
  pElement: {
    "electric": cc.color(255, 231, 0 ,255),
    "fire": cc.color(227, 43, 0, 255),
    "water": cc.color(1, 179, 255, 255)
  },
  pRange: {0: 75, 1: 150},
  pTerrain: {0: 'walk',1: 'fly'},
  pSpeed: {0: 0.2, 1: 0.5, 2: 1.0}, //TODO PORQUE?!?!?! velocidades 0.88 - 0.93 traen el bug (0,10) Y velocidad 0.1, hace que para linux y android tengan tambien el bug, pero el javascript si.
  pDamage: {0: 5, 1: 15, 2:20},
  pAttackSpeed: {0: 0.5, 1: 1.0, 2: 1.5},

  //Stats (s)
  sTurnProb: null,
  sLife: null,
  sRange: null,
  sSpeed: null,
  sDamage: null,
  sAttackSpeed: null,

  //Initial values
  turnProb: null,
  life: null,
  element: null,
  range: null,
  terrain: null,
  speed: null,
  damage: null,
  attackSpeed: null,

  //Part objects
  head: null,
  middle: null,
  armL: null,
  armR: null,
  legL: null,
  legR: null,

  ctor: function(level, dna, turnProb, life, element, range, terrain, speed, damage, attackSpeed) {
    // The constructor sets the level, creationTime, and all the initial stats,
    // after that it determines which sprites corresponds to every robot part and
    // it assembles the robot sprite by sprite. It also sets the real stats based
    // on the initial parameters
    //TODO que funcione el balanceo, poder hacer que un robot sea de tipo +1 y eso
    this._super(res.empty);

    this.setAnchorPoint(0.5, 0.0);
    this.level = level;
    this.creationTime = new Date().getTime();
    dna = dna || false;
    if (dna) {
      this.turnProb = dna[0];
      this.life = dna[1];
      this.element = dna[2];
      this.range = dna[3];
      this.terrain = dna[4];
      this.speed = dna[5];
      this.damage = dna[6];
      this.attackSpeed = dna[7];
    } else {
      this.turnProb = turnProb;
      this.life = life;
      this.element = element;
      this.range = range;
      this.terrain = terrain;
      this.speed = speed;
      this.damage = damage;
      this.attackSpeed = attackSpeed;
    }

    if (this.turnProb in this.pTurnProb) {
      this.sTurnProb = this.pTurnProb[this.turnProb];
    } else {
      this.sTurnProb = this.pTurnProb[0];
      cc.log("Turn Probability value incorrect, setting 0");
    }

    if (this.life in this.pLife) {
      this.middle = new Part(res.parts.middles[this.life]);
      this.sLife = this.pLife[this.life];
      this.cLife = this.sLife;
    } else {
      this.middle = new Part(res.invalidPart);
      this.sLife = this.pLife[0];
      this.cLife = this.sLife;
      cc.log("Life value incorrect, setting 0");
    }

    if (this.range in this.pRange) {
      this.armL = new Part(res.parts.arms[this.element + this.range + "L"]);
      this.armR = new Part(res.parts.arms[this.element + this.range + "R"]);
      this.sRange = this.pRange[this.range];
    } else {
      this.armL = new Part(res.invalidPart);
      this.armR = new Part(res.invalidPart);
      this.sRange = this.pRange[0];
      cc.log("Range value incorrect, setting 0");
    }

    if (this.terrain in this.pTerrain) {
      this.legL = new Part(res.parts.legs[this.pTerrain[this.terrain] + 'L']);
      this.legR = new Part(res.parts.legs[this.pTerrain[this.terrain] + 'R']);
    } else {
      this.legL = new Part(res.invalidPart);
      this.legR = new Part(res.invalidPart);
      cc.log("Terrain value incorrect");
    }

    if (this.speed in this.pSpeed) {
      this.sSpeed = this.pSpeed[this.speed];
      this.animSpeed = this.pSpeed[this.speed];
    } else {
      this.sSpeed = this.pSpeed[0];
      this.animSpeed = this.pSpeed[0];
      cc.log("Speed value incorrect, setting 0");
    }

    if (this.damage in this.pDamage) {
      this.sDamage = this.pDamage[this.damage];
      this.head = new Part(res.parts.heads[this.element + this.damage]);
    } else {
      this.sDamage = this.pDamage[0];
      this.head = new Part(res.invalidPart);
      cc.log("Damage value is incorrect, setting 0");
    }

    if (this.attackSpeed in this.pAttackSpeed) {
      this.sAttackSpeed = this.pAttackSpeed[this.attackSpeed];
    } else {
      this.sAttackSpeed = this.pAttackSpeed[0];
      cc.log("Attack Speed value incorrect, setting 0");
    }

    this.addChild(this.head, 2);
    this.addChild(this.middle, 1);
    this.addChild(this.armL, 3);
    this.addChild(this.armR, 0);
    this.addChild(this.legL, 0);
    this.addChild(this.legR, 0);

    this.createHealthBar();

    this.debug();

    this.scheduleUpdate();
  },
  toString: function() {
    return "Robot";
  },
  getDNA: function() {
    var dna = [
      this.turnProb,
      this.life,
      this.element,
      this.range,
      this.terrain,
      this.speed,
      this.damage,
      this.attackSpeed,
    ];
    return dna;
  },
  createHealthBar: function() { //TODO crear una buena health bar que sea independiente del tamaño del sprie
    //Creates two rectangles for representing the healtbar
    var originB = cc.p(-30, 0);
    var originF = cc.p(-28, 2);
    var destinationB = cc.p(30, 15);
    var destinationF = cc.p(28, 13);
    var fillColorB = cc.color(0, 0, 0, 255);
    var fillColorF = this.pElement[this.element];

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
    hpbar.setScaleX(this.cLife / this.sLife);
  },
  fire: function(target) {//TODO repetido en defensa hacer buena clase padre
    // This funcitons is executed when the robot attacks something
    if (target) {
      this.infligedDamage += target.hurt(this);
    }
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
      this.y >= this.level.map.getMidPointFromTile(currTilePos).y + (this.level.map.getTileSize().height / 2) - this.pSpeed[this.speed]) {//TODO no habia una solucion menos horrible?
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
  hurt: function(deffense) {
    // This function calculates the total damage of the received attack depending
    // on the deffense properties, and do some things in reaction
    //#TODO daño en funcion del elemento
    this.hitsReceived += 1;
    var elementMod = 1;
    if (this.element == "electric") {
      if (deffense.element == "electric") {elementMod = 1;}
      else if (deffense.element == "fire") {elementMod = 2;}
      else if (deffense.element == "water") {elementMod = 0.5;}
    }
    else if (this.element == "fire") {
      if (deffense.element == "electric") {elementMod = 0.5;}
      else if (deffense.element == "fire") {elementMod = 1;}
      else if (deffense.element == "water") {elementMod = 2;}
    }
    else if (this.element == "water") {
      if (deffense.element == "electric") {elementMod = 2;}
      else if (deffense.element == "fire") {elementMod = 0.5;}
      else if (deffense.element == "water") {elementMod = 1;}
    }

    this.cLife -= deffense.sDamage * elementMod;
    if (this.cLife <= 0) {
      this.cLife = 0;
      this.die();
    }
    this.updateHealthBar();
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
    var maxHits = this.pLife[2] / (new Deffense().pDamage[0] * 0.5);
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
    if (this.counter < this.sAttackSpeed) {
      this.counter += delta;
    } else {
      this.counter = 0.0;
      this.fire(base);
    }

    if (this.checkNewTile()) {
      // this.debugger.debugTile(this.level.map, {stop: true});// TODO stop doesn't work
      this.debugger.debugText(this, {
        // text: "time: " + this.livedTimeScore().toFixed(4) + "\n" +
        // text: "time: " + this.firstHurtTimeScore().toFixed(4) + "\n" +
        text: "time: " + this.hitsReceivedScore().toFixed(4) + "\n" +
        "damage: " + this.infligedDamageScore().toFixed(4) + "\n" +
        "distance: " + this.distanceToBaseScore().toFixed(4) + "\n" +
        "score: " + this.getScore().toFixed(4) + "\n"
      });
      this.debugger.debugTile(this.level.map, {tile:this.level.map.rectFromTile(this.cTilePos)});
      this.turn(this.canTurn(this.cTilePos));
    }

    if (!base) {
      this.walk();
    }
  },
});

var Part = cc.Sprite.extend({
  ctor:function(partImage) {
    this._super(partImage);
    this.setAnchorPoint(0.5, 0.1);
  },
  toString: function() {
    return "Part";
  },
});
