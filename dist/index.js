(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
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
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(10)
var polyfills = __webpack_require__(53)
var legacy = __webpack_require__(55)
var queue = []

var util = __webpack_require__(34)

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
    __webpack_require__(35).equal(queue.length, 0)
  })
}

module.exports = patch(__webpack_require__(26))
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const u = __webpack_require__(3).fromCallback
const mkdirs = u(__webpack_require__(74))
const mkdirsSync = __webpack_require__(75)

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const u = __webpack_require__(3).fromPromise
const fs = __webpack_require__(25)

function pathExists (path) {
  return fs.access(path).then(() => true).catch(() => false)
}

module.exports = {
  pathExists: u(pathExists),
  pathExistsSync: fs.existsSync
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

var Readable = __webpack_require__(28);
var Writable = __webpack_require__(19);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(56)
var ieee754 = __webpack_require__(57)
var isArray = __webpack_require__(29)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).Buffer))

/***/ }),
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const rimraf = __webpack_require__(78)

module.exports = {
  remove: u(rimraf),
  removeSync: rimraf.sync
}


/***/ }),
/* 16 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(28);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(19);
exports.Duplex = __webpack_require__(7);
exports.Transform = __webpack_require__(33);
exports.PassThrough = __webpack_require__(63);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(9)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(62)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(30);
/*</replacement>*/

/*<replacement>*/
var Buffer = __webpack_require__(18).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = __webpack_require__(31);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(7);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(7);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(60).setImmediate, __webpack_require__(6)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const jsonFile = __webpack_require__(80)

module.exports = {
  // jsonfile exports
  readJson: u(jsonFile.readFile),
  readJsonSync: jsonFile.readFileSync,
  writeJson: u(jsonFile.writeFile),
  writeJsonSync: jsonFile.writeFileSync
}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TableStatementBuilder = __webpack_require__(43);

var _TableStatementBuilder2 = _interopRequireDefault(_TableStatementBuilder);

var _queryablejs = __webpack_require__(12);

var _Provider = __webpack_require__(44);

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
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = __webpack_require__(21);

var _Table2 = _interopRequireDefault(_Table);

var _MetaProvider = __webpack_require__(24);

var _MetaProvider2 = _interopRequireDefault(_MetaProvider);

var _queryablejs = __webpack_require__(12);

var _User = __webpack_require__(13);

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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = __webpack_require__(12);

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors
const u = __webpack_require__(3).fromCallback
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(10)

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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = __webpack_require__(16).EventEmitter;
var inherits = __webpack_require__(8);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(17);
Stream.Writable = __webpack_require__(64);
Stream.Duplex = __webpack_require__(65);
Stream.Transform = __webpack_require__(66);
Stream.PassThrough = __webpack_require__(67);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(29);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(16).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(30);
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = __webpack_require__(18).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(58);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(59);
var destroyImpl = __webpack_require__(31);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(7);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(32).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(7);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(32).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(2)))

/***/ }),
/* 29 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16).EventEmitter;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var processNextTick = __webpack_require__(14);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = __webpack_require__(9).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(7);

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(68);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(69);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(2)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(34);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// imported from ncp (this is temporary, will rewrite)

var fs = __webpack_require__(1)
var path = __webpack_require__(0)
var utimes = __webpack_require__(72)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 37 */
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  copySync: __webpack_require__(76)
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/* eslint-disable node/no-deprecated-api */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).Buffer))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _MetaDatabase = __webpack_require__(41);

var _MetaDatabase2 = _interopRequireDefault(_MetaDatabase);

var _MetaTable = __webpack_require__(23);

var _MetaTable2 = _interopRequireDefault(_MetaTable);

var _MetaProvider = __webpack_require__(24);

var _MetaProvider2 = _interopRequireDefault(_MetaProvider);

var _AdminUser = __webpack_require__(48);

var _AdminUser2 = _interopRequireDefault(_AdminUser);

var _GuestUser = __webpack_require__(49);

var _GuestUser2 = _interopRequireDefault(_GuestUser);

var _User = __webpack_require__(13);

var _User2 = _interopRequireDefault(_User);

var _LocalFileSystem = __webpack_require__(50);

var _LocalFileSystem2 = _interopRequireDefault(_LocalFileSystem);

var _FileSystem = __webpack_require__(93);

