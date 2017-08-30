"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = require("./Table");

var _Table2 = _interopRequireDefault(_Table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
    function Database(sqlite, edm) {
        _classCallCheck(this, Database);

        if (sqlite == null) {
            throw new Error("Database needs to have a sqlite.");
        }
        if (edm == null) {
            throw new Error("Database needs to have a edm.");
        }

        this.name = edm.name;
        this.edm = edm;
        this.sqlite = sqlite;
        this.tables = {};

        this._createTables();
    }

    _createClass(Database, [{
        key: "_createTables",
        value: function _createTables() {
            var _this = this;

            var options = {
                sqlite: this.sqlite,
                edm: this.edm
            };

            this.edm.tables.forEach(function (table) {
                _this.tables[table.name] = new _Table2.default(table.name, options);
            });
        }
    }, {
        key: "createAsync",
        value: function createAsync() {
            return this.tables.reduce(function (promise, table) {
                return promise.then(function () {
                    return table.createAsync();
                });
            }, Promise.resolve());
        }
    }, {
        key: "dropAsync",
        value: function dropAsync() {
            return his.tables.reduce(function (promise, table) {
                return promise.then(function () {
                    return table.dropAsync();
                });
            }, Promise.resolve());
        }
    }, {
        key: "getTable",
        value: function getTable(name) {
            return this.tables[name];
        }
    }]);

    return Database;
}();

exports.default = Database;
//# sourceMappingURL=Database.js.map