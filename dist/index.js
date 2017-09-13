(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("path"), require("fs"), require("stream"), require("assert"), require("constants"), require("util"), require("os"), require("buffer"));
	else if(typeof define === 'function' && define.amd)
		define(["path", "fs", "stream", "assert", "constants", "util", "os", "buffer"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("path"), require("fs"), require("stream"), require("assert"), require("constants"), require("util"), require("os"), require("buffer")) : factory(root["path"], root["fs"], root["stream"], root["assert"], root["constants"], root["util"], root["os"], root["buffer"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_17__, __WEBPACK_EXTERNAL_MODULE_36__, __WEBPACK_EXTERNAL_MODULE_38__, __WEBPACK_EXTERNAL_MODULE_42__, __WEBPACK_EXTERNAL_MODULE_63__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(5)
var polyfills = __webpack_require__(35)
var legacy = __webpack_require__(37)
var queue = []

var util = __webpack_require__(38)

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
  process.on('exit', function() {
    debug(queue)
    __webpack_require__(17).equal(queue.length, 0)
  })
}

module.exports = patch(__webpack_require__(15))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
  module.exports = patch(fs)
}

// Always patch fs.close/closeSync, because we want to
// retry() whenever a close happens *anywhere* in the program.
// This is essential when multiple graceful-fs instances are
// in play at the same time.
module.exports.close =
fs.close = (function (fs$close) { return function (fd, cb) {
  return fs$close.call(fs, fd, function (err) {
    if (!err)
      retry()

    if (typeof cb === 'function')
      cb.apply(this, arguments)
  })
}})(fs.close)

module.exports.closeSync =
fs.closeSync = (function (fs$closeSync) { return function (fd) {
  // Note that graceful-fs also retries when fs.closeSync() fails.
  // Looks like a bug to me, although it's probably a harmless one.
  var rval = fs$closeSync.apply(fs, arguments)
  retry()
  return rval
}})(fs.closeSync)

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch
  fs.FileReadStream = ReadStream;  // Legacy name.
  fs.FileWriteStream = WriteStream;  // Legacy name.
  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  ReadStream.prototype = Object.create(fs$ReadStream.prototype)
  ReadStream.prototype.open = ReadStream$open

  var fs$WriteStream = fs.WriteStream
  WriteStream.prototype = Object.create(fs$WriteStream.prototype)
  WriteStream.prototype.open = WriteStream$open

  fs.ReadStream = ReadStream
  fs.WriteStream = WriteStream

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  queue.push(elem)
}

