var Hud = cc.Layer.extend({
  // TODO El hud es muy inestable, hay mucho hardcode de numeros en pixeles, hay que
  // buscar un buen metodo para hacer menues mas estables
  level: null,

  dd: null, // Deffense Details
  ddElement: null,
  ddRange: null,
  ddTerrain: null,
  ddDamage: null,
  ddAttackSpeed: null,
  ddDestroy: null,
  ddDestroySure: false,
  ddDeffense: null, // Selected dd deffense

  it: null, // Information Text

  ds: null, // Deffense Selector
  dsBtnOk: null,
  dsBtnCancel: null,
  dsLabel: null,
  dsDeffense: null, // Dummy deffense on screen

  ig: null,

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

    // Deffense Selector
    var dsSize = cc.size(s.width, 128); // deffenseSelector Height // TODO 128 hardcoded
    var dsPos = cc.p(0, 0); // deffenseSelector Position//TODO 128 esta hardcodeado, igual que el 3, fijarse si se puede centrar mejor, con alguna funcion de cocos
    this.ds = new ccui.ListView();
    this.ds.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.ds.setTouchEnabled(true);
    this.ds.setContentSize(dsSize);
    this.ds.setPosition((this.ds.width - 3 * 96) / 2, 0); // TODO TOO MUCH HARDCODE
    if (cc.sys.os) { // In JS this line throws an error so we look if we are running natively
      // this.ds.setScrollBarEnabled(false); //TODO throws error in chrome
    }
    this.addChild(this.ds);

    this.dsBtnOk = new ccui.Button(res.ui.okBtnM, res.ui.okBtnDM);
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
      var pos = level.map.tileCoordFromChild(level.dummyDeffense);
      var canBePlaced = level.dummyDeffense.canBePlacedOn(pos);
      if (canBePlaced.result && level.base.money >= 300) {
        level.dummyDeffense.setColor(cc.color(255, 255, 255));
        level.deffenses.push(level.dummyDeffense);
        var newDeffense = level.dummyDeffense;
        newDeffense.retain();
        newDeffense.isDummy = false;
        btn.getParent().dsBtnCancel.exec();
        level.map.addChild(newDeffense);
        newDeffense.setTouchEvent();
        newDeffense.scheduleUpdate();

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

    this.dsBtnCancel = new ccui.Button(res.ui.cancelBtnM, res.ui.cancelBtnDM);
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
        this.getParent().level.dummyDeffense.removeFromParent();//TODO make afunction that disappearse the dummydeffense, this is being repeated
        this.getParent().level.dummyDeffense = null;
        this.getParent().level.map.debugger.debugTile(this.getParent().level.map, {stop: true});

      }
    };
    easyTouchButton(this.dsBtnCancel, function(btnCancel) {
      btnCancel.exec();
    }, this.dsBtnCancel);
    this.addChild(this.dsBtnCancel);

    var buttons = [
      {
        button: new ccui.Button(res.ui.yellowBtnM, res.ui.yellowBtnDM),
        image: new cc.Sprite(res.edBtn),
        type: "electric"
      },
      {
        button: new ccui.Button(res.ui.redBtnM, res.ui.redBtnDM),
        image: new cc.Sprite(res.fdBtn),
        type: "fire"
      },
      {
        button: new ccui.Button(res.ui.blueBtnM, res.ui.blueBtnDM),
        image: new cc.Sprite(res.wdBtn),
        type: "water"
      }
    ];
    var dsEvent = function(btn, level, type) {
      var hud = btn.getParent().getParent().getParent();
      hud.it.message("Place " + type[0].toUpperCase() + type.slice(1) + " Tower - $300");
      var range = 0;//0,1,2
      var element = type;//water,fire,electric
      var terrain = 0;//0,1
      var damage = 0;//0,1,2
      var attackSpeed = 0;//0,1,2
      var customDeffense = new Deffense(level, element, range, terrain, damage, attackSpeed);
      customDeffense.retain();
      customDeffense.isDummy = true;
      level.showDummyDeffense(customDeffense);
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
    this.it = new cc.LabelTTF("Deffense Selector", "Arial", 32, cc.size(s.width, 32), cc.TEXT_ALIGNMENT_CENTER);
    var itPos = cc.p(0, dsSize.height + dsPos.y); // Information text position
    this.it.setAnchorPoint(0, 0);
    this.it.setPosition(itPos);
    this.it.message = function (message, duration) {
      this.setOpacity(0);
      duration = duration || 3;
      var changeText = new cc.CallFunc(function(it, msg){it.setString(msg);}, this, message);
      var appear = new cc.FadeIn(0.2);
      var delay = new cc.DelayTime(duration);
      var disappear = new cc.FadeOut(0.2);
      var actArray = [changeText, appear, delay, disappear];
      this.runAction(new cc.Sequence(actArray));
    };
    this.addChild(this.it, 101);

    // Deffense Details
    var ddSize = cc.size(s.width, 192); // deffenseDetails // TODO Height 256 hardcoded
    var ddPos = cc.p(-s.width, dsSize.height + dsPos.y + this.it.height + 8); // deffenseDetails Position in function of deffenseSelectorPos // TODO HARDOCODE 8
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
    this.dd.show = function(deffense) {
      if (!this.inScreen && deffense) {
        this.runAction(new cc.MoveBy(0.1, cc.p(s.width,0)));
        this.getParent().ddDeffense = deffense;
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
    this.ddDeffense = this.level.deffenses[0]; // TODO que no sea una defensa estatica
    this.ddElement = new PropertySelector(this.dd, this.ddDeffense, 'element');
    this.dd.pushBackCustomItem(this.ddElement);
    this.ddRange = new PropertySelector(this.dd, this.ddDeffense, 'range');
    this.dd.pushBackCustomItem(this.ddRange);
    this.ddTerrain = new PropertySelector(this.dd, this.ddDeffense, 'terrain');
    this.dd.pushBackCustomItem(this.ddTerrain);
    this.ddDamage = new PropertySelector(this.dd, this.ddDeffense, 'damage');
    this.dd.pushBackCustomItem(this.ddDamage);
    this.ddAttackSpeed = new PropertySelector(this.dd, this.ddDeffense, 'attackSpeed');
    this.dd.pushBackCustomItem(this.ddAttackSpeed);
    this.ddDestroy = new ccui.Button(res.ui.cancelBtnM, res.ui.cancelBtnDM);
    this.ddDestroy.setTouchEnabled(true);
    this.ddDestroy.pressedActionEnabled = true;
    this.dd.pushBackCustomItem(this.ddDestroy);
    easyTouchButton(this.ddDestroy, function(btn){
      var hud = btn.getParent().getParent().getParent();
      if (hud.ddDestroySure) {
        var burn = new cc.TintTo(0.2, 0, 0, 0);
        var disappear = new cc.FadeOut(0.2);
        var message = new cc.CallFunc(function(deffense){hud.it.message("Turret destroyed");}, this, hud);
        hud.level.base.money += 50;
        hud.ig.refresh();
        var destroy = new cc.CallFunc(function(deffense){deffense.die();}, this);
        var actArray = [burn, disappear, message, destroy];
        hud.ddDeffense.runAction(new cc.Sequence(actArray));
        hud.ddDestroySure = false;
      } else {
        hud.it.message("Press again to destroy (+$50)");
        hud.ddDestroySure = true;
      }
    });

    return true;
  },
  ddRefresh: function() {
    this.ddElement.refresh();
    this.ddRange.refresh();
    this.ddTerrain.refresh();
    this.ddDamage.refresh();
    this.ddAttackSpeed.refresh();
  },
});

var PropertySelector = ccui.Layout.extend({
  property: null,
  pValueLabel: null,
  ctor: function(parent, deffense, property) {
    // TODO HARDCODE EVERYWHERE
    this._super();
    this.property = property;
    pProperty = 'p' + property[0].toUpperCase() + property.slice(1);
    sProperty = 's' + property[0].toUpperCase() + property.slice(1);

    var colPos = this.getAnchorPointInPoints();
    // this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    // this.setBackGroundColor(new cc.color(0, 0, 0));
    // this.setBackGroundColorOpacity(80);
    this.setContentSize(64, parent.height);

    var background = new ccui.Layout();
    background.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    background.setBackGroundColor(new cc.color(0, 0, 0));
    background.setBackGroundColorOpacity(200);
    background.setContentSize(this.width * 0.75 - 4, this.getContentSize().height - 32); //TODO 32 hardcoded
    background.setPosition(this.width / 2 - background.width / 2, 8);
    this.addChild(background);

    var pName = this.property[0].toUpperCase() + this.property.slice(1);
    var pNameLabel = new ccui.Text(pName, "Arial", background.width / 3);
    pNameLabel.setAnchorPoint(0, 0);
    pNameLabel.setPosition(0, background.height);
    background.addChild(pNameLabel, 99);

    var pValue = deffense[pProperty][deffense[this.property]];
    this.pValueLabel = new ccui.Text(pValue, "Arial", background.width / 2);
    this.pValueLabel.setAnchorPoint(0, 0);
    this.pValueLabel.setPosition(4, background.height / 2 - this.pValueLabel.height / 2); // TODO 4 hardcodeado
    background.addChild(this.pValueLabel, 99);

    var downBtn = new ccui.Button(res.ui.minusBtnS, res.ui.minusBtnDS);
    downBtn.setAnchorPoint(0, 0);
    downBtn.setPosition(this.width / 2 - downBtn.width / 2, 8);
    downBtn.pressedActionEnabled = true;
    downBtn.setTouchEnabled(true);
    downBtn.setContentSize(cc.size(this.width, this.width));
    easyTouchButton(downBtn, function(downBtn){
      var d = upBtn.getParent().getParent().getParent().getParent().ddDeffense; //Deffense
      var p = upBtn.getParent().property;  //Property name
      var pProp = d['p' + p[0].toUpperCase() + p.slice(1)]; // possible stats(properties)
      var prop = d[p];
      var sProp = pProp[prop];

      var sortedKeys = Object.keys(pProp).sort();
      var canMinimize = sortedKeys.indexOf(prop.toString()) > 0;
      if (canMinimize) {
        var cost = 100;
        var hasBudget = d.level.base.money >= cost; // TODO 50 hardcoded
        if (hasBudget) {
          var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) - 1];
          d[p] = parseInt(improvement) || improvement;
          d.refreshStats();
          d.level.base.money -= cost;
          d.level.hud.ig.refresh();
          upBtn.getParent().refresh();
          d.level.hud.it.message("Tower " + p[0].toUpperCase() + p.slice(1) + " to: " + pProp[d[p]]);
        } else {
          d.level.hud.it.message("You don't have 100 bucks");
        }
      } else {
        d.level.hud.it.message("You only can go up for $100");
      }
    });
    this.addChild(downBtn);

    var upBtn = new ccui.Button(res.ui.plusBtnS, res.ui.plusBtnDS);
    upBtn.setAnchorPoint(0, 0);
    upBtn.setPosition(this.width / 2 - upBtn.width / 2, this.getContentSize().height - upBtn.getSize().height - 24);//TODO 24 hardcode
    upBtn.pressedActionEnabled = true;
    upBtn.setTouchEnabled(true);
    upBtn.setContentSize(cc.size(this.width, this.width));
    easyTouchButton(upBtn, function(upBtn){
      var d = upBtn.getParent().getParent().getParent().getParent().ddDeffense; //Deffense
      var p = upBtn.getParent().property;  //Property name
      var pProp = d['p' + p[0].toUpperCase() + p.slice(1)]; // possible stats(properties)
      var prop = d[p];
      var sProp = pProp[prop];

      var sortedKeys = Object.keys(pProp).sort();
      var canMaximize = sortedKeys.indexOf(prop.toString()) < sortedKeys.length - 1;
      if (canMaximize) {
        var cost = 100;
        var hasBudget = d.level.base.money >= cost; // TODO 50 hardcoded
        if (hasBudget) {
          var improvement = sortedKeys[sortedKeys.indexOf(prop.toString()) + 1];
          d[p] = parseInt(improvement) || improvement;
          d.level.base.money -= cost;
          d.refreshStats();
          d.level.hud.ig.refresh();
          upBtn.getParent().refresh();
          d.level.hud.it.message("Tower " + p[0].toUpperCase() + p.slice(1) + " to: " + pProp[d[p]]);
        } else {
          d.level.hud.it.message("You don't have 100 bucks");
        }
      } else {
        d.level.hud.it.message("You only can go down for $100");
      }
    });
    this.addChild(upBtn);
  },
  refresh: function() {
    var deffense = this.getParent().getParent().getParent().ddDeffense;
    var pProperty = 'p' + this.property[0].toUpperCase() + this.property.slice(1);
    var pValue = deffense[pProperty][deffense[this.property]];
    this.pValueLabel.setString(pValue);
  },

});
