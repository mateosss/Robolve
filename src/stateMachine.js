// TODO Class description

// COMBAK The functioning of state machines should be, you have the owner nodes
// which creates a statemachine in owner.sm property, and you should access states
// functions from owner.sm.function
// States should belong to statemachine not to node, and should affect directly the node
// Basically search for when you use a state function of a computer and add the .sm in between
var StateMachine = cc.Class.extend({
  owner: null, // The owner of the state machine
  cStates: null, // [] array with applied states, from older to newer
  states: null, // [] Automatically generated array, with all the STATES instances
  ctor: function(owner) {
    this.states = [];
    this.cStates = [];
    for (let i = 0; i < owner.STATES.length; i++) {
      this.states.push(new State(this, owner, owner.STATES[i]));
    }
    this.owner = owner;
  },
  getMainState: function() {
    return this.cStates[0];
  },
  getState: function(state) { // Gets a state from STATES by name
    if (typeof state === 'string') state = this.states.find(aState => aState.name == state);
    return state;
  },
  addState: function(state, extra) { // adds a state to cStates and starts it, expects a state or a string with its name, extra is an {}, adds everything that is in extra to state.local
    state = this.getState(state);
    if (!state) return cc.log("addState: State " + state + " doesn't exists for a " + this.owner.toString());
    _.concat(state.local, extra);
    state.start();
    return state;
  },
  removeState: function(state) { // removes a state from cStates and ends it, expects a state or a string with its name
    this.getState(state).end();
  },
  removeAllStates: function() {
    this.cStates.forEach((state) => state.end());
  },
  reanimateAllStates: function(state) {
    this.cStates.forEach(state => {
      if (state.animation) state.animation.call(this.owner, state);
    });
  },
  setState: function(state, extra) { // stops all states and add the provided one
    var preserve = this.getState(state);
    if (!preserve) return cc.log("setState: State " + state + " doesn't exists for a " + this.owner.toString());
    for (var i = this.cStates.length - 1; i >= 0; i--) {
      if (this.cStates[i] !== preserve) this.removeState(this.cStates[i]);
    }
    this.addState(preserve, extra);
  },
  setDefaultState: function() {
    this.setState(this.states[0]);
  },
  isInState: function(state) {
    return this.getState(state).active;
  },

  destroy: function() {
    this.states.forEach((s) => s.destroy());
  },
  toString: () => "StateMachine",
});
