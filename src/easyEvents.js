var easyTouchEnded = function(pressObj, exec) {
  // HOWTO: easyTouchEnded(node, function, ..params, {options:{}});
  // node: a cc.node or any object that contains getBoundingBoxToWorld() function, it is called pressObj
  // function: the function that will be executed when a touch is detected within the boundaries of the previous parameter, the context of this function, and the first parameter are always the pressObj
  // params: the params to pass to the function, can be many.
  // {options:{}}: it has to be the last parameter, and inside options:{}, you put the next options
  // - invertedArea: boolean, true if you want to detect the touch when anything is touched except the pressObj
  var optionsPos = Array.prototype.findIndex.call(arguments, function(arg){
    if (typeof arg == 'object' && Object.keys(arg)[0] == 'options' && Object.keys(arg).length === 1) {
      return true;
    }
  }); // Check if it was passed an options parameter

  var options = optionsPos > -1 ? arguments[optionsPos].options : {};
  var invertedArea = options.invertedArea || false;
  var params = Array.prototype.slice.call(arguments, 2);
  var reaction = function (event){
    var location = event.getLocation();
    var touchInArea = cc.rectContainsPoint(pressObj.getBoundingBoxToWorld(), cc.p(location.x, location.y));
    if (touchInArea == invertedArea){
    } else {
      var context = pressObj;
      var parameters = [pressObj];
      parameters.push(params);
      exec.apply(context, parameters);
      // exec(pressObj);
    }
    return true;
  };
  if ('touches' in cc.sys.capabilities) {
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function(touch, event) {return true;},
      onTouchEnded: reaction,
    }, pressObj);
  } else if ('mouse' in cc.sys.capabilities) {
    cc.eventManager.addListener({
      event: cc.EventListener.MOUSE,
      onMouseDown: function(event) {},
      onMouseUp: reaction,
    }, pressObj);
  }
};
