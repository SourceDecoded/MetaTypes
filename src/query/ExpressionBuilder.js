import { Expression } from "./Expression";

const returnExpression = () => {
    return expression;
};

class OperationExpressionBuilder {
    constructor(getLeftExpression) {
        this.getLeftExpression = getLeftExpression || returnExpression;
    }

    any(fn) {
        var expressionBuilder = new ExpressionBuilder();
        var expression = fn(expressionBuilder);
        return Expression.any(this.getLeftExpression(), expression);
    }

    where(fn) {
        var propertyAccessExpression = this.getLeftExpression();

        this.getLeftExpression = function() {
            var expressionBuilder = new ExpressionBuilder(Object);
            var expression = fn(expressionBuilder);

            return Expression.queryable(propertyAccessExpression, Expression.expression(Expression.where(expression)));
        };

        return this;
    }

    all(fn) {
        var expressionBuilder = new ExpressionBuilder();
        var expression = fn(expressionBuilder);
        return Expression.all(this.getLeftExpression(), expression);
    }

    isEqualTo(value) {
        var constant = Expression.getExpressionType(value);
        return Expression.equalTo(this.getLeftExpression(), constant);
    }

    isNotEqualTo(value) {
        var constant = Expression.getExpressionType(value);
        return Expression.notEqualTo(this.getLeftExpression(), constant);
    }

    contains(value) {
        var constant = Expression.getExpressionType(value);
        return Expression.substringOf(this.getLeftExpression(), constant);
    }

    isIn(array) {
        if (Array.isArray(array)) {
            return Expression.isIn(this.getLeftExpression(), Expression.array(array));
        } else {
            throw new Error("isIn is expecting to be passed an array!");
        }
    }

    isNotIn(array) {
        if (Array.isArray(array)) {
            return Expression.isNotIn(this.getLeftExpression(), Expression.array(array));
        } else {
            throw new Error("isNotIn is expecting to be passed an array!");
        }
    }

    isSubstringOf(value) {
        console.warn("isSubstringOf is deprecated, please us contains.");
        return Expression.substringOf(this.getLeftExpression(), Expression.string(value));
    }

    isGreaterThan(value) {
        var constant = Expression.getExpressionType(value);
        return Expression.greaterThan(this.getLeftExpression(), constant);
    }

    isGreaterThanOrEqualTo(value) {
        var constant = Expression.getExpressionType(value);
        return Expression.greaterThanOrEqualTo(this.getLeftExpression(), constant);
    }

    isLessThanOrEqualTo(value) {
        var constant = Expression.getExpressionType(value);
        return Expression.lessThanOrEqualTo(this.getLeftExpression(), constant);
    }

    isLessThan(value) {
        var constant = Expression.getExpressionType(value);
        return Expression.lessThan(this.getLeftExpression(), constant);
    }

    endsWith(value) {
        return Expression.endsWith(this.getLeftExpression(), Expression.string(value));
    }

    startsWith(value) {
        return Expression.startsWith(this.getLeftExpression(), Expression.string(value));
    }

    property(value) {
        return new OperationExpressionBuilder(function() {
            return Expression.propertyAccess(this.getLeftExpression(), value);
        });
    }

    getExpression() {
        return this.getLeftExpression();
    }
}

class ExpressionBuilder {
    constructor(Type) {
        this.Type = Type || Object;
    }
    property(property) {
        return new OperationExpressionBuilder(function() {
            return Expression.propertyAccess(Expression.type(this.Type), property);
        });
    }

    and() {
        return Expression.and.apply(Expression, arguments);
    }

    or() {
        return Expression.or.apply(Expression, arguments);
    }

    any(filter) {
        var expressionBuilder = new ExpressionBuilder();
        var expression = filter(expressionBuilder);
        return setExpression(Expression.any("", expression));
    }

    all(filter) {
        var expressionBuilder = new ExpressionBuilder();
        var expression = filter(expressionBuilder);
        return setExpression(Expression.all("", expression));
    }

    value() {
        return new OperationExpressionBuilder(function() {
            return Expression.type(this.Type);
        });
    }
}

export { ExpressionBuilder, OperationExpressionBuilder };
