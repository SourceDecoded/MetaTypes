import Expression from "./Expression";
import OperationExpressionBuilder from "./OperationExpressionBuilder";

export default class ExpressionBuilder {
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
