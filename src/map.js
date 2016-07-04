var Map = cc.TMXTiledMap.extend({
  CHILD_SCALE: 0.2,
  positionTarget: cc.p(winSize.width/2,winSize.height/2),
  ctor: function(tmxMap){
    this._super(tmxMap);
    this.scale = 0.15;
    this.setAnchorPoint(0.5, 0.5);
    this.scheduleUpdate();
  },
  toString: function(){
    return "Map";
  },
  spawn: function(child, layer, tag){ //TODO muy imprecisa esta funcion
    //Spawn a robot or deffense in the map
    layer = layer || null;
    tag = tag || null;
    this.addChild(child, layer, tag);
    child.scale = this.CHILD_SCALE;//TODO escalado? asi se hace?
    p = this.getSpawnPoint(child);
    child.setPosition(p.x, p.y+48);//TODO y+48? fijarse como hacer mejor los sprites
  },
  getSpawnPoint: function(child){
    spawnPoint = this.getObjectGroup("Objects").getObject(
      "Spawn" + child.toString()
    );
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
