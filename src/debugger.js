var Debugger = cc.Class.extend({
  object: null,
  methods: [], // Format [{method:function(){},options:{}}]
  ctor: function(object){
    this.object = object;
  },
  debug: function (){
    for (var debugMethod in this.methods) {
      this.methods[debugMethod].method(this.object, {stop: true});
      this.methods[debugMethod].method(this.object, debugMethod.options || {});
    }
  },
  debugLineTo: function(object, options){
    //TODO Draw a line from object to target with distance label in pixels
    target = options.target || null;
    stop = options.stop || false;
    if(stop){object.removeChild(object.getChildByName("debugLineTo"));}
    else{
      //TODO DRAW A LINE TO TARGET AND LABEL WITH PIXELS DISTANCE ABOVE THAT
    }
  },
  debugRange: function(object, options){
    // Draws a circle from the center with radius sRange
    stop = options.stop || false;
    if (stop){object.removeChild(object.getChildByName("debugRange"));}
    else{
      var pos = object.getAnchorPointInPoints();
      var radius = object.sRange / object.level.map.CHILD_SCALE;
      var color = cc.color(1, 179, 255, 100);
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);
      circle.setName("debugRange");
      object.addChild(circle, -1);
    }
  },
  debugAnchor: function(object, options){
    // Draws a circle in the object's anchor point
    stop = options.stop || false;
    if (stop){object.removeChild(object.getChildByName("debugRange"));}
    else{
      var pos = object.getAnchorPointInPoints();
      var radius = 10;
      var color = cc.color(200, 0, 200, 255);
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);
      circle.setName("debugAnchor");
      object.addChild(circle, 999);
    }
  },
});
