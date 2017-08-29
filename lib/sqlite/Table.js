"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StatementBuilder = require("./StatementBuilder");

var _StatementBuilder2 = _interopRequireDefault(_StatementBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
    function Table(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Table);

        this.sqlite = options.sqlite;
        this.edm = options.edm;
        this.name = name;

        if (this.name == null) {
            throw new Error("The table needs to have a name.");
        }

        if (this.sqlite == null) {
            throw new Error("The table needs to have a sqlite database.");
        }

        if (this.edm == null) {
            throw new Error("The table needs to have a edm.");
        }

        this.table = this._getTable(name);
        this.statementBuilder = new _StatementBuilder2.default(name, options);
    }

    _createClass(Table, [{
        key: "_getTable",
        value: function _getTable(name) {
            return this.edm.tables.find(function (table) {
                return table.name === name;
            });
        }
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync(entity) {}
    }, {
        key: "createTableAsync",
        value: function createTableAsync() {}
    }, {
        key: "dropTableAsync",
        value: function dropTableAsync() {}
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(entity) {}
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(entity, delta) {}
    }, {
        key: "asQueryable",
        value: function asQueryable() {}
    }]);

    return Table;
}();

exports.default = Table;
//# sourceMappingURL=Table.js.map