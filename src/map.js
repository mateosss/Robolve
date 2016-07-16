var TiledMap = cc.TMXTiledMap.extend({
  level: null,
  CHILD_SCALE: 0.2,
  positionTarget: cc.p(winSize.width/2,winSize.height/2),
  ctor: function(level, tmxMap){
    this.level = level;
    this._super(tmxMap);
    this.scale = 0.15;
    this.setAnchorPoint(0.5, 0.5);
    this.scheduleUpdate();
  },
  toString: function(){
    return "Map";
  },
  spawn: function(child, layer, tag){
    //Spawn a robot, deffense or base in the map
    layer = layer || null;
    tag = tag || null;
    //TODO calcular que sprite spawneado tiene mas prioridad en el eje z con esto
    //http://stackoverflow.com/questions/19345011/cocos2d-x-adding-objects-to-isometric-tilemap
    // tmpCastle->setAnchorPoint(0.5, 0);
    // int z = (TILEMAP_WIDTH - tmpCastle->getPositionX()) + (TILEMAP_HEIGHT
    // - tmpCastle->getPositionY());
    // tmpCastle->setZOrder(z);

    this.addChild(child, layer, tag);
    child.scale = this.CHILD_SCALE;//TODO escalado? asi se hace?
    p = this.getSpawnPoint(child);
    child.setPosition(p);
  },
  getSpawnPoint: function(child){
    spawnPoint = this.getObjectGroup("Objects").getObject(
      "Spawn" + child.toString()
    );
    tileCoord = this.tileCoordFromObject(spawnPoint);
    mapLayer = this.getLayer("Background");
    tileSize = this.getTileSize();

    p = mapLayer.getPositionAt(tileCoord);

    // debug = new Debugger();//TODO sacar despues las cosas de debug
    // var punto = cc.p(1,1);
    // debug.debugPoint(this, {point: p, color:cc.color(0,255,0,255)});
    // debug.debugPoint(this, {point: this.getMidPointFromTile(punto), color:cc.color(0,0,255,255)});
    // debug.debugRect(this, {rect:this.spriteRectFromTile(punto)});
    // debug.debugTile(this, {tile:this.rectFromTile(punto)});
    // debug.debugText(this, {text: "Robots Count: " + this.level.robots.length});
    p.y += tileSize.height / 2;
    return p;
  },
  tileCoordFromObject: function(obj){
    //Returns the tile coordinates from a tiled map object
    //Source: http://discuss.cocos2d-x.org/t/isometric-map-is-returning-wrong-position-for-object/27100/7
    var mapHeight = this.getMapSize().height;
    var tileHeight = this.getTileSize().height;
    var x = obj.x;
    var y = obj.y;
    var w = obj.width;
    var h = obj.height;
    var objTileX = Math.floor(x / tileHeight);
    var objTileY = Math.floor(mapHeight - y / tileHeight - h / tileHeight) - 1;
    return cc.p(objTileX, objTileY);
  },
  tileCoordFromChild: function(child){
    //Retruns the tile coordinates from a child of the map
    //Source: Learn iPhone and iPad cocos2d Game Development - Book
    var mapWidth = this.getMapSize().width;
    var mapHeight = this.getMapSize().height;
    var tileWidth = this.getTileSize().width;
    var tileHeight = this.getTileSize().height;

    var tilePosDiv = cc.p(child.x / tileWidth, child.y / tileHeight);
    var inverseTileY = mapHeight - tilePosDiv.y;
    // Cast to int makes sure that result is in whole numbers
    var posX = Math.floor(inverseTileY + tilePosDiv.x - mapWidth / 2);
    var posY = Math.floor(inverseTileY - tilePosDiv.x + mapWidth / 2);

    posX = Math.max(0, posX);
    posX = Math.min(mapWidth - 1, posX);
    posY = Math.max(0, posY);
    posY = Math.min(mapHeight - 1, posY);
    return cc.p(posX, posY);
  },
  tileCoordFromLocation: function(loc){
    //TODO returns the tile coord from a screen location if loc is inside map
  },
  spriteRectFromTile: function(tileCoord){
    //Returns the rect, of a sprite, of a tile (expressed in tilemap coords)
    tile = this.getLayer("Background").getTileAt(tileCoord);
    var rect = cc.rect(
      tile.x, tile.y,
      tile.width, tile.height
    );
    return rect;
  },
  rectFromTile: function(tileCoord){
    //Returns the rect of a tile expressed in tilemap coords
    tile = this.getLayer("Background").getTileAt(tileCoord);
    var rect = cc.rect(
      tile.x, tile.y,
      this.getTileSize().width, this.getTileSize().height
    );
    return rect;
  },
  getMidPointFromTile: function(tileCoord){
    var tile = this.rectFromTile(tileCoord);
    return cc.p(cc.rectGetMidX(tile), cc.rectGetMidY(tile));
  },
  update: function(deltaTime){
    this.x = (this.positionTarget.x - this.x) * deltaTime * 16 + this.x;
    this.y = (this.positionTarget.y - this.y) * deltaTime * 16 + this.y;
  },
});


var Base = cc.Sprite.extend({
  level: null, // Level where this object is placed
  cLife: null, // Current life
  sLife: null, // Initial life
  cTilePos: null, // Current Tile Position
  ctor: function(level, life){
    this._super(res.base);
    this.level = level;
    this.sLife = this.cLife = life;
    this.setAnchorPoint(0.5, 0.1);
    this.createHealthBar();
    this.debug();
  },
  toString: function(){
    return "Base";
  },
  debug: function(){
    // Creates a debugger for verbose information directly on the canvas
    this.debugger = new Debugger(this);
    this.debugger.methods = [ // Modify debug information on canvas
      { method: this.debugger.debugAnchor },
      // { method: this.debugger.debugRange },
    ];
    this.debugger.debug();
  },
  createHealthBar: function(){
    //TODO Repeating from robot, maybe has to go in debugger
    //Creates two rectangles for representing the healtbar
    var originB = cc.p(-200, 0);
    var originF = cc.p(-195, 5);
    var destinationB = cc.p(200, 100);
    var destinationF = cc.p(195, 95);
    var fillColorB = cc.color(0, 0, 0, 255);
    var fillColorF = cc.color(0, 200, 100, 255);

    var back = new cc.DrawNode();
    var front = new cc.DrawNode();
    back.drawRect(originB, destinationB, fillColorB, 0, fillColorB);
    front.drawRect(originF, destinationF, fillColorF, 0, fillColorF);
    front.setAnchorPoint(0.0, 0.0);
    front.setPosition(this.getAnchorPointInPoints());
    back.setPosition(this.getAnchorPointInPoints());
    //TODO como centrar los sprites en el tile?
    back.y += 500;
    front.y += 500;
    front.setName("hpbar");
    this.addChild(back, 10);
    this.addChild(front, 11);
  },
  updateHealthBar: function(){
    //updates the healthbar length with the sLife stat
    var hpbar = this.getChildByName("hpbar");
    hpbar.setScaleX(this.cLife / this.sLife);
  },
  hurt: function(robot){
    //This function calculates the total damage of the bullet depending on the
    //Robot, and do some things in reaction
    this.cLife -= robot.sDamage;
    if (this.cLife <= 0) {
      this.life = 0;
      this.kill();
    }
    this.updateHealthBar();
  },
  kill: function(){
    //In the next frame the level will remove the robots with destroy==true
    console.info("GAME OVER");
  },
});
