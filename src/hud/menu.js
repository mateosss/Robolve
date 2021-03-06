// Main menu class, executed by app.js

var Menu = cc.LayerGradient.extend({
  //TODO pantalla de cargar y cargar todos los sprites de antes si no se tilda
  //en celular cada vez que spawnea hasta que todos los sprites se cargan
  sprite:null,

  // Component structure
  // TODO put it here

  ctor:function (text) {
    // this._super(cc.color(25, 25, 50), cc.color(50, 50, 100));
    this._super(cc.color(96, 125, 139), cc.color(96, 125, 139));
    // this._super(cc.color(255, 255, 255), cc.color(255, 255, 255));
    if (!text) text = "Robolve";


    // Main screen
    this.mainContainer = new Layout({visible: false});
    this.mainContainer.addTo(this);

    this.upperHalf = new Layout({height: "50ph", y: "-50ph"});
    this.upperHalf.addTo(this.mainContainer);

    this.titleContainer = new Panel({bgImage: r.ui.panel_in_nuts, width: "80pw", height: "50ph", x: "center", y: "center", bottom: "5pw"});
    this.titleContainer.addTo(this.upperHalf);

    this.titleText = new Text({x: "center", y: "center", text: "Robolve", fontSize: 96, color: cc.color(255, 255, 255), top: "11px", bottom: "48px + 22px"});
    this.titleText.addTo(this.titleContainer);

    this.titleFire = new Button({button: "deepOrangeRound", width: "112px", height: "112px", scale9: false, iconFontSize: 60, icon: "fire", x: "center", y: "center", top: "11px + 48px", right: "112px + 11px"});
    this.titleFire.addTo(this.titleContainer);
    this.titleElectric = new Button({button: "yellowRound", width: "112px", height: "112px", scale9: false, iconFontSize: 60, icon: "flash", x: "center", y: "center", top: "11px + 48px"});
    this.titleElectric.addTo(this.titleContainer);
    this.titleWater = new Button({button: "blueRound", width: "112px", height: "112px", scale9: false, iconFontSize: 60, icon: "water", x: "center", y: "center", top: "11px + 48px", left: "112px + 11px"});
    this.titleWater.addTo(this.titleContainer);

    this.buttonPlay = new Button({callback: () => this.startGame(0), y: "center", x: "center", button: "blue", text: "PLAY DEMO", width: "80pw", height: "20pw"});
    this.buttonPlay.addTo(this.mainContainer);
    this.buttonPlay.icon = new Icon({fontSize: 96, icon: "play", y: "center", bottom: "5px", left: "24px"});
    this.buttonPlay.icon.addTo(this.buttonPlay);

    this.bottomHalf = new Layout({height: "50ph", y: "0ph"});
    this.bottomHalf.addTo(this.mainContainer);

    this.buttonMaps = new Button({callback: () => this.showMaps(), y: "center", x: "center", button: "green", text: "MORE MAPS", width: "70pw", height: "17.5pw", bottom: "17.5pw + 11px"});
    this.buttonMaps.addTo(this.bottomHalf);
    this.buttonMaps.icon = new Icon({fontSize: 84, icon: "map-outline", y: "center", bottom: "5px", left: "21px"});
    this.buttonMaps.icon.addTo(this.buttonMaps);

    this.buttonStore = new Button({callback: () => this.showStore(), y: "center", x: "center", button: "pink", text: "OPEN STORE", width: "70pw", height: "17.5pw", bottom: "-11px"});
    this.buttonStore.addTo(this.bottomHalf);
    this.buttonStore.icon = new Icon({fontSize: 84, icon: "store", y: "center", bottom: "5px", left: "21px"});
    this.buttonStore.icon.addTo(this.buttonStore);
    if (!cc.sys.isNative) {
      if (window.navigator.userAgent.toLowerCase().indexOf("android") !== -1) {
        this.buttonApk = new Button({callback: () => cc.sys.openURL("http://robolve.ga/"), y: "center", x: "center", button: "amber", text: "GET APK", width: "70pw", height: "17.5pw", bottom: "-17.5pw + -33px"});
        this.buttonApk.addTo(this.bottomHalf);
        this.buttonApk.icon = new Icon({fontSize: 84, icon: "download", y: "center", bottom: "5px", left: "21px"});
        this.buttonApk.icon.addTo(this.buttonApk);
      }
      if (cc.winSize.height > cc.winSize.width) {
        this.buttonFullscreen = new Button({callback: () => cc.screen.requestFullScreen(), y: "0px", x: "-15pw", button: "indigoRound", icon: "fullscreen", width: "15pw", height: "15pw", bottom: "11px", right: "11px", scale9: false});
        this.buttonFullscreen.addTo(this.mainContainer);
      }
    }



    // Maps screen
    this.mapsContainer = new Layout({visible: false});
    this.mapsContainer.addTo(this);
    this.mapsContainer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.mapsContainer.setBackGroundColor(new cc.Color(76, 175, 80, 127));

    this.mapsIcon = new Icon({icon: "map-outline", x: "center", fontSize: 256, y: "87.5ph + -154px"});
    this.mapsIcon.addTo(this.mapsContainer);

    this.mapsButtons = new Panel({bgImage: r.ui.panel_in_soft, height: "75ph", padding: "32px", y: "0ph", paddingBottom: "17.5pw + 32px"});
    this.mapsButtons.addTo(this.mapsContainer);


    let amountOfMaps = _.size(r.maps) - 2;
    this.mapsScroll = new ScrollLayout({innerHeight: amountOfMaps * 20 + "ph + 30pw"});
    this.mapsScroll.addTo(this.mapsButtons);
    this.mapsScroll.setInertiaScrollEnabled(true);

    for (let i = 0; i < amountOfMaps; i++) {
      let mapName = _.formatVarName(_.last(r.maps["map" + (i + 1)].split("/")).split(".")[0]);
      let ii = i;
      this["mapsMap" + (i + 1)] = new Button({callback: () => this.startGame(ii), y: (i + 1) * -20 + "pw", top: "15pw", x: "center", button: r.ui.buttons[i % (r.ui.buttons.length - 2)], text: mapName, width: "70pw", height: "17.5pw"}); // jshint ignore:line
      this["mapsMap" + (i + 1)].addTo(this.mapsScroll);
    }

    this.mapsGoBack = new Button({callback: () => this.showMain(), button: "blueGray", text: "Go Back", width: "60pw", height: "17.5pw", x: "center", y: "32px"});
    this.mapsGoBack.addTo(this.mapsContainer);

    // Store screen
    this.storeContainer = new Layout({visible: false});
    this.storeContainer.addTo(this);
    this.storeContainer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.storeContainer.setBackGroundColor(new cc.Color(233, 30, 99, 255));

    this.storeIcon = new Icon({icon: "store", x: "center", fontSize: 256, y: "75ph + -128px"});
    this.storeIcon.addTo(this.storeContainer);

    this.storeText = new Text({text: "The store is not ready yet!", x: "center", y: "center", bottom: "24px", fontSize: 48});
    this.storeText.addTo(this.storeContainer);

    this.storeSubtext = new Text({text: "Go play and collect some gold meanwhile...", x: "center", y: "center", top: "16px", fontSize: 32});
    this.storeSubtext.addTo(this.storeContainer);

    this.storeBottomHalf = new Layout({height: "50ph", y: "0ph"});
    this.storeBottomHalf.addTo(this.storeContainer);

    this.storeGoBack = new Button({callback: () => this.showMain(), button: "blueGray", text: "Go Back", width: "60pw", height: "17.5pw", x: "center", y: "32px"});
    this.storeGoBack.addTo(this.storeBottomHalf);

    // Loading screen
    this.loadingContainer = new Layout({visible: false});
    this.loadingContainer.addTo(this);
    this.loadingContainer.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.loadingContainer.setBackGroundColor(new cc.Color(156, 39, 176, 255));

    this.loadingIcon = new Icon({icon: "timer-sand", x: "center", fontSize: 256, y: "75ph + -128px"});
    this.loadingIcon.addTo(this.loadingContainer);

    this.loadingText = new Text({text: "Loading...", x: "center", y: "center", fontSize: 64});
    this.loadingText.addTo(this.loadingContainer);

    this.loadingHint = new Text({x: "center", y: "64px", fontSize: 24});
    this.loadingHint.addTo(this.loadingContainer);

    this.showMain();
    return true;
  },
  startGame: function(level) {
    this.showLoading();
    setTimeout(() => {
      cc.spriteFrameCache.addSpriteFrames(r.robots_plist);
      cc.spriteFrameCache.addSpriteFrames(r.defenses_plist);
      cc.spriteFrameCache.addSpriteFrames(r.character_plist);
      cc.director.runScene(new cc.TransitionFade(1, new GameLevel(r.maps['map' + (level + 1)])));
    }, 32); // HACK: 32 is a hack over a timeout hack
  },
  showMain: function() {
    this.mainContainer.setup({visible: true});
    this.mapsContainer.setup({visible: false});
    this.storeContainer.setup({visible: false});
    this.loadingContainer.setup({visible: false});
    if (!cc.sys.isNative || !this.mainContainer.textCorrected) {
      this.mainContainer.textCorrected = true;
      if (cc.sys.isNative) {
        this.buttonPlay.text.x += 32;
        this.buttonMaps.text.x += 28;
        this.buttonStore.text.x += 28;
      } else {
        // TODO yes, i know, there is a timeout for setting a text label position...
        setTimeout(() => { // jshint ignore:line
          this.buttonPlay.text.x += 32;
          this.buttonMaps.text.x += 28;
          this.buttonStore.text.x += 28;
        });
      }
    }
  },
  showMaps: function() {
    this.mainContainer.setup({visible: false});
    this.mapsContainer.setup({visible: true});
    this.storeContainer.setup({visible: false});
    this.loadingContainer.setup({visible: false});
  },
  showStore: function() {
    this.mainContainer.setup({visible: false});
    this.mapsContainer.setup({visible: false});
    this.storeContainer.setup({visible: true});
    this.loadingContainer.setup({visible: false});
  },
  showLoading: function() {
    this.mainContainer.setup({visible: false});
    this.mapsContainer.setup({visible: false});
    this.storeContainer.setup({visible: false});
    this.loadingContainer.setup({visible: true});
    let hint = _.randchoice([
      "Deadlines can force you to skip some obvious details.",
      "There are more than 50% chance that 2 of 23 people\nhave their birthdays on the same day",
      "Metahumor is not seen as true comedy by some people.",
      "No body really reads these hints.",
      "I spent more than 400 hundred hours of\nmy life in making this. You better like it",
      "Almost nobody read these tips, so you must\nbe one in many, good for you.",
      "The average time it takes to load the game\nmakes this tips completely unreadable",
      "This game has in fact music, it is a loop\nof the song 4' 33\" by John Cage",
    ]);
    this.loadingHint.setup({text: "Did you know?\n" + hint});
  },
});
