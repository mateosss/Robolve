// Global rb variable (stands for RoBolve), that saves global things
var rb = {
  global: window, // jshint ignore:line
  dev: { // Helper functions for use when debuggin on the browser
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
    createDefense: 300,
    increaseStat: 100,
    decreaseStat: 100,
    // Gain
    destroyDefense: 50,
    killRobot: 30,
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
          var message = new cc.CallFunc(function(){ hud.it.message("Turret destroyed"); });
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
};