var _FileSystem2 = _interopRequireDefault(_FileSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Database = __webpack_require__(42);

var _Database2 = _interopRequireDefault(_Database);

var _MetaTable = __webpack_require__(23);

var _MetaTable2 = _interopRequireDefault(_MetaTable);

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

var _fs = __webpack_require__(10);

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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = __webpack_require__(21);

var _Table2 = _interopRequireDefault(_Table);

var _EdmValidator = __webpack_require__(47);

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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataTypeMapping = __webpack_require__(22);

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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Visitor = __webpack_require__(45);

var _Visitor2 = _interopRequireDefault(_Visitor);

var _EntityBuilder = __webpack_require__(46);

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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryablejs = __webpack_require__(12);

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
/* 46 */
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataTypeMapping = __webpack_require__(22);

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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _User2 = __webpack_require__(13);

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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _User2 = __webpack_require__(13);

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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

var _fsExtra = __webpack_require__(51);

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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const assign = __webpack_require__(52)

const fs = {}

// Export graceful-fs:
assign(fs, __webpack_require__(25))
// Export extra methods:
assign(fs, __webpack_require__(70))
assign(fs, __webpack_require__(38))
assign(fs, __webpack_require__(4))
assign(fs, __webpack_require__(15))
assign(fs, __webpack_require__(79))
assign(fs, __webpack_require__(83))
assign(fs, __webpack_require__(84))
assign(fs, __webpack_require__(85))
assign(fs, __webpack_require__(86))
assign(fs, __webpack_require__(92))
assign(fs, __webpack_require__(5))

module.exports = fs


/***/ }),
/* 52 */
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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(26)
var constants = __webpack_require__(54)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = {"O_RDONLY":0,"O_WRONLY":1,"O_RDWR":2,"S_IFMT":61440,"S_IFREG":32768,"S_IFDIR":16384,"S_IFCHR":8192,"S_IFBLK":24576,"S_IFIFO":4096,"S_IFLNK":40960,"S_IFSOCK":49152,"O_CREAT":512,"O_EXCL":2048,"O_NOCTTY":131072,"O_TRUNC":1024,"O_APPEND":8,"O_DIRECTORY":1048576,"O_NOFOLLOW":256,"O_SYNC":128,"O_SYMLINK":2097152,"O_NONBLOCK":4,"S_IRWXU":448,"S_IRUSR":256,"S_IWUSR":128,"S_IXUSR":64,"S_IRWXG":56,"S_IRGRP":32,"S_IWGRP":16,"S_IXGRP":8,"S_IRWXO":7,"S_IROTH":4,"S_IWOTH":2,"S_IXOTH":1,"E2BIG":7,"EACCES":13,"EADDRINUSE":48,"EADDRNOTAVAIL":49,"EAFNOSUPPORT":47,"EAGAIN":35,"EALREADY":37,"EBADF":9,"EBADMSG":94,"EBUSY":16,"ECANCELED":89,"ECHILD":10,"ECONNABORTED":53,"ECONNREFUSED":61,"ECONNRESET":54,"EDEADLK":11,"EDESTADDRREQ":39,"EDOM":33,"EDQUOT":69,"EEXIST":17,"EFAULT":14,"EFBIG":27,"EHOSTUNREACH":65,"EIDRM":90,"EILSEQ":92,"EINPROGRESS":36,"EINTR":4,"EINVAL":22,"EIO":5,"EISCONN":56,"EISDIR":21,"ELOOP":62,"EMFILE":24,"EMLINK":31,"EMSGSIZE":40,"EMULTIHOP":95,"ENAMETOOLONG":63,"ENETDOWN":50,"ENETRESET":52,"ENETUNREACH":51,"ENFILE":23,"ENOBUFS":55,"ENODATA":96,"ENODEV":19,"ENOENT":2,"ENOEXEC":8,"ENOLCK":77,"ENOLINK":97,"ENOMEM":12,"ENOMSG":91,"ENOPROTOOPT":42,"ENOSPC":28,"ENOSR":98,"ENOSTR":99,"ENOSYS":78,"ENOTCONN":57,"ENOTDIR":20,"ENOTEMPTY":66,"ENOTSOCK":38,"ENOTSUP":45,"ENOTTY":25,"ENXIO":6,"EOPNOTSUPP":102,"EOVERFLOW":84,"EPERM":1,"EPIPE":32,"EPROTO":100,"EPROTONOSUPPORT":43,"EPROTOTYPE":41,"ERANGE":34,"EROFS":30,"ESPIPE":29,"ESRCH":3,"ESTALE":70,"ETIME":101,"ETIMEDOUT":60,"ETXTBSY":26,"EWOULDBLOCK":35,"EXDEV":18,"SIGHUP":1,"SIGINT":2,"SIGQUIT":3,"SIGILL":4,"SIGTRAP":5,"SIGABRT":6,"SIGIOT":6,"SIGBUS":10,"SIGFPE":8,"SIGKILL":9,"SIGUSR1":30,"SIGSEGV":11,"SIGUSR2":31,"SIGPIPE":13,"SIGALRM":14,"SIGTERM":15,"SIGCHLD":20,"SIGCONT":19,"SIGSTOP":17,"SIGTSTP":18,"SIGTTIN":21,"SIGTTOU":22,"SIGURG":16,"SIGXCPU":24,"SIGXFSZ":25,"SIGVTALRM":26,"SIGPROF":27,"SIGWINCH":28,"SIGIO":23,"SIGSYS":12,"SSL_OP_ALL":2147486719,"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION":262144,"SSL_OP_CIPHER_SERVER_PREFERENCE":4194304,"SSL_OP_CISCO_ANYCONNECT":32768,"SSL_OP_COOKIE_EXCHANGE":8192,"SSL_OP_CRYPTOPRO_TLSEXT_BUG":2147483648,"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS":2048,"SSL_OP_EPHEMERAL_RSA":0,"SSL_OP_LEGACY_SERVER_CONNECT":4,"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER":32,"SSL_OP_MICROSOFT_SESS_ID_BUG":1,"SSL_OP_MSIE_SSLV2_RSA_PADDING":0,"SSL_OP_NETSCAPE_CA_DN_BUG":536870912,"SSL_OP_NETSCAPE_CHALLENGE_BUG":2,"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG":1073741824,"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG":8,"SSL_OP_NO_COMPRESSION":131072,"SSL_OP_NO_QUERY_MTU":4096,"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION":65536,"SSL_OP_NO_SSLv2":16777216,"SSL_OP_NO_SSLv3":33554432,"SSL_OP_NO_TICKET":16384,"SSL_OP_NO_TLSv1":67108864,"SSL_OP_NO_TLSv1_1":268435456,"SSL_OP_NO_TLSv1_2":134217728,"SSL_OP_PKCS1_CHECK_1":0,"SSL_OP_PKCS1_CHECK_2":0,"SSL_OP_SINGLE_DH_USE":1048576,"SSL_OP_SINGLE_ECDH_USE":524288,"SSL_OP_SSLEAY_080_CLIENT_DH_BUG":128,"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG":0,"SSL_OP_TLS_BLOCK_PADDING_BUG":512,"SSL_OP_TLS_D5_BUG":256,"SSL_OP_TLS_ROLLBACK_BUG":8388608,"ENGINE_METHOD_DSA":2,"ENGINE_METHOD_DH":4,"ENGINE_METHOD_RAND":8,"ENGINE_METHOD_ECDH":16,"ENGINE_METHOD_ECDSA":32,"ENGINE_METHOD_CIPHERS":64,"ENGINE_METHOD_DIGESTS":128,"ENGINE_METHOD_STORE":256,"ENGINE_METHOD_PKEY_METHS":512,"ENGINE_METHOD_PKEY_ASN1_METHS":1024,"ENGINE_METHOD_ALL":65535,"ENGINE_METHOD_NONE":0,"DH_CHECK_P_NOT_SAFE_PRIME":2,"DH_CHECK_P_NOT_PRIME":1,"DH_UNABLE_TO_CHECK_GENERATOR":4,"DH_NOT_SUITABLE_GENERATOR":8,"NPN_ENABLED":1,"RSA_PKCS1_PADDING":1,"RSA_SSLV23_PADDING":2,"RSA_NO_PADDING":3,"RSA_PKCS1_OAEP_PADDING":4,"RSA_X931_PADDING":5,"RSA_PKCS1_PSS_PADDING":6,"POINT_CONVERSION_COMPRESSED":2,"POINT_CONVERSION_UNCOMPRESSED":4,"POINT_CONVERSION_HYBRID":6,"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"UV_UDP_REUSEADDR":4}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var Stream = __webpack_require__(27).Stream

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 57 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 58 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(18).Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(61);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(2)))

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(33);

