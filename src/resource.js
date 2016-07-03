var res = {
  HelloWorld_png : "res/HelloWorld.png",
  map: "res/map.png",
  empty:"res/sprites/empty.png",
  invalidPart: "res/sprites/invalidPart.png",
  deffense: "res/sprites/deffense.png",
  maps:{
    map1Sheet: "res/map/final132.png",
    map1: "res/map/mapsketch.tmx",
  },
  parts:{
    heads: {
      "water0":"res/sprites/heads/waterWeak.png",
      "water1":"res/sprites/heads/waterNormal.png",
      "water2":"res/sprites/heads/waterStrong.png",
      "fire0":"res/sprites/heads/fireWeak.png",
      "fire1":"res/sprites/heads/fireNormal.png",
      "fire2":"res/sprites/heads/fireStrong.png",
      "electric0":"res/sprites/heads/electricWeak.png",
      "electric1":"res/sprites/heads/electricNormal.png",
      "electric2":"res/sprites/heads/electricStrong.png",
    },
    middles:{
      0: "res/sprites/middles/weak.png",
      1: "res/sprites/middles/normal.png",
      2: "res/sprites/middles/strong.png",
    },
    arms:{
      "water0L":"res/sprites/arms/waterMeleL.png",
      "water0R":"res/sprites/arms/waterMeleR.png",
      "water1L":"res/sprites/arms/waterRangeL.png",
      "water1R":"res/sprites/arms/waterRangeR.png",
      "fire0L":"res/sprites/arms/fireMeleL.png",
      "fire0R":"res/sprites/arms/fireMeleR.png",
      "fire1L":"res/sprites/arms/fireRangeL.png",
      "fire1R":"res/sprites/arms/fireRangeR.png",
      "electric0L":"res/sprites/arms/electricMeleL.png",
      "electric0R":"res/sprites/arms/electricMeleR.png",
      "electric1L":"res/sprites/arms/electricRangeL.png",
      "electric1R":"res/sprites/arms/electricRangeR.png",
    },
    legs:{
      "walkL":"res/sprites/legs/walkL.png",
      "walkR":"res/sprites/legs/walkR.png",
      "flyL":"res/sprites/legs/flyL.png",
      "flyR":"res/sprites/legs/flyR.png",
    },
  }
};

var g_resources = [];

// Charge robot parts
for (var part in res.parts){
  for (var subpart in res.parts[part]) {
    g_resources.push(res.parts[part][subpart]);
  }
}

// Charge maps sheets and tmx
for (var map in res.maps){
  g_resources.push(res.maps[map]);
}

// Charge everything else
for (var i in res) {
  if (i != "parts" && i != "maps") {
    g_resources.push(res[i]);
  }
}
