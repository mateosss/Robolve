// A state simulates a state of a robot which consist in basically changing properties
// and executing things on the robot when the states initiates / every frame / when the states ends
// every property that should be changed and reseted to its previous state should be passed
// through newProps object, with the name of the property and the new value, the state
// will automatically backup the previous values, and restore them on .end() execution
// If more customization needed you can use the postStart, everyFrame and beforeEnd
// functions, be sure to let everything as you wish before ending the node

// Possible TODO, do it only if needed
// options.delay, delay before starting the state
// options.schedule list, use parent.schedule to execute something with lots of options
//    use http://www.cocos2d-x.org/docs/api-ref/js/v3x/symbols/cc.Node.html#schedule with the exact same parameters


var State = cc.Node.extend({
  name: null, // name of the state i.e. 'walk'
  newProps: null, // {} an object with property name to change and new value, i.e. {sSpeed: 0}
  oldProps: null, // {} will backup the old properties on start
  local: null, // {} use this to save variables through state moments
  timeToEnd: null, // put a number here for finishing the event after that amount of seconds

  // Flow control variables
  first: true, // false when it was executed at least once
  active: false, // true when the state has started but not ended yet
  ended: false, // true when the state has ended

  // These three functions (state moments) will be provided with the state parent as the this
  // and the first argument as the state (second on everyFrame)
  // you can use the local property from state provided in the first argument to store variables
  postStart: null, // executed inmediately after start
  everyFrame: null, // executed every frame (if present, a scheduleUpdate() will be made), first argument is deltatime
  beforeEnd: null, // executed just before exit

  lifespan: 0, // amount of seconds the event should last until it finish itself


  ctor: function(options) {
    this._super();
    this.newProps = options.props || {};
    this.name = options.name;
    this.postStart = options.postStart;
    this.everyFrame = options.everyFrame;
    this.beforeEnd = options.beforeEnd;
    this.lifespan = options.lifespan;
  },
  start: function(parent) {
    // The states checks it is already active, if thats the case, exit
    if (this.active) return;
    // 1. The states adds itself to the cStates of the parent
    parent.cStates.push(this);
    parent.addChild(this);
    // 2. Initializations and the properties of the parent that are in new Props
    // are backed up in oldProps, and are replaced with the new
    this.oldProps = {};
    this.local = {};
    for (var prop in this.newProps) {
      this.oldProps[prop] = parent[prop];
      parent[prop] = this.newProps[prop];
    }
    // 3. If postStart was given, then call it
    if (this.postStart) this.postStart.call(parent, this);
    // 4. If everyFrame was given, then scheduleUpdate
    if (this.everyFrame || this.lifespan) this.scheduleUpdate();
    // 5. If lifespan was given, increase set timeToEnd value
    if (this.lifespan) this.timeToEnd = this.lifespan;
    // 6. mark that this is at least the first run
    this.first = false;
    // 7. mark that this state is now active because it hasn't ended yet (just started)
    this.active = true;
  },
  end: function() {
    // -6. Check if beforeEnd was given, then call it
    if (this.beforeEnd) this.beforeEnd.call(this.parent, this);
    // -5. Place the backuped properties again on the parent
    for (var prop in this.oldProps) this.parent[prop] = this.oldProps[prop];
    // -4. Be sure to unscheduleUpdate, we don't want this to be running anymore
    this.unscheduleUpdate();
    // -3. the state removes itself from the parent cStates and is removed from the parent
    this.parent.cStates.splice(this.parent.cStates.findIndex(aState => aState === this), 1);
    this.parent.removeChild(this);
    // -2. Mark that this state is not active anymore
    this.active = false;
    // -1. Mark that this state is now ended
    this.ended = true;
  },
  update: function(dt) {
    if (this.everyFrame) this.everyFrame.call(this.parent, dt, this);
    if (this.lifespan) this.timeToEnd -= dt; console.log("lifespan");
    if (this.timeToEnd < 0) this.end();
  }
});
