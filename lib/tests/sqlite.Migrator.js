"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Migrator = require("./../sqlite/Migrator");

var _Migrator2 = _interopRequireDefault(_Migrator);

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["sqlite.QueryBuilder: Constructor."] = function () {

    var queryBuilder = new QueryBuilder(_edm2.default);
};

exports["sqlite.QueryBuilder: IsEqualTo."] = function () {

    var queryBuilder = new QueryBuilder(_edm2.default);
    var queryable = new Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT * FROM \"Source\" WHERE \"Source\".\"string\" = 'Hello World' LIMIT -1 OFFSET 0");
};

exports["sqlite.QueryBuilder: Select."] = function () {

    var queryBuilder = new QueryBuilder(_edm2.default);
    var queryable = new Queryable("Source");

    queryable = queryable.select(["string"]).where(function (expBuilder) {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT \"string\" AS \"string\" FROM \"Source\" WHERE \"Source\".\"string\" = 'Hello World' LIMIT -1 OFFSET 0");
};

exports["sqlite.QueryBuilder: isIn with array."] = function () {

    var queryBuilder = new QueryBuilder(_edm2.default);
    var queryable = new Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isIn(["John", "Doe"]);
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT * FROM \"Source\" WHERE \"Source\".\"string\" IN ('John', 'Doe') LIMIT -1 OFFSET 0");
};

exports["sqlite.QueryBuilder: isIn with queryable."] = function () {

    var queryBuilder = new QueryBuilder(_edm2.default);
    var queryable = new Queryable("Source");

    var otherQueryable = new Queryable("OtherForeign").select(["string"]).where(function (expBuilder) {
        return expBuilder.property("string").startsWith("J");
    });

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isIn(otherQueryable);
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT * FROM \"Source\" WHERE \"Source\".\"string\" IN (SELECT \"string\" AS \"string\" FROM \"OtherForeign\" WHERE \"OtherForeign\".\"string\" LIKE 'J%' LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0");
};
//# sourceMappingURL=sqlite.Migrator.js.map