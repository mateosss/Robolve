var DefenseSelector = ccui.ListView.extend({
  hud: null, // The hud which contains this DefenseSelector
  ok: null, // ok button
  cancel: null, // cancel button

  ctor: function(hud) {
    this._super();
    this.hud = hud;

    let s = cc.winSize;
    let size = cc.size(96*3 , 128); // defenseSelector Height // TODO 320,128 hardcoded
    this.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.setTouchEnabled(true);
    this.setContentSize(size);
    this.setPosition((s.width - 3 * 96) / 2, 0); // TODO TOO MUCH HARDCODE

    // ok button
    this.ok = new ccui.Button(r.ui.okBtnM, r.ui.okBtnDM);
    this.ok.setAnchorPoint(0, 0);
    this.ok.setTouchEnabled(true);
    let okPos = cc.p(-s.width + 16, this.height + 8 + this.y);  // TODO button padding (16) hardcoded
    this.ok.inScreen = false;
    this.ok.setPosition(okPos);
    this.ok.show = function() {
      if (!this.inScreen) {
        this.runAction(new cc.MoveBy(0.1, cc.p(s.width,0)));
        this.inScreen = true;
      }
    };
    this.ok.dismiss = function() {
      if (this.inScreen) {
        this.runAction(new cc.MoveBy(0.1, cc.p(-s.width,0)));
        this.inScreen = false;
      }
    };

    easyTouchButton(this.ok, function(ok, level) {
      /// TODO ALL THIS CODE IS REPEATED FROM GAME.JS and MAP.JS
      var pos = level.map.tileCoordFromChild(level.dummyDefense);
      var canBePlaced = level.dummyDefense.canBePlacedOn(pos);
      if (canBePlaced.result && level.base.gold >= 300) {
        let hud = ok.getParent();
        level.dummyDefense.setColor(cc.color(255, 255, 255));
        level.defenses.push(level.dummyDefense);
        var newDefense = level.dummyDefense;
        newDefense.retain();
        newDefense.isDummy = false;
        hud.ds.cancel.exec();
        level.map.addChild(newDefense);
        newDefense.setTouchEvent();
        newDefense.factoryReset(); // This makes possible to the idle animation to execute the idle animation
        newDefense.scheduleUpdate();

        hud.ig.removeGold(300);
        hud.it.message(canBePlaced.cause);

      } else {
        if (canBePlaced.result) {
          ok.getParent().it.message("You don't have 300 bucks");
          ok.getParent().ig.notEnoughGold();
        } else {
          ok.getParent().it.message(canBePlaced.cause);
        }
      }
    }, this.hud.level);
    this.hud.addChild(this.ok);

    // cancel button
    this.cancel = new ccui.Button(r.ui.cancelBtnM, r.ui.cancelBtnDM);
    this.cancel.setAnchorPoint(0, 0);
    var cancelPos = cc.p(-s.width + s.width - this.cancel.width - 16, this.height + 8 + this.y);  // TODO button padding (16) hardcoded
    this.cancel.inScreen = false;
    this.cancel.setTouchEnabled(true);
    this.cancel.setPosition(cancelPos);
    this.cancel.show = this.ok.show; //TODO estas cosas que uno se ve obligado a hacer...
    this.cancel.dismiss = this.ok.dismiss;
    this.cancel.exec = function() {
      let hud = this.getParent();
      if (hud.ds.ok.inScreen) {
        hud.ds.ok.dismiss();
        this.dismiss();
        hud.level.dummyDefense.removeFromParent();//TODO make afunction that disappearse the dummydefense, this is being repeated
        hud.level.dummyDefense = null;
        hud.level.map.debugger.debugTile(this.getParent().level.map, {stop: true});

      }
    };
    easyTouchButton(this.cancel, cancel => cancel.exec(), this.cancel);
    this.hud.addChild(this.cancel);

    // Defense selector defenses buttons
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
      if (!hud.ds.ok.inScreen) {
        hud.ds.ok.show();// TODO ETO SE VA A DECONTROLAAAA AIUDAAA
        hud.ds.cancel.show();// TODO ETO SE VA A DECONTROLAAAA AIUDAAA
      }
    };
    for (let i = 0; i < buttons.length; i++) {
      let btn = buttons[i].button;
      // TODO remove img and buttons.image references
      // var img = buttons[i].image;
      var type = buttons[i].type;
      btn.setTouchEnabled(true);
      // btn.addChild(img);
      // img.setPosition(btn.width / 2, btn.height / 2);
      easyTouchButton(btn, dsEvent, this.hud.level, type);
      this.addChild(btn);
    }

  },
  toString: () => "DefenseSelector",
});
