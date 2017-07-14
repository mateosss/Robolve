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
  owner: null, // The node owner of the state, to which the state will affect
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


  ctor: function(owner, options) {
    this._super();
    this.retain();
    this.owner = owner;
    this.newProps = options.props || {};
    this.oldProps = {};
    this.local = {};
    this.name = options.name;
    this.postStart = options.postStart;
    this.everyFrame = options.everyFrame;
    this.beforeEnd = options.beforeEnd;
    this.lifespan = options.lifespan;
  },
  destroy: function() {
    this.owner.removeChild(this);
    this.release();
  },
  start: function() {
    // The states checks it is already active, if thats the case, exit
    if (this.active) return;
    // 1. The states adds itself to the cStates of the owner
    this.owner.cStates.push(this);
    this.owner.addChild(this);
    // 2. The properties of the owner that are in new Props
    // are backed up in oldProps, and are replaced with the new
    for (var prop in this.newProps) {
      this.oldProps[prop] = this.owner[prop];
      this.owner[prop] = this.newProps[prop];
    }
    // 3. If postStart was given, then call it
    if (this.postStart) this.postStart.call(this.owner, this);
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
    if (this.beforeEnd) this.beforeEnd.call(this.owner, this);
    // -5. Place the backuped properties again on the owner
    for (var prop in this.oldProps) this.owner[prop] = this.oldProps[prop];
    // -4. Be sure to unscheduleUpdate, we don't want this to be running anymore
    this.unscheduleUpdate();
    // -3. the state removes itself from the owner cStates and is removed from the owner
    this.owner.cStates.splice(this.owner.cStates.findIndex(aState => aState === this), 1);
    this.owner.removeChild(this);
    // -2. Mark that this state is not active anymore
    this.active = false;
    // -1. Mark that this state is now ended
    this.ended = true;
  },
  update: function(dt) {
    if (this.everyFrame) this.everyFrame.call(this.owner, dt, this);
    if (this.lifespan) this.timeToEnd -= dt;
    if (this.timeToEnd < 0) this.end();
  }
});
