"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function () {
    function Service(sqliteDatabase, context) {
        _classCallCheck(this, Service);

        if (sqliteDatabase == null) {
            throw new Error("The sqlite service needs to have a sqlite database.");
        }

        if (context == null) {
            throw new Error("The sqlite service needs to have a context.");
        }

        this.sqliteDatabase = sqliteDatabase;
        this.context = context;
    }

    _createClass(Service, [{
        key: "activateAsync",
        value: function activateAsync() {}
    }, {
        key: "addEntityAsync",
        value: function addEntityAsync(type, entity) {}
    }, {
        key: "deactivateAsync",
        value: function deactivateAsync() {}
    }, {
        key: "removeEntityAsync",
        value: function removeEntityAsync(type, entity) {}
    }, {
        key: "updateAsync",
        value: function updateAsync(type, entity) {}
    }, {
        key: "asQueryable",
        value: function asQueryable(type) {}
    }]);

    return Service;
}();

exports.default = Service;
//# sourceMappingURL=Service.js.map