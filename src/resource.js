var res = {
  HelloWorld_png : "res/HelloWorld.png",
  map: "res/map.png",
  empty:"res/sprites/empty.png",
  invalidPart: "res/sprites/invalidPart.png",
  parts:{
    heads: {
      "waterWeak":"res/sprites/heads/waterWeak.png",
      "waterNormal":"res/sprites/heads/waterNormal.png",
      "waterStrong":"res/sprites/heads/waterStrong.png",
      "fireWeak":"res/sprites/heads/fireWeak.png",
      "fireNormal":"res/sprites/heads/fireNormal.png",
      "fireStrong":"res/sprites/heads/fireStrong.png",
      "electricWeak":"res/sprites/heads/electricWeak.png",
      "electricNormal":"res/sprites/heads/electricNormal.png",
      "electricStrong":"res/sprites/heads/electricStrong.png",
    },
    middles:{
      "weak": "res/sprites/middles/weak.png",
      "normal": "res/sprites/middles/normal.png",
      "strong": "res/sprites/middles/strong.png",
    },
    arms:{
      "waterMeleL":"res/sprites/arms/waterMeleL.png",
      "waterMeleR":"res/sprites/arms/waterMeleR.png",
      "waterRangeL":"res/sprites/arms/waterRangeL.png",
      "waterRangeR":"res/sprites/arms/waterRangeR.png",
      "fireMeleL":"res/sprites/arms/fireMeleL.png",
      "fireMeleR":"res/sprites/arms/fireMeleR.png",
      "fireRangeL":"res/sprites/arms/fireRangeL.png",
      "fireRangeR":"res/sprites/arms/fireRangeR.png",
      "electricMeleL":"res/sprites/arms/electricMeleL.png",
      "electricMeleR":"res/sprites/arms/electricMeleR.png",
      "electricRangeL":"res/sprites/arms/electricRangeL.png",
      "electricRangeR":"res/sprites/arms/electricRangeR.png",
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
for (var i in res) {
  if (i != "parts") {
    g_resources.push(res[i]);
  }
}

for (var part in res.parts){
  for (var subpart in res.parts[part]) {
    g_resources.push(res.parts[part][subpart]);
  }
}
