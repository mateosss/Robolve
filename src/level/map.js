var TiledMap = cc.TMXTiledMap.extend({
  level: null,
  CHILD_SCALE: 0.8,
  positionTarget: cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2),
  ctor: function(level, tmxMap){
    this.level = level;
    this._super(tmxMap);
    this.scale = 0.15;
    this.setAnchorPoint(0.5, 0.5);
    this.scheduleUpdate();

    easyTouchEnded(this, function(map, event) {
      var btnRect = map.level.hud.ds.ok.getBoundingBoxToWorld();
      var isNotABtn = !cc.rectContainsPoint(btnRect, event.getLocation());//TODO pretty unclean
      if (map.level.dummyDefense && map.level.dummyDefense.visible === true && isNotABtn) {
        var tile = map.tileCoordFromLocation(event.getLocation());
        map.moveToTile(map.level.dummyDefense, tile);

        ///////TODO ALL THIS CODE IS REPEATED FROM GAME.JS
        var color;
        var tint;

        if (map.level.dummyDefense.canBePlacedOn(tile).result && map.level.base.gold >= rb.prices.createDefense) {
          color = cc.color(0, 255, 100, 50);
        } else {
          color = cc.color(255, 50, 50, 50);
        }
        tint = new cc.TintTo(0.2, color.r, color.g, color.b);
        map.level.dummyDefense.runAction(tint);
        /////////////
        map.selectTile(tile, color);
      }
    }, {options: {passEvent: true}});
  },
  toString: function(){
    return "Map";
  },
  placeOnTile: function(sprite, tile) {
    var mapLayer = this.getLayer("Background");
    // var p = mapLayer.getPositionAt(tile);
    var p = this.getMidPointFromTile(tile);
    var tileSize = this.getTileSize();
    p.y += tileSize.height / 2;
    this.spawn(sprite, p);
  },
  getMapDefenses: function() {
    // customRobot.retain();
    var allObjects = this.getObjectGroup("Objects").getObjects();
    var defenses = [];
    for (var i = 0; i < allObjects.length; i++) {
      if (allObjects[i].name.startsWith("SpawnDefense")) {
        // Creates the new defense
        var defense = new Defense(
          this.level,
          parseInt(allObjects[i].life),
          allObjects[i].element,
          parseInt(allObjects[i].range),
          parseInt(allObjects[i].terrain),
          parseInt(allObjects[i].damage),
          parseInt(allObjects[i].attackSpeed)
        );
        defense.retain();
        // Calculates the new defense position
        var p = this.tileCoordFromObject(allObjects[i]);
        // Push the defense and location
        defenses.push({defense: defense, position: p});
      }
    }
    return defenses;
  },
  moveToTile: function(sprite, tile, withAnimations, animDuration) {
    var mapLayer = this.getLayer("Background");
    // var p = mapLayer.getPositionAt(tile);
    var p = this.getMidPointFromTile(tile);
    var tileSize = this.getTileSize();
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
    //Spawn a robot, defense or base in the map
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
    var p = position || this.getSpawnPoint(child);
    child.setPosition(p);
  },
  getSpawnPoint: function(child){
    var spawnPoint = this.getObjectGroup("Objects").getObject(
      "Spawn" + child.toString()
    );
    var tileCoord = this.tileCoordFromObject(spawnPoint);
    var mapLayer = this.getLayer("Background");
    var tileSize = this.getTileSize();

    var p = mapLayer.getPositionAt(tileCoord);

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
    var objTileY = Math.floor(mapHeight - y / tileHeight - h / tileHeight);
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
    var mapLoc = this.convertToNodeSpace(loc);
    var tilePos = this.tileCoordFromChild(mapLoc);
    return tilePos;
  },
  spriteRectFromTile: function(tileCoord){
    //Returns the rect of a tile's sprite (expressed in tilemap coords)
    var tile = this.getLayer("Background").getTileAt(tileCoord);
    var rect = cc.rect(
      tile.x, tile.y,
      tile.width, tile.height
    );
    return rect;
  },
  rectFromTile: function(tileCoord){
    //Returns the rect of a tile expressed in tilemap coords
    var tile = this.getLayer("Background").getTileAt(tileCoord);
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
  zoomMap: function(zoomDelta) {
    var zoom = this.scale + zoomDelta;
    if (zoom >= 0.15 && zoom <= 1.0) {
      this.scale = zoom;
      // mapCenter = this.map.convertToWorldSpaceAR(this.map.getAnchorPoint());
      // difference = cc.pSub(mapCenter, this.clickLocation);
      // TODO para que funcione el zoom hacia algo
      // obtener la posicion en el mapa de mi click
      // setear esa posicion como el anchor point
      // escalar desde ahi
      // dejar el anchor point donde estaba
      // this.moveMap(difference.x * zoomDelta * 10, 0);
    }
  },
  moveMap: function(x, y) {
    var winSize = cc.director.getWinSize();
    var mapHalfWidth = (this.width * this.scale)/2;
    var mapHalfHeight = (this.height)/2;

    var maxLeft = winSize.width - 50 - mapHalfWidth;
    var maxRight = 0 + 50 + mapHalfWidth;
    var maxDown = winSize.height + 50 - mapHalfHeight;
    var maxUp = 0 - 50 + mapHalfHeight;

    var newX = this.positionTarget.x + x;
    var newY = this.positionTarget.y + y;

    if (newX < maxLeft) {
      newX = maxLeft;
    }
    if (newX > maxRight) {
      newX = maxRight;
    }

    if (newY < maxDown) {
      newY = maxDown;
    }
    if (newY > maxUp) {
      newY = maxUp;
    }

    this.positionTarget.x = newX;
    this.positionTarget.y = newY;
  },
  update: function(deltaTime){
    this.x = (this.positionTarget.x - this.x) * deltaTime * 16 + this.x;
    this.y = (this.positionTarget.y - this.y) * deltaTime * 16 + this.y;
  },
});
