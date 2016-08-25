var easyTouchEnded = function(pressObj, exec, invertedArea) {
  invertedArea = invertedArea || false;
  var reaction = function (event){
    var location = event.getLocation();
    var touchInArea = cc.rectContainsPoint(pressObj.getBoundingBoxToWorld(), cc.p(location.x, location.y));
    if (touchInArea == invertedArea){
    } else {
      exec(pressObj);
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
