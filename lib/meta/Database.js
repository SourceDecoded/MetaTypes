"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Database = require("./../sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _Table = require("./Table");

var _Table2 = _interopRequireDefault(_Table);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        var _this = this;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$decorators = _ref.decorators,
            decorators = _ref$decorators === undefined ? [] : _ref$decorators,
            _ref$database = _ref.database,
            database = _ref$database === undefined ? null : _ref$database,
            _ref$fileSystem = _ref.fileSystem,
            fileSystem = _ref$fileSystem === undefined ? null : _ref$fileSystem;

        _classCallCheck(this, _class);

        if (!Array.isArray(decorators)) {
            throw new Error("Invalid Argument: decorators needs to be an array.");
        }

        if (database == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a database.");
        }

        if (fileSystem == null) {
            throw new Error("Null Argument Exception: MetaDatabase needs to have a fileSystem.");
        }

        this.database = database;
        this.decorators = decorators;
        this.edm = database.edm;
        this.name = this.edm.name;
        this.version = this.edm.version;
        this.fileSystem = fileSystem;
        this.tables = {};

        database.getTables().forEach(function (table) {
            _this.tables[table.name] = new _Table2.default({
                table: table,
                decorators: _this.decorators,
                fileSystem: _this.fileSystem
            });
        });
    }

    _createClass(_class, [{
        key: "getTable",
        value: function getTable(name) {
            return this.tables[name] || null;
        }
    }, {
        key: "getTables",
        value: function getTables() {
            var _this2 = this;

            return Object.keys(this.tables).map(function (name) {
                return _this2.tables[name];
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=Database.js.map