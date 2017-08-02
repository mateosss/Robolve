// Global rb variable (stands for RoBolve), that saves global things
var rb = {

  dev: { // Helper functions for use when debuggin on the browser
    getLevel: () => cc.director.getRunningScene().children.find(c => c.toString() === "Level"),
    getRobots: () => rb.dev.getLevel().robots,
    getDefenses: () => rb.dev.getLevel().defenses,
    getRobot: () => rb.dev.getRobots()[0],
    getDefense: () => rb.dev.getDefenses()[0],
    allRobots: (func) => rb.dev.getRobots().forEach(func),
    allDefenses: (func) => rb.dev.getDefenses().forEach(func),
    killRobots: (notKill) => rb.dev.getRobots().slice(notKill).forEach((r) => r.die()),
    killDefenses: (notKill) => rb.dev.getDefenses().slice(notKill).forEach((d) => d.die()),
    stateRobots: (state) => rb.dev.allRobots((r) => r.setState(state)),
    stateDefenses: (state) => rb.dev.allDefenses((d) => d.setState(state)),
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
  states: {
    defense: {
      still: {
        name: 'still',
        animation: function() { this.setAnimation('still'); }
      },
      idle: {
        name: 'idle',
        postStart: function() { this.setAnimation('idle', 1 / (8 * this.sAttackSpeed)); }
      },
      attack: {
        name: 'attack',
        animation: function() { this.setAnimation('attack', 1 / (this.sAttackSpeed * 12)); },
        everyFrame: function(delta, state) {
          if (this.counter < 1 / this.sAttackSpeed) this.counter += delta;
          else {
            this.counter = 0.0;
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
        animation: function() { this.setAnimation('attack', 1 / (this.sAttackSpeed * 6)); },
        everyFrame: function(delta, state) {
          if (this.counter < 1 / this.sAttackSpeed) this.counter += delta;
          else {
            this.counter = 0.0;
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
    }
  },
};
