// A state simulates a state of a robot which consist in basically changing properties
// and executing things on the robot when the states initiates / every frame / custom interval with scheduleItems / when the states ends
// every property that should be changed and reseted to its previous state should be passed
// through newProps object, with the name of the property and the new value, the state
// will automatically backup the previous values, and restore them on .end() execution
// If more customization needed you can use the postStart, everyFrame and beforeEnd
// functions, be sure to let everything as you wish before ending the node

// TODO IF NEEDED
// options.delay, delay before starting the state


var State = cc.Node.extend({
  name: null, // name of the state i.e. 'walk'
  owner: null, // The node owner of the state, to which the state will affect
  sm: null, // The owner.sm stateMachine to which this state belongs
  newProps: null, // {} an object with property name to change and new value, i.e. {sSpeed: 0}
  oldProps: null, // {} will backup the old properties on start
  local: null, // {} use this to save variables through state moments
  timeToEnd: null, // put a number here for finishing the event after that amount of seconds
  // Flow control variables
  first: true, // false when it was executed at least once
  active: false, // true when the state has started but not ended yet
  ended: false, // true when the state has ended

  // These three functions (state moments) will be provided with the state parent
  // (the computer) as the function context (this) and the first argument as the state (second on everyFrame)
  // you can use the local property from the state to store variables
  animation: null, // a function to be executed to set the animation for this state
  postStart: null, // executed inmediately after start
  everyFrame: null, // executed every frame (if present, a scheduleUpdate() will be made), first argument is deltatime
  scheduleItems: null, // a list of objects with functions and parameters to send to cc.Node.schedule
  beforeEnd: null, // executed just before exit

  lifespan: 0, // amount of seconds the event should last until it finish itself


  ctor: function(sm, owner, options) {
    this._super();
    this.retain();
    this.owner = owner;
    this.sm = sm;
    this.newProps = options.props || {};
    this.oldProps = {};
    this.local = {};
    this.name = options.name;
    this.animation = options.animation;
    this.postStart = options.postStart;
    this.everyFrame = options.everyFrame;
    this.scheduleItems = options.schedule || [];
    this.beforeEnd = options.beforeEnd;
    this.lifespan = options.lifespan;
  },
  destroy: function() { // called when the computer dies for freeing memory
    this.removeFromParent();
    this.release();
  },
  start: function() {
    // The states checks it is already active, if thats the case, exit
    if (this.active) return;
    // The states adds itself to the cStates of the owner
    this.sm.cStates.push(this);
    this.owner.addChild(this);
    // The properties of the owner that are in new Props
    // are backed up in oldProps, and are replaced with the new
    for (var prop in this.newProps) {
      this.oldProps[prop] = this.owner[prop];
      this.owner[prop] = this.newProps[prop];
    }
    // If setAnimation was given, then call it
    if (this.animation) this.animation.call(this.owner, this);
    // If postStart was given, then call it
    if (this.postStart) this.postStart.call(this.owner, this);
    // If everyFrame was given, then scheduleUpdate
    if (this.everyFrame || this.lifespan) this.scheduleUpdate();
    // Schedule every schedule item
    // this.schedule(function() {console.log("SCHEDULED SHIT");}, 0, cc.REPEAT_FOREVER, 0);
    this.scheduleItems.forEach((s, i) => {
      this.schedule((dt) => {
        s.callback.call(this.owner, dt, this);
      }, s.interval || 0, s.repeat || cc.REPEAT_FOREVER, s.delay || 0);
    });
    // If lifespan was given, increase set timeToEnd value
    if (this.lifespan) this.timeToEnd = this.lifespan;
    // mark that this is at least the first run
    this.first = false;
    // mark that this state is now active and it hasn't ended yet (it just started)
    this.active = true;
    this.ended = false;
  },
  end: function() {
    // -7. Check if beforeEnd was given, then call it
    if (this.beforeEnd) this.beforeEnd.call(this.owner, this);
    // -6. Place the backuped properties again on the owner
    for (var prop in this.oldProps) this.owner[prop] = this.oldProps[prop];
    // -5. Be sure to unscheduleUpdate, we don't want this to be running anymore
    this.unscheduleUpdate();
    // Unschedule all the rest of things scheduled with scheduleItems
    this.unscheduleAllCallbacks();
    // -4. the state removes itself from the owner's stateMachine cStates and is removed from the owner
    var index = this.sm.cStates.indexOf(this);
    this.sm.cStates.splice(index, 1);
    this.removeFromParent();
    // -3. If this state was the last (the one with higher priority), set the animation of the new higher priority state
    if (index && index === this.sm.cStates.length) _.last(this.sm.cStates).animation.call(this.owner, this);
    // -2. Mark that this state is not active anymore
    this.active = false;
    // -1. Mark that this state is now ended
    this.ended = true;
  },
  update: function(dt) {
    if (this.everyFrame) this.everyFrame.call(this.owner, dt, this);
    if (this.lifespan) this.timeToEnd -= dt;
    if (this.timeToEnd < 0) this.end();
  },
  toString: () => "State",
});
