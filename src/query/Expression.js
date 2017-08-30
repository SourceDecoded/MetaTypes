class Expression {
    constructor() {
        this.nodeName = "expression";
    }

    copy() {
        throw new Error("Meant to be overriden");
    }

    isEqualTo() {
        throw new Error("Meant to be overriden");
    }

    static getExpressionType(value) {
        if (value instanceof Expression) {
            return value;
        }

        if (typeof value === "string") {
            return Expression.string(value);
        } else if (typeof value === "function") {
            return Expression["function"](value);
        } else if (typeof value === "number") {
            return Expression.number(value);
        } else if (typeof value === "boolean") {
            return Expression.boolean(value);
        } else if (value === null) {
            return Expression["null"](value);
            return Expression["undefined"](value);
        } else if (Array.isArray(value)) {
            return Expression.array(value);
        } else if (value instanceof Date) {
            return Expression.date(value);
        } else {
            return Expression.object(value);
        }
    }

    static property(value) {
        return new ValueExpression("property", value);
    }

    static constant(value) {
        return new ValueExpression("constant", value);
    }

    static boolean(value) {
        var expression = new ValueExpression("boolean");
        expression.value = value;
        return expression;
    }

    static string(value) {
        var expression = new ValueExpression("string");
        expression.value = value;
        return expression;
    }

    static number(value) {
        var expression = new ValueExpression("number");
        expression.value = value;
        return expression;
    }

    static object(value) {
        var expression = new ValueExpression("object");
        expression.value = value;
        return expression;
    }

    static date(value) {
        var expression = new ValueExpression("date");
        expression.value = value;
        return expression;
    }

    static function(value) {
        var expression = new ValueExpression("function");
        expression.value = value;
        return expression;
    }

    static type(value) {
        var expression = new ValueExpression("type");
        expression.value = value || Object;
        return expression;
    }

    static null(value) {
        var expression = new ValueExpression("null");
        expression.value = value;
        return expression;
    }

    static undefined(value) {
        var expression = new ValueExpression("undefined");
        expression.value = value;
        return expression;
    }

    static array(value) {
        var expression = new ValueExpression("array");
        expression.value = value;
        return expression;
    }

    static queryable(leftExpression, rightExpression) {
        var expression = new OperationExpression("queryable");
        expression.children.push(leftExpression, rightExpression);
        return expression;
    }

    //
    // OperationExpression helpers
    //

    static equalTo() {
        var expression = new OperationExpression("equalTo");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static notEqualTo() {
        var expression = new OperationExpression("notEqualTo");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static or() {
        var expression = new OperationExpression("or");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static and() {
        var expression = new OperationExpression("and");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static where() {
        var expression = new OperationExpression("where");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static greaterThan() {
        var expression = new OperationExpression("greaterThan");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static lessThan() {
        var expression = new OperationExpression("lessThan");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static greaterThanOrEqualTo() {
        var expression = new OperationExpression("greaterThanOrEqualTo");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static lessThanOrEqualTo() {
        var expression = new OperationExpression("lessThanOrEqualTo");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static orderBy() {
        var expression = new OperationExpression("orderBy");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static descending() {
        var expression = new OperationExpression("descending");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static ascending() {
        var expression = new OperationExpression("ascending");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static skip(value) {
        var expression = new OperationExpression("skip");
        var valueExpression = Expression.constant(value);
        expression.children.push(valueExpression);

        return expression;
    }

    static take(value) {
        var expression = new OperationExpression("take");
        var valueExpression = Expression.constant(value);
        expression.children.push(valueExpression);

        return expression;
    }

    static buildOperatorExpression(name) {
        var expression = new OperationExpression(name);
        var args = Array.prototype.slice.call(arguments, 1);
        args.forEach(arg => {
            expression.children.push(arg);
        });

        return expression;
    }

    static guid() {
        var expression = new OperationExpression("guid");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static substring() {
        var expression = new OperationExpression("substring");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static substringOf() {
        var expression = new OperationExpression("substringOf");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static startsWith() {
        var expression = new OperationExpression("startsWith");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static endsWith() {
        var expression = new OperationExpression("endsWith");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static isIn(property, array) {
        var expression = new OperationExpression("isIn");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static isNotIn(property, array) {
        var expression = new OperationExpression("isNotIn");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static include() {
        var expression = new OperationExpression("include");
        Array.prototype.slice.call(arguments, 0).forEach(arg => {
            expression.children.push(arg);
        });
        return expression;
    }

    static any(propertyAccessExpression, expression) {
        var anyExpression = new OperationExpression("any");
        var expressionExpression = Expression.expression(expression);

        anyExpression.children.push(propertyAccessExpression, expressionExpression);
        return anyExpression;
    }

    static all(propertyAccessExpression, expression) {
        var allExpression = new OperationExpression("all");
        var expressionExpression = Expression.expression(expression);

        allExpression.children.push(propertyAccessExpression, expressionExpression);
        return allExpression;
    }

    static expression(value) {
        var expresssionExpression = new ValueExpression("expression", value);

        return expresssionExpression;
    }

    static propertyAccess(leftExpression, propertyName) {
        var propertyExpression = Expression.property(propertyName);
        var propertyAccessExpression = new OperationExpression("propertyAccess");
        propertyAccessExpression.children.push(leftExpression, propertyExpression);

        return propertyAccessExpression;
    }

    static contains(type, namespace, expression) {
        var containsExpression = new OperationExpression("contains");
        var ofTypeExpression = new ValueExpression("ofType", type);
        var propertyExpression = new ValueExpression("property", namespace);

        containsExpression.children.push(ofTypeExpression, propertyExpression, expression);

        return containsExpression;
    }

    static intersects(type, namespace, expression) {
        var intersectsExpression = new OperationExpression("intersects");
        var ofTypeExpression = new ValueExpression("ofType", type);
        var propertyExpression = new ValueExpression("property", namespace);

        intersectsExpression.children.push(ofTypeExpression, propertyExpression, expression);

        return intersectsExpression;
    }
}

class ValueExpression extends Expression {
    constructor(nodeName, value) {
        super();
        this.value = value;
        this.nodeName = nodeName;
    }

    copy() {
        return new ValueExpression(this.nodeName, this.value);
    }

    isEqualTo(node) {
        if (node && this.nodeName === node.nodeName && this.value === node.value) {
            return true;
        }
        return false;
    }

    contains(node) {
        return this.isEqualTo(node);
    }
}

class OperationExpression extends Expression {
    constructor(nodeName) {
        super();
        var args = Array.prototype.slice.call(arguments, 0);

        this.nodeName = nodeName;
        this.children = args.slice(1);
    }
    copy() {
        var children = [];
        var copy = new OperationExpression(this.nodeName);

        this.children.forEach(expression => {
            copy.children.push(expression.copy());
        });

        return copy;
    }

    isEqualTo() {
        if (!Array.isArray(node.children) || this.nodeName !== node.nodeName) {
            return false;
        }

        if (node.children.length !== this.children.length) {
            return false;
        }

        return this.children.every((expression, index) => {
            return expression.isEqualTo(node.children[index]);
        });
    }

    contains(node) {
        if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
            var matched = node.children.every((childNode, index) => {
                return childNode.contains(this.children[index]);
            });

            if (matched) {
                return true;
            }
        }

        return this.children.some(childNode => {
            return childNode.contains(node);
        });
    }

    getMatchingNodes(node, matchedNodes) {
        matchedNodes = Array.isArray(matchedNodes) ? matchedNodes : [];

        if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
            var matched = node.children.every((childNode, index) => {
                return childNode.contains(this.children[index], matchedNodes);
            });

            if (matched) {
                matchedNodes.push(this);
            }
        }

        this.children.forEach(childNode => {
            if (Array.isArray(childNode.children)) {
                childNode.getMatchingNodes(node, matchedNodes);
            }
        }, matchedNodes);

        return matchedNodes;
    }
}

export { Expression, ValueExpression, OperationExpression };