function retry () {
  var elem = queue.shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.fromCallback = function (fn) {
  return Object.defineProperty(function () {
    if (typeof arguments[arguments.length - 1] === 'function') fn.apply(this, arguments)
    else {
      return new Promise((resolve, reject) => {
        arguments[arguments.length] = (err, res) => {
          if (err) return reject(err)
          resolve(res)
        }
        arguments.length++
        fn.apply(this, arguments)
      })
    }
  }, 'name', { value: fn.name })
}

exports.fromPromise = function (fn) {
  return Object.defineProperty(function () {
    const cb = arguments[arguments.length - 1]
    if (typeof cb !== 'function') return fn.apply(this, arguments)
    else fn.apply(this, arguments).then(r => cb(null, r), cb)
  }, 'name', { value: fn.name })
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const u = __webpack_require__(2).fromCallback
const mkdirs = u(__webpack_require__(43))
const mkdirsSync = __webpack_require__(44)

module.exports = {
  mkdirs: mkdirs,
  mkdirsSync: mkdirsSync,
  // alias
  mkdirp: mkdirs,
  mkdirpSync: mkdirsSync,
  ensureDir: mkdirs,
  ensureDirSync: mkdirsSync
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const u = __webpack_require__(2).fromPromise
const fs = __webpack_require__(14)

function pathExists (path) {
  return fs.access(path).then(() => true).catch(() => false)
}

module.exports = {
  pathExists: u(pathExists),
  pathExistsSync: fs.existsSync
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Expression = function () {
    function Expression() {
        _classCallCheck(this, Expression);

        this.nodeName = "expression";
    }

    _createClass(Expression, [{
        key: "copy",
        value: function copy() {
            throw new Error("Meant to be overriden");
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo() {
            throw new Error("Meant to be overriden");
        }
    }], [{
        key: "getExpressionType",
        value: function getExpressionType(value) {
            if (value instanceof Expression) {
                return value;
            }

            if (typeof value === "string") {
                return Expression.string(value);
            } else if (typeof value === "function") {
                return Expression["function"](value);
            } else if (typeof value === "number") {
                return Expression.number(value);
            } else if (typeof value === "boolean") {
                return Expression.boolean(value);
            } else if (value === null) {
                return Expression["null"](value);
                return Expression["undefined"](value);
            } else if (Array.isArray(value)) {
                return Expression.array(value);
            } else if (value instanceof Date) {
                return Expression.date(value);
            } else {
                return Expression.object(value);
            }
        }
    }, {
        key: "property",
        value: function property(value) {
            return new ValueExpression("property", value);
        }
    }, {
        key: "constant",
        value: function constant(value) {
            return new ValueExpression("constant", value);
        }
    }, {
        key: "boolean",
        value: function boolean(value) {
            var expression = new ValueExpression("boolean");
            expression.value = value;
            return expression;
        }
    }, {
        key: "string",
        value: function string(value) {
            var expression = new ValueExpression("string");
            expression.value = value;
            return expression;
        }
    }, {
        key: "number",
        value: function number(value) {
            var expression = new ValueExpression("number");
            expression.value = value;
            return expression;
        }
    }, {
        key: "object",
        value: function object(value) {
            var expression = new ValueExpression("object");
            expression.value = value;
            return expression;
        }
    }, {
        key: "date",
        value: function date(value) {
            var expression = new ValueExpression("date");
            expression.value = value;
            return expression;
        }
    }, {
        key: "function",
        value: function _function(value) {
            var expression = new ValueExpression("function");
            expression.value = value;
            return expression;
        }
    }, {
        key: "type",
        value: function type(value) {
            var expression = new ValueExpression("type");
            expression.value = value || Object;
            return expression;
        }
    }, {
        key: "null",
        value: function _null(value) {
            var expression = new ValueExpression("null");
            expression.value = value;
            return expression;
        }
    }, {
        key: "undefined",
        value: function undefined(value) {
            var expression = new ValueExpression("undefined");
            expression.value = value;
            return expression;
        }
    }, {
        key: "array",
        value: function array(value) {
            var expression = new ValueExpression("array");
            expression.value = value;
            return expression;
        }
    }, {
        key: "queryable",
        value: function queryable(leftExpression, rightExpression) {
            var expression = new OperationExpression("queryable");
            expression.children.push(leftExpression, rightExpression);
            return expression;
        }

        //
        // OperationExpression helpers
        //

    }, {
        key: "equalTo",
        value: function equalTo() {
            var expression = new OperationExpression("equalTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "notEqualTo",
        value: function notEqualTo() {
            var expression = new OperationExpression("notEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "or",
        value: function or() {
            var expression = new OperationExpression("or");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "and",
        value: function and() {
            var expression = new OperationExpression("and");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "where",
        value: function where() {
            var expression = new OperationExpression("where");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "greaterThan",
        value: function greaterThan() {
            var expression = new OperationExpression("greaterThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "lessThan",
        value: function lessThan() {
            var expression = new OperationExpression("lessThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "greaterThanOrEqualTo",
        value: function greaterThanOrEqualTo() {
            var expression = new OperationExpression("greaterThanOrEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "lessThanOrEqualTo",
        value: function lessThanOrEqualTo() {
            var expression = new OperationExpression("lessThanOrEqualTo");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "orderBy",
        value: function orderBy() {
            var expression = new OperationExpression("orderBy");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "descending",
        value: function descending() {
            var expression = new OperationExpression("descending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "ascending",
        value: function ascending() {
            var expression = new OperationExpression("ascending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "skip",
        value: function skip(value) {
            var expression = new OperationExpression("skip");
            var valueExpression = Expression.constant(value);
            expression.children.push(valueExpression);

            return expression;
        }
    }, {
        key: "take",
        value: function take(value) {
            var expression = new OperationExpression("take");
            var valueExpression = Expression.constant(value);
            expression.children.push(valueExpression);

            return expression;
        }
    }, {
        key: "buildOperatorExpression",
        value: function buildOperatorExpression(name) {
            var expression = new OperationExpression(name);
            var args = Array.prototype.slice.call(arguments, 1);
            args.forEach(function (arg) {
                expression.children.push(arg);
            });

            return expression;
        }
    }, {
        key: "guid",
        value: function guid() {
            var expression = new OperationExpression("guid");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "substring",
        value: function substring() {
            var expression = new OperationExpression("substring");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "substringOf",
        value: function substringOf() {
            var expression = new OperationExpression("substringOf");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "startsWith",
        value: function startsWith() {
            var expression = new OperationExpression("startsWith");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "endsWith",
        value: function endsWith() {
            var expression = new OperationExpression("endsWith");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "isIn",
        value: function isIn(property, array) {
            var expression = new OperationExpression("isIn");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(property, array) {
            var expression = new OperationExpression("isNotIn");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "include",
        value: function include() {
            var expression = new OperationExpression("include");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        }
    }, {
        key: "any",
        value: function any(propertyAccessExpression, expression) {
            var anyExpression = new OperationExpression("any");
            var expressionExpression = Expression.expression(expression);

            anyExpression.children.push(propertyAccessExpression, expressionExpression);
            return anyExpression;
        }
    }, {
        key: "all",
        value: function all(propertyAccessExpression, expression) {
            var allExpression = new OperationExpression("all");
            var expressionExpression = Expression.expression(expression);

            allExpression.children.push(propertyAccessExpression, expressionExpression);
            return allExpression;
        }
    }, {
        key: "expression",
        value: function expression(value) {
            var expresssionExpression = new ValueExpression("expression", value);

            return expresssionExpression;
        }
    }, {
        key: "propertyAccess",
        value: function propertyAccess(leftExpression, propertyName) {
            var propertyExpression = Expression.property(propertyName);
            var propertyAccessExpression = new OperationExpression("propertyAccess");
            propertyAccessExpression.children.push(leftExpression, propertyExpression);

            return propertyAccessExpression;
        }
    }, {
        key: "contains",
        value: function contains(type, namespace, expression) {
            var containsExpression = new OperationExpression("contains");
            var ofTypeExpression = new ValueExpression("ofType", type);
            var propertyExpression = new ValueExpression("property", namespace);

            containsExpression.children.push(ofTypeExpression, propertyExpression, expression);

            return containsExpression;
        }
    }, {
        key: "intersects",
        value: function intersects(type, namespace, expression) {
            var intersectsExpression = new OperationExpression("intersects");
            var ofTypeExpression = new ValueExpression("ofType", type);
            var propertyExpression = new ValueExpression("property", namespace);

            intersectsExpression.children.push(ofTypeExpression, propertyExpression, expression);

            return intersectsExpression;
        }
    }]);

    return Expression;
}();

var ValueExpression = function (_Expression) {
    _inherits(ValueExpression, _Expression);

    function ValueExpression(nodeName, value) {
        _classCallCheck(this, ValueExpression);

        var _this = _possibleConstructorReturn(this, (ValueExpression.__proto__ || Object.getPrototypeOf(ValueExpression)).call(this));

        _this.value = value;
        _this.nodeName = nodeName;
        return _this;
    }

    _createClass(ValueExpression, [{
        key: "copy",
        value: function copy() {
            return new ValueExpression(this.nodeName, this.value);
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(node) {
            if (node && this.nodeName === node.nodeName && this.value === node.value) {
                return true;
            }
            return false;
        }
    }, {
        key: "contains",
        value: function contains(node) {
            return this.isEqualTo(node);
        }
    }]);

    return ValueExpression;
}(Expression);

var OperationExpression = function (_Expression2) {
    _inherits(OperationExpression, _Expression2);

    function OperationExpression(nodeName) {
        _classCallCheck(this, OperationExpression);

        var _this2 = _possibleConstructorReturn(this, (OperationExpression.__proto__ || Object.getPrototypeOf(OperationExpression)).call(this));

        var args = Array.prototype.slice.call(arguments, 0);

        _this2.nodeName = nodeName;
        _this2.children = args.slice(1);
        return _this2;
    }

    _createClass(OperationExpression, [{
        key: "copy",
        value: function copy() {
            var children = [];
            var copy = new OperationExpression(this.nodeName);

            this.children.forEach(function (expression) {
                copy.children.push(expression.copy());
            });

            return copy;
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo() {
            if (!Array.isArray(node.children) || this.nodeName !== node.nodeName) {
                return false;
            }

            if (node.children.length !== this.children.length) {
                return false;
            }

            return this.children.every(function (expression, index) {
                return expression.isEqualTo(node.children[index]);
            });
        }
    }, {
        key: "contains",
        value: function contains(node) {
            var _this3 = this;

            if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
                var matched = node.children.every(function (childNode, index) {
                    return childNode.contains(_this3.children[index]);
                });

                if (matched) {
                    return true;
                }
            }

            return this.children.some(function (childNode) {
                return childNode.contains(node);
            });
        }
    }, {
        key: "getMatchingNodes",
        value: function getMatchingNodes(node, matchedNodes) {
            var _this4 = this;

            matchedNodes = Array.isArray(matchedNodes) ? matchedNodes : [];

            if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
                var matched = node.children.every(function (childNode, index) {
                    return childNode.contains(_this4.children[index], matchedNodes);
                });

                if (matched) {
                    matchedNodes.push(this);
                }
            }

            this.children.forEach(function (childNode) {
                if (Array.isArray(childNode.children)) {
                    childNode.getMatchingNodes(node, matchedNodes);
                }
            }, matchedNodes);

            return matchedNodes;
        }
    }]);

    return OperationExpression;
}(Expression);

exports.Expression = Expression;
exports.ValueExpression = ValueExpression;
exports.OperationExpression = OperationExpression;
//# sourceMappingURL=Expression.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationExpressionBuilder = exports.ExpressionBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Expression = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var returnExpression = function returnExpression(expression) {
    return expression;
};

var OperationExpressionBuilder = function () {
    function OperationExpressionBuilder(getLeftExpression) {
        _classCallCheck(this, OperationExpressionBuilder);

        this.getLeftExpression = getLeftExpression || returnExpression;
    }

    _createClass(OperationExpressionBuilder, [{
        key: "any",
        value: function any(fn) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return _Expression.Expression.any(this.getLeftExpression(), expression);
        }
    }, {
        key: "where",
        value: function where(fn) {
            var propertyAccessExpression = this.getLeftExpression();

            this.getLeftExpression = function () {
                var expressionBuilder = new ExpressionBuilder(Object);
                var expression = fn(expressionBuilder);

                return _Expression.Expression.queryable(propertyAccessExpression, _Expression.Expression.expression(_Expression.Expression.where(expression)));
            };

            return this;
        }
    }, {
        key: "all",
        value: function all(fn) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return _Expression.Expression.all(this.getLeftExpression(), expression);
        }
    }, {
        key: "isEqualTo",
        value: function isEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.equalTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isNotEqualTo",
        value: function isNotEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.notEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "contains",
        value: function contains(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.substringOf(this.getLeftExpression(), constant);
        }
    }, {
        key: "isIn",
        value: function isIn(array) {
            if (Array.isArray(array)) {
                return _Expression.Expression.isIn(this.getLeftExpression(), _Expression.Expression.array(array));
            } else {
                throw new Error("isIn is expecting to be passed an array!");
            }
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(array) {
            if (Array.isArray(array)) {
                return _Expression.Expression.isNotIn(this.getLeftExpression(), _Expression.Expression.array(array));
            } else {
                throw new Error("isNotIn is expecting to be passed an array!");
            }
        }
    }, {
        key: "isGreaterThan",
        value: function isGreaterThan(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.greaterThan(this.getLeftExpression(), constant);
        }
    }, {
        key: "isGreaterThanOrEqualTo",
        value: function isGreaterThanOrEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.greaterThanOrEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isLessThanOrEqualTo",
        value: function isLessThanOrEqualTo(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.lessThanOrEqualTo(this.getLeftExpression(), constant);
        }
    }, {
        key: "isLessThan",
        value: function isLessThan(value) {
            var constant = _Expression.Expression.getExpressionType(value);
            return _Expression.Expression.lessThan(this.getLeftExpression(), constant);
        }
    }, {
        key: "endsWith",
        value: function endsWith(value) {
            return _Expression.Expression.endsWith(this.getLeftExpression(), _Expression.Expression.string(value));
        }
    }, {
        key: "startsWith",
        value: function startsWith(value) {
            return _Expression.Expression.startsWith(this.getLeftExpression(), _Expression.Expression.string(value));
        }
    }, {
        key: "property",
        value: function property(value) {
            var _this = this;

            return new OperationExpressionBuilder(function () {
                return _Expression.Expression.propertyAccess(_this.getLeftExpression(), value);
            });
        }
    }, {
        key: "getExpression",
        value: function getExpression() {
            return this.getLeftExpression();
        }
    }]);

    return OperationExpressionBuilder;
}();

var ExpressionBuilder = function () {
    function ExpressionBuilder(type) {
        _classCallCheck(this, ExpressionBuilder);

        this.type = type || Object;
    }

    _createClass(ExpressionBuilder, [{
        key: "property",
        value: function property(_property) {
            var _this2 = this;

            return new OperationExpressionBuilder(function () {
                return _Expression.Expression.propertyAccess(_Expression.Expression.type(_this2.type), _property);
            });
        }
    }, {
        key: "and",
        value: function and() {
            return _Expression.Expression.and.apply(_Expression.Expression, arguments);
        }
    }, {
        key: "or",
        value: function or() {
            return _Expression.Expression.or.apply(_Expression.Expression, arguments);
        }
    }, {
        key: "value",
        value: function value() {
            var _this3 = this;

            return new OperationExpressionBuilder(function () {
                return _Expression.Expression.type(_this3.type);
            });
        }
    }]);

    return ExpressionBuilder;
}();

exports.ExpressionBuilder = ExpressionBuilder;
exports.OperationExpressionBuilder = OperationExpressionBuilder;
//# sourceMappingURL=ExpressionBuilder.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExpressionVisitor = exports.ExpressionBuilder = exports.Expression = exports.Queryable = undefined;

var _Queryable = __webpack_require__(3);

var _Queryable2 = _interopRequireDefault(_Queryable);

var _Expression = __webpack_require__(0);

var _Expression2 = _interopRequireDefault(_Expression);

var _ExpressionBuilder = __webpack_require__(1);

var _ExpressionBuilder2 = _interopRequireDefault(_ExpressionBuilder);

var _ExpressionVisitor = __webpack_require__(4);

var _ExpressionVisitor2 = _interopRequireDefault(_ExpressionVisitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Queryable = _Queryable2.default;
exports.Expression = _Expression2.default;
exports.ExpressionBuilder = _ExpressionBuilder2.default;
exports.ExpressionVisitor = _ExpressionVisitor2.default;
//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Expression = __webpack_require__(0);

var _ExpressionBuilder = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assertHasProvider = function assertHasProvider(queryable) {
    if (!queryable.provider) {
        throw new Error("No provider found.");
    }
};

var copyQuery = function copyQuery(query) {
    var copy = {};

    copy.where = query.where.copy();
    copy.orderBy = query.orderBy.copy();
    copy.include = query.include.copy();
    copy.parameters = JSON.parse(JSON.stringify(query.parameters));
    copy.take = query.take;
    copy.skip = query.skip;

    return copy;
};

var Queryable = function () {
    function Queryable(type, query) {
        _classCallCheck(this, Queryable);

        query = query || {};

        this.type = type || "Object";
        this.provider = null;
        this.query = {};
        this.query.parameters = query && query.parameters || {};

        if (query.where != null && query.where.nodeName === "where") {
            this.query.where = query.where;
        } else {
            this.query.where = _Expression.Expression.where();
        }

        if (query.skip != null && query.skip.nodeName === "skip") {
            this.query.skip = query.skip;
        } else {
            this.query.skip = _Expression.Expression.skip(0);
        }

        if (query.take != null && query.take.nodeName === "take") {
            this.query.take = query.take;
        } else {
            this.query.take = _Expression.Expression.take(Infinity);
        }

        if (query.include != null && query.include.nodeName === "include") {
            this.query.include = query.include;
        } else {
            this.query.include = _Expression.Expression.include();
        }

        if (query.orderBy != null && query.orderBy.nodeName === "orderBy") {
            this.query.orderBy = query.orderBy;
        } else {
            this.query.orderBy = _Expression.Expression.orderBy();
        }
    }

    _createClass(Queryable, [{
        key: "getExpression",
        value: function getExpression() {
            return this.query;
        }
    }, {
        key: "getQuery",
        value: function getQuery() {
            return this.query;
        }
    }, {
        key: "or",
        value: function or(lambda) {
            var rightExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                rightExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type));
            } else if (lambda instanceof _Expression.Expression) {
                rightExpression = lambda;
            } else {
                throw new Error("Expected an expression to be supplied.");
            }

            if (query.where.children.length === 0) {
                query.where.children.push(rightExpression);
            } else {
                var leftExpression = query.where.children.pop();
                query.where.children.push(_Expression.Expression.or(leftExpression, rightExpression));
            }

            return this.copy(query);
        }
    }, {
        key: "where",
        value: function where(lambda) {
            var rightExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                rightExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type));
            } else if (lambda instanceof _Expression.Expression) {
                rightExpression = lambda;
            } else {
                throw new Error("Expected an expression to be supplied.");
            }

            if (query.where.children.length === 0) {
                query.where.children.push(rightExpression);
            } else {
                var leftExpression = query.where.children.pop();
                query.where.children.push(_Expression.Expression.and(leftExpression, rightExpression));
            }

            return this.copy(query);
        }
    }, {
        key: "and",
        value: function and(lambda) {
            return this.where(lambda);
        }
    }, {
        key: "take",
        value: function take(value) {
            if (typeof value !== "number") {
                throw new Error("Illegal Argument Exception: value needs to be a number.");
            }

            var query = copyQuery(this.getQuery());
            query.take = _Expression.Expression.take(value);

            return this.copy(query);
        }
    }, {
        key: "skip",
        value: function skip(value) {
            if (typeof value !== "number") {
                throw new Error("Illegal Argument Exception: value needs to be a number.");
            }

            var query = copyQuery(this.getQuery());
            query.skip = _Expression.Expression.skip(value);

            return this.copy(query);
        }
    }, {
        key: "orderByDesc",
        value: function orderByDesc(lambda) {
            var propertyExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                propertyExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type)).getExpression();
            } else if (lambda instanceof _ExpressionBuilder.OperationExpressionBuilder) {
                propertyExpression = lambda.getExpression();
            } else {
                throw new Error("Expected a property to orderByDesc.");
            }

            var descendingExpression = _Expression.Expression.descending(propertyExpression);

            if (!query.orderBy.contains(propertyExpression)) {
                query.orderBy.children.push(descendingExpression);
                return this.copy(query);
            } else {
                return this;
            }
        }
    }, {
        key: "orderBy",
        value: function orderBy(lambda) {
            var propertyExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                propertyExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type)).getExpression();
            } else if (lambda instanceof _ExpressionBuilder.OperationExpressionBuilder) {
                propertyExpression = lambda.getExpression();
            } else {
                throw new Error("Expected a property to orderBy.");
            }

            var ascendingExpression = _Expression.Expression.ascending(propertyExpression);

            if (!query.orderBy.contains(propertyExpression)) {
                query.orderBy.children.push(ascendingExpression);
                return this.copy(query);
            } else {
                return this;
            }
        }
    }, {
        key: "setParameters",
        value: function setParameters(params) {
            if (!params) {
                throw new Error("Expected parameters to be passed in.");
            }
            var parameters = this.query.parameters;

            Object.keys(params).forEach(function (key) {
                parameters[key] = params[key];
            });
            return this;
        }
    }, {
        key: "withParameters",
        value: function withParameters(params) {
            if (!params) {
                throw new Error("Expected parameters to be passed in.");
            }

            var parameters = this.query.parameters = {};
            Object.keys(params).forEach(function (key) {
                parameters[key] = params[key];
            });
            return this;
        }
    }, {
        key: "include",
        value: function include(lambda) {
            var propertyExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                propertyExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type)).getExpression();
            } else if (lambda instanceof _ExpressionBuilder.OperationExpressionBuilder) {
                propertyExpression = lambda.getExpression();
            } else {
                throw new Error("Expected a property to include.");
            }

            if (propertyExpression.nodeName !== "queryable") {
                propertyExpression = _Expression.Expression.queryable(propertyExpression, _Expression.Expression.expression(_Expression.Expression.where()));
            }

            query.include.children.push(propertyExpression);
            return this.copy(query);
        }
    }, {
        key: "merge",
        value: function merge(queryable) {
            if (!(queryable instanceof Queryable)) {
                throw new Error("Expected a queryable to be passed in.");
            }

            var clone = this.copy();
            var cloneQuery = clone.getQuery();
            var query = queryable.getQuery();
            var rightExpression = query.where.children[0];

            if (rightExpression != null) {
                // No need to copy if there is nothing to copy.
                if (cloneQuery.where.children.length === 0) {
                    cloneQuery.where.children.push(rightExpression.copy());
                } else if (cloneQuery.where.children.length === 1 && cloneQuery.where.children[0].nodeName === "and") {
                    cloneQuery.where.children[0].children.push(rightExpression.copy());
                } else {
                    var leftExpression = cloneQuery.where.children.pop();
                    cloneQuery.where.children.push(_Expression.Expression.and(leftExpression, rightExpression.copy()));
                }
            }

            query.include.children.forEach(function (expression) {
                cloneQuery.include.children.push(expression.copy());
            });

            query.orderBy.children.forEach(function (expression) {
                if (!cloneQuery.orderBy.contains(expression)) {
                    cloneQuery.orderBy.children.push(expression.copy());
                }
            });

            return this.copy(cloneQuery);
        }
    }, {
        key: "toArrayAsync",
        value: function toArrayAsync() {
            assertHasProvider(this);
            return this.provider.toArrayAsync(this);
        }
    }, {
        key: "countAsync",
        value: function countAsync() {
            assertHasProvider(this);
            return this.provider.countAsync(this);
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync() {
            assertHasProvider(this);
            return this.provider.toArrayWithCountAsync(this);
        }
    }, {
        key: "ofType",
        value: function ofType(type) {
            var queryable = new Queryable(type);
            queryable.provider = this.provider;
            return queryable;
        }
    }, {
        key: "copy",
        value: function copy(query) {
            var queryable = new Queryable(this.type, query || copyQuery(this.query));
            queryable.provider = this.provider;
            return queryable;
        }
    }]);

    return Queryable;
}();

exports.default = Queryable;
//# sourceMappingURL=Queryable.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Expression = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExpressionVisitor = function () {
    function ExpressionVisitor() {
        _classCallCheck(this, ExpressionVisitor);
    }

    _createClass(ExpressionVisitor, [{
        key: "parse",
        value: function parse(expression) {
            var _this = this;

            var children = [];

            if (!expression) {
                return null;
            }

            expression.children.forEach(function (expression) {
                if (!expression.children) {
                    children.push(expression);
                } else {
                    children.push(_this.parse(expression));
                }
            });

            var func = this[expression.nodeName];

            if (!func) {
                throw new Error("The builder doesn't support the \"" + expression.nodeName + "\" expression.");
            }

            children.forEach(function (child, index) {
                if (child instanceof _Expression.Expression) {
                    var func = _this[child.nodeName];
                    if (!func) {
                        throw new Error("The builder doesn't support the \"" + child.nodeName + "\" expression.");
                    }
                    children[index] = func.call(_this, child);
                }
            });

            return func.apply(this, children);
        }
    }]);

    return ExpressionVisitor;
}();

exports.default = ExpressionVisitor;
//# sourceMappingURL=ExpressionVisitor.js.map

/***/ })
/******/ ]);
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User() {
    _classCallCheck(this, User);

    this.id = null;
    this.name = null;
    this.isAdmin = false;
    this.groups = [];
};

exports.default = User;
//# sourceMappingURL=User.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const rimraf = __webpack_require__(47)

module.exports = {
  remove: u(rimraf),
  removeSync: rimraf.sync
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const jsonFile = __webpack_require__(49)

module.exports = {
  // jsonfile exports
  readJson: u(jsonFile.readFile),
  readJsonSync: jsonFile.readFileSync,
  writeJson: u(jsonFile.writeFile),
  writeJsonSync: jsonFile.writeFileSync
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TableStatementBuilder = __webpack_require__(25);

var _TableStatementBuilder2 = _interopRequireDefault(_TableStatementBuilder);

var _queryablejs = __webpack_require__(6);

var _Provider = __webpack_require__(26);

var _Provider2 = _interopRequireDefault(_Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
    function Table(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Table);

        this.sqliteDatabase = options.sqliteDatabase;
        this.edm = options.edm;
        this.name = name;

        if (this.name == null) {
            throw new Error("The table needs to have a name.");
        }

        if (this.sqliteDatabase == null) {
            throw new Error("The table needs to have a sqliteDatabase database.");
        }

        if (this.edm == null) {
            throw new Error("The table needs to have a edm.");
        }

        this.table = this._getTable(name);

        if (this.table == null) {
            throw new Error("Cannot find table called '" + name + "' with-in " + this.edm.name + ".");
        }

        this.tableStatementBuilder = new _TableStatementBuilder2.default(name, options);
        this.provider = new _Provider2.default(name, {
            edm: this.edm,
            sqliteDatabase: this.sqliteDatabase
        });
    }

    _createClass(Table, [{
        key: "_clone",
        value: function _clone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }, {
        key: "_getPrimaryKeyName",
        value: function _getPrimaryKeyName() {
            var column = this.table.columns.find(function (column) {
                return column.isPrimaryKey;
            });

            return column && column.name || null;
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync(entity) {
            var _this = this;

            var sql = this.tableStatementBuilder.createInsertStatement(this.table, entity);

            return this.sqliteDatabase.run(sql.statement, sql.values).then(function (result) {
                var updatedEntity = _this._clone(entity);

                updatedEntity[_this._getPrimaryKeyName()] = result.stmt.lastID;
                return updatedEntity;
            });
        }
    }, {
        key: "asQueryable",
        value: function asQueryable() {
            var queryable = new _queryablejs.Queryable(this.name);
            queryable.provider = this.provider;

            return queryable;
        }
    }, {
        key: "createAsync",
        value: function createAsync() {
            var tableStatement = this.tableStatementBuilder.createTableStatement(this.table, this.edm.relationships);
            var indexesStatements = this.tableStatementBuilder.createTableIndexesStatements(this.table, this.edm.relationships);

            indexesStatements.unshift(tableStatement);

            return this.sqliteDatabase.exec(indexesStatements.join(";"));
        }
    }, {
        key: "dropAsync",
        value: function dropAsync() {
            var statement = this.tableStatementBuilder.createDropTableStatement(this.table.name);

            return this.sqliteDatabase.run(statement);
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider() {
            return this.provider;
        }
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(entity) {
            var sql = this.tableStatementBuilder.createDeleteStatement(this.table, entity);

            return this.sqliteDatabase.run(sql.statement, sql.values).then(function () {
                return entity;
            });
        }
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(entity, delta) {
            var sql = this.tableStatementBuilder.createUpdateStatement(this.table, entity, delta);

            return this.sqliteDatabase.run(sql.statement, sql.values).then(function (statement) {
                return Object.assign({}, entity, delta);
            });
        }
    }]);

    return Table;
}();

exports.default = Table;
//# sourceMappingURL=Table.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    "String": "TEXT",
    "Number": "NUMERIC",
    "Boolean": "NUMERIC",
    "Float": "REAL",
    "Decimal": "REAL",
    "Double": "REAL",
    "Integer": "INTEGER",
    "Date": "NUMERIC",
    "Enum": "NUMERIC"
};
//# sourceMappingURL=dataTypeMapping.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = __webpack_require__(10);

var _Table2 = _interopRequireDefault(_Table);

var _MetaProvider = __webpack_require__(13);

var _MetaProvider2 = _interopRequireDefault(_MetaProvider);

var _queryablejs = __webpack_require__(6);

var _User = __webpack_require__(7);

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultDecorators = {
    name: null,
    edm: null,
    table: null,
    decorators: []
};

var MetaTable = function () {
    function MetaTable() {
        var _this = this;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$table = _ref.table,
            table = _ref$table === undefined ? null : _ref$table,
            _ref$decorators = _ref.decorators,
            decorators = _ref$decorators === undefined ? [] : _ref$decorators,
            _ref$fileSystem = _ref.fileSystem,
            fileSystem = _ref$fileSystem === undefined ? null : _ref$fileSystem;

        _classCallCheck(this, MetaTable);

        if (table == null) {
            throw new Error("Null Argument Exception: MetaTable needs to have a table.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaTable needs to have a fileSystem.");
        }

        this.table = table;
        this.name = table.name;
        this.edm = table.edm;
        this.fileSystem = fileSystem;
        this.edmTable = this._getEdmTable(this.name);
        this.decoratorOptions = {};
        this.decorators = decorators.filter(function (decorator) {
            var decorators = _this.edmTable.decorators || [];

            return decorators.findIndex(function (tableDecorator) {
                _this.decoratorOptions[tableDecorator.name] = tableDecorator.options;
                return tableDecorator.name === decorator.name;
            }) > -1;
        });
    }

    _createClass(MetaTable, [{
        key: "_approveEntityToBeRemovedAsync",
        value: function _approveEntityToBeRemovedAsync(user, entity) {
            return this._invokeMethodOnDecoratorsAsync(user, "approveEntityToBeRemovedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_assertUser",
        value: function _assertUser(user) {
            if (!(user instanceof _User2.default)) {
                throw new Error("Illegal Argument Exception: user needs to be an instance of User.");
            }
        }
    }, {
        key: "_entityAddedAsync",
        value: function _entityAddedAsync(user, entity) {
            return this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "entityAddedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_entityRemovedAsync",
        value: function _entityRemovedAsync(user, entity) {
            return this._invokeMethodWithRecoveryOnDecoratorsAsync(user, "entityRemovedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_entityUpdatedAsync",
        value: function _entityUpdatedAsync(user, entity, delta) {
            var _this2 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this2.decoratorOptions[decorator.name]);
                    return _this2._invokeMethodWithRecoveryAsync(decorator, "entityUpdatedAsync", [_this2.name, entity, delta, options]);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_getEdmTable",
        value: function _getEdmTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_getPrimaryKeyColumn",
        value: function _getPrimaryKeyColumn() {
            return this._getEdmTable(this.name).columns.find(function (column) {
                return column.isPrimaryKey;
            });
        }
    }, {
        key: "_getPrimaryKeyName",
        value: function _getPrimaryKeyName() {
            return this._getPrimaryKeyColumn().name;
        }
    }, {
        key: "_getFilePathById",
        value: function _getFilePathById(id) {
            return this.edm.name + "_" + this.edm.version + "_" + this.edmTable.name + "_" + id;
        }
    }, {
        key: "_invokeMethodAsync",
        value: function _invokeMethodAsync(obj, method) {
            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            if (obj != null && typeof obj[method] === "function") {
                var result = obj[method].apply(obj, args);

                if (!(result instanceof Promise)) {
                    result = Promise.resolve(result);
                }

                return result;
            }

            return Promise.resolve();
        }
    }, {
        key: "_invokeMethodWithRecoveryAsync",
        value: function _invokeMethodWithRecoveryAsync(obj, method) {
            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            var promise = Promise.resolve();

            if (obj != null && typeof obj[method] === "function") {
                promise = obj[method].apply(obj, args);

                if (!(promise instanceof Promise)) {
                    promise = Promise.resolve(promise);
                }
            }

            return promise.catch(function (eror) {
                // Log error.
                return null;
            });
        }
    }, {
        key: "_invokeMethodOnDecoratorsAsync",
        value: function _invokeMethodOnDecoratorsAsync(user, method, args) {
            var _this3 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this3.decoratorOptions[decorator.name]);

                    var customArgs = args.slice();
                    customArgs.push(options);

                    return _this3._invokeMethodAsync(decorator, method, customArgs);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_invokeMethodWithRecoveryOnDecoratorsAsync",
        value: function _invokeMethodWithRecoveryOnDecoratorsAsync(user, method) {
            var _this4 = this;

            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this4.decoratorOptions[decorator.name]);
                    var customArgs = args.slice();
                    customArgs.push(options);

                    return _this4._invokeMethodWithRecoveryAsync(decorator, method, customArgs);
                });
            }, Promise.resolve());
        }
    }, {
        key: "_prepareEntityToBeAddedAsync",
        value: function _prepareEntityToBeAddedAsync(user, entity) {
            return this._invokeMethodOnDecoratorsAsync(user, "prepareEntityToBeAddedAsync", [this.name, entity]);
        }
    }, {
        key: "_prepareEntityToBeUpdatedAsync",
        value: function _prepareEntityToBeUpdatedAsync(user, entity, delta) {
            var _this5 = this;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function (delta) {
                    var options = Object.assign({ user: user }, _this5.decoratorOptions[decorator.name]);
                    return _this5._invokeMethodAsync(decorator, "prepareEntityToBeUpdatedAsync", [_this5.name, entity, delta, options]);
                }).then(function () {
                    return delta;
                });
            }, Promise.resolve(delta));
        }
    }, {
        key: "_validateEntityToBeAddedAsync",
        value: function _validateEntityToBeAddedAsync(user, entity) {
            Object.freeze(entity);

            return this._invokeMethodOnDecoratorsAsync(user, "validateEntityToBeAddedAsync", [this.name, entity]).then(function () {
                return entity;
            });
        }
    }, {
        key: "_validateEntityToBeUpdatedAsync",
        value: function _validateEntityToBeUpdatedAsync(user, entity, delta) {
            var _this6 = this;

            Object.freeze(delta);

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    var options = Object.assign({ user: user }, _this6.decoratorOptions[decorator.name]);
                    return _this6._invokeMethodAsync(decorator, "validateEntityToBeUpdatedAsync", [_this6.name, entity, delta, options]);
                });
            }, Promise.resolve()).then(function () {
                return delta;
            });
        }
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync(user, entity) {
            var _this7 = this;

            this._assertUser(user);

            return this._prepareEntityToBeAddedAsync(user, entity).then(function () {
                return _this7._validateEntityToBeAddedAsync(user, entity);
            }).then(function () {
                return _this7.table.addEntityAsync(entity);
            }).then(function (entity) {
                return _this7._entityAddedAsync(user, entity);
            });
        }
    }, {
        key: "asQueryable",
        value: function asQueryable(user) {
            this._assertUser(user);

            var provider = this.getQueryProvider(user);
            var queryable = new _queryablejs.Queryable();

            queryable.provider = provider;

            return queryable;
        }
    }, {
        key: "getFileSizeByIdAsync",
        value: function getFileSizeByIdAsync(user, id) {
            var _this8 = this;

            return this.getEntityByIdAsync(user, id).then(function (entity) {
                return _this8.getFileSizeAsync(_this8._getFilePathById(id));
            });
        }
    }, {
        key: "getFileReadStreamByIdAsync",
        value: function getFileReadStreamByIdAsync(user, id) {
            var _this9 = this;

            return this.getEntityByIdAsync(user, id).then(function (entity) {
                return _this9.fileSystem.getReadStreamAsync(_this9._getFilePathById(id));
            });
        }
    }, {
        key: "getFileWriteStreamByIdAsync",
        value: function getFileWriteStreamByIdAsync(user, id) {
            var _this10 = this;

            var filePath = this._getFilePathById(id);
            return this.getEntityByIdAsync(user, id).then(function (entity) {
                return _this10.fileSystem.getWriteStreamAsync(filePath);
            }).then(function (writable) {
                writable.on("finish", function () {
                    _this10._invokeMethodWithRecoveryOnDecoratorsAsync(user, "fileUpdatedAsync", [id, filePath]);
                });
                return writable;
            });
        }
    }, {
        key: "getEntityByIdAsync",
        value: function getEntityByIdAsync(user, id) {
            var primaryKey = this._getPrimaryKeyName();
            return this.asQueryable(user).where(function (expBuilder) {
                return expBuilder.property(primaryKey).isEqualTo(id);
            }).toArrayAsync().then(function (results) {
                if (results.length === 1) {
                    return results[0];
                }

                throw new Error("Entity Not Found");
            });
        }
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider(user) {
            this._assertUser(user);

            return new _MetaProvider2.default(user, this);
        }
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(user, entity) {
            var _this11 = this;

            this._assertUser(user);

            Object.freeze(entity);
            return this._approveEntityToBeRemovedAsync(user, entity).then(function () {
                var primaryKey = _this11._getPrimaryKeyName();

                return _this11.removeFileByIdAsync(user, entity[primaryKey]).catch(function (error) {
                    return;
                });
            }).then(function () {
                return _this11.table.removeEntityAsync(entity);
            }).then(function () {
                return _this11._entityRemovedAsync(user, entity);
            });
        }
    }, {
        key: "removeFileByIdAsync",
        value: function removeFileByIdAsync(user, id) {
            var _this12 = this;

            var filePath = this._getFilePathById(id);

            return this.getEntityByIdAsync(user, id).then(function () {
                return _this12.fileSystem.removeFileAsync(filePath);
            }).then(function () {
                return _this12._invokeMethodWithRecoveryOnDecoratorsAsync(user, "fileRemovedAsync", [id, filePath]);
            });
        }
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(user, entity, delta) {
            var _this13 = this;

            this._assertUser(user);

            Object.freeze(entity);
            var updatedEntity = void 0;

            return this._prepareEntityToBeUpdatedAsync(user, entity, delta).then(function (delta) {
                return _this13._validateEntityToBeUpdatedAsync(user, entity, delta);
            }).then(function (delta) {
                return _this13.table.updateEntityAsync(user, entity, delta).then(function (entity) {
                    updatedEntity = entity;
                    return delta;
                });
            }).then(function (delta) {
                return _this13._entityUpdatedAsync(user, updatedEntity, delta);
            }).then(function () {
                return updatedEntity;
            });
        }
    }]);

    return MetaTable;
}();

exports.default = MetaTable;
//# sourceMappingURL=MetaTable.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaProvider = function () {
    function MetaProvider(user, metaTable) {
        _classCallCheck(this, MetaProvider);

        this.metaTable = metaTable;
        this.provider = metaTable.table.provider;
        this.decorators = metaTable.decorators;
        this.user = user;
    }

    _createClass(MetaProvider, [{
        key: "_invokeMethodAsync",
        value: function _invokeMethodAsync(obj, method) {
            var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            if (obj != null && typeof obj[method] === "function") {
                var result = obj[method].apply(obj, args);

                if (!(result instanceof Promise)) {
                    result = Promise.resolve(result);
                }

                return result;
            }

            return Promise.resolve();
        }
    }, {
        key: "_refineQueryableAsync",
        value: function _refineQueryableAsync(queryable) {
            var _this = this;

            var user = this.user;
            var previousQueryable = queryable;

            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function (queryable) {
                    previousQueryable = queryable;

                    var options = _this.metaTable.decoratorOptions[decorator.name];
                    var result = _this._invokeMethodAsync(decorator, "refineQueryableAsync", [user, queryable, options]);

                    if (result == null) {
                        result = queryable;
                    }

                    if (!(result instanceof Promise)) {
                        return Promise.resolve(result);
                    }

                    return result;
                }).then(function (queryable) {
                    if (!(queryable instanceof _queryablejs.Queryable)) {
                        return previousQueryable;
                    }
                    return queryable;
                });
            }, Promise.resolve(queryable));
        }
    }, {
        key: "toArrayAsync",
        value: function toArrayAsync(queryable) {
            var _this2 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this2.provider.toArrayAsync(queryable);
            });
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync(queryable) {
            var _this3 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this3.provider.toArrayWithCountAsync(queryable);
            });
        }
    }, {
        key: "countAsync",
        value: function countAsync(queryable) {
            var _this4 = this;

            var user = this.user;

            return this._refineQueryableAsync(queryable).then(function (queryable) {
                return _this4.provider.countAsync(queryable);
            });
        }
    }]);

    return MetaProvider;
}();

