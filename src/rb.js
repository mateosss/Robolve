// Global rb variable (stands for RoBolve), that saves global things
var rb = {
  dev: {
    getLevel: () => cc.director.getRunningScene().children[0],
    getRobots: () => rb.dev.getLevel().robots,
    allRobots: (func) => rb.dev.getRobots().forEach(func),
    debugScoreRobot: (robot) => {
      robot.debug();
      robot.debugger.debugTile(robot.level.map, {stop: true});// TODO stop doesn't work
      robot.debugger.debugText(robot, {
        // text: "time: " + robot.livedTimeScore().toFixed(4) + "\n" +
        // text: "time: " + robot.firstHurtTimeScore().toFixed(4) + "\n" +
        text: "received: " + robot.hitsReceivedScore().toFixed(4) + "\n" +
        "infliged: " + robot.infligedDamageScore().toFixed(4) + "\n" +
        "distance: " + robot.distanceToBaseScore().toFixed(4) + "\n" +
        "score: " + robot.getScore().toFixed(4) + "\n"
      });
      robot.debugger.debugTile(robot.level.map, {tile:robot.level.map.rectFromTile(robot.cTilePos)});
    },
    debugAllRobotsScore: () => rb.dev.allRobots(rb.dev.debugScoreRobot),
  },
  animations: { "attack": 6, "walk": 8, "still": 1 },
  states: {
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
