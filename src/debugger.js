var Debugger = cc.Class.extend({
  object: null,
  methods: [], // Format [{method:function(){},options:{}}]
  ctor: function(object){
    this.object = object;
  },
  debug: function (){
    for (var debugMethod in this.methods) {
      this.methods[debugMethod].method(this.object, {stop: true});
      this.methods[debugMethod].method(
        this.object, this.methods[debugMethod].options || {}
      );
    }
  },
  debugText: function(object, options){
    var debugName = "debugText";
    var stop = options.stop || false;
    if(stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var updateLabel = object.getChildByName(debugName);
      if (updateLabel) {
        updateLabel.string = options.text || "";
      } else {
        var text = options.text || "debugText";
        var fontName = options.fontName || "Arial";
        var fontSize = options.fontSize || 32;
        var dimensions = options.dimensions || cc.size(object.width, object.height);
        var hAlignment = options.hAlignment || cc.TEXT_ALIGNMENT_LEFT;
        var vAlignment = options.vAlignment || cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        var position = options.position || object.getAnchorPointInPoints();
        var label = new cc.LabelTTF(text, fontName, fontSize, dimensions, hAlignment, vAlignment);
        label.fillStyle = options.fillStyle || cc.color(255, 255, 255, 255);
        label.setName(debugName);
        label.setPosition(position);
        object.addChild(label, 10000);
      }
    }
  },
  debugLine: function(object, options){
    // Draws a line between from object to options.target
    var debugName = "debugLine";
    var stop = options.stop || false; // TODO STOP DOESNT WORK. maybe stop should be default, and cleanup should be the option
    if(stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var pos = object.getAnchorPointInPoints();
      if (!options.target) return;
      var target = object.convertToNodeSpace(object.level.map.convertToWorldSpace(options.target));
      var color = options.color || cc.color(255, 255, 255, 255);
      var width = options.width || 2;
      var line = new cc.DrawNode();
      line.drawSegment(pos, target, width, color);
      line.setName(debugName);
      object.addChild(line, 1000);//TODO hacer nivel z opcional tambien
      return line;
    }
  },
  debugRange: function(object, options){
    // Draws a circle from the center with radius sRange
    var debugName = "debugRange";
    var stop = options.stop || false;
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var pos = object.getAnchorPointInPoints();
      var radius = object.sRange / object.level.map.CHILD_SCALE || 2000;
      var color = options.color || cc.color(1, 179, 255, 20);
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);
      circle.setName(debugName);
      object.addChild(circle, -1);
      return circle;
    }
  },
  debugAnchor: function(object, options){//TODO Unir esta funcion con debugPoint
    // Draws a circle in the object's anchor point
    var debugName = "debugAnchor";
    var stop = options.stop || false;
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var pos = object.getAnchorPointInPoints();
      var radius = options.radius || 5;
      var color = options.color || cc.color(200, 0, 200, 255);
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);
      circle.setName(debugName);
      object.addChild(circle, 999);
      return circle;
    }
  },
  debugPoint: function(object, options){
    // Draws a point in the given options.pos
    var debugName = "debugPoint";
    var stop = options.stop || false;//TODO stop doesn't work because many repeated  names
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var pos = options.point || null;
      var color = options.color || cc.color(0, 200, 200, 255);
      var radius = options.radius || 5;
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);
      circle.setName(debugName);
      object.addChild(circle, 1000);//TODO hacer nivel z opcional tambien
      return circle;
    }
  },
  debugRect: function(object, options){
    //Draws options.rect, or the object's rect
    var debugName = "debugRect";
    var stop = options.stop || false;//TODO check in all debug functions if stop works
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var square = new cc.DrawNode();
      var z = options.z || 100;
      var rect = options.rect ||
      cc.rect(object.x, object.y, object.width, object.height);
      var origin = options.origin || cc.p(rect.x, rect.y);
      var destination = options.destination ||
      cc.p(rect.x + rect.width, rect.y + rect.height);
      var fillColor = options.fillColor || cc.color(0, 50, 100, 50);
      var lineWidth = options.lineWidth || 1;
      var lineColor = options.lineColor || cc.color(0, 0, 0, 255);
      square.drawRect(origin, destination, fillColor, lineWidth, lineColor);
      square.setName(debugName);
      object.addChild(square, z);//TODO poner niveles z diferentes
      return square;
    }
  },
  debugPoly: function(object, options){
    // Draws a polygon from vertexes in options.verts or the object's limits
    var debugName = "debugPoly";
    var stop = options.stop || false;
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var polygon = new cc.DrawNode();
      var z = options.z || 200;
      var verts = options.verts || [
        cc.p(object.x, object.y),
        cc.p(object.x + object.width, object.y),
        cc.p(object.x + object.width, object.y + object.height),
        cc.p(object.x, object.y + object.height),
      ];
      var fillColor = options.fillColor || cc.color(0, 200, 100, 50);
      var lineWidth = options.lineWidth || 1;
      var lineColor = options.lineColor || cc.color(0, 0, 0, 255);
      polygon.drawPoly(verts, fillColor, lineWidth, lineColor);
      polygon.setName(debugName);
      object.addChild(polygon, z);
      return polygon;
    }
  },
  debugTile: function(object, options){
    // Draws a romboid polygon based on the rect of a tile to show the tile
    if (options.tile) {
      var tile = options.tile;
      var verts = [
        cc.p(tile.x, tile.y + tile.height / 2),
        cc.p(tile.x + tile.width / 2, tile.y + tile.height),
        cc.p(tile.x + tile.width, tile.y + tile.height / 2),//
        cc.p(tile.x + tile.width / 2, tile.y),
      ];
      options.verts = verts;
    }
    return this.debugPoly(object, options);

  },
});