exports.default = MetaProvider;
//# sourceMappingURL=MetaProvider.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors
const u = __webpack_require__(2).fromCallback
const fs = __webpack_require__(1)

const api = [
  'access',
  'appendFile',
  'chmod',
  'chown',
  'close',
  'fchmod',
  'fchown',
  'fdatasync',
  'fstat',
  'fsync',
  'ftruncate',
  'futimes',
  'lchown',
  'link',
  'lstat',
  'mkdir',
  'open',
  'read',
  'readFile',
  'readdir',
  'readlink',
  'realpath',
  'rename',
  'rmdir',
  'stat',
  'symlink',
  'truncate',
  'unlink',
  'utimes',
  'write',
  'writeFile'
]
// fs.mkdtemp() was added in Node.js v5.10.0, so check if it exists
typeof fs.mkdtemp === 'function' && api.push('mkdtemp')

// Export all keys:
Object.keys(fs).forEach(key => {
  exports[key] = fs[key]
})

// Universalify async methods:
api.forEach(method => {
  exports[method] = u(fs[method])
})

// We differ from mz/fs in that we still ship the old, broken, fs.exists()
// since we are a drop-in replacement for the native module
exports.exists = function (filename, callback) {
  if (typeof callback === 'function') {
    return fs.exists(filename, callback)
  }
  return new Promise(resolve => {
    return fs.exists(filename, resolve)
  })
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(5)

module.exports = clone(fs)

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// imported from ncp (this is temporary, will rewrite)

var fs = __webpack_require__(1)
var path = __webpack_require__(0)
var utimes = __webpack_require__(41)

function ncp (source, dest, options, callback) {
  if (!callback) {
    callback = options
    options = {}
  }

  var basePath = process.cwd()
  var currentPath = path.resolve(basePath, source)
  var targetPath = path.resolve(basePath, dest)

  var filter = options.filter
  var transform = options.transform
  var overwrite = options.overwrite
  // If overwrite is undefined, use clobber, otherwise default to true:
  if (overwrite === undefined) overwrite = options.clobber
  if (overwrite === undefined) overwrite = true
  var errorOnExist = options.errorOnExist
  var dereference = options.dereference
  var preserveTimestamps = options.preserveTimestamps === true

  var started = 0
  var finished = 0
  var running = 0

  var errored = false

  startCopy(currentPath)

  function startCopy (source) {
    started++
    if (filter) {
      if (filter instanceof RegExp) {
        console.warn('Warning: fs-extra: Passing a RegExp filter is deprecated, use a function')
        if (!filter.test(source)) {
          return doneOne(true)
        }
      } else if (typeof filter === 'function') {
        if (!filter(source, dest)) {
          return doneOne(true)
        }
      }
    }
    return getStats(source)
  }

  function getStats (source) {
    var stat = dereference ? fs.stat : fs.lstat
    running++
    stat(source, function (err, stats) {
      if (err) return onError(err)

      // We need to get the mode from the stats object and preserve it.
      var item = {
        name: source,
        mode: stats.mode,
        mtime: stats.mtime, // modified time
        atime: stats.atime, // access time
        stats: stats // temporary
      }

      if (stats.isDirectory()) {
        return onDir(item)
      } else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
        return onFile(item)
      } else if (stats.isSymbolicLink()) {
        // Symlinks don't really need to know about the mode.
        return onLink(source)
      }
    })
  }

  function onFile (file) {
    var target = file.name.replace(currentPath, targetPath.replace('$', '$$$$')) // escapes '$' with '$$'
    isWritable(target, function (writable) {
      if (writable) {
        copyFile(file, target)
      } else {
        if (overwrite) {
          rmFile(target, function () {
            copyFile(file, target)
          })
        } else if (errorOnExist) {
          onError(new Error(target + ' already exists'))
        } else {
          doneOne()
        }
      }
    })
  }

  function copyFile (file, target) {
    var readStream = fs.createReadStream(file.name)
    var writeStream = fs.createWriteStream(target, { mode: file.mode })

    readStream.on('error', onError)
    writeStream.on('error', onError)

    if (transform) {
      transform(readStream, writeStream, file)
    } else {
      writeStream.on('open', function () {
        readStream.pipe(writeStream)
      })
    }

    writeStream.once('close', function () {
      fs.chmod(target, file.mode, function (err) {
        if (err) return onError(err)
        if (preserveTimestamps) {
          utimes.utimesMillis(target, file.atime, file.mtime, function (err) {
            if (err) return onError(err)
            return doneOne()
          })
        } else {
          doneOne()
        }
      })
    })
  }

  function rmFile (file, done) {
    fs.unlink(file, function (err) {
      if (err) return onError(err)
      return done()
    })
  }

  function onDir (dir) {
    var target = dir.name.replace(currentPath, targetPath.replace('$', '$$$$')) // escapes '$' with '$$'
    isWritable(target, function (writable) {
      if (writable) {
        return mkDir(dir, target)
      }
      copyDir(dir.name)
    })
  }

  function mkDir (dir, target) {
    fs.mkdir(target, dir.mode, function (err) {
      if (err) return onError(err)
      // despite setting mode in fs.mkdir, doesn't seem to work
      // so we set it here.
      fs.chmod(target, dir.mode, function (err) {
        if (err) return onError(err)
        copyDir(dir.name)
      })
    })
  }

  function copyDir (dir) {
    fs.readdir(dir, function (err, items) {
      if (err) return onError(err)
      items.forEach(function (item) {
        startCopy(path.join(dir, item))
      })
      return doneOne()
    })
  }

  function onLink (link) {
    var target = link.replace(currentPath, targetPath)
    fs.readlink(link, function (err, resolvedPath) {
      if (err) return onError(err)
      checkLink(resolvedPath, target)
    })
  }

  function checkLink (resolvedPath, target) {
    if (dereference) {
      resolvedPath = path.resolve(basePath, resolvedPath)
    }
    isWritable(target, function (writable) {
      if (writable) {
        return makeLink(resolvedPath, target)
      }
      fs.readlink(target, function (err, targetDest) {
        if (err) return onError(err)

        if (dereference) {
          targetDest = path.resolve(basePath, targetDest)
        }
        if (targetDest === resolvedPath) {
          return doneOne()
        }
        return rmFile(target, function () {
          makeLink(resolvedPath, target)
        })
      })
    })
  }

  function makeLink (linkPath, target) {
    fs.symlink(linkPath, target, function (err) {
      if (err) return onError(err)
      return doneOne()
    })
  }

  function isWritable (path, done) {
    fs.lstat(path, function (err) {
      if (err) {
        if (err.code === 'ENOENT') return done(true)
        return done(false)
      }
      return done(false)
    })
  }

  function onError (err) {
    // ensure callback is defined & called only once:
    if (!errored && callback !== undefined) {
      errored = true
      return callback(err)
    }
  }

  function doneOne (skipped) {
    if (!skipped) running--
    finished++
    if ((started === finished) && (running === 0)) {
      if (callback !== undefined) {
        return callback(null)
      }
    }
  }
}

module.exports = ncp


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(0)

// get drive on windows
function getRootPath (p) {
  p = path.normalize(path.resolve(p)).split(path.sep)
  if (p.length > 0) return p[0]
  return null
}

