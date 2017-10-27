"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Visitor = require("./../sqlite/Visitor");

var _Visitor2 = _interopRequireDefault(_Visitor);

var _queryablejs = require("queryablejs");

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["sqlite.Visitor: Constructor."] = function () {

    var visitor = new _Visitor2.default("Source", _edm2.default);
};

exports["sqlite.Visitor: IsEqualTo."] = function () {

    var visitor = new _Visitor2.default("Source", _edm2.default);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    var query = queryable.getQuery();
    var sql = visitor.createSql(query);

    _assert2.default.equal(sql, "SELECT * FROM \"Source\" WHERE (\"Source\".\"string\" = 'Hello World') OFFSET 0 LIMIT -1");
};

exports["sqlite.Visitor: Select."] = function () {

    var visitor = new _Visitor2.default("Source", _edm2.default);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.select(["string"]).where(function (expBuilder) {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    var query = queryable.getQuery();
    var sql = visitor.createSql(query);
};

exports["sqlite.Visitor: isIn with array."] = function () {

    var visitor = new _Visitor2.default("Source", _edm2.default);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isIn(["John", "Doe"]);
    });

    var query = queryable.getQuery();
    var sql = visitor.createSql(query);
};

exports["sqlite.Visitor: isIn with queryable."] = function () {

    var visitor = new _Visitor2.default("Source", _edm2.default);
    var queryable = new _queryablejs.Queryable("Source");
    var otherQueryable = new _queryablejs.Queryable("OtherForeign").select(["string"]).where(function (expBuilder) {
        return expBuilder.property("string").startsWith("J");
    });

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isIn(otherQueryable);
    });

    var query = queryable.getQuery();
    var sql = visitor.createSql(query);
};
//# sourceMappingURL=sqlite.Visitor.js.map