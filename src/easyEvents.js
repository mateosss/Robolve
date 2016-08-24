var easyTouchEnded = function(pressObj, exec, invertedArea) {
  invertedArea = invertedArea || false;
  var reaction = function (location){
    var pressObj = this._node;
    var touchInArea = cc.rectContainsPoint(pressObj.getBoundingBoxToWorld(),
    cc.p(location._x, location._y));
    if (touchInArea == invertedArea){
    } else {
      exec(pressObj);
    }
    return true;
  };
  if ('touches' in cc.sys.capabilities) {
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ALL_AT_ONCE,
      onTouchBegan: function(touch, event) {},
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