// http://stackoverflow.com/a/62888/10333 contains more accurate
// TODO: expand to include the rest
const INVALID_PATH_CHARS = /[<>:"|?*]/

function invalidWin32Path (p) {
  const rp = getRootPath(p)
  p = p.replace(rp, '')
  return INVALID_PATH_CHARS.test(p)
}

module.exports = {
  getRootPath,
  invalidWin32Path
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  copySync: __webpack_require__(45)
}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/* eslint-disable node/no-deprecated-api */
module.exports = function (size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    try {
      return Buffer.allocUnsafe(size)
    } catch (e) {
      return new Buffer(size)
    }
  }
  return new Buffer(size)
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _MetaDatabase = __webpack_require__(23);

var _MetaDatabase2 = _interopRequireDefault(_MetaDatabase);

var _MetaTable = __webpack_require__(12);

var _MetaTable2 = _interopRequireDefault(_MetaTable);

var _MetaProvider = __webpack_require__(13);

var _MetaProvider2 = _interopRequireDefault(_MetaProvider);

var _AdminUser = __webpack_require__(30);

var _AdminUser2 = _interopRequireDefault(_AdminUser);

var _GuestUser = __webpack_require__(31);

var _GuestUser2 = _interopRequireDefault(_GuestUser);

var _User = __webpack_require__(7);

var _User2 = _interopRequireDefault(_User);

var _LocalFileSystem = __webpack_require__(32);

var _LocalFileSystem2 = _interopRequireDefault(_LocalFileSystem);

var _FileSystem = __webpack_require__(62);

var _FileSystem2 = _interopRequireDefault(_FileSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Database = __webpack_require__(24);

var _Database2 = _interopRequireDefault(_Database);

var _MetaTable = __webpack_require__(12);

var _MetaTable2 = _interopRequireDefault(_MetaTable);

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(5);

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaDatabase = function () {
    function MetaDatabase() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$decorators = _ref.decorators,
            decorators = _ref$decorators === undefined ? [] : _ref$decorators,
            _ref$sqlite = _ref.sqlite,
            sqlite = _ref$sqlite === undefined ? null : _ref$sqlite,
            _ref$databasePath = _ref.databasePath,
            databasePath = _ref$databasePath === undefined ? null : _ref$databasePath,
            _ref$edm = _ref.edm,
            edm = _ref$edm === undefined ? null : _ref$edm,
            _ref$fileSystem = _ref.fileSystem,
            fileSystem = _ref$fileSystem === undefined ? null : _ref$fileSystem;

        _classCallCheck(this, MetaDatabase);

        if (!Array.isArray(decorators)) {
            throw new Error("Invalid Argument: decorators needs to be an array.");
        }

        if (sqlite == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a sqlite.");
        }

        if (databasePath == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a databasePath.");
        }

        if (edm == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a edm.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a fileSystem.");
        }

        this.decorators = decorators;
        this.databasePath = databasePath;
        this.sqlite = sqlite;
        this.edm = edm;
        this.name = this.edm.name;
        this.version = this.edm.version;
        this.fileSystem = fileSystem;
        this.tables = {};
        this.readyPromise = null;

        this._initializeAsync();
    }

    _createClass(MetaDatabase, [{
        key: "_createDatabaseAsync",
        value: function _createDatabaseAsync(edm) {
            var path = this.databasePath;

            return this.sqlite.open(path).then(function (sqliteDatabase) {
                var database = new _Database2.default({
                    edm: edm,
                    sqliteDatabase: sqliteDatabase
                });

                return database;
            });
        }
    }, {
        key: "_initializeEdmAsync",
        value: function _initializeEdmAsync(edm) {
            var decoratedEdm = JSON.parse(JSON.stringify(edm));

            if (edm.isInitialized) {
                this.edm = this.decoratedEdm;
                return Promise.resolve(decoratedEdm);
            } else {
                return this._invokeOnDecoratorsAsync("prepareEdmAsync", [decoratedEdm]).then(function () {
                    return decoratedEdm;
                });
            }
        }
    }, {
        key: "_initializeAsync",
        value: function _initializeAsync() {
            var _this = this;

            if (this.readyPromise == null) {
                var database = null;

                return this.readyPromise = this._initializeEdmAsync(this.edm).then(function (edm) {
                    _this.edm = edm;
                    var databasePromise = _this._createDatabaseAsync(edm);

                    if (!edm.isInitialized) {
                        databasePromise = databasePromise.then(function (newDatabase) {
                            database = newDatabase;
                            return newDatabase.createAsync();
                        }).then(function () {
                            _this.edm.isInitialized = true;
                        });
                    }

                    return databasePromise;
                }).then(function () {

                    return _this.decorators.reduce(function (promise, decorator) {
                        return promise.then(function () {
                            return _this._invokeOnDecoratorsAsync("activatedAsync", [_this]);
                        });
                    }, Promise.resolve());
                }).then(function () {

                    database.getTables().forEach(function (table) {
                        _this.tables[table.name] = new _MetaTable2.default({
                            table: table,
                            decorators: _this.decorators,
                            fileSystem: _this.fileSystem
                        });
                    });
                });
            }

            return this.readyPromise;
        }
    }, {
        key: "_invokeOnDecoratorsAsync",
        value: function _invokeOnDecoratorsAsync(methodName, args) {
            return this.decorators.reduce(function (promise, decorator) {
                return promise.then(function () {
                    if (typeof decorator[methodName] === "function") {
                        var value = decorator[methodName].apply(decorator, args);
                        if (!(value instanceof Promise)) {
                            return Promise.resolve(value);
                        }
                        return value;
                    }
                });
            }, Promise.resolve());
        }
    }, {
        key: "getTableAsync",
        value: function getTableAsync(name) {
            var _this2 = this;

            return this.readyPromise.then(function () {
                return _this2.tables[name] || null;
            });
        }
    }, {
        key: "getTablesAsync",
        value: function getTablesAsync() {
            var _this3 = this;

            return this.readyPromise.then(function () {
                return Object.keys(_this3.tables).map(function (name) {
                    return _this3.tables[name];
                });
            });
        }
    }, {
        key: "initializeAsync",
        value: function initializeAsync() {
            return this.readyPromise;
        }
    }]);

    return MetaDatabase;
}();

exports.default = MetaDatabase;
//# sourceMappingURL=MetaDatabase.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = __webpack_require__(10);

var _Table2 = _interopRequireDefault(_Table);

var _EdmValidator = __webpack_require__(29);

var _EdmValidator2 = _interopRequireDefault(_EdmValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var edmValidator = new _EdmValidator2.default();

var Database = function () {
    function Database() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Database);

        var sqliteDatabase = options.sqliteDatabase;
        var edm = options.edm;

        if (sqliteDatabase == null) {
            throw new Error("Database needs to have a sqliteDatabase.");
        }
        if (edm == null) {
            throw new Error("Database needs to have a edm.");
        }

        this.name = edm.name;
        this.edm = edm;
        this.sqliteDatabase = sqliteDatabase;
        this.tables = {};

        edmValidator.validate(edm);
        this._createTables();
    }

    _createClass(Database, [{
        key: "_createTables",
        value: function _createTables() {
            var _this = this;

            var options = {
                sqliteDatabase: this.sqliteDatabase,
                edm: this.edm
            };

            this.edm.tables.forEach(function (table) {
                _this.tables[table.name] = new _Table2.default(table.name, options);
            });
        }
    }, {
        key: "_getTableFromEdm",
        value: function _getTableFromEdm(name) {
            return this.edm.tables.find(function (table) {
                return table.name = name;
            });
        }
    }, {
        key: "_getTableBuildOrder",
        value: function _getTableBuildOrder() {
            var _this2 = this;

            var walkedTables = [];

            this.edm.tables.forEach(function (table) {
                _this2._walkRelationships(table, walkedTables);
            });

            return walkedTables;
        }
    }, {
        key: "_walkRelationships",
        value: function _walkRelationships(table, tablesWalked) {
            var _this3 = this;

            if (tablesWalked.indexOf(table) > -1) {
                return;
            }

            var forEachRelationship = function forEachRelationship(relationship) {
                var sourceTable = _this3._getTableFromEdm(relationship.type);
                _this3._walkRelationships(sourceTable, tablesWalked);
            };

            this.edm.relationships.oneToOne.filter(function (relationship) {
                relationship.ofType === table.name;
            }).forEach(forEachRelationship);

            this.edm.relationships.oneToMany.filter(function (relationship) {
                relationship.ofType === table.name;
            }).forEach(forEachRelationship);

            tablesWalked.push(table);
        }
    }, {
        key: "createAsync",
        value: function createAsync() {
            var _this4 = this;

            var buildOrder = this._getTableBuildOrder();

            return buildOrder.reduce(function (promise, table) {
                return promise.then(function () {
                    var sqliteDatabaseTable = _this4.tables[table.name];
                    return sqliteDatabaseTable.createAsync();
                });
            }, Promise.resolve());
        }
    }, {
        key: "dropAsync",
        value: function dropAsync() {
            var _this5 = this;

            var buildOrder = this._getTableBuildOrder().reverse();

            return buildOrder.reduce(function (promise, table) {
                return promise.then(function () {
                    var sqliteDatabaseTable = _this5.tables[table.name];
                    return sqliteDatabaseTable.dropAsync();
                });
            }, Promise.resolve());
        }
    }, {
        key: "getTable",
        value: function getTable(name) {
            return this.tables[name];
        }
    }, {
        key: "getTables",
        value: function getTables() {
            var _this6 = this;

            return Object.keys(this.tables).map(function (name) {
                return _this6.tables[name];
            });
        }
    }]);

    return Database;
}();

exports.default = Database;
//# sourceMappingURL=Database.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataTypeMapping = __webpack_require__(11);

