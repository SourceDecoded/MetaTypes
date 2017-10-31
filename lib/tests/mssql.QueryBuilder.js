"use strict";

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _QueryBuilder = require("./../mssql/QueryBuilder");

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var _queryablejs = require("queryablejs");

var _edm = require("./../mock/edm");

var _edm2 = _interopRequireDefault(_edm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = "dbo";

exports["mssql.QueryBuilder: Constructor."] = function () {

    var queryBuilder = new _QueryBuilder2.default(_edm2.default, schema);
};

exports["mssql.QueryBuilder: IsEqualTo."] = function () {

    var queryBuilder = new _QueryBuilder2.default(_edm2.default, schema);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT * FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] = 'Hello World' ORDER BY (SELECT NULL) OFFSET 0 ROWS");
};

exports["mssql.QueryBuilder: Select."] = function () {

    var queryBuilder = new _QueryBuilder2.default(_edm2.default, schema);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.select(["string"]).where(function (expBuilder) {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT [string] AS [string] FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] = 'Hello World' ORDER BY (SELECT NULL) OFFSET 0 ROWS");
};

exports["mssql.QueryBuilder: isIn with array."] = function () {

    var queryBuilder = new _QueryBuilder2.default(_edm2.default, schema);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isIn(["John", "Doe"]);
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT * FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] IN ('John', 'Doe') ORDER BY (SELECT NULL) OFFSET 0 ROWS");
};

exports["mssql.QueryBuilder: isIn with queryable."] = function () {

    var queryBuilder = new _QueryBuilder2.default(_edm2.default, schema);
    var queryable = new _queryablejs.Queryable("Source");

    var otherQueryable = new _queryablejs.Queryable("OtherForeign").select(["string"]).where(function (expBuilder) {
        return expBuilder.property("string").startsWith("J");
    });

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isIn(otherQueryable);
    });

    var query = queryable.getQuery();
    var sql = queryBuilder.createStatement(query);

    _assert2.default.equal(sql, "SELECT * FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] IN (SELECT [string] AS [string] FROM [dbo].[OtherForeign__0_0_1] WHERE [dbo].[OtherForeign__0_0_1].[string] LIKE 'J%' ORDER BY (SELECT NULL) OFFSET 0 ROWS) ORDER BY (SELECT NULL) OFFSET 0 ROWS");
};
//# sourceMappingURL=mssql.QueryBuilder.js.map