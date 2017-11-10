"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, _class);

        if (!options.edm) {
            throw new Error("EDM needed to generate qualified table name");
        }
        if (!options.schema) {
            throw new Error("schema needed to generate qualified table name");
        }
        this.edm = options.edm;
        this.schema = options.schema;
    }

    _createClass(_class, [{
        key: "getQualifiedTableName",
        value: function getQualifiedTableName(tableName) {
            return "[" + this.getSchemaPart() + "].[" + this.getTablePart(tableName) + "]";
        }
    }, {
        key: "getTablePart",
        value: function getTablePart(tableName) {
            return tableName + "__" + this.edm.name + "__" + this.edm.version.replace(/\./g, "_");
        }
    }, {
        key: "getSchemaPart",
        value: function getSchemaPart() {
            return this.schema;
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=TableNameHelper.js.map