var _dataTypeMapping2 = _interopRequireDefault(_dataTypeMapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultRelationships = {
    oneToOne: [],
    oneToMany: []
};

var TableStatementBuilder = function () {
    function TableStatementBuilder() {
        _classCallCheck(this, TableStatementBuilder);

        this.dataTypeMapping = _dataTypeMapping2.default;
    }

    _createClass(TableStatementBuilder, [{
        key: "_escapeName",
        value: function _escapeName(name) {
            return "\"" + name.replace(/\"/g, '"') + "\"";
        }
    }, {
        key: "createDropTableStatment",
        value: function createDropTableStatment(table) {
            return "DROP TABLE IF EXISTS " + this._escapeName(table.name);
        }
    }, {
        key: "createInsertStatement",
        value: function createInsertStatement(table, entity) {
            var _this = this;

            if (table == null) {
                throw new Error("Null Argument Exception: table cannot be null or undefined.");
            }

            if (entity == null) {
                throw new Error("Null Argument Exception: entity cannot be null or undefined.");
            }

            var sqliteEntity = {};
            var columns = [];
            var values = [];

            this.filterRelevantColumns(table.columns).forEach(function (column) {
                var columnName = column.name;
                var defaultValue = _this.getDefaultValue(column);

                if (typeof entity[columnName] !== "undefined" && entity[columnName] !== null) {
                    columns.push(_this._escapeName(columnName));

                    if (entity[columnName] === null) {
                        values.push(_this.toSqliteValue(defaultValue));
                    } else {
                        values.push(_this.toSqliteValue(entity[columnName]));
                    }
                }
            });

            var columnsStatement = columns.join(", ");
            var valuesStatement = new Array(values.length).fill("?").join(", ");

            if (values.length === 0) {
                return {
                    statement: "INSERT INTO " + this._escapeName(table.name) + " DEFAULT VALUES",
                    values: values
                };
            }

            return {
                statement: "INSERT INTO " + this._escapeName(table.name) + " (" + columnsStatement + ") VALUES (" + valuesStatement + ")",
                values: values
            };
        }
    }, {
        key: "createUpdateStatement",
        value: function createUpdateStatement(table, entity, delta) {
            var _this2 = this;

            var values = [];
            var primaryKeyExpr = [];
            var primaryKeyValues = [];
            var columnSet = [];
            var columns = table.columns;

            if (table == null) {
                throw new Error("Null Argument Exception: table cannot be null or undefined.");
            }

            if (entity == null) {
                throw new Error("Null Argument Exception: entity cannot be null or undefined.");
            }

            if (delta == null) {
                throw new Error("Null Argument Exception: delta cannot be null or undefined.");
            }

            if (Object.keys(delta).length === 0) {
                throw new Error("Invalid Argument: delta cannot an empty object.");
            }

            this.filterRelevantColumns(columns).forEach(function (column) {
                var columnName = column.name;

                if (typeof delta[columnName] !== "undefined" && _this2.dataTypeMapping[column.type] != null) {
                    columnSet.push(_this2._escapeName(columnName) + " = ?");
                    values.push(_this2.toSqliteValue(delta[columnName]));
                }
            });

            this.getPrimaryKeys(columns).forEach(function (key) {
                primaryKeyExpr.push(_this2._escapeName(key) + " = ?");
                primaryKeyValues.push(entity[key]);
            });

            values = values.concat(primaryKeyValues);

            return {
                statement: "UPDATE " + this._escapeName(table.name) + " SET " + columnSet.join(", ") + " WHERE " + primaryKeyExpr.join(" AND "),
                values: values
            };
        }
    }, {
        key: "createDeleteStatement",
        value: function createDeleteStatement(table, entity) {
            var _this3 = this;

            if (table == null) {
                throw new Error("Null Argument Exception: table cannot be null or undefined.");
            }

            if (entity == null) {
                throw new Error("Null Argument Exception: entity cannot be null or undefined.");
            }

            var primaryKeysExpr = [];
            var values = [];
            var primaryKeys = this.getPrimaryKeys(table.columns);

            primaryKeys.forEach(function (primaryKey) {

                if (entity[primaryKey] === null) {
                    primaryKeysExpr.push(_this3._escapeName(primaryKey) + " IS NULL");
                } else {
                    primaryKeysExpr.push(_this3._escapeName(primaryKey) + " = ?");
                    values.push(_this3.toSqliteValue(entity[primaryKey]));
                }
            });

            return {
                statement: "DELETE FROM " + this._escapeName(table.name) + " WHERE " + primaryKeysExpr.join(" AND "),
                values: values
            };
        }
    }, {
        key: "createColumnDefinitionStatement",
        value: function createColumnDefinitionStatement(table, column) {
            var sqliteDataType = this.dataTypeMapping[column.type];
            var primaryKeyStatment = "";
            var primaryKeys = this.getPrimaryKeys(table.columns);

            if (sqliteDataType != null) {
                var primaryKey = "";

                if (column.isPrimaryKey) {

                    if (primaryKeys.length === 1) {
                        primaryKey = " PRIMARY KEY";
                    }

                    if (column.isAutoIncrement) {
                        primaryKey += " AUTOINCREMENT";
                    }
                }

                return this._escapeName(column.name) + " " + (this.dataTypeMapping[column.type] + primaryKey);
            } else {
                return null;
            }
        }
    }, {
        key: "createColumnsDefinitionStatement",
        value: function createColumnsDefinitionStatement(table) {
            var _this4 = this;

            var columns = table.columns;
            var columnsDefinition = columns.map(function (column) {
                return _this4.createColumnDefinitionStatement(table, column);
            }).filter(function (value) {
                return value != null;
            }).join(", ");

            return columnsDefinition;
        }
    }, {
        key: "createIndexStatement",
        value: function createIndexStatement(table, column) {
            return "CREATE INDEX IF NOT EXISTS " + this._escapeName(column) + " ON " + this._escapeName(table) + " (" + this._escapeName(column) + ")";
        }
    }, {
        key: "createTableIndexesStatements",
        value: function createTableIndexesStatements(table, relationships) {
            var _this5 = this;

            var foreignKeyIndexes = this.getTablesRelationshipsAsTargets(table, relationships).map(function (relationship) {
                return _this5.createIndexStatement(relationship.ofType, relationship.withForeignKey);
            });

            var primaryKeys = this.getPrimaryKeys(table.columns);

            var keyIndexes = this.getTablesRelationshipsAsSources(table, relationships).filter(function (relationship) {
                return primaryKeys.indexOf(relationship.hasKey) === -1;
            }).map(function (relationship) {
                return _this5.createIndexStatement(relationship.type, relationship.hasKey);
            });

            var primaryKeysIndexes = primaryKeys.map(function (name) {
                return _this5.createIndexStatement(table.name, name);
            });

            return primaryKeysIndexes.concat(foreignKeyIndexes);
        }
    }, {
        key: "createForeignKeysStatement",
        value: function createForeignKeysStatement(table, relationships) {
            var _this6 = this;

            var tableName = table.name;
            var tableRelationships = this.getTablesRelationshipsAsTargets(table, relationships);

            return tableRelationships.map(function (relationship) {
                return _this6.createForeignKeyStatement(relationship);
            }).join("/n/t");
        }
    }, {
        key: "createForeignKeyStatement",
        value: function createForeignKeyStatement(relationship) {
            return "FOREIGN KEY (" + this._escapeName(relationship.withForeignKey) + ") REFERENCES " + this._escapeName(relationship.type) + " (" + this._escapeName(relationship.hasKey) + ")";
        }
    }, {
        key: "createPrimaryKeyStatement",
        value: function createPrimaryKeyStatement(table) {
            var _this7 = this;

            var primaryKeys = this.getPrimaryKeys(table.columns).map(function (primaryKey) {
                return _this7._escapeName(primaryKey);
            });

            if (primaryKeys.length === 0) {
                return "";
            } else {
                return "PRIMARY KEY (" + primaryKeys.join(", ") + ")";
            }
        }
    }, {
        key: "createTableStatement",
        value: function createTableStatement(table, relationships) {
            relationships = Object.assign({}, defaultRelationships, relationships);

            var columnDefinitionsStatement = this.createColumnsDefinitionStatement(table);
            var foreignKeysStatement = this.createForeignKeysStatement(table, relationships);

            if (columnDefinitionsStatement && foreignKeysStatement) {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(table.name) + " (" + columnDefinitionsStatement + ", " + foreignKeysStatement + ")";
            } else if (columnDefinitionsStatement) {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(table.name) + " (" + columnDefinitionsStatement + ")";
            } else {
                return "CREATE TABLE IF NOT EXISTS " + this._escapeName(table.name);
            }
        }
    }, {
        key: "filterRelevantColumns",
        value: function filterRelevantColumns(columns) {
            var _this8 = this;

            return columns.filter(function (column) {
                return _this8.dataTypeMapping[column.type] != null;
            });
        }
    }, {
        key: "getTablesRelationshipsAsTargets",
        value: function getTablesRelationshipsAsTargets(table, relationships) {
            var foreignKeyNames = {};

            var filter = function filter(relationship) {
                var foreignKey = relationship.withForeignKey;

                if (relationship.ofType === table.name && foreignKeyNames[foreignKey] == null) {
                    foreignKeyNames[foreignKey];
                    return true;
                }
                return false;
            };

            var oneToOne = relationships.oneToOne.filter(filter);
            var oneToMany = relationships.oneToMany.filter(filter);

            return oneToOne.concat(oneToMany);
        }
    }, {
        key: "getTablesRelationshipsAsSources",
        value: function getTablesRelationshipsAsSources(table, relationships) {
            var keyNames = {};

            var filter = function filter(relationship) {
                var key = relationship.hasKey;

                if (relationship.type === table.name && keyNames[key] == null) {
                    keyNames[key];
                    return true;
                }
                return false;
            };

            var oneToOne = relationships.oneToOne.filter(filter);
            var oneToMany = relationships.oneToMany.filter(filter);

            return oneToOne.concat(oneToMany);
        }
    }, {
        key: "getColumn",
        value: function getColumn(table, name) {
            return table.columns.find(function (column) {
                return column.name === name;
            });
        }
    }, {
        key: "getDefaultValue",
        value: function getDefaultValue(column) {
            return column["default" + column.type + "Value"] || null;
        }
    }, {
        key: "getPrimaryKeys",
        value: function getPrimaryKeys(columns) {
            return columns.filter(function (column) {
                return column.isPrimaryKey;
            }).map(function (column) {
                return column.name;
            });
        }
    }, {
        key: "toSqliteValue",
        value: function toSqliteValue(value) {
            if (typeof value === "string") {
                return value;
            } else if (typeof value === "number") {
                return value;
            } else if (typeof value === "boolean") {
                return value ? 1 : 0;
            } else if (value instanceof Date) {
                return value.getTime();
            } else if (value == null) {
                return null;
            } else {
                throw new Error("Unknown value.");
            }
        }
    }]);

    return TableStatementBuilder;
}();

exports.default = TableStatementBuilder;
//# sourceMappingURL=TableStatementBuilder.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Visitor = __webpack_require__(27);

var _Visitor2 = _interopRequireDefault(_Visitor);

var _EntityBuilder = __webpack_require__(28);

var _EntityBuilder2 = _interopRequireDefault(_EntityBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = function () {
    function Provider(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Provider);

        if (options.sqliteDatabase == null) {
            throw new Error("Null Argument Exception: sqliteDatabase is required in options.");
        }

        if (options.edm == null) {
            throw new Error("Null Argument Exception: edm is required in options.");
        }

        this.edm = options.edm;
        this.sqliteDatabase = options.sqliteDatabase;
        this.name = name;

        this.entityBuilder = new _EntityBuilder2.default(name, this.edm);
    }

    _createClass(Provider, [{
        key: "toArrayAsync",
        value: function toArrayAsync(queryable) {
            var _this = this;

            var query = queryable.getQuery();
            var visitor = new _Visitor2.default(this.name, this.edm);
            var statement = visitor.createSelectStatement(query);

            return this.sqliteDatabase.all(statement).then(function (results) {
                return _this.entityBuilder.convert(results);
            });
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync(queryable) {
            var _this2 = this;

            var count = 0;
            return this.countAsync(function (c) {
                count = c;
                return _this2.toArrayAsync(queryable);
            }).then(function (results) {
                return {
                    count: count,
                    results: results
                };
            });
        }
    }, {
        key: "countAsync",
        value: function countAsync(queryable) {
            var query = queryable.getQuery();
            var visitor = new _Visitor2.default(this.name, this.edm);
            var statement = visitor.createSelectStatementWithCount(query);

            return this.sqliteDatabase.get(statement).then(function (result) {
                return result.count;
            });
        }
    }]);

    return Provider;
}();

exports.default = Provider;
//# sourceMappingURL=Provider.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Visitor = function (_ExpressionVisitor) {
    _inherits(Visitor, _ExpressionVisitor);

    function Visitor(name, edm) {
        _classCallCheck(this, Visitor);

        var _this = _possibleConstructorReturn(this, (Visitor.__proto__ || Object.getPrototypeOf(Visitor)).call(this));

        _this.name = name;
        _this.edm = edm;
        _this.table = _this._getTable(name);
        _this.currentNavigationTable = _this.table;
        _this.joinClauses = [];
        _this.tableTypes = new Map();
        _this.isParsingInclude = false;

        _this.dataConverter = {
            convertString: function convertString(value) {
                return "'" + _this._escape(value) + "'";
            },
            convertContainsString: function convertContainsString(value) {
                return "'%" + _this._escape(value) + "%'";
            },
            convertStartsWithString: function convertStartsWithString(value) {
                return "'" + _this._escape(value) + "%'";
            },
            convertEndsWithString: function convertEndsWithString(value) {
                return "'%" + _this._escape(value) + "'";
            },
            convertNumber: function convertNumber(value) {
                return value.toString();
            },
            convertBoolean: function convertBoolean(value) {
                return value ? 1 : 0;
            },
            convertDate: function convertDate(value) {
                return value.getTime();
            }
        };

        return _this;
    }

    _createClass(Visitor, [{
        key: "_addJoinClause",
        value: function _addJoinClause(clause) {
            var index = this.joinClauses.indexOf(clause);
            if (index === -1) {
                this.joinClauses.push(clause);
            }
        }
    }, {
        key: "_escape",
        value: function _escape(value) {
            return "" + value.replace(/'/g, "''");
        }
    }, {
        key: "_escapeIdentifier",
        value: function _escapeIdentifier(value) {
            return "\"" + value.replace(/\"/g, '"') + "\"";
        }
    }, {
        key: "_buildLeftJoinStatementFromSource",
        value: function _buildLeftJoinStatementFromSource(relationship) {
            return "LEFT JOIN " + this._escapeIdentifier(relationship.ofType) + " ON " + this._escapeIdentifier(relationship.type) + "." + this._escapeIdentifier(relationship.hasKey) + " = " + this._escapeIdentifier(relationship.ofType) + "." + this._escapeIdentifier(relationship.withForeignKey);
        }
    }, {
        key: "_buildLeftJoinStatementFromTarget",
        value: function _buildLeftJoinStatementFromTarget(relationship) {
            return "LEFT JOIN " + this._escapeIdentifier(relationship.type) + " ON " + this._escapeIdentifier(relationship.ofType) + "." + this._escapeIdentifier(relationship.withForeignKey) + " = " + this._escapeIdentifier(relationship.type) + "." + this._escapeIdentifier(relationship.hasKey);
        }
    }, {
        key: "_getNavigationProperties",
        value: function _getNavigationProperties(edm, table) {
            var _this2 = this;

            var properties = {};
            var relationships = edm.relationships;

            var sourceRelationships = this._getRelationshipsAsSource(table, relationships);
            var targetRelationships = this._getRelationshipsAsTarget(table, relationships);

            sourceRelationships.forEach(function (relationship) {
                var property = void 0;

                if (relationship.hasOne != null) {
                    property = relationship.hasOne;
                } else {
                    property = relationship.hasMany;
                }

                properties[property] = {
                    relationship: relationship,
                    table: _this2._getTable(relationship.ofType),
                    joinClause: _this2._buildLeftJoinStatementFromSource(relationship)
                };
            });

            targetRelationships.forEach(function (relationship) {
                properties[relationship.withOne] = {
                    relationship: relationship,
                    table: _this2._getTable(relationship.type),
                    joinClause: _this2._buildLeftJoinStatementFromTarget(relationship)
                };
            });

            return properties;
        }
    }, {
        key: "_getRelationshipsAsSource",
        value: function _getRelationshipsAsSource(table, relationships) {
            var filter = function filter(relationship) {
                return relationship.type === table.name;
            };

            var oneToOneRelationships = relationships.oneToOne.filter(filter);
            var oneToManyRelationships = relationships.oneToMany.filter(filter);

            return oneToOneRelationships.concat(oneToManyRelationships);
        }
    }, {
        key: "_getRelationshipsAsTarget",
        value: function _getRelationshipsAsTarget(table, relationships) {
            var filter = function filter(relationship) {
                return relationship.ofType === table.name;
            };

            var oneToOneRelationships = relationships.oneToOne.filter(filter);
            var oneToManyRelationships = relationships.oneToMany.filter(filter);

            return oneToOneRelationships.concat(oneToManyRelationships);
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_sqlizePrimitive",
        value: function _sqlizePrimitive(value) {
            if (typeof value === "string") {
                return this.dataConverter.convertString(value);
            } else if (typeof value === "number") {
                return this.dataConverter.convertNumber(value);
            } else if (typeof value === "boolean") {
                return this.dataConverter.convertBoolean(value);
            } else if (value instanceof Date) {
                return this.dataConverter.convertDate(value);
            } else if (value == null) {
                return "NULL";
            } else {
                throw new Error("Unknown primitive type.");
            }
        }
    }, {
        key: "_writeTableProperty",
        value: function _writeTableProperty(table, column) {
            return this._escapeIdentifier(table) + "." + this._escapeIdentifier(column);
        }
    }, {
        key: "and",
        value: function and() {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];

            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" AND ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        }
    }, {
        key: "any",
        value: function any(property, expression) {
            var table = property.table;
            var visitor = new Visitor(table.name, this.edm);

            return visitor.parse(expression);
        }
    }, {
        key: "ascending",
        value: function ascending(propertyAccessor) {
            var namespace = propertyAccessor.value;
            return namespace + " ASC";
        }
    }, {
        key: "array",
        value: function array(expression) {
            return expression.value;
        }
    }, {
        key: "boolean",
        value: function boolean(expression) {
            return expression.value;
        }
    }, {
        key: "countAsync",
        value: function countAsync(left, right) {
            throw new Error("Not yet implemented.");
        }
    }, {
        key: "constant",
        value: function constant(expression) {
            return expression.value;
        }
    }, {
        key: "createSelectStatementWithCount",
        value: function createSelectStatementWithCount(query, countAlias) {
            var queryParts = [];
            countAlias = countAlias || "count";

            this.joinClauses = [];
            this.tableTypes = new Map();

            this.tableTypes.set(this.table.name, this.table);

            var where = this.parse(query.where);

            queryParts.push("SELECT COUNT(*) AS \"" + countAlias + "\" FROM " + this._escapeIdentifier(this.table.name), this.joinClauses.join(" "), where);

            return queryParts.join(" ");
        }
    }, {
        key: "createSelectStatement",
        value: function createSelectStatement(query) {
            var queryParts = [];

            this.joinClauses = [];
            this.tableTypes = new Map();

            this.tableTypes.set(this.table.name, this.table);

            var where = this.parse(query.where);
            var orderBy = this.parse(query.orderBy);
            var skip = this.parse(query.skip);
            var take = this.parse(query.take);

            this.isParsingInclude = true;
            var include = this.parse(query.include);
            this.isParsingInclude = false;

            var columnAliases = this.makeColumnAliases(this.tableTypes);
            var joinClause = this.joinClauses.length > 0 ? this.joinClauses.join(" ") : "";

            if (where && include) {
                where = where + " AND " + include;
            } else if (!where && include) {
                where = include;
            }

            queryParts.push("SELECT " + columnAliases + " FROM " + this._escapeIdentifier(this.table.name), joinClause, where, orderBy, take, skip);

            return queryParts.filter(function (part) {
                return part != null && part != "";
            }).join(" ");
        }
    }, {
        key: "date",
        value: function date(expression) {
            return this._sqlizePrimitive(expression.value);
        }
    }, {
        key: "descending",
        value: function descending(propertyAccessor) {
            var namespace = propertyAccessor.value;
            return namespace + " DESC";
        }
    }, {
        key: "endsWith",
        value: function endsWith(propertyAccessor, value) {
            var namespace = propertyAccessor.value;
            return namespace + " LIKE " + this.dataConverter.convertEndsWithString(value);
        }
    }, {
        key: "equalTo",
        value: function equalTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            if (right === null) {
                return left + " IS NULL";
            } else {
                return left + " = " + this._sqlizePrimitive(right);
            }
        }
    }, {
        key: "expression",
        value: function expression(_expression) {
            return _expression.value;
        }
    }, {
        key: "greaterThan",
        value: function greaterThan(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " > " + this._sqlizePrimitive(right);
        }
    }, {
        key: "greaterThanOrEqualTo",
        value: function greaterThanOrEqualTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " >= " + this._sqlizePrimitive(right);
        }
    }, {
        key: "include",
        value: function include(whereExpression) {
            return whereExpression;
        }
    }, {
        key: "isIn",
        value: function isIn(property, array) {
            var _this3 = this;

            return "(" + array.map(function (value) {
                return _this3.equalTo(property, value);
            }).join(" OR ") + ")";
        }
    }, {
        key: "isNotIn",
        value: function isNotIn(property, array) {
            var _this4 = this;

            return "(" + array.map(function (value) {
                return _this4.notEqual(property, value);
            }).join(" AND ") + ")";
        }
    }, {
        key: "lessThan",
        value: function lessThan(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " < " + this._sqlizePrimitive(right);
        }
    }, {
        key: "lessThanOrEqualTo",
        value: function lessThanOrEqualTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            return left + " <= " + this._sqlizePrimitive(right);
        }
    }, {
        key: "makeColumnAliases",
        value: function makeColumnAliases(map) {
            var _this5 = this;

            var columns = [];

            map.forEach(function (table) {
                var tableName = table.name;

                table.columns.forEach(function (column) {
                    var columnName = column.name;

                    columns.push(_this5._escapeIdentifier(tableName) + "." + _this5._escapeIdentifier(columnName) + " AS " + _this5._escapeIdentifier(tableName + "___" + columnName));
                });
            });

            return columns.join(", ");
        }
    }, {
        key: "not",
        value: function not(left, right) {
            return left + " NOT " + right;
        }
    }, {
        key: "notEqualTo",
        value: function notEqualTo(propertyAccessor, right) {
            var left = propertyAccessor.value;
            if (right === null) {
                return left + " IS NOT NULL";
            } else {
                return left + " <> " + this._sqlizePrimitive(right);
            }
        }
    }, {
        key: "null",
        value: function _null(expression) {
            return null;
        }
    }, {
        key: "number",
        value: function number(expression) {
            return expression.value;
        }
    }, {
        key: "or",
        value: function or() {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" OR ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        }
    }, {
        key: "orderBy",
        value: function orderBy() {
            var result = Array.prototype.slice.call(arguments, 0).join(", ");
            if (!result) {
                return "";
            }

            return "ORDER BY " + result;
        }
    }, {
        key: "property",
        value: function property(expression) {
            var property = expression.value;
            return property;
        }
    }, {
        key: "propertyAccess",
        value: function propertyAccess(tableMetaData, property) {
            var propertyData = tableMetaData.navigationProperties && tableMetaData.navigationProperties[property] || null;
            var propertyTable = propertyData && propertyData.table || null;
            var currentTableName = this.currentNavigationTable.name;

            var navigationProperties = null;

            if (propertyTable) {
                if (this.isParsingInclude) {
                    this.tableTypes.set(propertyTable.name, propertyTable);
                }
                this._addJoinClause(propertyData.joinClause);
                this.currentNavigationTable = propertyTable;
                navigationProperties = this._getNavigationProperties(this.edm, propertyTable);
            }

            return {
                table: propertyTable,
                value: this._writeTableProperty(currentTableName, property),
                navigationProperties: navigationProperties
            };
        }
    }, {
        key: "queryable",
        value: function queryable(property, expression) {
            var table = property.table;
            var visitor = new Visitor(table.name, this.edm);

            return visitor.parse(expression);
        }
    }, {
        key: "skip",
        value: function skip(value) {
            return "OFFSET " + value;
        }
    }, {
        key: "startsWith",
        value: function startsWith(propertyAccessor, value) {
            var namespace = propertyAccessor.value;
            var newValue = this._sqlizePrimitive(value);
            newValue = value.substring(1, value.length - 1);

            return namespace + " LIKE " + this.dataConverter.convertStartsWithString(value);
        }
    }, {
        key: "string",
        value: function string(expression) {
            return expression.value;
        }
    }, {
        key: "substringOf",
        value: function substringOf(propertyAccessor, value) {
            var namespace = propertyAccessor.value;
            return namespace + " LIKE " + this.dataConverter.convertContainsString(value);
        }
    }, {
        key: "take",
        value: function take(value) {
            if (value === Infinity) {
                return "LIMIT -1";
            } else {
                return "LIMIT" + value;
            }
        }
    }, {
        key: "type",
        value: function type(_type) {
            this.currentNavigationTable = this.table;
            var navigationProperties = this._getNavigationProperties(this.edm, this.table);

            return {
                table: this.table,
                value: "",
                navigationProperties: navigationProperties
            };
        }
    }, {
        key: "where",
        value: function where(expression) {
            if (!expression) {
                return "";
            }
            return "WHERE " + this["and"].apply(this, arguments);
        }
    }]);

    return Visitor;
}(_queryablejs.ExpressionVisitor);

exports.default = Visitor;
//# sourceMappingURL=Visitor.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var flattenMultiKeyMap = function flattenMultiKeyMap(multiKeyMap) {
    var keys = multiKeyMap.getKeys();
    return keys.reduce(function (array, key) {
        return array.concat(multiKeyMap.get(key).getValues());
    }, []);
};

var getValues = function getValues(object) {
    return Object.keys(object).map(function (key) {
        return object[key];
    });
};

var EntityBuilder = function () {
    function EntityBuilder(name, edm) {
        _classCallCheck(this, EntityBuilder);

        this.name = name;
        this.edm = edm;
        this.relationships = this.edm.relationships;
        this.table = this._getTable(name);
        this.delimiter = "___";
    }

    _createClass(EntityBuilder, [{
        key: "_attachEntityRelationships",
        value: function _attachEntityRelationships(tableName, entity, entityMap, attachedEntities) {
            var _this = this;

            var table = this._getTable(tableName);

            var sourceRelationships = this._getTablesRelationshipsAsSources(table, this.relationships);
            var targetRelationships = this._getTablesRelationshipsAsTargets(table, this.relationships);

            var oneToOneRelationships = sourceRelationships.filter(function (relationship) {
                return relationship.hasOne != null;
            });

            var oneToManyRelationships = sourceRelationships.filter(function (relationship) {
                return relationship.hasMany != null;
            });

            oneToOneRelationships.forEach(function (relationship) {
                var foreignTableName = relationship.ofType;
                var foreignKey = relationship.withForeignKey;
                var key = relationship.hasKey;
                var hasOne = relationship.hasOne;

                var target = getValues(entityMap[foreignTableName]).find(function (target) {
                    return target[foreignKey] === entity[key];
                });

                if (target != null && attachedEntities.indexOf(target) === -1) {
                    entity[hasOne] = target;

                    _this._attachEntityRelationships(foreignTableName, target, entityMap, attachedEntities.concat([entity]));
                }
            });

            oneToManyRelationships.forEach(function (relationship) {
                var foreignTableName = relationship.ofType;
                var foreignKey = relationship.withForeignKey;
                var key = relationship.hasKey;
                var hasMany = relationship.hasMany;

                var targets = getValues(entityMap[foreignTableName]).filter(function (target) {
                    return target[foreignKey] === entity[key];
                });

                entity[hasMany] = [];

                targets.forEach(function (target) {
                    if (attachedEntities.indexOf(target) === -1) {
                        entity[hasMany].push(target);
                        _this._attachEntityRelationships(foreignTableName, target, entityMap, attachedEntities.concat([entity]));
                    }
                });
            });

            targetRelationships.forEach(function (relationship) {
                var sourceTableName = relationship.type;
                var foreignKey = relationship.withForeignKey;
                var key = relationship.hasKey;
                var withOne = relationship.withOne;

                var source = getValues(entityMap[sourceTableName]).find(function (source) {
                    return source[key] === entity[foreignKey];
                });

                if (source != null && attachedEntities.indexOf(source) === -1) {
                    entity[withOne] = source;

                    _this._attachEntityRelationships(sourceTableName, source, entityMap, attachedEntities.concat([entity]));
                }
            });
        }
    }, {
        key: "_convertRow",
        value: function _convertRow(row, entityMap) {
            var _this2 = this;

            var edm = this.edm;
            var name = this.name;
            var key = this._getKeyForRow(row);
            var entity = entityMap[this.name][key];

            if (entity == null) {
                entity = entityMap[this.name][key] = this._createEntity(name, row);
            }

            Object.keys(row).forEach(function (key) {
                var parts = key.split("___");
                var tableName = parts[0];
                var columnName = parts[1];

                var entity = _this2._createEntity(tableName, row);

                if (entity == null) {
                    entityMap[tableName][key] = entity;
                }
            });

            return entity;
        }
    }, {
        key: "_convertValue",
        value: function _convertValue(type, value) {
            if (value == null) {
                return null;
            }

            if (type === "String") {
                return value;
            } else if (type === "Numeric") {
                return parseFloat(value);
            } else if (type === "Boolean") {
                return type == "1" ? true : false;
            } else if (type === "Float") {
                return parseFloat(value);
            } else if (type === "Decimal") {
                return parseFloat(value);
            } else if (type === "Double") {
                return parseFloat(value);
            } else if (type === "Integer") {
                return parseInt(value, 10);
            } else if (type === "Date") {
                return new Date(value);
            } else if (type === "Enum") {
                return parseInt(value, 10);
            } else {
                throw new Error("Unknown type.");
            }
        }
    }, {
        key: "_createEntity",
        value: function _createEntity(type, row) {
            var _this3 = this;

            var entity = {};
            var columns = this._getTable(type).columns;
            var delimiter = this.delimiter;

            columns.forEach(function (column) {
                entity[column.name] = _this3._convertValue(column.type, row["" + type + delimiter + column.name]);
            });

            return entity;
        }
    }, {
        key: "_createEntityMap",
        value: function _createEntityMap() {
            return this.edm.tables.reduce(function (accumulator, table) {
                accumulator[table.name] = {};
                return accumulator;
            }, {});
        }
    }, {
        key: "_getKeyForEntity",
        value: function _getKeyForEntity(entity) {
            return this._getPrimaryKeys(this.name).map(function (key) {
                return entity[key];
            }).join("|");
        }
    }, {
        key: "_getKeyForRow",
        value: function _getKeyForRow(row) {
            var _this4 = this;

            return this._getPrimaryKeys(this.name).map(function (key) {
                return row["" + _this4.name + _this4.delimiter + key];
            }).join("|");
        }
    }, {
        key: "_getPrimaryKeys",
        value: function _getPrimaryKeys(name) {
            return this._getTable(name).columns.filter(function (column) {
                return column.isPrimaryKey;
            }).map(function (column) {
                return column.name;
            });
        }
    }, {
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "_getTablesRelationshipsAsTargets",
        value: function _getTablesRelationshipsAsTargets(table, relationships) {
            var foreignKeyNames = {};

            var filter = function filter(relationship) {
                var foreignKey = relationship.withForeignKey;

                if (relationship.ofType === table.name && foreignKeyNames[foreignKey] == null) {
                    foreignKeyNames[foreignKey];
                    return true;
                }
                return false;
            };

            var oneToOne = relationships.oneToOne.filter(filter);
            var oneToMany = relationships.oneToMany.filter(filter);

            return oneToOne.concat(oneToMany);
        }
    }, {
        key: "_getTablesRelationshipsAsSources",
        value: function _getTablesRelationshipsAsSources(table, relationships) {
            var keyNames = {};

            var filter = function filter(relationship) {
                var key = relationship.hasKey;

                if (relationship.type === table.name && keyNames[key] == null) {
                    keyNames[key];
                    return true;
                }
                return false;
            };

            var oneToOne = relationships.oneToOne.filter(filter);
            var oneToMany = relationships.oneToMany.filter(filter);

            return oneToOne.concat(oneToMany);
        }
    }, {
        key: "convert",
        value: function convert(sqlResults) {
            var _this5 = this;

            var name = this.name;

            if (sqlResults.length > 0) {
                var entityMap = this._createEntityMap();

                var results = sqlResults.map(function (row) {
                    return _this5._convertRow(row, entityMap);
                });

                Object.keys(entityMap).forEach(function (key) {
                    var parts = key.split("_|_");
                    var tableName = parts[0];
                    var entity = entityMap[key];

                    _this5._attachEntityRelationships(tableName, entity, entityMap, []);
                });

                return results;
            } else {
                return [];
            }
        }
    }]);

    return EntityBuilder;
}();

exports.default = EntityBuilder;
//# sourceMappingURL=EntityBuilder.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataTypeMapping = __webpack_require__(11);

var _dataTypeMapping2 = _interopRequireDefault(_dataTypeMapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EdmValidator = function () {
    function EdmValidator() {
        _classCallCheck(this, EdmValidator);
    }

    _createClass(EdmValidator, [{
        key: "validate",
        value: function validate(edm) {
            var _this = this;

            if (!Array.isArray(edm.tables)) {
                throw new Error("Edm needs to have at least one table.");
            }

            if (edm.name == null) {
                throw new Error("Edm needs to have a name.");
            }

            if (edm.version == null) {
                throw new Error("Edm needs to have a version.");
            }

            if (edm.label == null) {
                throw new Error("Edm needs to have a label.");
            }

            edm.tables.forEach(function (table) {
                _this.validateTable(table);
            });

            this.validateRelationships(edm);
        }
    }, {
        key: "validateColumn",
        value: function validateColumn(column) {
            if (column.name == null) {
                throw new Error("Column needs to have a name.");
            }

            if (column.label == null) {
                throw new Error("Column needs to hava a label.");
            }

            if (_dataTypeMapping2.default[column.type] == null) {
                throw new Error("Unknown Column Type: " + column.type + ".");
            }
        }
    }, {
        key: "validateOneToOneRelationship",
        value: function validateOneToOneRelationship(relationship) {
            if (relationship.type == null) {
                throw new Error("One to one relationships needs to have a type property.");
            }

            if (relationship.hasKey == null) {
                throw new Error("One to one relationships needs to have a hasKey property.");
            }

            if (relationship.hasOne == null) {
                throw new Error("One to one relationships needs to have a hasOne property.");
            }

            if (relationship.hasOneLabel == null) {
                throw new Error("One to one relationships needs to have a hasOneLabel property.");
            }

            if (relationship.ofType == null) {
                throw new Error("One to one relationships needs to have a ofType property.");
            }

            if (relationship.withKey == null) {
                throw new Error("One to one relationships needs to have a withKey property.");
            }

            if (relationship.withForeignKey == null) {
                throw new Error("One to one relationships needs to have a withForeignKey property.");
            }

            if (relationship.withOne == null) {
                throw new Error("One to one relationships needs to have a withOne property.");
            }

            if (relationship.withOneLabel == null) {
                throw new Error("One to one relationships needs to have a withOneLabel property.");
            }
        }
    }, {
        key: "validateOneToManyRelationship",
        value: function validateOneToManyRelationship(relationship) {
            if (relationship.type == null) {
                throw new Error("One to many relationships needs to have a type property.");
            }

            if (relationship.hasKey == null) {
                throw new Error("One to many relationships needs to have a hasKey property.");
            }

            if (relationship.hasMany == null) {
                throw new Error("One to many relationships needs to have a hasMany property.");
            }

            if (relationship.hasManyLabel == null) {
                throw new Error("One to many relationships needs to have a hasManyLabel property.");
            }

            if (relationship.ofType == null) {
                throw new Error("One to many relationships needs to have a ofType property.");
            }

            if (relationship.withKey == null) {
                throw new Error("One to many relationships needs to have a withKey property.");
            }

            if (relationship.withForeignKey == null) {
                throw new Error("One to many relationships needs to have a withForeignKey property.");
            }

            if (relationship.withOne == null) {
                throw new Error("One to many relationships needs to have a withOne property.");
            }

            if (relationship.withOneLabel == null) {
                throw new Error("One to many relationships needs to have a withOneLabel property.");
            }
        }
    }, {
        key: "validateRelationships",
        value: function validateRelationships(edm) {
            var _this2 = this;

            if (edm.relationships == null) {
                throw new Error("Edm needs to have a relationships object.");
            }

            if (!Array.isArray(edm.relationships.oneToOne)) {
                throw new Error("Edm needs to have a oneToOne array describing one to one relationships. It can be an empty array.");
            }

            if (!Array.isArray(edm.relationships.oneToMany)) {
                throw new Error("Edm needs to have a oneToMany array describing one to many relationships. It can be an empty array.");
            }

            edm.relationships.oneToOne.forEach(function (relationship) {
                _this2.validateOneToOneRelationship(relationship);
            });

            edm.relationships.oneToMany.forEach(function (relationship) {
                _this2.validateOneToManyRelationship(relationship);
            });
        }
    }, {
        key: "validateTable",
        value: function validateTable(table) {
            var _this3 = this;

            if (table.name == null) {
                throw new Error("Table needs to have a name.");
            }

            if (table.label == null) {
                throw new Error("Table needs to have a label.");
            }

            if (table.pluralLabel == null) {
                throw new Error("Table needs to have a pluralLabel.");
            }

            var primaryKeyColumns = table.columns.filter(function (column) {
                return column.isPrimaryKey;
            });

            if (primaryKeyColumns.length !== 1) {
                throw new Error("Tables can only have one primary key.");
            }

            table.columns.forEach(function (column) {
                _this3.validateColumn(column);
            });
        }
    }]);

    return EdmValidator;
}();

exports.default = EdmValidator;
//# sourceMappingURL=EdmValidator.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _User2 = __webpack_require__(7);

var _User3 = _interopRequireDefault(_User2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdminUser = function (_User) {
    _inherits(AdminUser, _User);

    function AdminUser(name) {
        _classCallCheck(this, AdminUser);

        var _this = _possibleConstructorReturn(this, (AdminUser.__proto__ || Object.getPrototypeOf(AdminUser)).call(this));

        _this.name = name || null;
        _this.isAdmin = true;
        return _this;
    }

    return AdminUser;
}(_User3.default);

exports.default = AdminUser;
//# sourceMappingURL=AdminUser.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _User2 = __webpack_require__(7);

var _User3 = _interopRequireDefault(_User2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GuestUser = function (_User) {
    _inherits(GuestUser, _User);

    function GuestUser(name) {
        _classCallCheck(this, GuestUser);

        var _this = _possibleConstructorReturn(this, (GuestUser.__proto__ || Object.getPrototypeOf(GuestUser)).call(this));

        _this.id = "guest";
        _this.name = "Guest";
        _this.isAdmin = false;
        return _this;
    }

    return GuestUser;
}(_User3.default);

exports.default = GuestUser;
//# sourceMappingURL=GuestUser.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(33);

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalFileSystem = function () {
    function LocalFileSystem(_ref) {
        var rootFilePath = _ref.rootFilePath,
            fileSystem = _ref.fileSystem;

        _classCallCheck(this, LocalFileSystem);

        if (rootFilePath == null) {
            throw new Error("Null Argument Exception: File System needs to have a rootFilePath.");
        }

        this.rootFilePath = rootFilePath;
        this.fileSystem = fileSystem || _fsExtra2.default;
    }

    _createClass(LocalFileSystem, [{
        key: "getReadStreamAsync",
        value: function getReadStreamAsync(path) {
            var fileStream = fileSystem.createReadStream(path);
            return Promise.resolve(fileStream);
        }
    }, {
        key: "removeFileAsync",
        value: function removeFileAsync(path) {
            return fileStream.unlink(path);
        }
    }, {
        key: "getWriteStreamAsync",
        value: function getWriteStreamAsync(path) {
            var fileStream = fileSystem.createWriteStream(path);
            return Promise.resolve(fileStream);
        }
    }, {
        key: "getFileSizeAsync",
        value: function getFileSizeAsync(path) {
            return fileSystem.stat().then(function (stat) {
                return stat.size;
            });
        }
    }]);

    return LocalFileSystem;
}();

exports.default = LocalFileSystem;
//# sourceMappingURL=LocalFileSystem.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const assign = __webpack_require__(34)

const fs = {}

// Export graceful-fs:
assign(fs, __webpack_require__(14))
// Export extra methods:
assign(fs, __webpack_require__(39))
assign(fs, __webpack_require__(20))
assign(fs, __webpack_require__(3))
assign(fs, __webpack_require__(8))
assign(fs, __webpack_require__(48))
assign(fs, __webpack_require__(52))
assign(fs, __webpack_require__(53))
assign(fs, __webpack_require__(54))
assign(fs, __webpack_require__(55))
assign(fs, __webpack_require__(61))
assign(fs, __webpack_require__(4))

module.exports = fs


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// simple mutable assign
function assign () {
  const args = [].slice.call(arguments).filter(i => i)
  const dest = args.shift()
  args.forEach(src => {
    Object.keys(src).forEach(key => {
      dest[key] = src[key]
    })
  })

  return dest
}

module.exports = assign


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(15)
var constants = __webpack_require__(36)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
    var callback
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0
      callback = function (er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
        }
        callback_.apply(this, arguments)
      }
    }
    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
  }})(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)
}

