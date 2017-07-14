// Global rb variable (stands for RoBolve), that saves global things
var rb = {
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
        postStart: function() { this.setAnimation('walk', (1 / 16) / this.sSpeed); }
        // TODO make everyframe to check what move needs instead of the update on robot
      },
      attack: {
        name: 'attack',
        postStart: function() { this.setAnimation('attack', 1 / (this.sAttackSpeed * 6)); },
        lifespan: 3
        // TODO make everyframe to check what attack needs instead of the update on robot
      },
    }
  },
};