/*<replacement>*/
var util = __webpack_require__(11);
util.inherits = __webpack_require__(8);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17).Transform


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17).PassThrough


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 69 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

const u = __webpack_require__(3).fromCallback
module.exports = {
  copy: u(__webpack_require__(71))
}


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const ncp = __webpack_require__(36)
const mkdir = __webpack_require__(4)
const pathExists = __webpack_require__(5).pathExists

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const os = __webpack_require__(73)
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
/* 73 */
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const invalidWin32Path = __webpack_require__(37).invalidWin32Path

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const invalidWin32Path = __webpack_require__(37).invalidWin32Path

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const copyFileSync = __webpack_require__(77)
const mkdir = __webpack_require__(4)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)

const BUF_LENGTH = 64 * 1024
const _buff = __webpack_require__(39)(BUF_LENGTH)

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
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const assert = __webpack_require__(35)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const jsonFile = __webpack_require__(20)

jsonFile.outputJsonSync = __webpack_require__(81)
jsonFile.outputJson = u(__webpack_require__(82))
// aliases
jsonFile.outputJSONSync = jsonFile.outputJSONSync
jsonFile.outputJSON = jsonFile.outputJson
jsonFile.writeJSON = jsonFile.writeJson
jsonFile.writeJSONSync = jsonFile.writeJsonSync
jsonFile.readJSON = jsonFile.readJson
jsonFile.readJSONSync = jsonFile.readJsonSync

