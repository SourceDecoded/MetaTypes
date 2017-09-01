"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Table = require("./sqlite/Table");

var _Table2 = _interopRequireDefault(_Table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaTable = function () {
    function MetaTable(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, MetaTable);

        this.edm = options.edm;
        this.sqlite = options.sqlite;
        this.name = name;

        this.sqliteTable = new _Table2.default(name, options);
    }

    _createClass(MetaTable, [{
        key: "addEntityAsync",
        value: function addEntityAsync(entity) {}
    }, {
        key: "asQueryable",
        value: function asQueryable() {}
    }, {
        key: "getQueryProvider",
        value: function getQueryProvider() {}
    }, {
        key: "removedEntityAsync",
        value: function removedEntityAsync(entity) {}
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync(entity, delta) {}
    }]);

    return MetaTable;
}();

exports.default = MetaTable;
//# sourceMappingURL=MetaTable.js.map