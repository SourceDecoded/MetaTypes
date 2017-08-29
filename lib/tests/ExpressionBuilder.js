"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _ExpressionBuilder = require("../query/ExpressionBuilder");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["ExpressionBuilder: Constructor."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    assert.ok(true);
};

exports["ExpressionBuilder: Constructor with and."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.and();

    assert.equal("and", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with or."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.or();

    assert.equal("or", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with any."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.any(function (expBuilder) {
        expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("any", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with all."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.all(function (expBuilder) {
        expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("all", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with value."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var value = expressionBuilder.value();
    assert.ok(true);
};

exports["ExpressionBuilder: Constructor with expression (isEqualTo)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").isEqualTo("Jared");

    assert.equal("equalTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isNotEqualTo)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").isNotEqualTo("Jared");

    assert.equal("notEqualTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (contains)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").contains("Jared");

    assert.equal("substringOf", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isIn)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var testArray = ["test"];
    var expression = expressionBuilder.property("firstName").isIn(testArray);

    assert.equal("isIn", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.deepEqual(testArray, expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isIn: w/o passing in Array)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();

    assert.throws(function () {
        expressionBuilder.property("firstName").isIn("test");
    });
};

exports["ExpressionBuilder: Constructor with expression (isNotIn)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var testArray = ["test"];
    var expression = expressionBuilder.property("firstName").isNotIn(testArray);

    assert.equal("isNotIn", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.deepEqual(testArray, expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isNotIn: w/o passing in Array)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();

    assert.throws(function () {
        expressionBuilder.property("firstName").isNotIn("test");
    });
};

exports["ExpressionBuilder: Constructor with expression (isGreaterThan)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").isGreaterThan("Jared");

    assert.equal("greaterThan", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isGreaterThanOrEqualTo)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").isGreaterThanOrEqualTo("Jared");

    assert.equal("greaterThanOrEqualTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isLessThan)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").isLessThan("Jared");

    assert.equal("lessThan", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isLessThanOrEqualTo)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").isLessThanOrEqualTo("Jared");

    assert.equal("lessThanOrEqualTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (endsWith)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").endsWith("Jared");

    assert.equal("endsWith", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (startsWith)."] = function () {
    var expressionBuilder = new _ExpressionBuilder.ExpressionBuilder();
    var expression = expressionBuilder.property("firstName").startsWith("Jared");

    assert.equal("startsWith", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["OperationExpressionBuilder: Constructor with getExpression."] = function () {
    var operationExpressionBuilder = new _ExpressionBuilder.OperationExpressionBuilder();
    var expression = operationExpressionBuilder.getExpression();
    assert.ok(true);
};

exports["OperationExpressionBuilder: Constructor with any."] = function () {
    var operationExpressionBuilder = new _ExpressionBuilder.OperationExpressionBuilder();
    var expression = operationExpressionBuilder.any(function (expBuilder) {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("any", expression.nodeName);
    assert.equal("firstName", expression.children[1].value.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value.children[1].value);
};

exports["OperationExpressionBuilder: Constructor with where."] = function () {
    var operationExpressionBuilder = new _ExpressionBuilder.OperationExpressionBuilder();
    var expression = operationExpressionBuilder.where(function (expBuilder) {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    var query = expression.getLeftExpression();

    assert.equal("where", query.children[1].value.nodeName);
    assert.equal("firstName", query.children[1].value.children[0].children[0].children[1].value);
    assert.equal("Jared", query.children[1].value.children[0].children[1].value);
};

exports["OperationExpressionBuilder: Constructor with all."] = function () {
    var operationExpressionBuilder = new _ExpressionBuilder.OperationExpressionBuilder();
    var expression = operationExpressionBuilder.all(function (expBuilder) {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("all", expression.nodeName);
    assert.equal("firstName", expression.children[1].value.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value.children[1].value);
};
//# sourceMappingURL=ExpressionBuilder.js.map