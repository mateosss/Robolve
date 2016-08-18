// TODO este archivo no deberia existir, hacer algo para que no exista
var deffenses = {
  ctor: function(level) {
    range = 0;//0,1,2
    element = "electric";//water,fire,electric
    terrain = 0;//0,1
    damage = 2;//0,1,2
    attackSpeed = 2;//0,1,2
    var customDeffense = new Deffense(this, element, range, terrain, damage, attackSpeed);
    mapLayer = this.map.getLayer("Background");

    //Spawn
    // p = mapLayer.getPositionAt(cc.p(0,0));
    // tileSize = this.map.getTileSize();
    // p.y += tileSize.height / 2;
    // this.map.spawn(customDeffense, p, 5);
    // this.deffenses.push(customDeffense);
  }
};
