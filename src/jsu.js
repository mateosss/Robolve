// Javscript Related Utilities and Initializations
// It probably has repeated code because it is made for performance not for size

Map.prototype.getki = function(i) { // Gets the key that corresponds to an index
  return Array.from(this.keys())[i];
};

Map.prototype.geti = function(i) { // Gets the value that corresponds to an index
  return Array.from(this.values())[i];
};

Map.prototype.seti = function(i, value) { // Sets the value of an index
  this.set(this.getki(i), value);
};

Object.values = Object.values || function (object) {
  return Object.keys(object).map(key => object[key]);
};

var _ = {
  size: object => Object.keys(object).length, // length of an object
  props: Class => new Class(), // new empty class, used for getting constants
  format: function(string, params, flexible) { // similar to python str.format
    if (typeof params !== "object") params = Array.prototype.slice.call(arguments, 1);
    var chunks = string.split("{}");
    var final = "";
    if (!flexible && chunks.length - 1 !== params.length) throw "jsu: _.format arguments length doesn't match the given string expected params";
    for (var i = 0; i < chunks.length - 1; i++) final += chunks[i] + params[i];
    final += _.last(chunks);
    return final;
  },
  last: (array, value) => { // returns the last element of an array or modifies it if a value is provided
    if (!value) return array[array.length - 1];
    else array[array.length - 1] = value;
  },
  insert: function(array, pos) { // inserts elements into an array at a given position
    // Put the elements separated by commas after the pos param
    var elements = Array.prototype.slice.call(arguments, 2);
    Array.prototype.splice.apply(array, [pos, 0].concat(elements));
  },
  capitalize: string => string[0].toUpperCase() + string.slice(1),
  concat: function() { // adds objects to the first object argument and returns it
    for (var i = 1; i < arguments.length; i++) {
      for (var a in arguments[i]) {
        arguments[0][a] = arguments[i][a];
      }
    }
    return arguments[0];
  },
  objFilter: (obj, filter) => { // Returns a copy of obj with only the props that pass the filter
    let res = {};
    for (let k in obj) if (filter(k, obj[k])) res[k] = obj[k];
    return res;
  },
  objMap: (obj, map) => { // Returns a copy of obj with every [k,v] mapped by map to another [k',v'], if map returns something different than a length 2 array, it is considered as a deleted property
    let res = {};
    for (let k in obj) {
      let newPair = map(k, obj[k]);
      if (newPair && newPair.length === 2) res[newPair[0]] = newPair[1];
    }
    return res;
  },
  pick: (obj, props) => _.objFilter(obj, k => _.in(k, props)), // Returns a copy of obj with only the selected props
  in: (elem, arr) => arr.indexOf(elem) !== -1,
  swap: (arr, i, j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  },
  itime: (message) => {
    _.time = new Date().getTime();
    _.timemsg = message;
  },
  time: 0,
  timemsg: 0,
  etime: () => console.log(_.format("{}: {}ms", _.timemsg, new Date().getTime() - _.time)),
  test: (func, self, iterations, ...params) => {
    var iTime = new Date().getTime();
    for (var i = 0; i < iterations; i++) {
      func.apply(self, params);
    }
    var eTime = new Date().getTime() - iTime;
    return eTime;
  },
  revEach: function(array, func, context) { // Reverse forEach from last to first element in array
    for (var i = array.length - 1; i >= 0; i--) {
      func.call(context, array[i], i, array);
    }
  },
  revFind: (array, predicate) => {
    let match;
    let i = array.length - 1;
    while (i >= 0 && match === undefined) {
      if (predicate(array[i])) match = array[i];
      else i--;
    }
    return match;
  },
  min: (x, y) => x < y ? x : y,
  max: (x, y) => x > y ? x : y,
  clamp: (n, min, max) => n > max ? max : (n < min ? min : n),
  randn: (n) => { // Normal distribution approximation random, n=6 is pretty good, see http://jsfiddle.net/xx9bh8Lz/127/
  	let rand = 0;
    for (let i = 0; i < n; i++) rand += Math.random();
    return rand / n;
  },
  randnint: (n, from, to) => from + Math.floor(_.randn(n) * (to - from + 1)),
  rand6intCenter: (center) => Math.floor(_.randn(6) * 2 * center),
  randint: (from, to) => from + Math.floor(Math.random() * (to - from + 1)),
  randchoice: (array) => array[_.randint(0, array.length - 1)],
  randchoiceObj: (obj) => obj[_.randchoice(Object.keys(obj))],
  wrap: (func, ...params) => {return () => func(...params);}, // Returns a function that executes a function with specific params
  sequence: (self, ...funcs) => { return () => { // Returns a function that executes funcs (with no params) (with self context) in sequence
    for (var i = 0; i < funcs.length; i++) funcs[i].apply(self);
  };},
  assert: console.assert || ((bool, error) => { if (!bool) console.log(error); }),
  formatVarName: name => { // from "someVarName" to "Some Var Name"
    let res = name[0].toUpperCase();
    for (let l of name.slice(1)) {
      res += l === l.toUpperCase() ? " " + l : l;
    }
    return res;
  },
  invert: object => { // from {a: 1, b: 2} to {1: 'a', 2: 'b'}
    let res = {};
    Object.keys(object).forEach((key) => { res[object[key]] = key; });
    return res;
  },
  tryParseInt: i => {
    let j = parseInt(i);
    return isNaN(j) ? i : j;
  },
  mapNumbers: arr => arr.map(_.tryParseInt),
};
