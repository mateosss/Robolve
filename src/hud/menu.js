// Main menu class, executed by app.js

var Menu = cc.LayerGradient.extend({
  //TODO pantalla de cargar y cargar todos los sprites de antes si no se tilda
  //en celular cada vez que spawnea hasta que todos los sprites se cargan
  sprite:null,
  ctor:function (text) {
    this._super(cc.color(25, 25, 50), cc.color(50, 50, 100));
    if (!text) {
      text = "";
    }

    var size = cc.winSize;
    var tapLabel = new cc.LabelTTF(text + (text ? "\n\n" : "") + "Select Level", r.getDefaultFont(), 46);
    tapLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    tapLabel.x = size.width / 2;
    tapLabel.y = size.height / 2 + 200;
    this.addChild(tapLabel, 5);

    var lsSize = cc.size(size.width, 128);// TODO 128 hardcoded
    this.ls = new ccui.ListView();
    this.ls.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
    this.ls.setTouchEnabled(true);
    this.ls.setBounceEnabled(true);
    this.ls.setContentSize(lsSize);
    this.ls.setPosition((this.ls.width - (_.size(r.maps) - 1) * 96) / 2, size.height / 2 - this.ls.height); // TODO TOO MUCH HARDCODE
    this.ls.setItemsMargin(8);
    this.addChild(this.ls, 1);//TODO z levels hardcoded

    // Comment for omitting level screen
    var startGame = function(i) {
      cc.spriteFrameCache.addSpriteFrames(r.parts_plist_0);
      cc.spriteFrameCache.addSpriteFrames(r.parts_plist_1);
      var firstTime = !text;
      cc.director.runScene(new cc.TransitionFade(1, new GameLevel(r.maps['map' + (i + 1)], firstTime)));
    };
    for (var i = 0; i < _.size(r.maps) - 1; i++) {
      var btn = new Button({callback: _.wrap(startGame, i), text: (i + 1).toString(), button: "green", width: "96px", height: "96px",});
      this.ls.pushBackCustomItem(btn);
    }

    // startGame(0); // XXX Remove
    // setTimeout(() => rb.dev.stateRobots("still"), 10000);

    return true;
  }
});