function patchLchmod (fs) {
  fs.lchmod = function (path, mode, callback) {
    fs.open( path
           , constants.O_WRONLY | constants.O_SYMLINK
           , mode
           , function (err, fd) {
      if (err) {
        if (callback) callback(err)
        return
      }
      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      fs.fchmod(fd, mode, function (err) {
        fs.close(fd, function(err2) {
          if (callback) callback(err || err2)
        })
      })
    })
  }

  fs.lchmodSync = function (path, mode) {
    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

    // prefer to return the chmod error, if one occurs,
    // but still try to close, and report closing errors if they occur.
    var threw = true
    var ret
    try {
      ret = fs.fchmodSync(fd, mode)
      threw = false
    } finally {
      if (threw) {
        try {
          fs.closeSync(fd)
        } catch (er) {}
      } else {
        fs.closeSync(fd)
      }
    }
    return ret
  }
}

function patchLutimes (fs) {
  if (constants.hasOwnProperty("O_SYMLINK")) {
    fs.lutimes = function (path, at, mt, cb) {
      fs.open(path, constants.O_SYMLINK, function (er, fd) {
        if (er) {
          if (cb) cb(er)
          return
        }
        fs.futimes(fd, at, mt, function (er) {
          fs.close(fd, function (er2) {
            if (cb) cb(er || er2)
          })
        })
      })
    }

    fs.lutimesSync = function (path, at, mt) {
      var fd = fs.openSync(path, constants.O_SYMLINK)
      var ret
      var threw = true
      try {
        ret = fs.futimesSync(fd, at, mt)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }

  } else {
    fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
    fs.lutimesSync = function () {}
  }
}

function chmodFix (orig) {
  if (!orig) return orig
  return function (target, mode, cb) {
    return orig.call(fs, target, mode, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chmodFixSync (orig) {
  if (!orig) return orig
  return function (target, mode) {
    try {
      return orig.call(fs, target, mode)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function chownFix (orig) {
  if (!orig) return orig
  return function (target, uid, gid, cb) {
    return orig.call(fs, target, uid, gid, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chownFixSync (orig) {
  if (!orig) return orig
  return function (target, uid, gid) {
    try {
      return orig.call(fs, target, uid, gid)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function statFix (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target, cb) {
    return orig.call(fs, target, function (er, stats) {
      if (!stats) return cb.apply(this, arguments)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      if (cb) cb.apply(this, arguments)
    })
  }
}

function statFixSync (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target) {
    var stats = orig.call(fs, target)
    if (stats.uid < 0) stats.uid += 0x100000000
    if (stats.gid < 0) stats.gid += 0x100000000
    return stats;
  }
}

// ENOSYS means that the fs doesn't support the op. Just ignore
// that, because it doesn't matter.
//
// if there's no getuid, or if getuid() is something other
// than 0, and the error is EINVAL or EPERM, then just ignore
// it.
//
// This specific case is a silent failure in cp, install, tar,
// and most other unix tools that manage permissions.
//
// When running as root, or if other types of errors are
// encountered, then it's strict.
function chownErOk (er) {
  if (!er)
    return true

  if (er.code === "ENOSYS")
    return true

  var nonroot = !process.getuid || process.getuid() !== 0
  if (nonroot) {
    if (er.code === "EINVAL" || er.code === "EPERM")
      return true
  }

  return false
}


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("constants");

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var Stream = __webpack_require__(16).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const u = __webpack_require__(2).fromCallback
module.exports = {
  copy: u(__webpack_require__(40))
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const ncp = __webpack_require__(18)
const mkdir = __webpack_require__(3)
const pathExists = __webpack_require__(4).pathExists

function copy (src, dest, options, callback) {
  if (typeof options === 'function' && !callback) {
    callback = options
    options = {}
  } else if (typeof options === 'function' || options instanceof RegExp) {
    options = {filter: options}
  }
  callback = callback || function () {}
  options = options || {}

  // Warn about using preserveTimestamps on 32-bit node:
  if (options.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`)
  }

  // don't allow src and dest to be the same
  const basePath = process.cwd()
  const currentPath = path.resolve(basePath, src)
  const targetPath = path.resolve(basePath, dest)
  if (currentPath === targetPath) return callback(new Error('Source and destination must not be the same.'))

  fs.lstat(src, (err, stats) => {
    if (err) return callback(err)

    let dir = null
    if (stats.isDirectory()) {
      const parts = dest.split(path.sep)
      parts.pop()
      dir = parts.join(path.sep)
    } else {
      dir = path.dirname(dest)
    }

    pathExists(dir, (err, dirExists) => {
      if (err) return callback(err)
      if (dirExists) return ncp(src, dest, options, callback)
      mkdir.mkdirs(dir, err => {
        if (err) return callback(err)
        ncp(src, dest, options, callback)
      })
    })
  })
}

module.exports = copy


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const os = __webpack_require__(42)
const path = __webpack_require__(0)

// HFS, ext{2,3}, FAT do not, Node.js v0.10 does not
function hasMillisResSync () {
  let tmpfile = path.join('millis-test-sync' + Date.now().toString() + Math.random().toString().slice(2))
  tmpfile = path.join(os.tmpdir(), tmpfile)

  // 550 millis past UNIX epoch
  const d = new Date(1435410243862)
  fs.writeFileSync(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141')
  const fd = fs.openSync(tmpfile, 'r+')
  fs.futimesSync(fd, d, d)
  fs.closeSync(fd)
  return fs.statSync(tmpfile).mtime > 1435410243000
}

function hasMillisRes (callback) {
  let tmpfile = path.join('millis-test' + Date.now().toString() + Math.random().toString().slice(2))
  tmpfile = path.join(os.tmpdir(), tmpfile)

  // 550 millis past UNIX epoch
  const d = new Date(1435410243862)
  fs.writeFile(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141', err => {
    if (err) return callback(err)
    fs.open(tmpfile, 'r+', (err, fd) => {
      if (err) return callback(err)
      fs.futimes(fd, d, d, err => {
        if (err) return callback(err)
        fs.close(fd, err => {
          if (err) return callback(err)
          fs.stat(tmpfile, (err, stats) => {
            if (err) return callback(err)
            callback(null, stats.mtime > 1435410243000)
          })
        })
      })
    })
  })
}

function timeRemoveMillis (timestamp) {
  if (typeof timestamp === 'number') {
    return Math.floor(timestamp / 1000) * 1000
  } else if (timestamp instanceof Date) {
    return new Date(Math.floor(timestamp.getTime() / 1000) * 1000)
  } else {
    throw new Error('fs-extra: timeRemoveMillis() unknown parameter type')
  }
}

function utimesMillis (path, atime, mtime, callback) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  fs.open(path, 'r+', (err, fd) => {
    if (err) return callback(err)
    fs.futimes(fd, atime, mtime, futimesErr => {
      fs.close(fd, closeErr => {
        if (callback) callback(futimesErr || closeErr)
      })
    })
  })
}

module.exports = {
  hasMillisRes,
  hasMillisResSync,
  timeRemoveMillis,
  utimesMillis
}


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const invalidWin32Path = __webpack_require__(19).invalidWin32Path

const o777 = parseInt('0777', 8)

function mkdirs (p, opts, callback, made) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  } else if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    const errInval = new Error(p + ' contains invalid WIN32 path characters.')
    errInval.code = 'EINVAL'
    return callback(errInval)
  }

  let mode = opts.mode
  const xfs = opts.fs || fs

  if (mode === undefined) {
    mode = o777 & (~process.umask())
  }
  if (!made) made = null

  callback = callback || function () {}
  p = path.resolve(p)

  xfs.mkdir(p, mode, er => {
    if (!er) {
      made = made || p
      return callback(null, made)
    }
    switch (er.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) return callback(er)
        mkdirs(path.dirname(p), opts, (er, made) => {
          if (er) callback(er, made)
          else mkdirs(p, opts, callback, made)
        })
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        xfs.stat(p, (er2, stat) => {
          // if the stat fails, then that's super weird.
          // let the original error be the failure reason.
          if (er2 || !stat.isDirectory()) callback(er, made)
          else callback(null, made)
        })
        break
    }
  })
}

module.exports = mkdirs


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const invalidWin32Path = __webpack_require__(19).invalidWin32Path

const o777 = parseInt('0777', 8)

function mkdirsSync (p, opts, made) {
  if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  let mode = opts.mode
  const xfs = opts.fs || fs

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    const errInval = new Error(p + ' contains invalid WIN32 path characters.')
    errInval.code = 'EINVAL'
    throw errInval
  }

  if (mode === undefined) {
    mode = o777 & (~process.umask())
  }
  if (!made) made = null

  p = path.resolve(p)

  try {
    xfs.mkdirSync(p, mode)
    made = made || p
  } catch (err0) {
    switch (err0.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) throw err0
        made = mkdirsSync(path.dirname(p), opts, made)
        mkdirsSync(p, opts, made)
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        let stat
        try {
          stat = xfs.statSync(p)
        } catch (err1) {
          throw err0
        }
        if (!stat.isDirectory()) throw err0
        break
    }
  }

  return made
}

module.exports = mkdirsSync


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const copyFileSync = __webpack_require__(46)
const mkdir = __webpack_require__(3)

function copySync (src, dest, options) {
  if (typeof options === 'function' || options instanceof RegExp) {
    options = {filter: options}
  }

  options = options || {}
  options.recursive = !!options.recursive

  // default to true for now
  options.clobber = 'clobber' in options ? !!options.clobber : true
  // overwrite falls back to clobber
  options.overwrite = 'overwrite' in options ? !!options.overwrite : options.clobber
  options.dereference = 'dereference' in options ? !!options.dereference : false
  options.preserveTimestamps = 'preserveTimestamps' in options ? !!options.preserveTimestamps : false

  options.filter = options.filter || function () { return true }

  // Warn about using preserveTimestamps on 32-bit node:
  if (options.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`)
  }

  const stats = (options.recursive && !options.dereference) ? fs.lstatSync(src) : fs.statSync(src)
  const destFolder = path.dirname(dest)
  const destFolderExists = fs.existsSync(destFolder)
  let performCopy = false

  if (options.filter instanceof RegExp) {
    console.warn('Warning: fs-extra: Passing a RegExp filter is deprecated, use a function')
    performCopy = options.filter.test(src)
  } else if (typeof options.filter === 'function') performCopy = options.filter(src, dest)

  if (stats.isFile() && performCopy) {
    if (!destFolderExists) mkdir.mkdirsSync(destFolder)
    copyFileSync(src, dest, {
      overwrite: options.overwrite,
      errorOnExist: options.errorOnExist,
      preserveTimestamps: options.preserveTimestamps
    })
  } else if (stats.isDirectory() && performCopy) {
    if (!fs.existsSync(dest)) mkdir.mkdirsSync(dest)
    const contents = fs.readdirSync(src)
    contents.forEach(content => {
      const opts = options
      opts.recursive = true
      copySync(path.join(src, content), path.join(dest, content), opts)
    })
  } else if (options.recursive && stats.isSymbolicLink() && performCopy) {
    const srcPath = fs.readlinkSync(src)
    fs.symlinkSync(srcPath, dest)
  }
}

module.exports = copySync


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)

const BUF_LENGTH = 64 * 1024
const _buff = __webpack_require__(21)(BUF_LENGTH)

function copyFileSync (srcFile, destFile, options) {
  const overwrite = options.overwrite
  const errorOnExist = options.errorOnExist
  const preserveTimestamps = options.preserveTimestamps

  if (fs.existsSync(destFile)) {
    if (overwrite) {
      fs.unlinkSync(destFile)
    } else if (errorOnExist) {
      throw new Error(`${destFile} already exists`)
    } else return
  }

  const fdr = fs.openSync(srcFile, 'r')
  const stat = fs.fstatSync(fdr)
  const fdw = fs.openSync(destFile, 'w', stat.mode)
  let bytesRead = 1
  let pos = 0

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw, _buff, 0, bytesRead)
    pos += bytesRead
  }

  if (preserveTimestamps) {
    fs.futimesSync(fdw, stat.atime, stat.mtime)
  }

  fs.closeSync(fdr)
  fs.closeSync(fdw)
}

module.exports = copyFileSync


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const assert = __webpack_require__(17)

const isWindows = (process.platform === 'win32')

function defaults (options) {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(m => {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
}

function rimraf (p, options, cb) {
  let busyTries = 0

  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  rimraf_(p, options, function CB (er) {
    if (er) {
      if (isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
          busyTries < options.maxBusyTries) {
        busyTries++
        let time = busyTries * 100
        // try again, with the same exact callback as this one.
        return setTimeout(() => rimraf_(p, options, CB), time)
      }

      // already gone
      if (er.code === 'ENOENT') er = null
    }

    cb(er)
  })
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null)
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === 'EPERM' && isWindows) {
      return fixWinEPERM(p, options, er, cb)
    }

    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb)
    }

    options.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null)
        }
        if (er.code === 'EPERM') {
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        }
        if (er.code === 'EISDIR') {
          return rmdir(p, options, er, cb)
        }
      }
      return cb(er)
    })
  })
}

