"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require("stream");

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
    }]);

    return FileSystem;
}();

exports.default = FileSystem;
//# sourceMappingURL=FileSystem.js.map