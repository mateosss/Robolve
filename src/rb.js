// Global rb variable (stands for RoBolve), that saves global things
var rb = {

  dev: { // Helper functions for use when debuggin on the browser
    getLevel: () => cc.director.getRunningScene().children[0],
    getRobots: () => rb.dev.getLevel().robots,
    getDefenses: () => rb.dev.getLevel().defenses,
    getRobot: () => rb.dev.getRobots()[0],
    getDefense: () => rb.dev.getDefenses()[0],
    allRobots: (func) => rb.dev.getRobots().forEach(func),
    allDefenses: (func) => rb.dev.getDefenses().forEach(func),

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

  animations: { attack: 6, walk: 8, still: 1, idle: 1 },
  palette: {
    electric: cc.color(255, 231, 0 ,255),
    fire: cc.color(227, 43, 0, 255),
    water: cc.color(1, 179, 255, 255)
  },
  states: {
    defense: {
      idle: {
        name: 'idle',
        postStart: function() { this.setAnimation('idle'); }
      }
    },
    robot: {
      still: {
        name: 'still',
        props: { sSpeed: 0 },
        postStart: function(s) {
          s.local.prevAnim = this.cAnimation;
          this.setAnimation('still');
        },
        beforeEnd: function(s) { this.setAnimation(s.local.prevAnim); },
      },
      walk: {
        name: 'walk',
        postStart: function() { this.setAnimation('walk', (1 / 16) / this.sSpeed); },
        everyFrame: function() {
          if (this.checkNewTile()) this.turn(this.canTurn(this.cTilePos));
          this.walk();
        }
      },
      attack: {
        name: 'attack',
        postStart: function() { this.setAnimation('attack', 1 / (this.sAttackSpeed * 6)); },
        everyFrame: function(delta, state) {
          if (this.counter < 1 / this.sAttackSpeed) this.counter += delta;
          else {
            this.counter = 0.0;
            this.fire(state.local.base);
          }
        }
      },
    }
  },
};
