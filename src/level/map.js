var TiledMap = cc.TMXTiledMap.extend({
  // zOrders from 0..200000 are reserved from things affected by perspective like robots, defenses, etc.
  level: null,
  CHILD_SCALE: 0.8,
  positionTarget: null, // The map tries to follow this point with a smooth delay
  ctor: function(level, tmxMap){
    this.level = level;
    this._super(tmxMap);
    this.scale = 0.05;
    this.setAnchorPoint(0.5, 0.5);
    this.scheduleUpdate();
    this.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
    this.positionTarget = this.getPosition();
    this.runAction(new cc.Sequence(new cc.DelayTime(0.5), new cc.EaseBackOut(new cc.ScaleTo(1, 0.25))));

    easyTouchEnded(this, function(map, event) {
      var btnRect = map.level.hud.ds.confirm.getBoundingBoxToWorld();
      var isNotABtn = !cc.rectContainsPoint(btnRect, event.getLocation());//TODO pretty unclean
      if (map.level.dummyDefense && map.level.dummyDefense.visible === true && isNotABtn) {
        var tile = map.tileCoordFromChild(cc.pAdd(this.convertToNodeSpace(event.getLocation()), cc.p(0, -32)));

        map.moveToTile(map.level.dummyDefense, tile, true, 0.2);

        ///////TODO ALL THIS CODE IS REPEATED FROM GAME.JS
        var color;
        var tint;

        if (map.level.dummyDefense.canBePlacedOn(tile).result && map.level.character.getGold() >= rb.prices.createDefense) {
          color = cc.color(0, 255, 100, 50);
        } else {
          color = cc.color(255, 50, 50, 50);
        }
        tint = new cc.TintTo(0.2, color.r, color.g, color.b);
        map.level.dummyDefense.runAction(tint);
        /////////////
        // map.selectTile(tile, color);
      }
    }, {options: {passEvent: true}});
  },
  zoomFit: function() {
    this.runAction(new cc.EaseBackOut(new cc.ScaleTo(0.4, 0.25)));
    this.positionTarget = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
  },
  toString: () => "Map",
  zOrderFromPos: pos => pos.x + (1280 - pos.y) * 128,
  addChild: function(child, localZOrder, tag) {
    // WARNING: For some reason this function overrides the cocos `name` or `getName()` property, be sure to set name after addChild
    // Dont change zOrder of the TMX background
    if (child instanceof cc.TMXLayer) this._super(child, localZOrder, tag);
    else this._super(child, localZOrder || this.zOrderFromPos(child), tag);
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
    let allObjects = this.getObjectGroup("Objects").getObjects();
    let defenses = [];
    for (let i = 0; i < allObjects.length; i++) {
      if (allObjects[i].name.startsWith("SpawnDefense")) {
        // Creates the new defense
        let dna = [];
        // TODO ignoring jshint warning, for jshint bug: https://github.com/jshint/jshint/issues/3100
        Defense.prototype.STATS.forEach((__, stat) => dna.push(_.tryParseInt(allObjects[i][stat]))); // jshint ignore:line
        let defense = new Defense(this.level, dna);
        defense.retain();
        defense.setBuilt();
        // Calculates the new defense position
        let p = this.tileCoordFromObject(allObjects[i]);
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
      sprite.stopAllActions();
      animDuration = animDuration || 0.2;
      var move = new cc.EaseBackOut(new cc.MoveTo(animDuration, p));
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
    child.scale = this.CHILD_SCALE;//TODO escalado? asi se hace?
    var p = position || this.getSpawnPoint(child);
    child.setPosition(p);
    this.addChild(child, layer, tag);
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
    // Be careful with rounding errors
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
    if (zoom >= 0.15 && zoom <= 2.0) {
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
    let winSize = cc.winSize;
    let mapHalfWidth = (this.width * this.scale) / 2;
    let mapHalfHeight = (this.height * this.scale) / 2;

    let maxLeft = winSize.width - 500 - mapHalfWidth;
    let maxRight = 500 + mapHalfWidth;
    let maxDown = winSize.height - 500 - mapHalfHeight;
    let maxUp = 500 + mapHalfHeight;

    let newX = this.positionTarget.x + x;
    let newY = this.positionTarget.y + y;

    if (newX < maxLeft) newX = maxLeft;
    if (newX > maxRight) newX = maxRight;
    if (newY < maxDown) newY = maxDown;
    if (newY > maxUp) newY = maxUp;

    this.positionTarget.x = newX;
    this.positionTarget.y = newY;
  },
  update: function(deltaTime){
    this.x = (this.positionTarget.x - this.x) * 0.033 * 16 + this.x;
    this.y = (this.positionTarget.y - this.y) * 0.033 * 16 + this.y;
  },
});
