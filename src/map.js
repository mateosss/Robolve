var TiledMap = cc.TMXTiledMap.extend({
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
    tileCoord = this.tileCoordFromObject(this, spawnPoint);
    mapLayer = this.getLayer("Background");
    tileSize = this.getTileSize();

    p = mapLayer.getPositionAt(tileCoord);

    p.y += tileSize.height + (0.25*tileSize.height);
    p.x += tileSize.width / 2 - (0.25*tileSize.width / 2);
    // p.y += tileSize.height;
    // p.x += tileSize.width / 2;
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
    objTileX = x / tileHeight + 1;
    // Cocos2d flips Y ("top left" corner becomes "bottom left", same with right)
    objTileY = mapHeight - y / tileHeight - h / tileHeight + 1;
    return cc.p(objTileX, objTileY);
  },
  update: function(deltaTime){
    this.x = (this.positionTarget.x - this.x) * deltaTime * 16 + this.x;
    this.y = (this.positionTarget.y - this.y) * deltaTime * 16 + this.y;
  },
});


var Base = cc.Sprite.extend({
  level: null, // Level where this object is placed
  cLife: null, // Current life
  ctor: function(level){
    this._super(res.base);
    this.level = level;
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
      { method: this.debugger.debugRange },
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
    back.drawRect(originB, destinationB, fillColorB);
    front.drawRect(originF, destinationF, fillColorF);
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
    console.log("GAME OVER");
  },
});