function fixWinEPERM (p, options, er, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')
  if (er) {
    assert(er instanceof Error)
  }

  options.chmod(p, 666, er2 => {
    if (er2) {
      cb(er2.code === 'ENOENT' ? null : er)
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === 'ENOENT' ? null : er)
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb)
        } else {
          options.unlink(p, cb)
        }
      })
    }
  })
}

function fixWinEPERMSync (p, options, er) {
  let stats

  assert(p)
  assert(options)
  if (er) {
    assert(er instanceof Error)
  }

  try {
    options.chmodSync(p, 666)
  } catch (er2) {
    if (er2.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  try {
    stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  if (stats.isDirectory()) {
    rmdirSync(p, options, er)
  } else {
    options.unlinkSync(p)
  }
}

function rmdir (p, options, originalEr, cb) {
  assert(p)
  assert(options)
  if (originalEr) {
    assert(originalEr instanceof Error)
  }
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p, options, cb)
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr)
    } else {
      cb(er)
    }
  })
}

function rmkids (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, (er, files) => {
    if (er) return cb(er)

    let n = files.length
    let errState

    if (n === 0) return options.rmdir(p, cb)

    files.forEach(f => {
      rimraf(path.join(p, f), options, er => {
        if (errState) {
          return
        }
        if (er) return cb(errState = er)
        if (--n === 0) {
          options.rmdir(p, cb)
        }
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  let st

  options = options || {}
  defaults(options)

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  try {
    st = options.lstatSync(p)
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er.code === 'EPERM' && isWindows) {
      fixWinEPERMSync(p, options, er)
    }
  }

  try {
    // sunos lets the root user unlink directories, which is... weird.
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null)
    } else {
      options.unlinkSync(p)
    }
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    } else if (er.code === 'EPERM') {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
    } else if (er.code !== 'EISDIR') {
      throw er
    }
    rmdirSync(p, options, er)
  }
}

function rmdirSync (p, options, originalEr) {
  assert(p)
  assert(options)
  if (originalEr) {
    assert(originalEr instanceof Error)
  }

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === 'ENOTDIR') {
      throw originalEr
    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
      rmkidsSync(p, options)
    } else if (er.code !== 'ENOENT') {
      throw er
    }
  }
}

function rmkidsSync (p, options) {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options))
  options.rmdirSync(p, options)
}

module.exports = rimraf
rimraf.sync = rimrafSync


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const jsonFile = __webpack_require__(9)

jsonFile.outputJsonSync = __webpack_require__(50)
jsonFile.outputJson = u(__webpack_require__(51))
// aliases
jsonFile.outputJSONSync = jsonFile.outputJSONSync
jsonFile.outputJSON = jsonFile.outputJson
jsonFile.writeJSON = jsonFile.writeJson
jsonFile.writeJSONSync = jsonFile.writeJsonSync
jsonFile.readJSON = jsonFile.readJson
jsonFile.readJSONSync = jsonFile.readJsonSync

module.exports = jsonFile


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var _fs
try {
  _fs = __webpack_require__(1)
} catch (_) {
  _fs = __webpack_require__(5)
}

function readFile (file, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }

  if (typeof options === 'string') {
    options = {encoding: options}
  }

  options = options || {}
  var fs = options.fs || _fs

  var shouldThrow = true
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors
  } else if ('throws' in options) {
    shouldThrow = options.throws
  }

  fs.readFile(file, options, function (err, data) {
    if (err) return callback(err)

    data = stripBom(data)

    var obj
    try {
      obj = JSON.parse(data, options ? options.reviver : null)
    } catch (err2) {
      if (shouldThrow) {
        err2.message = file + ': ' + err2.message
        return callback(err2)
      } else {
        return callback(null, null)
      }
    }

    callback(null, obj)
  })
}

function readFileSync (file, options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {encoding: options}
  }

  var fs = options.fs || _fs

  var shouldThrow = true
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors
  } else if ('throws' in options) {
    shouldThrow = options.throws
  }

  try {
    var content = fs.readFileSync(file, options)
    content = stripBom(content)
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = file + ': ' + err.message
      throw err
    } else {
      return null
    }
  }
}

function writeFile (file, obj, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }
  options = options || {}
  var fs = options.fs || _fs

  var spaces = typeof options === 'object' && options !== null
    ? 'spaces' in options
    ? options.spaces : this.spaces
    : this.spaces

  var str = ''
  try {
    str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n'
  } catch (err) {
    // Need to return whether a callback was passed or not
    if (callback) callback(err, null)
    return
  }

  fs.writeFile(file, str, options, callback)
}

function writeFileSync (file, obj, options) {
  options = options || {}
  var fs = options.fs || _fs

  var spaces = typeof options === 'object' && options !== null
    ? 'spaces' in options
    ? options.spaces : this.spaces
    : this.spaces

  var str = JSON.stringify(obj, options.replacer, spaces) + '\n'
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8')
  content = content.replace(/^\uFEFF/, '')
  return content
}

var jsonfile = {
  spaces: null,
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync
}

module.exports = jsonfile


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const mkdir = __webpack_require__(3)
const jsonFile = __webpack_require__(9)

