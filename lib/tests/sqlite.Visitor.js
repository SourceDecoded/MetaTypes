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

    var statement = visitor.createSelectStatement(query);

    _assert2.default.equal(statement, 'SELECT "Source"."id" AS "Source___id", "Source"."string" AS "Source___string", "Source"."number" AS "Source___number", "Source"."date" AS "Source___date", "Source"."boolean" AS "Source___boolean", "Source"."float" AS "Source___float" FROM "Source" WHERE ("Source"."string" = \'Hello World\') LIMIT -1 OFFSET 0');
};

exports["sqlite.Visitor: Query nested object but don't bring back the data."] = function () {

    var visitor = new _Visitor2.default("Source", _edm2.default);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("foreigner").property("string").isEqualTo("Hello World");
    });

    var query = queryable.getQuery();

    var statement = visitor.createSelectStatement(query);

    _assert2.default.equal(statement, 'SELECT "Source"."id" AS "Source___id", "Source"."string" AS "Source___string", "Source"."number" AS "Source___number", "Source"."date" AS "Source___date", "Source"."boolean" AS "Source___boolean", "Source"."float" AS "Source___float" FROM "Source" LEFT JOIN "OtherForeign" ON "Source"."id" = "OtherForeign"."foreignKey" WHERE ("OtherForeign"."string" = \'Hello World\') LIMIT -1 OFFSET 0');
};

exports["sqlite.Visitor: Include nested object."] = function () {

    var visitor = new _Visitor2.default("Source", _edm2.default);
    var queryable = new _queryablejs.Queryable("Source");

    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("string").isEqualTo("Hello World");
    }).include(function (expBuilder) {
        return expBuilder.property("foreigner");
    });

    var query = queryable.getQuery();

    var statement = visitor.createSelectStatement(query);

    _assert2.default.equal(statement, 'SELECT "Source"."id" AS "Source___id", "Source"."string" AS "Source___string", "Source"."number" AS "Source___number", "Source"."date" AS "Source___date", "Source"."boolean" AS "Source___boolean", "Source"."float" AS "Source___float", "OtherForeign"."id" AS "OtherForeign___id", "OtherForeign"."foreignKey" AS "OtherForeign___foreignKey", "OtherForeign"."string" AS "OtherForeign___string" FROM "Source" LEFT JOIN "OtherForeign" ON "Source"."id" = "OtherForeign"."foreignKey" WHERE ("Source"."string" = \'Hello World\') LIMIT -1 OFFSET 0');
};
//# sourceMappingURL=sqlite.Visitor.js.map