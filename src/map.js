var TiledMap = cc.TMXTiledMap.extend({
  level: null,
  CHILD_SCALE: 0.8,
  positionTarget: cc.p(winSize.width/2,winSize.height/2),
  ctor: function(level, tmxMap){
    this.level = level;
    this._super(tmxMap);
    this.scale = 0.15;
    this.setAnchorPoint(0.5, 0.5);
    this.scheduleUpdate();

    easyTouchEnded(this, function(map, event) {
      var btnRect = map.level.hud.dsBtnOk.getBoundingBoxToWorld();
      var isNotABtn = !cc.rectContainsPoint(btnRect, event.getLocation());//TODO pretty unclean
      if (map.level.dummyDeffense && map.level.dummyDeffense.visible === true && isNotABtn) {
        var tile = map.tileCoordFromLocation(event);
        map.moveToTile(map.level.dummyDeffense, tile);

        ///////TODO ALL THIS CODE IS REPEATED FROM GAME.JS
        var color;
        var tint;

        if (map.level.dummyDeffense.canBePlacedOn(tile).result && map.level.base.money >= 300) { //TODO 300 deffense price hardcoded TODO
          color = cc.color(0, 255, 100, 50);
        } else {
          color = cc.color(255, 50, 50, 50);
        }
        tint = new cc.TintTo(0.2, color.r, color.g, color.b);
        map.level.dummyDeffense.runAction(tint);
        /////////////
        map.selectTile(tile, color);
      }
    }, {options: {passEvent: true}});
  },
  toString: function(){
    return "Map";
  },
  placeOnTile: function(sprite, tile) {
    mapLayer = this.getLayer("Background");
    // var p = mapLayer.getPositionAt(tile);
    var p = this.getMidPointFromTile(tile);
    tileSize = this.getTileSize();
    p.y += tileSize.height / 2;
    this.spawn(sprite, p);
  },
  moveToTile: function(sprite, tile, withAnimations, animDuration) {
    mapLayer = this.getLayer("Background");
    // var p = mapLayer.getPositionAt(tile);
    var p = this.getMidPointFromTile(tile);
    tileSize = this.getTileSize();
    p.y += tileSize.height / 2; //TODO esto deberia existir? aparece en muchas pates
    if (!withAnimations) {
      sprite.setPosition(p);
    } else {
      animDuration = animDuration || 1;
      var move = new cc.MoveTo(animDuration, p);
      sprite.runAction(move);
    }
  },
  spawn: function(child, position, layer, tag){
    //Spawn a robot, deffense or base in the map
    position = position || null;
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
    p = position || this.getSpawnPoint(child);
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
    //Returns the tile coordinates from a tiled map object dont use this for sprites, use the FromChild instead
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
    // Returns the tile coord from a screen location or event if loc is inside map
    var mapLoc = this.convertTouchToNodeSpace(loc);
    var tilePos = this.tileCoordFromChild(mapLoc);
    return tilePos;
  },
  spriteRectFromTile: function(tileCoord){
    //Returns the rect of a tile's sprite (expressed in tilemap coords)
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
  selectTile: function(tilePos, color, isNotTileCoord) {
    isNotTileCoord = isNotTileCoord || false;
    if (isNotTileCoord) {
      tilePos = this.tileCoordFromObject(tilePos);
    }
    if (!this.debugger) {//TODO debugger is a dependency
      this.debugger = new Debugger(this);
    }
    this.debugger.debugTile(this, {stop: true});
    this.debugger.debugTile(this.level.map, {
      tile:this.rectFromTile(tilePos),
      fillColor: color,
      z: 1
    });
  },
  update: function(deltaTime){
    this.x = (this.positionTarget.x - this.x) * deltaTime * 16 + this.x;
    this.y = (this.positionTarget.y - this.y) * deltaTime * 16 + this.y;
  },
});
