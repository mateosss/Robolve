var r = { // resources variable
  menuBackground : "res/menuBackground.png",
  empty: "res/sprites/empty.png",
  point: "res/sprites/point.png",
  invalidPart: "res/sprites/invalidPart.png",
  edBtn: "res/sprites/edBtn.png",
  fdBtn: "res/sprites/fdBtn.png",
  wdBtn: "res/sprites/wdBtn.png",
  base: "res/sprites/base.png",
  maps:{
    tilesheet: "res/map/tilesheet.png",
    map1: "res/map/map1.tmx",
    map2: "res/map/map2.tmx",
    map3: "res/map/map3.tmx",
    map4: "res/map/map4.tmx",
    map5: "res/map/map5.tmx",
  },
  ui:{
    ddBackground: "res/sprites/ui/ddBackground.jpg",
    buttons: [
      "blue",
      "green",
      "red",
      "yellow",
      "cancel",
      "ok",
      "minus",
      "plus",
    ],
  },
  parts_png: "res/sprites/parts.png",
  parts_plist: "res/sprites/parts.plist",
};

var g_resources = [];

// Charge maps sheets and tmx
for (var map in r.maps){
  g_resources.push(r.maps[map]);
}

// Charge ui images
for (var ui in r.ui){
  if (typeof r.ui[ui] === 'string') {
    g_resources.push(r.ui[ui]);
  }
  if (ui == 'buttons') {
    for (var btn in r.ui.buttons) {
      r.ui[r.ui.buttons[btn] + "BtnL"] = "res/sprites/ui/largeButtons/" + r.ui.buttons[btn] + "BtnL.png";
      r.ui[r.ui.buttons[btn] + "BtnDL"] = "res/sprites/ui/largeButtons/" + r.ui.buttons[btn] + "BtnDL.png";
      r.ui[r.ui.buttons[btn] + "BtnM"] = "res/sprites/ui/mediumButtons/" + r.ui.buttons[btn] + "BtnM.png";
      r.ui[r.ui.buttons[btn] + "BtnDM"] = "res/sprites/ui/mediumButtons/" + r.ui.buttons[btn] + "BtnDM.png";
      r.ui[r.ui.buttons[btn] + "BtnS"] = "res/sprites/ui/smallButtons/" + r.ui.buttons[btn] + "BtnS.png";
      r.ui[r.ui.buttons[btn] + "BtnDS"] = "res/sprites/ui/smallButtons/" + r.ui.buttons[btn] + "BtnDS.png";
      g_resources.push(r.ui[r.ui.buttons[btn] + "BtnL"]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "BtnDL"]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "BtnM"]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "BtnDM"]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "BtnS"]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "BtnDS"]);
    }
  }
}

// Charge everything else
for (var i in r) {
  if (typeof r[i] == "string") {
    g_resources.push(r[i]);
  }
}
