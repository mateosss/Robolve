var director = cc.director;
var winSize = cc.director.getWinSize();
console.log("Robolve Start");

var MainMenu = cc.Scene.extend({
  ctor: function(text) {
    this._super();
    this.text = text;
  },
  onEnter: function() {
    this._super();
    var layer = new Menu(this.text);
    this.addChild(layer);
  }
});

var Menu = cc.LayerGradient.extend({
  //TODO pantalla de cargar y cargar todos los sprites de antes si no se tilda
  //en celular cada vez que spawnea hasta que todos los sprites se cargan
  sprite:null,
  ctor:function (text) {
    this._super(cc.color(100, 100, 150), cc.color(50, 50, 100));
    if (!text) {
      text = "";
    }

    var size = cc.winSize;
    var tapLabel = new cc.LabelTTF(text + " - Select Level", "Arial", 46);
    tapLabel.x = size.width / 2;
    tapLabel.y = size.height / 2 + 200;
    this.addChild(tapLabel, 5);

    this.sprite = new cc.Sprite(res.HelloWorld_png);
    this.sprite.attr({
      x: size.width / 2,
      y: size.height / 2,
      scale: 0.25
    });
    this.sprite.getTexture().setTexParameters({minFilter: gl.LINEAR, magFilter: gl.LINEAR, wrapS: gl.REPEAT, wrapT: gl.REPEAT});
    this.sprite.setTextureRect(cc.rect(0, 0, size.width * 4, size.height * 4));
    this.addChild(this.sprite, 0);


    var lsSize = cc.size(size.width, 128);// TODO 128 hardcoded
    this.ls = new ccui.ListView();
    this.ls.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.ls.setTouchEnabled(true);
    this.ls.setBounceEnabled(true);
    this.ls.setContentSize(lsSize);
    this.ls.setPosition((this.ls.width - 3 * 96) / 2, size.height / 2 - this.ls.height); // TODO TOO MUCH HARDCODE
    if (cc.sys.os) { // In JS this line throws an error so we look if we are running natively
      // this.ls.setScrollBarEnabled(false); //TODO throws error in chrome
    }
    this.addChild(this.ls, 1);//TODO z levels hardcoded

    var startGame = function(btn, i) {
      var firstTime = !text;
      cc.director.runScene(new cc.TransitionFade(1, new GameLevel(res.maps['map' + (i + 1)], firstTime)));
    };
    for (var i = 0; i < _.size(res.maps) - 1; i++) {
      var btn = new ccui.Button(res.ui.greenBtnM, res.ui.greenBtnDM);
      btn.titleText = "Level " + (i + 1);
      btn.pressedActionEnabled = true;
      btn.setTouchEnabled(true);
      easyTouchButton(btn, startGame, i);
      this.ls.addChild(btn);
    }

    // cc.eventManager.addListener({
    //   event: cc.EventListener.TOUCH_ONE_BY_ONE,
    //   onTouchBegan: function (touches, event) {
    //     // cc.director.runScene(new GameLevel());
    //     cc.director.runScene(new cc.TransitionFade(1, new GameLevel()));
    //     return true;
    //   },
    // }, this);

    return true;
  }
});
