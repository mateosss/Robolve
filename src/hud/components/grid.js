var Grid = ccui.Layout.extend({
  displayManager: null, // Manages the size and location of this component
  grid: null, // Custom options for the setup
  cells: null, // List of the grid's cells
  ctor: function(cells, options) {
    this.grid = this.grid || {
      rows: Infinity, // Infinity means adaptive
      cols: 3,
    };
    this._super();
    this.cells = [];
    cells.forEach(c => this.addCell(c));
    this.displayManager = new DisplayManager(this, options);
    this.setup(options);
  },
  setup: function(options) {
    let rows = this.grid.rows = options.rows || this.grid.rows;
    let cols = this.grid.cols = options.cols || this.grid.cols;

    this.displayManager.setup(options);
    
    let finished = false;
    let width = (100 / this.grid.cols);
    for (let i = 0; i < rows && !finished; i++) {
      for (let j = 0; j < cols && !finished; j++) {
        if (i * cols + j < this.cells.length) {
          this.cells[i * cols + j].setup({width: width + "pw", height: width + "pw", x: (width * j) + "pw", y: -width * (i + 1) + "pw"});
        } else finished = true;
      }
    }

  },
  addCell: function(cell) {
    let width = (100 / this.grid.cols);
    let i = Math.floor(this.cells.length / this.grid.cols);
    let j = this.cells.length % this.grid.cols;
    cell.setup({width: width + "pw", height: width + "pw", x: (width * j) + "pw", y: -width * (i + 1) + "pw"});
    this.cells.push(cell);
    cell.addTo(this);
  },
  toString: () => "Layout"
});
