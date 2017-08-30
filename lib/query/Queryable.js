"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Expression = require("./Expression");

var _ExpressionBuilder = require("./ExpressionBuilder");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assertHasProvider = function assertHasProvider(queryable) {
    if (!queryable.provider) {
        throw new Error("No provider found.");
    }
};

var copyQuery = function copyQuery(query) {
    var copy = {};

    copy.where = query.where.copy();
    copy.orderBy = query.orderBy.copy();
    copy.include = query.include.copy();
    copy.parameters = JSON.parse(JSON.stringify(query.parameters));
    copy.take = query.take;
    copy.skip = query.skip;

    return copy;
};

var Queryable = function () {
    function Queryable(type, query) {
        _classCallCheck(this, Queryable);

        query = query || {};

        this.type = type || "Object";
        this.provider = null;
        this.query = {};
        this.query.parameters = query && query.parameters || {};

        if (query.where != null && query.where.nodeName === "where") {
            this.query.where = query.where;
        } else {
            this.query.where = _Expression.Expression.where();
        }

        if (query.skip != null && query.skip.nodeName === "skip") {
            this.query.skip = query.skip;
        } else {
            this.query.skip = _Expression.Expression.skip(0);
        }

        if (query.take != null && query.take.nodeName === "take") {
            this.query.take = query.take;
        } else {
            this.query.take = _Expression.Expression.take(Infinity);
        }

        if (query.include != null && query.include.nodeName === "include") {
            this.query.include = query.include;
        } else {
            this.query.include = _Expression.Expression.include();
        }

        if (query.orderBy != null && query.orderBy.nodeName === "orderBy") {
            this.query.orderBy = query.orderBy;
        } else {
            this.query.orderBy = _Expression.Expression.orderBy();
        }
    }

    _createClass(Queryable, [{
        key: "getExpression",
        value: function getExpression() {
            return this.query;
        }
    }, {
        key: "getQuery",
        value: function getQuery() {
            return this.query;
        }
    }, {
        key: "or",
        value: function or(lambda) {
            var rightExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                rightExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type));
            } else if (lambda instanceof _Expression.Expression) {
                rightExpression = lambda;
            } else {
                throw new Error("Expected an expression to be supplied.");
            }

            if (query.where.children.length === 0) {
                query.where.children.push(rightExpression);
            } else {
                var leftExpression = query.where.children.pop();
                query.where.children.push(_Expression.Expression.or(leftExpression, rightExpression));
            }

            return this.copy(query);
        }
    }, {
        key: "where",
        value: function where(lambda) {
            var rightExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                rightExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type));
            } else if (lambda instanceof _Expression.Expression) {
                rightExpression = lambda;
            } else {
                throw new Error("Expected an expression to be supplied.");
            }

            if (query.where.children.length === 0) {
                query.where.children.push(rightExpression);
            } else {
                var leftExpression = query.where.children.pop();
                query.where.children.push(_Expression.Expression.and(leftExpression, rightExpression));
            }

            return this.copy(query);
        }
    }, {
        key: "and",
        value: function and(lambda) {
            return this.where(lambda);
        }
    }, {
        key: "take",
        value: function take(value) {
            if (typeof value !== "number") {
                throw new Error("Illegal Argument Exception: value needs to be a number.");
            }

            var query = copyQuery(this.getQuery());
            query.take = _Expression.Expression.take(value);

            return this.copy(query);
        }
    }, {
        key: "skip",
        value: function skip(value) {
            if (typeof value !== "number") {
                throw new Error("Illegal Argument Exception: value needs to be a number.");
            }

            var query = copyQuery(this.getQuery());
            query.skip = _Expression.Expression.skip(value);

            return this.copy(query);
        }
    }, {
        key: "orderByDesc",
        value: function orderByDesc(lambda) {
            var propertyExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                propertyExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type)).getExpression();
            } else if (lambda instanceof _ExpressionBuilder.OperationExpressionBuilder) {
                propertyExpression = lambda.getExpression();
            } else {
                throw new Error("Expected a property to orderByDesc.");
            }

            var descendingExpression = _Expression.Expression.descending(propertyExpression);

            if (!query.orderBy.contains(propertyExpression)) {
                query.orderBy.children.push(descendingExpression);
                return this.copy(query);
            } else {
                return this;
            }
        }
    }, {
        key: "orderBy",
        value: function orderBy(lambda) {
            var propertyExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                propertyExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type)).getExpression();
            } else if (lambda instanceof _ExpressionBuilder.OperationExpressionBuilder) {
                propertyExpression = lambda.getExpression();
            } else {
                throw new Error("Expected a property to orderBy.");
            }

            var ascendingExpression = _Expression.Expression.ascending(propertyExpression);

            if (!query.orderBy.contains(propertyExpression)) {
                query.orderBy.children.push(ascendingExpression);
                return this.copy(query);
            } else {
                return this;
            }
        }
    }, {
        key: "setParameters",
        value: function setParameters(params) {
            if (!params) {
                throw new Error("Expected parameters to be passed in.");
            }
            var parameters = this.query.parameters;

            Object.keys(params).forEach(function (key) {
                parameters[key] = params[key];
            });
            return this;
        }
    }, {
        key: "withParameters",
        value: function withParameters(params) {
            if (!params) {
                throw new Error("Expected parameters to be passed in.");
            }

            var parameters = this.query.parameters = {};
            Object.keys(params).forEach(function (key) {
                parameters[key] = params[key];
            });
            return this;
        }
    }, {
        key: "include",
        value: function include(lambda) {
            var propertyExpression;
            var query = copyQuery(this.getQuery());

            if (typeof lambda === "function") {
                lambda = lambda || function () {};
                propertyExpression = lambda.call(_ExpressionBuilder.ExpressionBuilder, new _ExpressionBuilder.ExpressionBuilder(this.type)).getExpression();
            } else if (lambda instanceof _ExpressionBuilder.OperationExpressionBuilder) {
                propertyExpression = lambda.getExpression();
            } else {
                throw new Error("Expected a property to include.");
            }

            if (propertyExpression.nodeName !== "queryable") {
                propertyExpression = _Expression.Expression.queryable(propertyExpression, _Expression.Expression.expression(_Expression.Expression.where()));
            }

            query.include.children.push(propertyExpression);
            return this.copy(query);
        }
    }, {
        key: "merge",
        value: function merge(queryable) {
            if (!(queryable instanceof Queryable)) {
                throw new Error("Expected a queryable to be passed in.");
            }

            var clone = this.copy();
            var cloneQuery = clone.getQuery();
            var query = queryable.getQuery();
            var rightExpression = query.where.children[0];

            if (rightExpression != null) {
                // No need to copy if there is nothing to copy.
                if (cloneQuery.where.children.length === 0) {
                    cloneQuery.where.children.push(rightExpression.copy());
                } else if (cloneQuery.where.children.length === 1 && cloneQuery.where.children[0].nodeName === "and") {
                    cloneQuery.where.children[0].children.push(rightExpression.copy());
                } else {
                    var leftExpression = cloneQuery.where.children.pop();
                    cloneQuery.where.children.push(_Expression.Expression.and(leftExpression, rightExpression.copy()));
                }
            }

            query.include.children.forEach(function (expression) {
                cloneQuery.include.children.push(expression.copy());
            });

            query.orderBy.children.forEach(function (expression) {
                if (!cloneQuery.orderBy.contains(expression)) {
                    cloneQuery.orderBy.children.push(expression.copy());
                }
            });

            return this.copy(cloneQuery);
        }
    }, {
        key: "toArrayAsync",
        value: function toArrayAsync() {
            assertHasProvider(this);
            return this.provider.toArrayAsync(this);
        }
    }, {
        key: "countAsync",
        value: function countAsync() {
            assertHasProvider(this);
            return this.provider.countAsync(this);
        }
    }, {
        key: "toArrayWithCountAsync",
        value: function toArrayWithCountAsync() {
            assertHasProvider(this);
            return this.provider.toArrayWithCountAsync(this);
        }
    }, {
        key: "ofType",
        value: function ofType(type) {
            var queryable = new Queryable(type);
            queryable.provider = this.provider;
            return queryable;
        }
    }, {
        key: "copy",
        value: function copy(query) {
            var queryable = new Queryable(this.type, query || copyQuery(this.query));
            queryable.provider = this.provider;
            return queryable;
        }
    }]);

    return Queryable;
}();

exports.default = Queryable;
//# sourceMappingURL=Queryable.js.map