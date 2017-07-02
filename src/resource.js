var res = {
  HelloWorld_png : "res/HelloWorld.png",
  map: "res/map.png",
  empty: "res/sprites/empty.png",
  point: "res/sprites/point.png",
  invalidPart: "res/sprites/invalidPart.png",
  deffense: "res/sprites/deffense.png",
  electricDeffense: "res/sprites/electricDeffense.png",
  fireDeffense: "res/sprites/fireDeffense.png",
  waterDeffense: "res/sprites/waterDeffense.png",
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
  animations: {"attack": 6, "walk": 8, "still": 1},
  parts_png: "res/sprites/parts.png",
  parts_plist: "res/sprites/parts.plist",
};

res.genToPart = function(type, gen) { // TODO reemplazar esta asquerosidad por algo decente
  switch (type) {
    case "head":
      if (gen === 0) return "Weak";
      else if (gen === 1) return "Normal";
      else if (gen === 2) return "Strong";
      break;
    case "arm":
      if (gen === 0) return "Mele";
      else if (gen === 1) return "Range";
      break;
    case "middle":
      if (gen === 0) return "weak";
      if (gen === 1) return "normal";
      if (gen === 2) return "strong";
      break;
    default:
      return "ERROR DE GEN TO PART";
  }
};

res.getPartSpriteName = function(part_type, animation, part_name, frame) { //TODO Replace for a nicer one
  return part_type + "/" + animation + "/" + part_name + "_" + frame + ".png";
};

var g_resources = [];

// Charge maps sheets and tmx
for (var map in res.maps){
  g_resources.push(res.maps[map]);
}

// Charge ui images
for (var ui in res.ui){
  if (typeof res.ui[ui] === 'string') {
    g_resources.push(res.ui[ui]);
  }
  if (ui == 'buttons') {
    for (var btn in res.ui.buttons) {
      res.ui[res.ui.buttons[btn] + "BtnL"] = "res/sprites/ui/largeButtons/" + res.ui.buttons[btn] + "BtnL.png";
      res.ui[res.ui.buttons[btn] + "BtnDL"] = "res/sprites/ui/largeButtons/" + res.ui.buttons[btn] + "BtnDL.png";
      res.ui[res.ui.buttons[btn] + "BtnM"] = "res/sprites/ui/mediumButtons/" + res.ui.buttons[btn] + "BtnM.png";
      res.ui[res.ui.buttons[btn] + "BtnDM"] = "res/sprites/ui/mediumButtons/" + res.ui.buttons[btn] + "BtnDM.png";
      res.ui[res.ui.buttons[btn] + "BtnS"] = "res/sprites/ui/smallButtons/" + res.ui.buttons[btn] + "BtnS.png";
      res.ui[res.ui.buttons[btn] + "BtnDS"] = "res/sprites/ui/smallButtons/" + res.ui.buttons[btn] + "BtnDS.png";
      g_resources.push(res.ui[res.ui.buttons[btn] + "BtnL"]);
      g_resources.push(res.ui[res.ui.buttons[btn] + "BtnDL"]);
      g_resources.push(res.ui[res.ui.buttons[btn] + "BtnM"]);
      g_resources.push(res.ui[res.ui.buttons[btn] + "BtnDM"]);
      g_resources.push(res.ui[res.ui.buttons[btn] + "BtnS"]);
      g_resources.push(res.ui[res.ui.buttons[btn] + "BtnDS"]);
    }
  }
}

// Charge everything else
for (var i in res) {
  if (typeof res[i] == "string") {
    g_resources.push(res[i]);
  }
}
