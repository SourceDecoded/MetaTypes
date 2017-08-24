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
        this.sqlite = sqlite;
    }

    _createClass(Database, [{
        key: "_createTableAsync",
        value: function _createTableAsync(type) {}
    }, {
        key: "_getTableAsync",
        value: function _getTableAsync(type) {}
    }, {
        key: "activateAsync",
        value: function activateAsync() {}
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync() {}
    }, {
        key: "deactivateAsync",
        value: function deactivateAsync() {}
    }, {
        key: "getQueryableAsync",
        value: function getQueryableAsync(type) {}
    }, {
        key: "getQueryProviderAsync",
        value: function getQueryProviderAsync(type) {}
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync() {}
    }, {
        key: "updateEntityAsync",
        value: function updateEntityAsync() {}
    }]);

    return Database;
}();

exports.default = Database;
//# sourceMappingURL=Database.js.map