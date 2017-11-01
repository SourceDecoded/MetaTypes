"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GlassPane
// Represent an EDM, manage its corresponding DB and Migrator


var _Edm = require("../edm/Edm");

var _Edm2 = _interopRequireDefault(_Edm);

var _Migrator = require("../edm/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.edm = options.edm;
        this.metaDatabase = options.metaDatabase;
        this.migrationRunner = options.migrationRunner;
        this.actions = options.actions;
    }

    _createClass(_class, [{
        key: "dispose",
        value: function dispose() {
            // nothing to see here now, but one never knows!
        }
    }, {
        key: "executeEdmActionAsync",
        value: function executeEdmActionAsync(actionName, options) {
            var action = this.actions.edm[actionName];
            if (!action) {
                return Promise.reject("EDM action not found: " + actionName);
            }
            options.metaDatabase = this.metaDatabase;
            return action.executeAsync(options);
        }
    }, {
        key: "executeTableActionAsync",
        value: function executeTableActionAsync(tableName, actionName, options) {
            var action = this.actions.table[tableName][actionName];
            if (!action) {
                return Promise.reject("Table action not found: " + actionName);
            }
            options.metaDatabase = this.metaDatabase;
            options.tableName = tableName;
            return action.executeAsync(options);
        }
    }, {
        key: "executeEntityActionAsync",
        value: function executeEntityActionAsync(tableName, actionName, options) {
            var action = this.actions.entity[tableName][actionName];
            if (!action) {
                return Promise.reject("Entity action not found: " + actionName);
            }
            options.metaDatabase = this.metaDatabase;
            options.tableName = tableName;
            return action.executeAsync(options);
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassPane.js.map