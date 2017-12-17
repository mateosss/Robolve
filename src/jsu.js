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
  randint: (from, to) => from + Math.floor(Math.random() * (to - from + 1)),
  randchoice: (array) => array[_.randint(0, array.length - 1)],
  wrap: (func, ...params) => {return () => func(...params);}
};
