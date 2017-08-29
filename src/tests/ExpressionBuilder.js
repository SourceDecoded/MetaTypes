import * as assert from "assert";
import { ExpressionBuilder, OperationExpressionBuilder } from "../query/ExpressionBuilder";

exports["ExpressionBuilder: Constructor."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    assert.ok(true);
};

exports["ExpressionBuilder: Constructor with and."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.and();

    assert.equal("and", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with or."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.or();

    assert.equal("or", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with any."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.any(expBuilder => {
        expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("any", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with all."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.all(expBuilder => {
        expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("all", expression.nodeName);
};

exports["ExpressionBuilder: Constructor with value."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const value = expressionBuilder.value();
    assert.ok(true);
};

exports["ExpressionBuilder: Constructor with expression (isEqualTo)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isEqualTo("Jared");

    assert.equal("equalTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isNotEqualTo)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isNotEqualTo("Jared");

    assert.equal("notEqualTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (contains)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").contains("Jared");

    assert.equal("substringOf", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isIn)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const testArray = ["test"];
    const expression = expressionBuilder.property("firstName").isIn(testArray);

    assert.equal("isIn", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.deepEqual(testArray, expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isIn: w/o passing in Array)."] = function() {
    const expressionBuilder = new ExpressionBuilder();

    assert.throws(() => {
        expressionBuilder.property("firstName").isIn("test");
    });
};

exports["ExpressionBuilder: Constructor with expression (isNotIn)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const testArray = ["test"];
    const expression = expressionBuilder.property("firstName").isNotIn(testArray);

    assert.equal("isNotIn", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.deepEqual(testArray, expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isNotIn: w/o passing in Array)."] = function() {
    const expressionBuilder = new ExpressionBuilder();

    assert.throws(() => {
        expressionBuilder.property("firstName").isNotIn("test");
    });
};

exports["ExpressionBuilder: Constructor with expression (isGreaterThan)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isGreaterThan("Jared");

    assert.equal("greaterThan", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isGreaterThanOrEqualTo)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isGreaterThanOrEqualTo("Jared");

    assert.equal("greaterThanOrEqualTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isLessThan)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isLessThan("Jared");

    assert.equal("lessThan", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (isLessThanOrEqualTo)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isLessThanOrEqualTo("Jared");

    assert.equal("lessThanOrEqualTo", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (endsWith)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").endsWith("Jared");

    assert.equal("endsWith", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["ExpressionBuilder: Constructor with expression (startsWith)."] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").startsWith("Jared");

    assert.equal("startsWith", expression.nodeName);
    assert.equal("firstName", expression.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value);
};

exports["OperationExpressionBuilder: Constructor with getExpression."] = function() {
    const operationExpressionBuilder = new OperationExpressionBuilder();
    const expression = operationExpressionBuilder.getExpression();
    assert.ok(true);
};

exports["OperationExpressionBuilder: Constructor with any."] = function() {
    const operationExpressionBuilder = new OperationExpressionBuilder();
    const expression = operationExpressionBuilder.any(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("any", expression.nodeName);
    assert.equal("firstName", expression.children[1].value.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value.children[1].value);
};

exports["OperationExpressionBuilder: Constructor with where."] = function() {
    const operationExpressionBuilder = new OperationExpressionBuilder();
    const expression = operationExpressionBuilder.where(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    const query = expression.getLeftExpression();

    assert.equal("where", query.children[1].value.nodeName);
    assert.equal("firstName", query.children[1].value.children[0].children[0].children[1].value);
    assert.equal("Jared", query.children[1].value.children[0].children[1].value);
};

exports["OperationExpressionBuilder: Constructor with all."] = function() {
    const operationExpressionBuilder = new OperationExpressionBuilder();
    const expression = operationExpressionBuilder.all(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    assert.equal("all", expression.nodeName);
    assert.equal("firstName", expression.children[1].value.children[0].children[1].value);
    assert.equal("Jared", expression.children[1].value.children[1].value);
};
