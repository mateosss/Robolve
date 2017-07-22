var Hud = cc.Layer.extend({
  // TODO El hud es muy inestable, hay mucho hardcode de numeros en pixeles, hay que
  // buscar un buen metodo para hacer menues mas estables
  level: null,

  dd: null, // Defense Details
  ddElement: null,
  ddRange: null,
  ddTerrain: null,
  ddDamage: null,
  ddAttackSpeed: null,
  ddDestroy: null,
  ddDestroySure: false,
  ddDefense: null, // Selected dd defense

  it: null, // Information Text

  ds: null, // Defense Selector
  dsBtnOk: null,
  dsBtnCancel: null,
  dsLabel: null,
  dsDefense: null, // Dummy defense on screen

  ig: null, // Infromationg - Gold

  ctor: function(level) {
    this._super();
    this.level = level;
    var s = cc.winSize;
    var center = cc.p(s.width / 2, s.height / 2); // Screen center

    // Gold
    var igt = new cc.LabelTTF("Gold:", "Arial", 32, cc.size(s.width, 32), cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);//TODO width hardcoded
    igt.setAnchorPoint(0, 0);
    igt.setPosition(cc.p(0, 64));
    this.addChild(igt, 100);
    var igPos = cc.p(0, 32);
    this.ig = new cc.LabelTTF(this.level.base.money, "Arial", 32, cc.size(s.width, 32), cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);//TODO width hardcoded
    this.ig.setAnchorPoint(0, 0);
    this.ig.setPosition(igPos);
    this.ig.refresh = function() {
      this.setString(this.getParent().level.base.money + "");
    };
    this.addChild(this.ig, 100);

    // Defense Selector
    var dsSize = cc.size(s.width, 128); // defenseSelector Height // TODO 128 hardcoded
    var dsPos = cc.p(0, 0); // defenseSelector Position//TODO 128 esta hardcodeado, igual que el 3, fijarse si se puede centrar mejor, con alguna funcion de cocos
    this.ds = new ccui.ListView();
    this.ds.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.ds.setTouchEnabled(true);
    this.ds.setContentSize(dsSize);
    this.ds.setPosition((this.ds.width - 3 * 96) / 2, 0); // TODO TOO MUCH HARDCODE
    if (cc.sys.os) { // In JS this line throws an error so we look if we are running natively
      // this.ds.setScrollBarEnabled(false); //TODO throws error in chrome
    }
    this.addChild(this.ds);

    this.dsBtnOk = new ccui.Button(r.ui.okBtnM, r.ui.okBtnDM);
    this.dsBtnOk.setAnchorPoint(0, 0);
    this.dsBtnOk.setTouchEnabled(true);
    dsBtnOkPos = cc.p(-s.width, dsSize.height + dsPos.y);
    this.dsBtnOk.inScreen = false;
    this.dsBtnOk.setPosition(dsBtnOkPos);
    this.dsBtnOk.show = function() {
      if (!this.inScreen) {
        this.runAction(new cc.MoveBy(0.1, cc.p(s.width,0)));
        this.inScreen = true;
      }
    };
    this.dsBtnOk.dismiss = function() {
      if (this.inScreen) {
        this.runAction(new cc.MoveBy(0.1, cc.p(-s.width,0)));
        this.inScreen = false;
      }
    };
    easyTouchButton(this.dsBtnOk, function(btn, level) {
      /// TODO ALL THIS CODE IS REPEATED FROM GAME.JS and MAP.JS
      var pos = level.map.tileCoordFromChild(level.dummyDefense);
      var canBePlaced = level.dummyDefense.canBePlacedOn(pos);
      if (canBePlaced.result && level.base.money >= 300) {
        level.dummyDefense.setColor(cc.color(255, 255, 255));
        level.defenses.push(level.dummyDefense);
        var newDefense = level.dummyDefense;
        newDefense.retain();
        newDefense.isDummy = false;
        btn.getParent().dsBtnCancel.exec();
        level.map.addChild(newDefense);
        newDefense.setTouchEvent();
        newDefense.scheduleUpdate();

        level.base.money -= 300; //TODO 300 hardcoded
        btn.getParent().ig.refresh();
        btn.getParent().it.message(canBePlaced.cause);

      } else {
        if (canBePlaced.result) {
          btn.getParent().it.message("You don't have 300 bucks");
        } else {
          btn.getParent().it.message(canBePlaced.cause);
        }
      }
      ////////////////
    }, this.level);
    this.addChild(this.dsBtnOk);

    this.dsBtnCancel = new ccui.Button(r.ui.cancelBtnM, r.ui.cancelBtnDM);
    this.dsBtnCancel.setAnchorPoint(0, 0);
    dsBtnCancelPos = cc.p(-s.width + s.width - this.dsBtnCancel.width, dsSize.height + dsPos.y);
    this.dsBtnCancel.inScreen = false;
    this.dsBtnCancel.setTouchEnabled(true);
    this.dsBtnCancel.setPosition(dsBtnCancelPos);
    this.dsBtnCancel.show = this.dsBtnOk.show; //TODO estas cosas que uno se ve obligado a hacer...
    this.dsBtnCancel.dismiss = this.dsBtnOk.dismiss;
    this.dsBtnCancel.exec = function() {
      if (this.getParent().dsBtnOk.inScreen) {
        this.getParent().dsBtnOk.dismiss();
        this.dismiss();
        this.getParent().level.dummyDefense.removeFromParent();//TODO make afunction that disappearse the dummydefense, this is being repeated
        this.getParent().level.dummyDefense = null;
        this.getParent().level.map.debugger.debugTile(this.getParent().level.map, {stop: true});

      }
    };
    easyTouchButton(this.dsBtnCancel, function(btnCancel) {
      btnCancel.exec();
    }, this.dsBtnCancel);
    this.addChild(this.dsBtnCancel);

    var buttons = [
      {
        button: new ccui.Button(r.ui.yellowBtnM, r.ui.yellowBtnDM),
        image: new cc.Sprite(r.edBtn),
        type: "electric"
      },
      {
        button: new ccui.Button(r.ui.redBtnM, r.ui.redBtnDM),
        image: new cc.Sprite(r.fdBtn),
        type: "fire"
      },
      {
        button: new ccui.Button(r.ui.blueBtnM, r.ui.blueBtnDM),
        image: new cc.Sprite(r.wdBtn),
        type: "water"
      }
    ];
    var dsEvent = function(btn, level, type) {
      var hud = btn.getParent().getParent().getParent();
      hud.it.message("Place " + type[0].toUpperCase() + type.slice(1) + " Tower - $300");
      var life = 2;//0,1,2
      var range = 0;//0,1,2
      var element = type;//water,fire,electric
      var terrain = 0;//0,1
      var damage = 0;//0,1,2
      var attackSpeed = 0;//0,1,2
      var customDefense = new Defense(level, life, element, range, terrain, damage, attackSpeed);
      customDefense.retain();
      customDefense.isDummy = true;
      level.showDummyDefense(customDefense);
      if (!hud.dsBtnOk.inScreen) {
        hud.dsBtnOk.show();// TODO ETO SE VA A DECONTROLAAAA AIUDAAA
        hud.dsBtnCancel.show();// TODO ETO SE VA A DECONTROLAAAA AIUDAAA
      }
    };
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i].button;
      var img = buttons[i].image;
      var type = buttons[i].type;
      btn.pressedActionEnabled = true;
      btn.setTouchEnabled(true);
      btn.addChild(img);
      img.setPosition(btn.width / 2, btn.height / 2);
      easyTouchButton(btn, dsEvent, this.level, type);

      this.ds.addChild(btn);
    }

    // Info Text
    this.it = new cc.LabelTTF("Defense Selector", "Arial", 32, cc.size(s.width, 32), cc.TEXT_ALIGNMENT_CENTER);
    var itPos = cc.p(0, dsSize.height + dsPos.y); // Information text position
    this.it.setAnchorPoint(0, 0);
    this.it.setPosition(itPos);
    this.it.message = function (message, duration) {
      this.setOpacity(0);
      duration = duration || 3;
      var changeText = new cc.CallFunc(function(it, msg) { it.setString(msg); }, this, message);
      var appear = new cc.FadeIn(0.2);
      var delay = new cc.DelayTime(duration);
      var disappear = new cc.FadeOut(0.2);
      var actArray = [changeText, appear, delay, disappear];
      this.runAction(new cc.Sequence(actArray));
    };
    this.addChild(this.it, 101);

    // Defense Details
    var ddSize = cc.size(s.width, 192); // defenseDetails // TODO Height 256 hardcoded
    var ddPos = cc.p(-s.width, dsSize.height + dsPos.y + this.it.height + 8); // defenseDetails Position in function of defenseSelectorPos // TODO HARDOCODE 8
    this.dd = new ccui.ListView();
    this.dd.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.dd.setTouchEnabled(true); // TODO do i really need this?
    this.dd.setBounceEnabled(true);
    this.dd.setContentSize(ddSize);
    this.dd.setPosition(ddPos);
    if (cc.sys.os) { // In JS this line throws an error so we look if we are running natively
      // this.dd.setScrollBarEnabled(false);//TODO in chrome detects Linux
    }
    this.dd.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.dd.setBackGroundColor(new cc.color(10, 10, 40));
    this.dd.setBackGroundColorOpacity(80);
    this.dd.inScreen = false;
    this.dd.show = function(defense) {
      if (!this.inScreen && defense) {
        this.runAction(new cc.MoveBy(0.1, cc.p(s.width,0)));
        this.getParent().ddDefense = defense;
        this.getParent().ddRefresh();
        this.inScreen = true;
      }
    };
    this.dd.dismiss = function() {
      if (this.inScreen) {
        this.runAction(new cc.MoveBy(0.1, cc.p(-s.width,0)));
        this.getParent().ddDestroySure = false;
        this.inScreen = false;
      }
    };
    easyTouchEnded(this.dd, function(dd){
      dd.dismiss();
    }, {options:{invertedArea:true}});
    this.addChild(this.dd);
    this.ddLife = new PropertySelector(this.dd, 'life');
    this.dd.pushBackCustomItem(this.ddLife);
    this.ddElement = new PropertySelector(this.dd, 'element');
    this.dd.pushBackCustomItem(this.ddElement);
    this.ddRange = new PropertySelector(this.dd, 'range');
    this.dd.pushBackCustomItem(this.ddRange);
    this.ddTerrain = new PropertySelector(this.dd, 'terrain');
    this.dd.pushBackCustomItem(this.ddTerrain);
    this.ddDamage = new PropertySelector(this.dd, 'damage');
    this.dd.pushBackCustomItem(this.ddDamage);
    this.ddAttackSpeed = new PropertySelector(this.dd, 'attackSpeed');
    this.dd.pushBackCustomItem(this.ddAttackSpeed);
    this.ddDestroy = new ccui.Button(r.ui.cancelBtnM, r.ui.cancelBtnDM);
    this.ddDestroy.setTouchEnabled(true);
    this.ddDestroy.pressedActionEnabled = true;
    this.dd.pushBackCustomItem(this.ddDestroy);
    easyTouchButton(this.ddDestroy, function(btn){
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

    return true;
  },
  ddRefresh: function() {
    this.ddLife.refresh();
    this.ddElement.refresh();
    this.ddRange.refresh();
    this.ddTerrain.refresh();
    this.ddDamage.refresh();
    this.ddAttackSpeed.refresh();
  },
});