function outputJsonSync (file, data, options) {
  const dir = path.dirname(file)

  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  jsonFile.writeJsonSync(file, data, options)
}

module.exports = outputJsonSync


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(0)
const mkdir = __webpack_require__(3)
const pathExists = __webpack_require__(4).pathExists
const jsonFile = __webpack_require__(9)

function outputJson (file, data, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  const dir = path.dirname(file)

  pathExists(dir, (err, itDoes) => {
    if (err) return callback(err)
    if (itDoes) return jsonFile.writeJson(file, data, options, callback)

    mkdir.mkdirs(dir, err => {
      if (err) return callback(err)
      jsonFile.writeJson(file, data, options, callback)
    })
  })
}

module.exports = outputJson


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// most of this code was written by Andrew Kelley
// licensed under the BSD license: see
// https://github.com/andrewrk/node-mv/blob/master/package.json

// this needs a cleanup

const u = __webpack_require__(2).fromCallback
const fs = __webpack_require__(1)
const ncp = __webpack_require__(18)
const path = __webpack_require__(0)
const remove = __webpack_require__(8).remove
const mkdirp = __webpack_require__(3).mkdirs

function move (source, dest, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  const shouldMkdirp = ('mkdirp' in options) ? options.mkdirp : true
  const overwrite = options.overwrite || options.clobber || false

  if (shouldMkdirp) {
    mkdirs()
  } else {
    doRename()
  }

  function mkdirs () {
    mkdirp(path.dirname(dest), err => {
      if (err) return callback(err)
      doRename()
    })
  }

  function doRename () {
    if (path.resolve(source) === path.resolve(dest)) {
      fs.access(source, callback)
    } else if (overwrite) {
      fs.rename(source, dest, err => {
        if (!err) return callback()

        if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
          remove(dest, err => {
            if (err) return callback(err)
            options.overwrite = false // just overwriteed it, no need to do it again
            move(source, dest, options, callback)
          })
          return
        }

        // weird Windows shit
        if (err.code === 'EPERM') {
          setTimeout(() => {
            remove(dest, err => {
              if (err) return callback(err)
              options.overwrite = false
              move(source, dest, options, callback)
            })
          }, 200)
          return
        }

        if (err.code !== 'EXDEV') return callback(err)
        moveAcrossDevice(source, dest, overwrite, callback)
      })
    } else {
      fs.link(source, dest, err => {
        if (err) {
          if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') {
            moveAcrossDevice(source, dest, overwrite, callback)
            return
          }
          callback(err)
          return
        }
        fs.unlink(source, callback)
      })
    }
  }
}

function moveAcrossDevice (source, dest, overwrite, callback) {
  fs.stat(source, (err, stat) => {
    if (err) {
      callback(err)
      return
    }

    if (stat.isDirectory()) {
      moveDirAcrossDevice(source, dest, overwrite, callback)
    } else {
      moveFileAcrossDevice(source, dest, overwrite, callback)
    }
  })
}

function moveFileAcrossDevice (source, dest, overwrite, callback) {
  const flags = overwrite ? 'w' : 'wx'
  const ins = fs.createReadStream(source)
  const outs = fs.createWriteStream(dest, { flags })

  ins.on('error', err => {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)

    // may want to create a directory but `out` line above
    // creates an empty file for us: See #108
    // don't care about error here
    fs.unlink(dest, () => {
      // note: `err` here is from the input stream errror
      if (err.code === 'EISDIR' || err.code === 'EPERM') {
        moveDirAcrossDevice(source, dest, overwrite, callback)
      } else {
        callback(err)
      }
    })
  })

  outs.on('error', err => {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)
    callback(err)
  })

  outs.once('close', onClose)
  ins.pipe(outs)

  function onClose () {
    fs.unlink(source, callback)
  }
}

function moveDirAcrossDevice (source, dest, overwrite, callback) {
  const options = {
    overwrite: false
  }

  if (overwrite) {
    remove(dest, err => {
      if (err) return callback(err)
      startNcp()
    })
  } else {
    startNcp()
  }

  function startNcp () {
    ncp(source, dest, options, err => {
      if (err) return callback(err)
      remove(source, callback)
    })
  }
}

module.exports = {
  move: u(move)
}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const copySync = __webpack_require__(20).copySync
const removeSync = __webpack_require__(8).removeSync
const mkdirpSync = __webpack_require__(3).mkdirsSync
const buffer = __webpack_require__(21)

function moveSync (src, dest, options) {
  options = options || {}
  const overwrite = options.overwrite || options.clobber || false

  src = path.resolve(src)
  dest = path.resolve(dest)

  if (src === dest) return fs.accessSync(src)

  if (isSrcSubdir(src, dest)) throw new Error(`Cannot move '${src}' into itself '${dest}'.`)

  mkdirpSync(path.dirname(dest))
  tryRenameSync()

  function tryRenameSync () {
    if (overwrite) {
      try {
        return fs.renameSync(src, dest)
      } catch (err) {
        if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM') {
          removeSync(dest)
          options.overwrite = false // just overwriteed it, no need to do it again
          return moveSync(src, dest, options)
        }

        if (err.code !== 'EXDEV') throw err
        return moveSyncAcrossDevice(src, dest, overwrite)
      }
    } else {
      try {
        fs.linkSync(src, dest)
        return fs.unlinkSync(src)
      } catch (err) {
        if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') {
          return moveSyncAcrossDevice(src, dest, overwrite)
        }
        throw err
      }
    }
  }
}

function moveSyncAcrossDevice (src, dest, overwrite) {
  const stat = fs.statSync(src)

  if (stat.isDirectory()) {
    return moveDirSyncAcrossDevice(src, dest, overwrite)
  } else {
    return moveFileSyncAcrossDevice(src, dest, overwrite)
  }
}

function moveFileSyncAcrossDevice (src, dest, overwrite) {
  const BUF_LENGTH = 64 * 1024
  const _buff = buffer(BUF_LENGTH)

  const flags = overwrite ? 'w' : 'wx'

  const fdr = fs.openSync(src, 'r')
  const stat = fs.fstatSync(fdr)
  const fdw = fs.openSync(dest, flags, stat.mode)
  let bytesRead = 1
  let pos = 0

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw, _buff, 0, bytesRead)
    pos += bytesRead
  }

  fs.closeSync(fdr)
  fs.closeSync(fdw)
  return fs.unlinkSync(src)
}

function moveDirSyncAcrossDevice (src, dest, overwrite) {
  const options = {
    overwrite: false
  }

  if (overwrite) {
    removeSync(dest)
    tryCopySync()
  } else {
    tryCopySync()
  }

  function tryCopySync () {
    copySync(src, dest, options)
    return removeSync(src)
  }
}

// return true if dest is a subdir of src, otherwise false.
// extract dest base dir and check if that is the same as src basename
function isSrcSubdir (src, dest) {
  try {
    return fs.statSync(src).isDirectory() &&
           src !== dest &&
           dest.indexOf(src) > -1 &&
           dest.split(path.dirname(src) + path.sep)[1].split(path.sep)[0] === path.basename(src)
  } catch (e) {
    return false
  }
}

module.exports = {
  moveSync
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const fs = __webpack_require__(5)
const path = __webpack_require__(0)
const mkdir = __webpack_require__(3)
const remove = __webpack_require__(8)

const emptyDir = u(function emptyDir (dir, callback) {
  callback = callback || function () {}
  fs.readdir(dir, (err, items) => {
    if (err) return mkdir.mkdirs(dir, callback)

    items = items.map(item => path.join(dir, item))

    deleteItem()

    function deleteItem () {
      const item = items.pop()
      if (!item) return callback()
      remove.remove(item, err => {
        if (err) return callback(err)
        deleteItem()
      })
    }
  })
})

function emptyDirSync (dir) {
  let items
  try {
    items = fs.readdirSync(dir)
  } catch (err) {
    return mkdir.mkdirsSync(dir)
  }

  items.forEach(item => {
    item = path.join(dir, item)
    remove.removeSync(item)
  })
}

module.exports = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
}


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const file = __webpack_require__(56)
const link = __webpack_require__(57)
const symlink = __webpack_require__(58)

module.exports = {
  // file
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  // link
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  // symlink
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
}


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const mkdir = __webpack_require__(3)
const pathExists = __webpack_require__(4).pathExists

function createFile (file, callback) {
  function makeFile () {
    fs.writeFile(file, '', err => {
      if (err) return callback(err)
      callback()
    })
  }

  pathExists(file, (err, fileExists) => {
    if (err) return callback(err)
    if (fileExists) return callback()
    const dir = path.dirname(file)
    pathExists(dir, (err, dirExists) => {
      if (err) return callback(err)
      if (dirExists) return makeFile()
      mkdir.mkdirs(dir, err => {
        if (err) return callback(err)
        makeFile()
      })
    })
  })
}

function createFileSync (file) {
  if (fs.existsSync(file)) return

  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  fs.writeFileSync(file, '')
}

module.exports = {
  createFile: u(createFile),
  createFileSync
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const mkdir = __webpack_require__(3)
const pathExists = __webpack_require__(4).pathExists

function createLink (srcpath, dstpath, callback) {
  function makeLink (srcpath, dstpath) {
    fs.link(srcpath, dstpath, err => {
      if (err) return callback(err)
      callback(null)
    })
  }

  pathExists(dstpath, (err, destinationExists) => {
    if (err) return callback(err)
    if (destinationExists) return callback(null)
    fs.lstat(srcpath, (err, stat) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink')
        return callback(err)
      }

      const dir = path.dirname(dstpath)
      pathExists(dir, (err, dirExists) => {
        if (err) return callback(err)
        if (dirExists) return makeLink(srcpath, dstpath)
        mkdir.mkdirs(dir, err => {
          if (err) return callback(err)
          makeLink(srcpath, dstpath)
        })
      })
    })
  })
}

function createLinkSync (srcpath, dstpath, callback) {
  const destinationExists = fs.existsSync(dstpath)
  if (destinationExists) return undefined

  try {
    fs.lstatSync(srcpath)
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink')
    throw err
  }

  const dir = path.dirname(dstpath)
  const dirExists = fs.existsSync(dir)
  if (dirExists) return fs.linkSync(srcpath, dstpath)
  mkdir.mkdirsSync(dir)

  return fs.linkSync(srcpath, dstpath)
}

module.exports = {
  createLink: u(createLink),
  createLinkSync
}


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const _mkdirs = __webpack_require__(3)
const mkdirs = _mkdirs.mkdirs
const mkdirsSync = _mkdirs.mkdirsSync

const _symlinkPaths = __webpack_require__(59)
const symlinkPaths = _symlinkPaths.symlinkPaths
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync

const _symlinkType = __webpack_require__(60)
const symlinkType = _symlinkType.symlinkType
const symlinkTypeSync = _symlinkType.symlinkTypeSync

const pathExists = __webpack_require__(4).pathExists

function createSymlink (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type

  pathExists(dstpath, (err, destinationExists) => {
    if (err) return callback(err)
    if (destinationExists) return callback(null)
    symlinkPaths(srcpath, dstpath, (err, relative) => {
      if (err) return callback(err)
      srcpath = relative.toDst
      symlinkType(relative.toCwd, type, (err, type) => {
        if (err) return callback(err)
        const dir = path.dirname(dstpath)
        pathExists(dir, (err, dirExists) => {
          if (err) return callback(err)
          if (dirExists) return fs.symlink(srcpath, dstpath, type, callback)
          mkdirs(dir, err => {
            if (err) return callback(err)
            fs.symlink(srcpath, dstpath, type, callback)
          })
        })
      })
    })
  })
}

function createSymlinkSync (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type

  const destinationExists = fs.existsSync(dstpath)
  if (destinationExists) return undefined

  const relative = symlinkPathsSync(srcpath, dstpath)
  srcpath = relative.toDst
  type = symlinkTypeSync(relative.toCwd, type)
  const dir = path.dirname(dstpath)
  const exists = fs.existsSync(dir)
  if (exists) return fs.symlinkSync(srcpath, dstpath, type)
  mkdirsSync(dir)
  return fs.symlinkSync(srcpath, dstpath, type)
}

module.exports = {
  createSymlink: u(createSymlink),
  createSymlinkSync
}


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const pathExists = __webpack_require__(4).pathExists

/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */

function symlinkPaths (srcpath, dstpath, callback) {
  if (path.isAbsolute(srcpath)) {
    return fs.lstat(srcpath, (err, stat) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureSymlink')
        return callback(err)
      }
      return callback(null, {
        'toCwd': srcpath,
        'toDst': srcpath
      })
    })
  } else {
    const dstdir = path.dirname(dstpath)
    const relativeToDst = path.join(dstdir, srcpath)
    return pathExists(relativeToDst, (err, exists) => {
      if (err) return callback(err)
      if (exists) {
        return callback(null, {
          'toCwd': relativeToDst,
          'toDst': srcpath
        })
      } else {
        return fs.lstat(srcpath, (err, stat) => {
          if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink')
            return callback(err)
          }
          return callback(null, {
            'toCwd': srcpath,
            'toDst': path.relative(dstdir, srcpath)
          })
        })
      }
    })
  }
}

function symlinkPathsSync (srcpath, dstpath) {
  let exists
  if (path.isAbsolute(srcpath)) {
    exists = fs.existsSync(srcpath)
    if (!exists) throw new Error('absolute srcpath does not exist')
    return {
      'toCwd': srcpath,
      'toDst': srcpath
    }
  } else {
    const dstdir = path.dirname(dstpath)
    const relativeToDst = path.join(dstdir, srcpath)
    exists = fs.existsSync(relativeToDst)
    if (exists) {
      return {
        'toCwd': relativeToDst,
        'toDst': srcpath
      }
    } else {
      exists = fs.existsSync(srcpath)
      if (!exists) throw new Error('relative srcpath does not exist')
      return {
        'toCwd': srcpath,
        'toDst': path.relative(dstdir, srcpath)
      }
    }
  }
}

module.exports = {
  symlinkPaths,
  symlinkPathsSync
}


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)

function symlinkType (srcpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type
  if (type) return callback(null, type)
  fs.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, 'file')
    type = (stats && stats.isDirectory()) ? 'dir' : 'file'
    callback(null, type)
  })
}

function symlinkTypeSync (srcpath, type) {
  let stats

  if (type) return type
  try {
    stats = fs.lstatSync(srcpath)
  } catch (e) {
    return 'file'
  }
  return (stats && stats.isDirectory()) ? 'dir' : 'file'
}

module.exports = {
  symlinkType,
  symlinkTypeSync
}


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(2).fromCallback
const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const mkdir = __webpack_require__(3)
const pathExists = __webpack_require__(4).pathExists

function outputFile (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding
    encoding = 'utf8'
  }

  const dir = path.dirname(file)
  pathExists(dir, (err, itDoes) => {
    if (err) return callback(err)
    if (itDoes) return fs.writeFile(file, data, encoding, callback)

    mkdir.mkdirs(dir, err => {
      if (err) return callback(err)

      fs.writeFile(file, data, encoding, callback)
    })
  })
}

function outputFileSync (file, data, encoding) {
  const dir = path.dirname(file)
  if (fs.existsSync(dir)) {
    return fs.writeFileSync.apply(fs, arguments)
  }
  mkdir.mkdirsSync(dir)
  fs.writeFileSync.apply(fs, arguments)
}

module.exports = {
  outputFile: u(outputFile),
  outputFileSync
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = __webpack_require__(16);

var _buffer = __webpack_require__(63);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileWritable = function (_Writable) {
    _inherits(FileWritable, _Writable);

    function FileWritable(files, path) {
        _classCallCheck(this, FileWritable);

        var _this = _possibleConstructorReturn(this, (FileWritable.__proto__ || Object.getPrototypeOf(FileWritable)).call(this));

        _this.files = files;
        _this.path = path;

        _this.files[path] = "";
        return _this;
    }

    _createClass(FileWritable, [{
        key: "_write",
        value: function _write(chunk, encoding, next) {
            this.files[this.path] += chunk;
            next();
        }
    }]);

    return FileWritable;
}(_stream.Writable);

var FileSystem = function () {
    function FileSystem() {
        _classCallCheck(this, FileSystem);

        this.files = {};
    }

    _createClass(FileSystem, [{
        key: "getReadStreamAsync",
        value: function getReadStreamAsync(path) {
            if (this.files[path] == null) {
                throw new Error("File didn't exist.");
            }

            var readStream = new _stream.Readable();
            readStream.push(this.files[path]);
            readStream.push(null);

            return Promise.resolve(readStream);
        }
    }, {
        key: "getWriteStreamAsync",
        value: function getWriteStreamAsync(path) {
            var writeStream = new FileWritable(this.files, path);
            return Promise.resolve(writeStream);
        }
    }, {
        key: "removeFileAsync",
        value: function removeFileAsync(path) {
            if (this.files[path] == null) {
                throw new Error("File didn't exist.");
            }

            this.files[path] = null;

            return Promise.resolve();
        }
    }, {
        key: "getFileSizeAsync",
        value: function getFileSizeAsync(path) {
            if (this.files[path] == null) {
                throw new Error("File didn't exist.");
            }

            return Promise.resolve(_buffer.Buffer.byteLength(this.files[path], 'utf8'));
        }
    }]);

    return FileSystem;
}();

exports.default = FileSystem;
//# sourceMappingURL=FileSystem.js.map

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ })
/******/ ]);
});