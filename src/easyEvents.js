var easyTouchEnded = function(pressObj, exec) {
  /* HOWTO: easyTouchEnded(node, function, ..params, {options:{}});
  - node: a cc.node or any object that contains getBoundingBoxToWorld() function, it is called pressObj
  - function: the function that will be executed when a touch is detected within
  the boundaries of the pressObj, the context of this function.
  The first parameter is always the pressObj. So declare the function having
  that in mind. (e.g. function(pressObj, ..yourParams){})
  - params: the params to pass to the function, can be many.
  - {options:{}}: it has to be the last parameter, and inside options:{}, you put the next options
  - invertedArea: boolean, true if you want to detect the touch when anything is touched except the pressObj
  - passEvent: boolean, true if you want the touch event to be passed as the second argument of the function
  */
  // TODO hay muchisimos event listeners no se si esta bien eso, osea el hecho de que se crea uno nuevo cada vez que ejecuto easyTouchEnded
  var optionsPos = Array.prototype.findIndex.call(arguments, function(arg){
    if (typeof arg == 'object' && Object.keys(arg)[0] == 'options' && Object.keys(arg).length === 1) {
      return true;
    }
  }); // Check if it was passed an options parameter
  var options = optionsPos > -1 ? arguments[optionsPos].options : {};
  var invertedArea = options.invertedArea || false;
  var passEvent = options.passEvent || false;
  var params = Array.prototype.slice.call(arguments, 2);
  var reaction = function (event){
    var location = event.getLocation();
    var touchInArea = cc.rectContainsPoint(pressObj.getBoundingBoxToWorld(), cc.p(location.x, location.y));
    if (touchInArea == invertedArea){
      return false;
    } else {
      var context = pressObj;
      var parameters = [pressObj];
      if (passEvent) {
        parameters.push(event);
      }
      parameters = parameters.concat(params);
      console.log("PATO");
      exec.apply(context, parameters);
      return true;
    }
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

var easyTouchButton = function(pressObj, exec) {
  // For now only works with TOUCH_ENDED TODO
  var params = Array.prototype.slice.call(arguments, 2);
  var reaction = function (touches, event){
    if (event == ccui.Widget.TOUCH_ENDED) {
      var context = pressObj;
      var parameters = [pressObj];
      parameters = parameters.concat(params);
      exec.apply(context, parameters);
      return true;
    }
    return false;
  };
  pressObj.addTouchEventListener(reaction, pressObj);

};
