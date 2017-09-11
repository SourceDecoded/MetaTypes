"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require("fs-extra");

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
    }]);

    return LocalFileSystem;
}();

exports.default = LocalFileSystem;
//# sourceMappingURL=LocalFileSystem.js.map