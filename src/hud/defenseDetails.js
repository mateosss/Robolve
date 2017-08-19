var DefenseDetails = ccui.ListView.extend({
  hud: null, // hud parent to which the defensedetails are appended
  inScreen: false, // true when the component is on screen

  ctor: function(hud, pos) {
    this._super();
    this.hud = hud;

    var s = cc.winSize;
    var ddSize = cc.size(s.width, 192); // defenseDetails // TODO Height 256 hardcoded
    this.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.setTouchEnabled(true); // TODO do i really need this?
    this.setBounceEnabled(true);
    this.setContentSize(ddSize);
    this.setPosition(pos);
    this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.setBackGroundColor(new cc.color(10, 10, 40));
    this.setBackGroundColorOpacity(80);
    this.show = function(defense) {
      if (!this.inScreen && defense) {
        this.runAction(new cc.MoveBy(0.1, cc.p(s.width, 0)));
        this.getParent().ddDefense = defense;
        this.getParent().ddRefresh();
        this.inScreen = true;
      }
    };
    this.dismiss = function() {
      if (this.inScreen) {
        this.runAction(new cc.MoveBy(0.1, cc.p(-s.width,0)));
        this.getParent().ddDestroySure = false;
        this.inScreen = false;
      }
    };
    easyTouchEnded(this, dd => dd.dismiss(), { options: { invertedArea: true } });
    this.hud.ddLife = new PropertySelector(this, 'life');
    this.pushBackCustomItem(this.hud.ddLife);
    this.hud.ddElement = new PropertySelector(this, 'element');
    this.pushBackCustomItem(this.hud.ddElement);
    this.hud.ddRange = new PropertySelector(this, 'range');
    this.pushBackCustomItem(this.hud.ddRange);
    this.hud.ddTerrain = new PropertySelector(this, 'terrain');
    this.pushBackCustomItem(this.hud.ddTerrain);
    this.hud.ddDamage = new PropertySelector(this, 'damage');
    this.pushBackCustomItem(this.hud.ddDamage);
    this.hud.ddAttackSpeed = new PropertySelector(this, 'attackSpeed');
    this.pushBackCustomItem(this.hud.ddAttackSpeed);
    this.hud.ddDestroy = new ccui.Button(r.ui.cancelBtnM, r.ui.cancelBtnDM);
    this.hud.ddDestroy.setTouchEnabled(true);
    this.pushBackCustomItem(this.hud.ddDestroy);
    easyTouchButton(this.hud.ddDestroy, function(btn){
      var hud = btn.getParent().getParent().getParent();
      if (hud.ddDestroySure) {
        hud.ddDefense.die();
        hud.level.base.money += 50;
        hud.ig.refresh();
        hud.ddDestroySure = false;
      } else {
        hud.it.message("Press again to destroy (+$50)");
        hud.ddDestroySure = true;
      }
    });
  }
});
