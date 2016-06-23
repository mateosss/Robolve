var Map = cc.TMXTiledMap.extend({
  positionTarget: cc.p(winSize.width/2,winSize.height/2),
  ctor: function(tmxMap){
    this._super(tmxMap);
    this.scale = 0.15;
    this.setAnchorPoint(0.5, 0.5);
    this.scheduleUpdate();
  },
  spawnRobot: function(child, layer, tag){
    layer = layer || null;
    tag = tag || null;
    this.addChild(child, layer, tag);
    child.scale = 0.2;
    p = this.getSpawnPoint();
    child.setPosition(p.x, p.y+48);

  },
  getSpawnPoint: function(){
    spawnPoint = this.getObjectGroup("Objects").getObject("SpawnPoint");
    tileCoord = this.tileCoordFromObject(this, spawnPoint);
    mapLayer = this.getLayer("Background");
    p = mapLayer.getPositionAt(tileCoord);
    return p;
  },
  tileCoordFromObject: function(tileMap, obj){
    //Returns the cocos coordinates of an object in an isometric map
    mapHeight = tileMap.getMapSize().height;
    tileHeight = tileMap.getTileSize().height;

    x = obj.x;
    y = obj.y;
    w = obj.width;
    h = obj.height;

    // height - object's height in # of tiles along axis
    // objTileWidth = w / tileHeight - 1.0;
    // objTileHeight = h / tileHeight - 1.0;
    objTileX = x / tileHeight;
    // Cocos2d flips Y ("top left" corner becomes "bottom left", same with right)
    objTileY = mapHeight - y / tileHeight - h / tileHeight;

    return cc.p(objTileX, objTileY);
  },
  update: function(deltaTime){
    this.x = (this.positionTarget.x - this.x) * deltaTime * 16 + this.x;
    this.y = (this.positionTarget.y - this.y) * deltaTime * 16 + this.y;
  },
});

var base;
