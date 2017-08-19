var Hud = cc.Layer.extend({
  // TODO El hud es muy inestable, hay mucho hardcode de numeros en pixeles, hay que
  // buscar un buen metodo para hacer menues mas estables
  level: null,

  dd: null, // Defense Details

  it: null, // Information Text

  ds: null, // Defense Selector
  dsBtnOk: null,
  dsBtnCancel: null,
  dsDefense: null, // Dummy defense on screen

  ig: null, // Infromationg - Gold

  ctor: function(level) {
    this._super();
    this.level = level;
    var s = cc.winSize;
    var center = cc.p(s.width / 2, s.height / 2); // Screen center

    // Gold
    this.ig = new InfoGold(this);
    this.addChild(this.ig);

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
    var dsBtnOkPos = cc.p(-s.width + 16, dsSize.height + dsPos.y);  // TODO button padding (16) hardcoded
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
        newDefense.factoryReset(); // This makes possible to the idle animation to execute the idle animation
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
    var dsBtnCancelPos = cc.p(-s.width + s.width - this.dsBtnCancel.width - 16, dsSize.height + dsPos.y);  // TODO button padding (16) hardcoded
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
      var life = 0;//0,1,2
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
      // TODO remove img and buttons.image references
      // var img = buttons[i].image;
      var type = buttons[i].type;
      btn.setTouchEnabled(true);
      // btn.addChild(img);
      // img.setPosition(btn.width / 2, btn.height / 2);
      easyTouchButton(btn, dsEvent, this.level, type);

      this.ds.addChild(btn);
    }

    // Info Text
    this.it = new InfoText(this);
    this.addChild(this.it);

    // Defense Details
    this.dd = new DefenseDetails(this);
    this.addChild(this.dd);

    return true;
  },
  toString: function() {
    return "Hud";
  },
});
