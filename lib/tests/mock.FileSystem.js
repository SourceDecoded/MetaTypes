"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _FileSystem = require("./../mock/FileSystem");

var _FileSystem2 = _interopRequireDefault(_FileSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["mock.FileSystem: getReadStreamAsync"] = function () {
    var fileSystem = new _FileSystem2.default();
    var fileName = "Mock File.txt";
    var fileContent = "Hello World!";

    fileSystem.files[fileName] = fileContent;

    fileSystem.getReadStreamAsync(fileName).then(function (stream) {
        return new Promise(function (resolve, reject) {
            var data = "";

            stream.on("data", function (d) {
                data += d;
            });

            stream.on("end", function () {
                _assert2.default.equal(data, fileContent);
            });
        });
    });
};

exports["mock.FileSystem: getWriteStreamAsync"] = function () {
    var fileSystem = new _FileSystem2.default();
    var fileName = "Mock File.txt";
    var fileContent = "Hello World!";

    fileSystem.getWriteStreamAsync(fileName).then(function (stream) {
        return new Promise(function (resolve, reject) {
            stream.write(fileContent);
            stream.end();

            _assert2.default.equal(fileSystem.files[fileName], fileContent);
        });
    });
};

exports["mock.FileSystem: removeFileAsync"] = function () {
    var fileSystem = new _FileSystem2.default();
    var fileName = "Mock File.txt";

    fileSystem.files[fileName] = "Hello World!";

    fileSystem.removeFileAsync(fileName).then(function () {
        _assert2.default.equal(fileSystem.files[fileName], null);
    });
};

exports["mock.FileSystem: getFileSizeAsync"] = function () {
    var fileSystem = new _FileSystem2.default();
    var fileName = "Mock File.txt";
    var fileContent = "Hello World!";

    fileSystem.files[fileName] = fileContent;

    var size = Buffer.byteLength(fileContent, 'utf8');

    fileSystem.getFileSizeAsync(fileName).then(function (s) {
        _assert2.default.equal(s, size);
    });
};
//# sourceMappingURL=mock.FileSystem.js.map