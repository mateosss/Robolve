var TutorialDialog = Dialog.extend({
  hud: null,

  // UI Components Structure

  titleContainer: null,
  titleText: null,
  titleClose: null,

  mainContainer: null,
  mainScroll: null,
  // mainTitle1,2,3,
  // mainParagraphs1,2,3,

  ctor: function(hud, options) {

    options.type = "empty";
    options.width = options.width || "100pw";
    options.height = options.height || "100ph";
    options.padding = options.padding || "11px";
    options.x = options.x || "center";
    options.y = options.y || "center";
    options.bgImage = r.ui.panel_out;

    this._super(hud, options);

    this.titleContainer = new Layout({height: "80px", width: "100pw", y: "-80px"});
    this.titleContainer.addTo(this);
    this.titleText = new Text({text: "Tutorial", hAlign:cc.TEXT_ALIGNMENT_CENTER, width:"100pw", y: "center", top: cc.sys.isNative ? "8px" : "13px", fontSize: 48});
    this.titleText.addTo(this.titleContainer);
    this.titleClose = new Button({callback: () => { this.dismiss(); this.hud.pauseMenu.show(); }, width: "78.4px", height: "78.4px", padding: "11px", button: "red", icon: "close", y: "-78.4px", x: "-78.4px", scale: 0.5});
    this.titleClose.addTo(this.titleContainer);

    this.mainContainer = new Layout({height: "100ph + -80px"});
    this.mainContainer.addTo(this);
    this.mainPanel = new Panel({bgImage: r.ui.panel_in, height: "100ph", width: "100pw", padding: "11px", paddingBottom: "11px", x: "center"});
    this.mainPanel.addTo(this.mainContainer);
    this.mainScroll = new ScrollLayout({innerHeight: cc.sys.isNative ? "2000px" : "2128px", padding: "11px", paddingTop: cc.sys.isNative ? "7px" : "5px"}); // TODO: i got innerHeight from seeing how much y equals after ctor execution
    this.mainScroll.setInertiaScrollEnabled(true);
    this.mainScroll.addTo(this.mainPanel);


    let sections = [
      {
        title: "What to do?",
        sentences: [
          "You must defend your base from the guardians.",
          "For wining a game you must survive all the level waves.",
        ],
      },
      {
        title: "How to do it?",
        sentences: [
          "You can attack directly a robot by tapping on it.",
          "You can create defenses to help you fight.",
          "Orb itself is a defense.",
        ],
      },
      {
        title: "Defenses",
        sentences: [
          _.format("You can create a defense with the \"plus\" button for ${}.", rb.prices.createDefense),
          _.format("You can improve that defense for ${}.", rb.prices.increaseStat),
          "You can restore a defense's life for free by repairing it.",
          "",
          "Defenses will be destroyed by robots if they reach them.",
        ],
      },
      {
        title: "Robots",
        sentences: [
          "Besides destroying everything they can, after dying,",
          "robots drop 3 kind of items: GOLD, UNIQUE ITEMS, or",
          "ELEMENTAL COINS.",
        ],
      },
      {
        title: "Unique Items",
        sentences: [
          "Unique items can be equiped or sold from the inventory.",
          "They can improve your different stats substantially.",
        ],
      },
      {
        title: "Elemental Coins",
        sentences: [
          "Elemental Coins are special items that vary their prices",
          "and droprates based on the proportion of defenses of the",
          "same element you got.",
          "",
          "Be careful though, having too many defenses of one type",
          "can alert robots and they will evolve to crush you.",
        ],
      },
      {
        title: "Elemental relationships",
        sentences: [
          "As we all know, fire is better than electric, which",
          "in turn is better than water, which in turn is better",
          "than fire, and so on.",
          "",
          "When any robot or defense has a target with a worse",
          "element, they inflict duplicated damage.",
        ],
      },
      {
        title: "Why am I killing robots?",
        sentences: [
          "You are KY3, one of the twelve robots crafted by",
          "Cypressy with the sole purpose of finding \"something\"",
          "She's a crazy old lady that created you and all robots",
          "minds and hardware before destroying humanity.",
          "You choose Orb, an old robot with a deficient conscience",
          "incapable of moving but with its weapons intact.",
          "",
          "You are trying to reach back to Cypressy but for some",
          "reason her guardians are trying to destroy Orb.",
          "You must defend it at all costs because the program that",
          "manages your sense of moral and honor says so.",
        ],
      },
    ];

    let y = 0;
    let section;
    let lines;
    let title;
    let paragraph;

    for (var i = 0; i < sections.length; i++) {
      section = i + 1;
      lines = sections[i].sentences.length;

      y -= 48 * 2;
      title = sections[i].title;
      this["mainTitle" + section] = new Text({text: title, hAlign: cc.TEXT_ALIGNMENT_LEFT, fontSize: 48, y: y + "px", left: "22px"});
      this["mainTitle" + section].addTo(this.mainScroll);

      y -= 16 + (cc.sys.isNative ? 28 : 32) * lines;
      paragraph = sections[i].sentences.join("\n");
      this.mainParagraph1 = new Text({text: paragraph, hAlign: cc.TEXT_ALIGNMENT_LEFT, fontSize: 24, lineHeight: 28, y: y + "px", left: "22px"});
      this.mainParagraph1.addTo(this.mainScroll);
    }

  },

  toString: () => "TutorialDialog",
});
