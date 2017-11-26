var DefenseDetails = ccui.ListView.extend({
  hud: null, // hud parent to which the defensedetails are appended
  inScreen: false, // true when the component is on screen
  destroySure: false, // used as confirmation for destroying a turret
  defense: null, // Selected dd defense

  // Childs
  life: null,
  element: null,
  range: null,
  terrain: null,
  damage: null,
  attackSpeed: null,

  destroy: null,

  ctor: function(hud) {
    this._super();
    this.hud = hud;

    var s = cc.winSize;
    var size = cc.size(s.width, 192); // defenseDetails // TODO Height 256 hardcoded
    var pos = cc.p(-s.width, this.hud.ds.height + this.hud.ds.y + this.hud.it.height + 8); // defenseDetails Position in function of defenseSelectorPos // TODO HARDOCODE 8
    this.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.setTouchEnabled(true); // TODO do i really need this?
    this.setBounceEnabled(true);
    this.setContentSize(size);
    this.setPosition(pos);
    this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.setBackGroundColor(new cc.color(10, 10, 40));
    this.setBackGroundColorOpacity(80);
    this.show = function(defense) {
      if (!this.inScreen && defense) {
        this.runAction(new cc.MoveBy(0.1, cc.p(s.width, 0)));
        this.defense = defense;
        this.refresh();
        this.inScreen = true;
      }
    };
    this.dismiss = function() {
      if (this.inScreen) {
        this.runAction(new cc.MoveBy(0.1, cc.p(-s.width,0)));
        this.destroySure = false;
        this.inScreen = false;
      }
    };
    easyTouchEnded(this, dd => dd.dismiss(), { options: { invertedArea: true } });
    this.life = new PropertySelector(this, 'life');
    this.pushBackCustomItem(this.life);
    this.element = new PropertySelector(this, 'element');
    this.pushBackCustomItem(this.element);
    this.range = new PropertySelector(this, 'range');
    this.pushBackCustomItem(this.range);
    this.terrain = new PropertySelector(this, 'terrain');
    this.pushBackCustomItem(this.terrain);
    this.damage = new PropertySelector(this, 'damage');
    this.pushBackCustomItem(this.damage);
    this.attackSpeed = new PropertySelector(this, 'attackSpeed');
    this.pushBackCustomItem(this.attackSpeed);
    this.destroy = new ccui.Button(r.ui.cancelBtnM, r.ui.cancelBtnDM);
    this.destroy.setTouchEnabled(true);
    this.pushBackCustomItem(this.destroy);
    easyTouchButton(this.destroy, function(btn){
      let dd = btn.getParent().getParent();
      let hud = dd.hud;
      if (dd.destroySure) {
        dd.defense.die();
        hud.ig.addGold(50);
        dd.destroySure = false;
      } else {
        hud.it.message("Press again to destroy (+$50)");
        dd.destroySure = true;
      }
    });
  },
  toString: () => "DefenseDetails",
  refresh: function() {
    this.life.refresh();
    this.element.refresh();
    this.range.refresh();
    this.terrain.refresh();
    this.damage.refresh();
    this.attackSpeed.refresh();
  }
});
