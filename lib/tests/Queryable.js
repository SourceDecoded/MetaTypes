"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _Queryable = require("./../query/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

var _ExpressionBuilder = require("../query/ExpressionBuilder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["Queryable: Constructor."] = function () {
    var queryable = new _Queryable2.default();
    assert.ok(true);
};

exports["Queryable: Constructor with query (where: single)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    var query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (where: chain)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("firstName").isEqualTo("Jared");
    }).where(function (expBuilder) {
        return expBuilder.property("lastName").isEqualTo("Barnes");
    });

    var query = queryable.getQuery();

    assert.equal("and", query.where.children[0].nodeName);
    assert.equal("equalTo", query.where.children[0].children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[0].children[1].value);
    assert.equal("equalTo", query.where.children[0].children[1].nodeName);
    assert.equal("lastName", query.where.children[0].children[1].children[0].children[1].value);
    assert.equal("Barnes", query.where.children[0].children[1].children[1].value);
};

exports["Queryable: Constructor with query (where: with ExpressionBuilder instance.)"] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").isEqualTo("Jared");
    var queryable = new _Queryable2.default();
    queryable = queryable.where(expression);

    var query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (where: w/o lambda or ExpressionBuilder instance)"] = function () {
    var queryable = new _Queryable2.default();

    assert.throws(function () {
        queryable = queryable.where();
    });
};

exports["Queryable: Constructor with query (orderBy: single)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.orderBy(function (expBuilder) {
        return expBuilder.property("firstName");
    });

    var query = queryable.getQuery();

    assert.equal("ascending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderBy: chain)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.orderBy(function (expBuilder) {
        return expBuilder.property("firstName");
    }).orderBy(function (expBuilder) {
        return expBuilder.property("lastName");
    });

    var query = queryable.getQuery();

    assert.equal("ascending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
    assert.equal("ascending", query.orderBy.children[1].nodeName);
    assert.equal("lastName", query.orderBy.children[1].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderBy: with ExpressionBuilder instance.)"] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName");
    var queryable = new _Queryable2.default();
    queryable = queryable.orderBy(expression);

    var query = queryable.getQuery();

    assert.equal("ascending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderBy: with the same expression called twice.)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.orderBy(function (expBuilder) {
        return expBuilder.property("firstName");
    }).orderBy(function (expBuilder) {
        return expBuilder.property("firstName");
    });

    var query = queryable.getQuery();

    assert.equal(1, query.orderBy.children.length);
};

exports["Queryable: Constructor with query (orderBy: w/o lambda or ExpressionBuilder instance)"] = function () {
    var queryable = new _Queryable2.default();

    assert.throws(function () {
        queryable = queryable.orderBy();
    });
};

exports["Queryable: Constructor with query (include: single)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.include(function (expBuilder) {
        return expBuilder.property("firstName");
    });

    var query = queryable.getQuery();

    assert.equal("queryable", query.include.children[0].nodeName);
    assert.equal("firstName", query.include.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (include: chain)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.include(function (expBuilder) {
        return expBuilder.property("firstName");
    }).include(function (expBuilder) {
        return expBuilder.property("lastName");
    });

    var query = queryable.getQuery();

    assert.equal("queryable", query.include.children[0].nodeName);
    assert.equal("firstName", query.include.children[0].children[0].children[1].value);
    assert.equal("queryable", query.include.children[1].nodeName);
    assert.equal("lastName", query.include.children[1].children[0].children[1].value);
};

exports["Queryable: Constructor with query (include: with ExpressionBuilder instance.)"] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName");
    var queryable = new _Queryable2.default();
    queryable = queryable.include(expression);

    var query = queryable.getQuery();

    assert.equal("queryable", query.include.children[0].nodeName);
    assert.equal("firstName", query.include.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (include: w/o lambda or ExpressionBuilder instance)"] = function () {
    var queryable = new _Queryable2.default();

    assert.throws(function () {
        queryable = queryable.include();
    });
};

exports["Queryable: Constructor with query (take: value === number)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.take(10);

    var query = queryable.getQuery();

    assert.equal(10, query.take.children[0].value);
};

exports["Queryable: Constructor with query (take: value !== number)"] = function () {
    var queryable = new _Queryable2.default();
    assert.throws(function () {
        queryable = queryable.take();
    });
};

exports["Queryable: Constructor with query (skip: value === number)"] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.skip(10);

    var query = queryable.getQuery();

    assert.equal(10, query.skip.children[0].value);
};

exports["Queryable: Constructor with query (skip: value !== number)"] = function () {
    var queryable = new _Queryable2.default();
    assert.throws(function () {
        queryable = queryable.skip();
    });
};
//# sourceMappingURL=Queryable.js.map