// Global rb variable (stands for RoBolve), that saves global things
var rb = {
  global: window, // jshint ignore:line
  dev: { // Helper functions for use when debuggin on the browser
    resizeView: () => cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL),
    stop: () => cc.director.getScheduler().unscheduleAll(),
    getLevel: () => cc.director.getRunningScene().children.find(c => c.toString() === "Level"),
    getHud: () => rb.dev.getLevel().hud,
    getRobots: () => rb.dev.getLevel().robots,
    getDefenses: () => rb.dev.getLevel().defenses,
    getCharacter: () => rb.dev.getLevel().character,
    spawnAll: () => {
      let level = rb.dev.getLevel();
      _.revEach(level.waveQuery, (r, i, q) => level.addRobot(q.pop()));
    },
    getBase: () => rb.dev.getLevel().base,
    getRobot: () => rb.dev.getRobots()[0],
    getDefense: () => rb.dev.getDefenses()[0],
    allRobots: (func) => rb.dev.getRobots().forEach(func),
    allDefenses: (func) => rb.dev.getDefenses().forEach(func),
    killRobots: (notKill) => rb.dev.getRobots().slice(notKill).forEach((r) => r.die()),
    killDefenses: (notKill) => rb.dev.getDefenses().slice(notKill).forEach((d) => d.die()),
    stateRobots: (state) => rb.dev.allRobots((r) => r.sm.setState(state)),
    stateDefenses: (state) => rb.dev.allDefenses((d) => d.sm.setState(state)),
    debugScoreRobot: function() {
      if (!this.debugger) this.debug();
      this.debugger.debugTile(this.level.map, { stop: true });// TODO stop doesn't work
      this.debugger.debugText(this, {
        // text: "time: " + this.livedTimeScore().toFixed(4) + "\n" +
        // text: "time: " + this.firstHurtTimeScore().toFixed(4) + "\n" +
        text: "received: " + this.hitsReceivedScore().toFixed(4) + "\n" +
        "infliged: " + this.infligedDamageScore().toFixed(4) + "\n" +
        "distance: " + this.distanceToBaseScore().toFixed(4) + "\n" +
        "score: " + this.getScore().toFixed(4) + "\n"
      });
      this.debugger.debugTile(this.level.map, {tile:this.level.map.rectFromTile(this.cTilePos)});
    },
    debugAllRobotsScore: (i) => rb.dev.allRobots((r) => r.schedule(rb.dev.debugScoreRobot, isNaN(i) ? 0.5 : i)),
    addGold: amount => rb.dev.getHud().ig.addGold(amount),
    addItem: (name, amount) => rb.dev.getCharacter().inventory.addItem(rb.items[name], amount || 1),
  },

  animations: {
    robot: { attack: 6, walk: 8, still: 1 },
    defense: { idle: 12, attack: 12 , still: 1},
    character: { still: 16, walk: 16, run: 16, build: 16, attack: 16 },
  },

  palette: {
    electric: cc.color(255, 231, 0 ,255),
    fire: cc.color(227, 43, 0, 255),
    water: cc.color(1, 179, 255, 255)
  },

  prices: {
    // Spend
    createDefense: 700,
    increaseStat: 100,
    decreaseStat: 100, // TODO not used
    // Gain
    initialGold: 1500,
    sellItem: 350,
    sellCoinMax: 150,
    destroyDefense: 350,
    killRobot: 50,
  },

  states: {
    defense: {
      still: {
        name: 'still',
        animation: function() { this.setAnimation('still'); }
      },
      idle: {
        name: 'idle',
        animation: function() { this.setAnimation('idle', 1 / (8 * this.sAttackSpeed)); }
      },
      attack: {
        name: 'attack',
        target: {
          target: null, // Attacking target
          charge: 0, // If full charge, attack
        },
        animation: function() { this.setAnimation('attack', 1 / (this.sAttackSpeed * 12)); },
        everyFrame: function(delta, state) {
          if (state.local.charge < 1 / this.sAttackSpeed) state.local.charge += delta;
          else {
            state.local.charge = 0.0;
            this.attack(state.local.target);
          }
        }
      },
      die: {
        name: 'die',
        postStart: function() {
          var hud = this.level.hud;
          var burn = new cc.TintTo(0.2, 0, 0, 0);
          var disappear = new cc.FadeOut(0.2);
          var message = new cc.CallFunc(function(){ hud.it.message("You can't simply destroy a piece of art like that"); });
          var destroy = new cc.CallFunc(function(){ this.destroy(); }, this);
          var actArray = [burn, disappear, message, destroy];
          this.runAction(new cc.Sequence(actArray));
        }
      },
      build: {
        name: 'build',
        animation: function() { this.setAnimation('still'); },
        postStart: function() {

        }
      },
      repair: {
        name: 'repair',
        animation: function() { this.setAnimation('still'); },
        postStart: function(state) {
          this.showBuildBar("Repairing", state.local.initialRepair);
        }
      },
      improve: {
        name: 'improve',
        animation: function() { this.setAnimation('still'); },
        postStart: function() {
          this.resetImproved();
          this.showBuildBar("Improving");
        }
      },
    },
    robot: {
      still: {
        name: 'still',
        props: { sSpeed: 0 },
        animation: function() { this.setAnimation('still'); }
      },
      walk: {
        name: 'walk',
        animation: function() { this.setAnimation('walk', (1 / 16) / this.sSpeed); },
        everyFrame: function() {
          if (this.checkNewTile()) this.turn(this.canTurn(this.cTilePos));
          this.walk();
        }
      },
      attack: {
        name: 'attack',
        target: {
          target: null, // Attacking target
          charge: 0, // If full charge, attack
        },
        animation: function() { this.setAnimation('attack', 1 / (this.sAttackSpeed * 6)); },
        everyFrame: function(delta, state) {
          if (state.local.charge < 1 / this.sAttackSpeed) state.local.charge += delta;
          else {
            state.local.charge = 0.0;
            this.attack(state.local.target);
          }
        }
      },
      die: {
        name: 'die',
        postStart: function() {
          var hud = this.level.hud;
          var burn = new cc.TintTo(0.2, 0, 0, 0);
          var disappear = new cc.FadeOut(0.2);
          var destroy = new cc.CallFunc(function(){ this.destroy(); }, this);
          var actArray = [burn, disappear, destroy];
          this.runAction(new cc.Sequence(actArray));
        }
      },
    },
    character: {
      still: {
        name: 'still',
        animation: function() { this.setAnimation("still"); },
        postStart: function() { this.cleanTarget(); }
      },
      move: {
        name: 'move',
        animation: function() { this.setAnimation(this.canRun() ? "run" : "walk"); },
        everyFrame: function() {
          this.move();
        }
      },
      build: {
        name: 'build',
        animation: function() { this.setAnimation("build", (this.sBuildTime || 1) * (1 / 16) / Character.prototype.sBuildTime); }, // The prototype says the base sBuildTime of a character
        schedule: [{
           callback: function(dt) {
             if (!this.target.sm.isInState('build')) this.sm.setDefaultState();
             else this.target.addBuilt(dt * 100 / _.max(this.sBuildTime, 0));
           },
           interval: 0.5,
        }],
        beforeEnd: function() {
            this.cleanTarget();
        },
      },
      repair: {
        name: 'repair',
        animation: function() { this.setAnimation("build",  Character.prototype.sRepairAmount * (1 / 16) / (this.sRepairAmount || 1)); }, // The prototype says the base sRepairAmount of a character
        schedule: [{
           callback: function(dt) {
             if (!this.target.sm.isInState('repair')) this.sm.setDefaultState();
             else this.target.addRepaired(this.sRepairAmount / 2); // TODO: Divided by two because of the refresh interval of 0.5, a little hardcoded
           },
           interval: 0.5,
        }],
        postStart: function() {
          this.target.sm.setState('repair', { initialRepair: this.target.getLifePercentage() });
        },
        beforeEnd: function() {
          this.target.sm.setState('idle');
          this.target.hideBuildBar();
          this.cleanTarget();
        },
      },
      improve: {
        name: 'improve',
        animation: function() { this.setAnimation("build", (this.sImproveTime || 1) * (1 / 16) / Character.prototype.sImproveTime); }, // The prototype says the base sImproveTime of a character
        schedule: [{
          callback: function(dt) {
            if (!this.target.sm.isInState('improve')) this.sm.setDefaultState();
            else this.target.addImproved(dt * 100 / _.max(this.sImproveTime, 0));
          },
          interval: 0.5,
        }],
        postStart: function() {

        },
        beforeEnd: function() {
          this.cleanTarget();
        },
      },
      attack: {
        name: 'attack',
        animation: function() { this.setAnimation("attack", 1 / (this.sAttackSpeed * 16)); },
        target: { // This is not a used object, just a representation of the used `state.local` properties
          target: null, // Attacking target
          charge: 0, // If full charge, attack
        },
        everyFrame: function(delta, state) {
          if (this.isTargetInRange()) {
            if (state.local.charge < 1 / this.sAttackSpeed) state.local.charge += delta;
            else {
              state.local.charge = 0.0;
              this.attack(state.local.target);
              if (state.local.target.isDead()) {
                let newTarget = this.getNewTarget();
                if (newTarget) {
                  this.setTarget(newTarget);
                  this.sm.setState('move');
                } else {
                  this.sm.setDefaultState();
                  this.cleanTarget();
                }
              }
            }
          } else {
            this.sm.setState('move');
          }
        },
      },
    }
  },

  characterStats: { // Character stats and needed values // TODO This should be here or in Character class? also it is not being used in some required places as in CharacaterSheet
    "sSpeed": {
      name: "Speed",
      description: "Movement speed",
      unitDescription: "In units per second",
      unit: " U/sec",
      unitRightZeros: 0,
    },
    "sBuildRange": {
      name: "Build Range",
      description: "The range in which the characater can build things around him",
      unitDescription: "In units round",
      unit: " U",
      unitRightZeros: 0,
    },
    "sBuildTime": {
      name: "Build Time",
      description: "The time it takes the player to build a defense",
      unitDescription: "In seconds per new defense",
      unit: " sec",
      unitRightZeros: 2,
    },
    "sImproveTime": {
      name: "Improve Time",
      description: "The time it takes the player to make a defense improvement",
      unitDescription: "In seconds per improvement",
      unit: " sec",
      unitRightZeros: 2,
    },
    "sRepairAmount": {
      name: "Repair Amount",
      description: "The amount of hp the player restores to a defense",
      unitDescription: "Defense HP repaired per second",
      unit: " HP/sec",
      unitRightZeros: 0,
    },
    "sAttackRange": {
      name: "Attack Range",
      description: "The range in which the player can start hitting enemies",
      unitDescription: "In units round",
      unit: " U",
      unitRightZeros: 0,
    },
    "sAttackSpeed": {
      name: "Attack Speed",
      description: "The amount of hits a player can give to an enemy in a second",
      unitDescription: "Amount of hits per second",
      unit: "/sec",
      unitRightZeros: 2,
    },
    "sDamage": {
      name: "Damage",
      description: "The damage a player inflicts to an enemy per hit",
      unitDescription: "Damage per hit",
      unit: "/hit",
      unitRightZeros: 0,
    },
    "inventory.capacity": {
      name: "Capacity",
      description: "The amount of items the player can carry in its inventory",
      unitDescription: "Slots",
      unit: "slots",
      unitRightZeros: 0,
    },
  },

  items: {
    gold: new Item({
      id: "gold", // the same as the item key
      name: "Gold", // Name to show in the UI
      category: "gold", // Category of the item, currently: gold | coin | unique
      description: "Use this to buy things", // Description to show in the UI
      image: r.items.gold, // Image of the item
      stackLimit: Infinity, // Limit of the stack for this item
      equipable: false,
    }),

    electricCoin: new Item({
      id: "electricCoin",
      name: "Electric Coin",
      category: "coin",
      description: "Sells best if you have many electric defenses",
      image: r.items.electricCoin,
      stackLimit: 5,
      equipable: false,
    }),
    fireCoin: new Item({
      id: "fireCoin",
      name: "Fire Coin",
      category: "coin",
      description: "Sells best if you have many fire defenses",
      image: r.items.fireCoin,
      stackLimit: 5,
      equipable: false,
    }),
    waterCoin: new Item({
      id: "waterCoin",
      name: "Water Coin",
      category: "coin",
      description: "Sells best if you have many water defenses",
      image: r.items.waterCoin,
      stackLimit: 5,
      equipable: false,
    }),

    sword: new Item({
      id: "sword",
      name: "Sword",
      category: "unique",
      description: "This is a family friendly sword",
      image: r.items.sword,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sDamage": +50
      }
    }),
    hammer: new Item({
      id: "hammer",
      name: "Hammer",
      category: "unique",
      description: "A hammer to repair, not to destroy",
      image: r.items.hammer,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sImproveTime": -4
      }
    }),
    screwdriver: new Item({
      id: "screwdriver",
      name: "Screwdriver",
      category: "unique",
      description: "A screwdriver, screw those drives!",
      image: r.items.screwdriver,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sRepairAmount": +400,
      }
    }),
    runner: new Item({
      id: "runner",
      name: "The Flash",
      category: "unique",
      description: "ZOOOM Zooooom! bojangles!",
      image: r.items.runner,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sSpeed": +8,
      }
    }),
    towerExpert: new Item({
      id: "towerExpert",
      name: "Tower Expert",
      category: "unique",
      description: "Be a tower expert and build right away",
      image: r.items.towerExpert,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sBuildTime": -8,
      }
    }),
    speedometer: new Item({
      id: "speedometer",
      name: "Speedometer",
      category: "unique",
      description: "Attack as if you were in a benny hill show",
      image: r.items.speedometer,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sAttackSpeed": +4,
      }
    }),
    briefcase: new Item({
      id: "briefcase",
      name: "Briefcase",
      category: "unique",
      description: "Leather portfolio with modern sewings",
      image: r.items.briefcase,
      stackLimit: 1,
      equipable: true,
      mods: {
        "inventory.capacity": +15,
      }
    }),
    twoSwords: new Item({
      id: "twoSwords",
      name: "Two Swords",
      category: "unique",
      description: "Two f*ing swords, what else can you ask for",
      image: r.items.twoSwords,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sSpeed": +3,
        "sAttackSpeed": +1,
        "sDamage": +25,
      }
    }),
    bullseye: new Item({
      id: "bullseye",
      name: "Bullseye",
      category: "unique",
      description: "The training of a bull in your eyes",
      image: r.items.bullseye,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sDamage": +50,
        "sAttackSpeed": +2,
      }
    }),
    toolbox: new Item({
      id: "toolbox",
      name: "Toolbox",
      category: "unique",
      description: "Build and repair defenses like a maniac",
      image: r.items.toolbox,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sRepairAmount": +200,
        "sImproveTime": -2,
        "sBuildTime": -3,
      }
    }),
    medicalBag: new Item({
      id: "medicalBag",
      name: "Medical Bag",
      category: "unique",
      description: "Be omnipreset for your lovely defenses",
      image: r.items.medicalBag,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sRepairAmount": +300,
        "sSpeed": +5,
      }
    }),
    campingEssentials: new Item({
      id: "campingEssentials",
      name: "Camping Essentials",
      category: "unique",
      description: "Be prepared for anything",
      image: r.items.campingEssentials,
      stackLimit: 1,
      equipable: true,
      mods: {
        "inventory.capacity": +5,
        "sSpeed": +3,
        "sDamage": +25,
      }
    }),
    coffee: new Item({
      id: "coffee",
      name: "Coffee",
      category: "unique",
      description: "You will be a little accelerated",
      image: r.items.coffee,
      stackLimit: 1,
      equipable: true,
      mods: {
        "sBuildTime": -3,
        "sAttackSpeed": +2,
      }
    }),
  },
};
