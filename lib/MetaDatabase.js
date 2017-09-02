"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Database = require("./sqlite/Database");

var _Database2 = _interopRequireDefault(_Database);

var _metaEdm = require("./metaEdm");

var _metaEdm2 = _interopRequireDefault(_metaEdm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaDatabase = function () {
    function MetaDatabase() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MetaDatabase);

        this.sqlite = options.sqlite;
        this.sqliteFile = options.sqliteFile;
        this.edm = options.edm;
        this.metaTables = [];
        this.edmDatabase = null;
    }

    _createClass(MetaDatabase, [{
        key: "initializeAsync",
        value: function initializeAsync() {
            var database = new _Database2.default({
                sqlite: this.sqlite,
                edm: _metaEdm2.default
            });

            this.edmDatabase = database;
        }
    }, {
        key: "getTable",
        value: function getTable(name) {}
    }]);

    return MetaDatabase;
}();

exports.default = MetaDatabase;
//# sourceMappingURL=MetaDatabase.js.map