// TODO Not in use

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
    this.setPosition(27, 16); // TODO TOO MUCH HARDCODE
    // ok button
    this.ok = new Button({callback: () => {
      /// TODO ALL THIS CODE IS REPEATED FROM GAME.JS and MAP.JS
      var pos = this.hud.level.map.tileCoordFromChild(this.hud.level.dummyDefense);
      var canBePlaced = this.hud.level.dummyDefense.canBePlacedOn(pos);
      if (canBePlaced.result && this.hud.level.character.getGold() >= rb.prices.createDefense) {
        let hud = this.ok.getParent();
        this.hud.level.dummyDefense.setColor(cc.color(255, 255, 255));
        this.hud.level.defenses.push(this.hud.level.dummyDefense);
        var newDefense = this.hud.level.dummyDefense;
        newDefense.retain();
        newDefense.isDummy = false;
        hud.ds.cancel.exec();
        this.hud.level.map.addChild(newDefense);
        newDefense.setTouchEvent();
        newDefense.factoryReset(); // This makes possible to the idle animation to execute the idle animation
        newDefense.scheduleUpdate();

        hud.ig.removeGold(rb.prices.createDefense);
        hud.it.message(canBePlaced.cause);

      } else {
        if (canBePlaced.result) {
          this.ok.getParent().it.message("You are pretty damn broke my dear player");
          this.ok.getParent().ig.notEnoughGold();
        } else {
          this.ok.getParent().it.message(canBePlaced.cause);
        }
      }
    }, x: "-200vw", left: "16px", y:"140px",button:"green", icon: "check", width:"96px", height: "96px"});

    this.ok.inScreen = false;
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

    this.ok.addTo(this.hud);

    // cancel button
    this.cancel = new Button({callback: () => this.cancel.exec(), x: "-100vw", right: "112px", y:"140px", button:"red", icon: "close", width:"96px", height: "96px"});
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
    this.cancel.addTo(this.hud);

    // Defense selector defenses buttons
    var buttons = [
      {
        button: new Button({button: "yellow", width: "96px", height: "96px", icon: "flash"}),
        image: new cc.Sprite(r.edBtn),
        type: "electric"
      },
      {
        button: new Button({button: "orange", width: "96px", height: "96px", icon: "fire"}),
        image: new cc.Sprite(r.fdBtn),
        type: "fire"
      },
      {
        button: new Button({button: "blue", width: "96px", height: "96px", icon: "water"}),
        image: new cc.Sprite(r.wdBtn),
        type: "water"
      }
    ];
    var dsEvent = function(btn, level, type) {
      var hud = btn.getParent().getParent().getParent();
      hud.it.message("Tell me where, and I'll do my thing");
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
      var type = buttons[i].type;
      btn.setup({callback: _.wrap(dsEvent, btn, this.hud.level, type)});
      this.addChild(btn);
    }

  },
  toString: () => "DefenseSelector",
});
