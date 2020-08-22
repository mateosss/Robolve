// The tutorial was made, as every tutorial ever made for every game, made
// in a rush, pardon the weird bits. Have that in mind when reading this class.

// TODO: Add button to get out of the tutorial
// TODO: Add button to fix zoom bug

// This class is used for scripting sequencial events of the tutorial
var Tutorial = cc.Class.extend({
  level: null,
  hidden: null, // object with things that can be hidden

  events: [
    function() {
      this.hidden = {
        it: this.level.hud.it,
        charStatus: this.level.hud.charStatus,
        openConsole: this.level.hud.openConsole,
        // save: this.level.hud.save,
        centerMap: this.level.hud.centerMap,
        openInventory: this.level.hud.openInventory,
        openCharSheet: this.level.hud.openCharSheet,
        waveText: this.level.hud.waveText,
        preview: this.level.hud.preview,
        button: this.level.hud.button,
        cs: this.level.hud.cs,
        ds: this.level.hud.ds,
        inventory: this.level.hud.inventory,
        equipbar: this.level.hud.equipbar,
        orb: this.level.hud.orb,
        bottombarLayout: this.level.hud.bottombarLayout,
        goldbar: this.level.hud.goldbar,
        // pauseButton: this.level.hud.pauseButton,
      };
      this.bulkVisible(Object.keys(this.hidden), false);
      this.bulkVisible(["orb", "goldbar"], true);
      // this.hidden.bottombarLayout.visible = true; // TODO
      // this.hidden.openConsole.visible = true; // TODO
      console.log("Tutorial started");
      this.nextEvent();
    },

    function() {
      this.speak("Welcome to robolve, I'm your host, and the thing you must defend through the game. Press the pink button to keep me talking.", null, "Ok, I guess");
    },

    function() {
      // rb.dev.getCharacter().sSpeed = 10;//TODO
      // rb.dev.getCharacter().sDamage =10000;//TODO
      this.speak("You have been walking with me, The Faboulous Orb (R), for a long, long time by now.", null, "(R) for registered?");
      this.focus(this.level.base.part, null, null, cc.p(0, 0.16));
    },

    function() {
      this.speak("You must protect and take me to the Master, why? because the program that manages your sense of moral and honor says so.", null, "Well written");
    },

    function() {
      this.focusOff();
      let robot = this.spawnRobot([0, 0, "electric", 1, 0, 0, 1, 1], "still", rb.items.bullseye, 1, function(robot) {
        this.nextEvent();
      }, function(robot) {
        this.nextEvent();
        this.bulkVisible(["bottombarLayout", "openInventory"], true);
      });
      robot.sDamage = 0;
      this.nextEvent();
    },

    function() {
      if (this.level.totalRobotsKilled >= 1) return this.nextEvent();
      this.speak("That robot over there is one of the Master's guardian, they don't want us to reach her.", null, "The bad guys");
    },

    function() {
      if (this.level.totalRobotsKilled >= 1) return this.nextEvent();
      this.speak("Go attack him before it damages me.", null, "I'm scared");
    },

    function() {
      if (this.level.totalRobotsKilled >= 1) return this.nextEvent();
      this.speak("Don't worry, it will not damage you in any way, probably because he is a bit pitty of you.", null, "Yeah, sure it is\nnot because this\nis a tutorial?");
    },

    function() {
      // indicate and wait for tap on enemy robot
      console.log("here1");
      if (this.level.totalRobotsKilled >= 1) return this.nextEvent();
      rb.dev.getRobot().sm.setState("walk");
      this.focus(rb.dev.getRobot().middle, null, null, cc.p(0,0));
    },

    function() {
      // After kill robot
      console.log("here2");
      this.speak("Well done, the poor guy dropped something, pick it up.", () => {}, "Yay! Loot");
      this.delay(()=>this.focus(rb.dev.getDropedItem(), 11, null, cc.p(0,0)), 200);
    },

    function() {
      this.speak("Oh very nice, that's a Bull's eye mod, you can equip it to your system from the inventory", () => {});
      this.focus(this.hidden.openInventory, 11, null, cc.p(0,0));
      this.hidden.openInventory.setup({callback: () => {
        this.level.hud.inventory.toggle();
        this.nextEvent();
      }});
    },

    function() {
      this.hidden.openInventory.setup({callback: () => {
        this.level.hud.inventory.toggle();
      }});

      this.bulkVisible(["openInventory"], false);
      this.level.hud.inventory.titleClose.visible = false;
      this.level.hud.inventory.setSelectedStack = function(stack) {
        InventoryView.prototype.setSelectedStack.apply(this, arguments);
        this.infoEquip.visible = false;
        this.infoSell.visible = false;
        if (stack.item === rb.items.bullseye) {
          rb.dev.getTutorial().nextEvent();
        }
      };
      this.focus(this.level.hud.inventory.grid.cells[1], 0);
    },

    function() {
      this.level.hud.inventory.setSelectedStack = function() {
        InventoryView.prototype.setSelectedStack.apply(this, arguments);
        this.infoEquip.visible = false;
      };

      this.speak("You are lucky, look at how the mod tweaks your system and equip it.");
      this.focus(this.level.hud.inventory.infoStatsContainer, 0);
    },

    function() {
      this.level.hud.inventory.infoEquip.visible = true;
      this.focus(this.level.hud.inventory.infoEquip, 0);
      this.level.hud.inventory.infoEquip.setup({callback: () => {
        this.level.character.equipStack(this.level.hud.inventory.selectedStackIndex);
        this.nextEvent();
      }});
    },

    function() {
      this.level.hud.inventory.infoEquip.setup({callback: () => {
        this.level.character.equipStack(this.level.hud.inventory.selectedStackIndex);
      }});
      this.level.hud.inventory.setSelectedStack = function() {
        InventoryView.prototype.setSelectedStack.apply(this, arguments);
      };


      this.speak("See how your stats have changed", () => {});
      this.level.hud.inventory.dismiss();
      this.level.hud.openCharSheet.visible = true;
      this.focus(this.level.hud.openCharSheet, 11, cc.hexToColor("#2196F3"));
      this.level.hud.openCharSheet.setup({
        callback: () => {
          this.level.hud.cs.show();
          this.level.hud.openCharSheet.setup({callback: () => this.level.hud.cs.toggle()});
          this.level.hud.openCharSheet.visible = false;
          this.level.hud.cs.titleClose.visible = false;
          this.nextEvent();
        }
      });
    },

    function() {
      this.speak("Very cool huh?", null, "I guess");
      this.focus(this.level.hud.cs.statsContainer, 0);
    },

    function() {
      this.level.hud.cs.dismiss();
      this.speak("Hey, I was thinking, since Master let me there, I had some time to think about what happened", null, "What?");
    },

    function() {
      this.speak("You know, the fact that Master killed all humans, and then tried to kill me.", null, "Oh sure, that");
    },

    function() {
      this.speak("I mean, I understand why someone would try to kill humans, but to kill ME?", null, "Yeah, I can't\nbelieve it");
    },

    function() {
      this.speak("She must've on some heavy substances.", null, "Sure");
    },

    function() {
      let robot = this.spawnRobot([0, 0, "fire", 1, 0, 0, 1, 1], "still", rb.items.gold, 500, function(robot) {
        this.nextEvent();
      }, ()=>{});
      robot.sDamage = 0;
      this.speak("Never mind, another robot is coming, what a coincidence, perfect timing to try out your new mod.", null, "Yay!");
      this.focus(robot.middle,null,null,cc.p(0,0));
      this.level.character.goAttack = function() {
        Character.prototype.goAttack.apply(this, arguments);
        rb.dev.stateRobots("walk");
      };
    },

    function() {
      if (this.level.totalRobotsKilled >= 2) return this.nextEvent();
      this.speak("What are you waiting for? Go attack it!", ()=>{}, "Calm down");
    },

    function() {
      this.speak("Wow! such damage.", null, "I kicked\nits metallic ass");
    },

    function() {
      // Spawn three fast robots in the same way
      let robot;
      for (var i = 0; i < 3; i++) {
        robot = this.spawnRobot([0, 0, "fire", 1, 0, 0, 1, 1], "still", rb.items.gold, 500, function(robot) {
          if (this.level.totalRobotsKilled>=5) this.nextEvent();
        }, ()=>{});
        robot.pointing = 1;
        robot.allParts(function(part) { part.setFlippedX(this.pointing % 2); });
        robot.sDamage = 0;
        robot.sSpeed = 2;
        robot.x += 64 * (i + 1);
        robot.y -= 32 * (i + 1);
      }
      this.speak("Oh come on, give us a break", ()=>{}, "I'm on it");
      this.focus(robot.middle,null,null,cc.p(0,0));
      this.level.character.goAttack = function() {
        Character.prototype.goAttack.apply(this, arguments); // Makes charStatus button visible
        rb.dev.getTutorial().nextEvent();
      };
    },

    function() {
      this.level.character.goAttack = function() {
      };

      this.focusOff();
      this.speak("Not so fast, sit back and let me have some fun.", null, "Ok sure");
      this.level.character.sm.setDefaultState(); // dejar el char quieto hasta que acecpte el explain

    },

    function() {
      this.explain("You can cancel an ongoing action with the bottom left button that is displaying your current action.");
    },

    function() {
      this.level.character.goAttack = function() {
        Character.prototype.goAttack.apply(this, arguments);
      };
      this.level.character.goAttack(rb.dev.getRobot()); // reanudar char
      this.aux = this.level.character.sDamage; // Guardo s damage asi el player no puede matar a los robots
      this.level.character.sDamage = 0;
      this.level.character.goAttack = function() {};


      this.focus(this.hidden.charStatus, 22, null, cc.p(0,0));
      this.hidden.charStatus.setup({callback:()=>{
        this.nextEvent();
        rb.dev.getCharacter().sm.setDefaultState();
      }});
    },

    function() {
      this.hidden.charStatus.setup({callback:()=>{
        rb.dev.getCharacter().sm.setDefaultState();
      }});
      this.level.character.sDamage = this.aux;


      this.level.base.sRange = 20000;
      this.focusOff();
      rb.dev.stateRobots("walk");
    },

    function() {
      this.level.character.goAttack = function() {
        Character.prototype.goAttack.apply(this, arguments);
      };

      this.level.base.sRange = 500;
      this.speak("Woohoo, I told you, I'm no dummy, I know how to defend myself", null, "Wow");
    },

    function() {
      this.speak("But I suppose even the best of us sometimes need help from robots like you.", null, "Wow?");
    },

    function() {
      this.speak("No ofense.", null, "Someone trying\nto offend me\nwould say so");
    },

    function() {
      this.speak("...", null, "What now?");
    },

    function() {
      this.speak("Oh oh, I think that was just the beginning, a lot of guardians are coming, we should prepare.", null, "How?");
    },

    function() {
        this.explain("You can create defenses to help you defend the orb by using your gold, be careful where you place your defenses, because robots can destroy them");
    },

    function() {
      this.speak("Quick! An electric guardian is coming, build a Fire defense to crush it.", null, "Fire is better\nthan electric?");
    },

    function() {
      this.explain("Guardians have one of three elements (electric, fire, water), so do defenses, and they change how much each one damages the other, be sure to think what element you choose.");
    },

    function() {
      this.bulkVisible(["button", "ds"], true);
      this.bulkVisible(["charStatus"], false);
      this.focus(this.hidden.button, 11, null, cc.p(0,0));
      this.hidden.button.setup({
        callback: () => {
          this.hidden.ds.show();
          this.nextEvent();
        }
      });
    },

    function() {
      this.hidden.button.setup({callback: () => this.hidden.ds.show()});
      this.focus(this.level.hud.ds.buttons[1], 11, null, cc.p(0,0));
      this.level.hud.ds.buttons[0].setEnabled(false);
      this.level.hud.ds.buttons[0].icon.y -= 7.375;
      this.level.hud.ds.buttons[2].setEnabled(false);
      this.level.hud.ds.buttons[2].icon.y -= 7.375;
      this.level.hud.ds.showConfirm = function() {
        BasicDefenseSelector.prototype.showConfirm.apply(this, arguments);
        rb.dev.getTutorial().nextEvent();
      };

    },

    function() {
      this.level.hud.ds.showConfirm = function() {
        BasicDefenseSelector.prototype.showConfirm.apply(this, arguments);
      };
      this.focus(this.level.hud.ds.confirmOk, 11, null, cc.p(0,0));
      this.level.hud.ds.confirmDefenseCreation = function() {
        let ret = BasicDefenseSelector.prototype.confirmDefenseCreation.apply(this, arguments);
        rb.dev.getTutorial().nextEvent();
        return ret;
      };
      this.level.hud.preview.show = function() {};
    },

    function() {
      rb.dev.getDefense().setBuilt();
      rb.dev.getDefense().sLife -= 100;
      rb.dev.getCharacter().sm.setDefaultState();
      this.level.hud.ds.confirmDefenseCreation = function() {
        return BasicDefenseSelector.prototype.confirmDefenseCreation.apply(this, arguments);
      };
      this.bulkVisible(["button", "ds"], false);
      let robot = this.spawnRobot([0, 0, "electric", 0, 0, 2, 0, 0], "walk", rb.items.fireCoin, 3, function(robot) {
        if (this.level.totalRobotsKilled>=6) this.nextEvent();
      }, ()=>{});
      robot.sSpeed = 2;
    },

    function() {
      this.speak("This will be a long day, let's improve this tower all we can.");
    },

    function() {
      this.speak("We will need some gold for that, sell some items.", null, "But they\nare mine");
    },

    function() {
      this.explain("You can sell chips or elemental coins to get some extra gold");
    },

    function() {
      this.speak("Sell EVERYTHING, I prefer a tower defending me over your robotic hands", null, "Oh come on");
    },

    function() {
      this.bulkVisible(["openInventory"], true);
      this.focus(this.hidden.openInventory, 11, null, cc.p(0,0));
      this.hidden.openInventory.setup({callback: () => {
        this.level.hud.inventory.toggle();
      }});
      this.level.hud.inventory.infoSell.setup({callback: ()=> {
        this.level.hud.ig.addGold(this.level.hud.inventory.getSelectedStackPrice());
        this.level.hud.inventory.inventory.items.splice(this.level.hud.inventory.selectedStackIndex, 1);
        this.level.hud.inventory.unselectStack();
        if (this.level.hud.inventory.inventory.items.length === 1) {
          this.nextEvent();
        }
      }});
    },

    function() {
      this.speak("Now we are rich! Those fire coins sell well huh?", null, "What were those?");
    },

    function() {
      this.explain("When you have more defenses of one color than others, it is more likely that robots drop coins of that element.");

    },

    function() {
      this.level.hud.dialog.dismiss();
      setTimeout(() => this.explain("Also, those coins sells better if you have more defenses of that color as well, but be aware, having just one color will alert guardians, and they will start coming in a stronger element."), 250);
    },


    function() {
      this.speak("Good, you made some knowledge and some cash there, now you can make our little buddy be stronger.", null, "Is it our son\nor something?");
    },

    function() {
      this.speak("You don't love our creations as I do. Those guardians damaged it a bit, try to repair it.", null, "Okay");
      this.bulkVisible(["openInventory"], false);
    },

    function() {
      this.focus(rb.dev.getDefense().middle, 0, null, cc.p(0,0));
      this.level.hud.preview.show = function() {
        BasicDefenseView.prototype.show.apply(this, arguments);
        rb.dev.getTutorial().nextEvent();
      };
      this.level.hud.preview.statsLife.setEnabled(false);
      this.level.hud.preview.statsRange.setEnabled(false);
      this.level.hud.preview.statsDamage.setEnabled(false);
      this.level.hud.preview.statsAttackSpeed.setEnabled(false);
      this.level.hud.preview.titleDestroy.visible = false;
      this.level.hud.preview.titleDestroy.setEnabled(false);
      this.level.hud.preview.titleClose.visible = false;
    },

    function() {
      // Indicate repair button
      this.level.hud.preview.show = function() {
        BasicDefenseView.prototype.show.apply(this, arguments);
      };
      this.focus(this.level.hud.preview.titleRepair, 11, null, cc.p(0,0));
      rb.dev.getDefense().addRepaired = function() {
        Defense.prototype.addRepaired.apply(this,arguments);
        if (this.isRepaired()) rb.dev.getTutorial().nextEvent();
      };
    },

    function() {
      rb.dev.getDefense().addRepaired = function() {
        Defense.prototype.addRepaired.apply(this,arguments);
      };
      this.speak("Alright, looking healthy, now get those progress bars all the way up.", null, "Improve time!");
    },

    function() {
      let statsLife = this.level.hud.preview.statsLife;
      let statsRange = this.level.hud.preview.statsRange;
      let statsDamage = this.level.hud.preview.statsDamage;
      let statsAttackSpeed = this.level.hud.preview.statsAttackSpeed;
      statsLife.setEnabled(true);
      statsRange.setEnabled(true);
      statsDamage.setEnabled(true);
      statsAttackSpeed.setEnabled(true);
      this.level.hud.preview.titleClose.visible = true;

      this.level.character.sImproveTime=2;
      this.focus(rb.dev.getDefense().middle, 0, null, cc.p(0,0));
      let callback = function() {
        StatTweak.prototype.nextValue.apply(this, arguments);
        let preview = rb.dev.getLevel().hud.preview;

        let life = preview.statsLife.getSelectedIndex();
        let range = preview.statsRange.getSelectedIndex();
        let damage = preview.statsDamage.getSelectedIndex();
        let attackSpeed = preview.statsAttackSpeed.getSelectedIndex();

        if (life === 2 && range === 2 && damage === 2 && attackSpeed === 2) {
          rb.dev.getTutorial().nextEvent();
        }
      };

      statsLife.nextValue = statsRange.nextValue = statsDamage.nextValue = statsAttackSpeed.nextValue = callback;
    },

    function() {
      let statsLife = this.level.hud.preview.statsLife;
      let statsRange = this.level.hud.preview.statsRange;
      let statsDamage = this.level.hud.preview.statsDamage;
      let statsAttackSpeed = this.level.hud.preview.statsAttackSpeed;
      let callback = function() {
        StatTweak.prototype.nextValue.apply(this, arguments);
      };
      statsLife.nextValue = statsRange.nextValue = statsDamage.nextValue = statsAttackSpeed.nextValue = callback;
      rb.dev.getCharacter().sImproveTime=5;


      this.speak("Awesome, here they come. More guardians!", null, "This is it");
      let robot;
      let dna;
      for (var i = 0; i < 10; i++) {
        dna = [];
        Robot.prototype.STATS.forEach(p => dna.push(_.randchoice(_.mapNumbers(Object.keys(p))))); // jshint ignore:line
        robot = this.spawnRobot(dna, "still", rb.items.gold, 10, function(robot) {
          if (this.level.totalRobotsKilled>=16) {
            this.nextEvent();
            this.level.totalRobotsKilled = 0; // se ejecuta dos veces esta funcion y pongo esto para asegurar que este if no se ejecuta dos veces
          }
        }, ()=>{});
        robot.pointing = 1;
        robot.allParts(function(part) { part.setFlippedX(this.pointing % 2); });
        robot.sDamage = 100;
        robot.x += 64 + 16 * (i + 1);
        robot.y -= 32 + 8 * (i + 1);
      }
    },

    function() {
      this.speak("They don't know what awaits them.", null, "(Emit war cry)");
    },

    function() {
      this.explain("Survive the last wave");
    },

    function() {
      rb.dev.stateRobots("walk");
    },
    function() {
      this.speak("Well that was awesome, let's play for real now", null, "I can't wait");
    },

    function() {
      this.currentEvent = 0;
      rb.dev.getBase().die();
    },

  ],
  currentEvent: 0,
  ctor: function(level) {
    this.level = level;
    setTimeout(() => this.nextEvent());
    window.tutorial = this;
  },
  speak: function(message, afterwards, answer) {
    afterwards = afterwards || (() => this.nextEvent());
    this.level.hud.orb.speak(message, afterwards, answer);
  },
  explain: function(text) {
    let dialog = this.level.hud.dialog;
    dialog.close.visible = false;
    let callback = () => {
      this.nextEvent();
      this.level.hud.dialog.dismiss();
    };
    let okText = _.randchoice(["Nice", "Cool", "Wow", "Omg"]);
    let cancelText = _.randchoice(["Boring", "Pff", "zzzZZZ", "Yassss"]);
    dialog.setup({title: "Explanation", text: text, okText: okText, okCallback: callback, cancelText: cancelText, cancelCallback: callback});
    dialog.show();
  },
  nextEvent: function() {
    // TODO check if it is last event
    this.events[this.currentEvent++].call(this);
    delete this.events[this.currentEvent - 1];
  },
  focus: function(element, padding, color, anchor) {
    this.level.hud.focus.focus.apply(this.level.hud.focus, arguments);
  },
  focusOff: function() {
    this.level.hud.focus.disableFocus();
  },
  bulkVisible: function(these, show) {
    for (let key of these) this.hidden[key].visible = !!show;
  },
  spawnRobot: function(dna, state, itemToDrop, itemQuantity, postkill, postpickup) {
    // post functions have this=tutorial, and first argument is the robot

    let robot = new Robot(this.level, dna);
    this.level.addRobot(robot);
    robot.die = function() {
      Robot.prototype.die.apply(this, arguments);
      postkill.call(rb.dev.getTutorial(), this);
    };
    robot.drop = function() {
      let item = new ItemPickup(this.level.map, this.getPosition(), itemToDrop, itemQuantity);
      item.unscheduleAllCallbacks(); // prevent disappear
      item.pickup = function() {
        ItemPickup.prototype.pickup.apply(this, arguments);
        postpickup.apply(rb.dev.getTutorial(), this);
      };
    };
    robot.sm.setState(state);
    return robot;
  },
  delay: function(func, delay) {
    setTimeout(func, delay);
  },
  toString: () => "Tutorial",
});