module.exports = jsonFile


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var _fs
try {
  _fs = __webpack_require__(1)
} catch (_) {
  _fs = __webpack_require__(10)
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).Buffer))

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const mkdir = __webpack_require__(4)
const jsonFile = __webpack_require__(20)

function outputJsonSync (file, data, options) {
  const dir = path.dirname(file)

  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  jsonFile.writeJsonSync(file, data, options)
}

module.exports = outputJsonSync


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(0)
const mkdir = __webpack_require__(4)
const pathExists = __webpack_require__(5).pathExists
const jsonFile = __webpack_require__(20)

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
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// most of this code was written by Andrew Kelley
// licensed under the BSD license: see
// https://github.com/andrewrk/node-mv/blob/master/package.json

// this needs a cleanup

const u = __webpack_require__(3).fromCallback
const fs = __webpack_require__(1)
const ncp = __webpack_require__(36)
const path = __webpack_require__(0)
const remove = __webpack_require__(15).remove
const mkdirp = __webpack_require__(4).mkdirs

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
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const copySync = __webpack_require__(38).copySync
const removeSync = __webpack_require__(15).removeSync
const mkdirpSync = __webpack_require__(4).mkdirsSync
const buffer = __webpack_require__(39)

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
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const fs = __webpack_require__(10)
const path = __webpack_require__(0)
const mkdir = __webpack_require__(4)
const remove = __webpack_require__(15)

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
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const file = __webpack_require__(87)
const link = __webpack_require__(88)
const symlink = __webpack_require__(89)

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
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const mkdir = __webpack_require__(4)
const pathExists = __webpack_require__(5).pathExists

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
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const mkdir = __webpack_require__(4)
const pathExists = __webpack_require__(5).pathExists

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
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const _mkdirs = __webpack_require__(4)
const mkdirs = _mkdirs.mkdirs
const mkdirsSync = _mkdirs.mkdirsSync

const _symlinkPaths = __webpack_require__(90)
const symlinkPaths = _symlinkPaths.symlinkPaths
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync

const _symlinkType = __webpack_require__(91)
const symlinkType = _symlinkType.symlinkType
const symlinkTypeSync = _symlinkType.symlinkTypeSync

const pathExists = __webpack_require__(5).pathExists

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
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(0)
const fs = __webpack_require__(1)
const pathExists = __webpack_require__(5).pathExists

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
/* 91 */
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
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const u = __webpack_require__(3).fromCallback
const fs = __webpack_require__(1)
const path = __webpack_require__(0)
const mkdir = __webpack_require__(4)
const pathExists = __webpack_require__(5).pathExists

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
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = __webpack_require__(27);

var _buffer = __webpack_require__(9);

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

/***/ })
/******/ ]);
});