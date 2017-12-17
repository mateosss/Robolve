var r = { // resources variable
  fonts: {
    baloo: {type: "font", name: cc.sys.isNative ? "res/fonts/baloo.ttf" : "baloo", srcs: ["res/fonts/baloo.ttf"]},
    icons: {type: "font", name: cc.sys.isNative ? "res/fonts/icons.ttf" : "icons", srcs: ["res/fonts/icons.ttf"]},
  },
  getDefaultFont: () => r.fonts.baloo.name,
  panel: "res/sprites/ui/panel.png", // TODO r.panel? This probably should have a hud sub object
  panel_out: "res/sprites/ui/panel_out.png", // TODO r.panel_out? This probably should have a hud sub object
  panel_in: "res/sprites/ui/panel_in.png", // TODO r.panel_in? This probably should have a hud sub object
  panel_in_nuts: "res/sprites/ui/panel_in_nuts.png", // TODO r.panel_in_nuts? This probably should have a hud sub object
  empty: "res/sprites/empty.png",
  point: "res/sprites/point.png",
  invalidPart: "res/sprites/invalidPart.png",
  base: "res/sprites/base.png",
  maps:{
    tilesheet: "res/map/tilesheet.png",
    map1: "res/map/map1.tmx",
    map2: "res/map/map2.tmx",
    map3: "res/map/map3.tmx",
    map4: "res/map/map4.tmx",
    map5: "res/map/map5.tmx",
  },
  ui: {
    buttons: [
      "blue",
      "green",
      "orange",
      "pink",
      "red",
      "yellow",
    ],
  },
  parts_png_0: "res/sprites/parts_0.png",
  parts_plist_0: "res/sprites/parts_0.plist",
  parts_png_1: "res/sprites/parts_1.png",
  parts_plist_1: "res/sprites/parts_1.plist",
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
      r.ui[r.ui.buttons[btn]] = "res/sprites/ui/buttons/" + r.ui.buttons[btn] + ".png";
      r.ui[r.ui.buttons[btn] + "P"] = "res/sprites/ui/buttons/" + r.ui.buttons[btn] + "P.png";
      g_resources.push(r.ui[r.ui.buttons[btn]]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "P"]);
    }
  }
}

// Charge everything else
for (var i in r) {
  if (typeof r[i] == "string") {
    g_resources.push(r[i]);
  }
}
