// Global rb variable (stands for RoBolve), that saves global things
var rb = {
  global: window, // jshint ignore:line
  dev: { // Helper functions for use when debuggin on the browser
    stop: () => cc.director.getScheduler().unscheduleAll(),
    getLevel: () => cc.director.getRunningScene().children.find(c => c.toString() === "Level"),
    getHud: () => rb.dev.getLevel().hud,
    getRobots: () => rb.dev.getLevel().robots,
    getDefenses: () => rb.dev.getLevel().defenses,
    getCharacter: () => rb.dev.getLevel().character,
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
    addGold: amount => rb.dev.getHud().ig.addGold(amount)
  },

  animations: {
    robot: { attack: 6, walk: 8, still: 1 },
    defense: { idle: 12, attack: 12 , still: 1}
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
        postStart: function() { this.cleanTarget(); }
      },
      move: {
        name: 'move',
        everyFrame: function() {
          this.move();
        }
      },
      build: {
        name: 'build',
        schedule: [{
           callback: function(dt) {
             if (!this.target.sm.isInState('build')) this.sm.setDefaultState();
             else this.target.addBuilt(dt * 100 / this.sBuildTime);
           },
           interval: 0.5,
        }],
        beforeEnd: function() {
            this.cleanTarget();
        },
      },
      repair: {
        name: 'repair',
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
        schedule: [{
          callback: function(dt) {
            if (!this.target.sm.isInState('improve')) this.sm.setDefaultState();
            else this.target.addImproved(dt * 100 / this.sImproveTime);
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
        target: {
          target: null, // Attacking target
          charge: 0, // If full charge, attack
        },
        everyFrame: function(delta, state) {
          if (this.isTargetInRange()) {
            if (state.local.charge < 1 / this.sAttackSpeed) state.local.charge += delta;
            else {
              state.local.charge = 0.0;
              this.attack(state.local.target);
              if (state.local.target.sLife == 0) {
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

  items: {
    gold: new Item({
      name: "Gold",
      description: "Use this to buy things",
      image: r.items.gold,
      stackLimit: Infinity,
      consumable: false,
      equipable: false,
    }),
    electricCoin: new Item({
      name: "Electric Coin",
      description: "Use this to pay to EPEC",
      image: r.items.electricCoin,
      stackLimit: 5,
      consumable: false,
      equipable: false,
    }),
    fireCoin: new Item({
      name: "Fire Coin",
      description: "That's some hot cash right there",
      image: r.items.fireCoin,
      stackLimit: 5,
      consumable: false,
      equipable: false,
    }),
    waterCoin: new Item({
      name: "Water Coin",
      description: "Filled with the tear of your enemies",
      image: r.items.waterCoin,
      stackLimit: 5,
      consumable: false,
      equipable: false,
    }),




      sword: new Item({
        name: "Sword",
        description: "This is a family friendly sword",
        image: r.items.sword,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sDamage": +50
        }
      }),
      hammer: new Item({
        name: "Hammer",
        description: "A hammer to repair, not to destroy",
        image: r.items.hammer,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sImproveTime": -4
        }
      }),
      screwdriver: new Item({
        name: "Screwdriver",
        description: "A screwdriver, screw those drives!",
        image: r.items.screwdriver,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sRepairAmount": +100,
        }
      }),
      runner: new Item({
        name: "The Flash",
        description: "ZOOOM Zooooom! bojangles!",
        image: r.items.runner,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sSpeed": +8,
        }
      }),
      towerExpert: new Item({
        name: "Tower Expert",
        description: "Be a tower expert and start building right away",
        image: r.items.towerExpert,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sBuildTime": +8,
        }
      }),
      speedometer: new Item({
        name: "Speedometer",
        description: "Attack as if you were in a benny hill show",
        image: r.items.speedometer,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sAttackSpeed": +4,
        }
      }),
      briefcase: new Item({
        name: "Briefcase",
        description: "Beautiful leather portfolio with modern sewings",
        image: r.items.briefcase,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "inventory.capacity": +15,
        }
      }),
      twoSwords: new Item({
        name: "Two Swords",
        description: "Two f*ing swords, what else can you ask for",
        image: r.items.twoSwords,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sSpeed": +3,
          "sAttackSpeed": +1,
          "sDamage": +25,
        }
      }),
      bullseye: new Item({
        name: "Bullseye",
        description: "Put this on and those robots will be endangered",
        image: r.items.bullseye,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sDamage": +50,
          "sAttackSpeed": +2,
        }
      }),
      toolbox: new Item({
        name: "Toolbox",
        description: "Build and repair defenses like a maniac",
        image: r.items.toolbox,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sRepairAmount": +50,
          "sImproveTime": -2,
          "sBuildTime": -3,
        }
      }),
      medicalBag: new Item({
        name: "Medical Bag",
        description: "Be omnipreset for your lovely defenses",
        image: r.items.medicalBag,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sRepairAmount": +100,
          "sSpeed": +5,
        }
      }),
      campingEssentials: new Item({
        name: "Camping Essentials",
        description: "Be prepared for anything",
        image: r.items.campingEssentials,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "inventory.capacity": +5,
          "sSpeed": +3,
          "sDamage": +25,
        }
      }),
      coffee: new Item({
        name: "Coffee",
        description: "You will be a little accelerated",
        image: r.items.coffee,
        stackLimit: 1,
        consumable: false,
        equipable: true,
        mods: {
          "sBuildTime": -3,
          "sAttackSpeed": +2,
        }
      }),
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
};
