import { Expression, ValueExpression, OperationExpression } from "./Expression";
import { ExpressionBuilder, OperationExpressionBuilder } from "./ExpressionBuilder";

const assertHasProvider = queryable => {
    if (!queryable.provider) {
        throw new Error("No provider found.");
    }
};

const copyQuery = query => {
    var copy = {};

    copy.where = query.where.copy();
    copy.orderBy = query.orderBy.copy();
    copy.include = query.include.copy();
    copy.parameters = JSON.parse(JSON.stringify(query.parameters));
    copy.take = query.take;
    copy.skip = query.skip;

    return copy;
};

export default class Queryable {
    constructor(Type, query) {
        query = query || {};

        this.Type = Type || Object;
        this.provider = null;
        this.query = {};
        this.query.parameters = (query && query.parameters) || {};

        if (query.where != null && query.where.nodeName === "where") {
            this.query.where = query.where;
        } else {
            this.query.where = Expression.where();
        }

        if (query.skip != null && query.skip.nodeName === "skip") {
            this.query.skip = query.skip;
        } else {
            this.query.skip = Expression.skip(0);
        }

        if (query.take != null && query.take.nodeName === "take") {
            this.query.take = query.take;
        } else {
            this.query.take = Expression.take(Infinity);
        }

        if (query.include != null && query.include.nodeName === "include") {
            this.query.include = query.include;
        } else {
            this.query.include = Expression.include();
        }

        if (query.orderBy != null && query.orderBy.nodeName === "orderBy") {
            this.query.orderBy = query.orderBy;
        } else {
            this.query.orderBy = Expression.orderBy();
        }
    }

    getExpression() {
        return this.query;
    }

    getQuery() {
        return this.query;
    }

    or(lambda) {
        var rightExpression;
        var query = copyQuery(this.getQuery());

        if (typeof lambda === "function") {
            lambda = lambda || function() {};
            rightExpression = lambda.call(ExpressionBuilder, new ExpressionBuilder(this.Type));
        } else if (lambda instanceof Expression) {
            rightExpression = lambda;
        } else {
            throw new Error("Expected an expression to be supplied.");
        }

        if (query.where.children.length === 0) {
            query.where.children.push(rightExpression);
        } else {
            var leftExpression = query.where.children.pop();
            query.where.children.push(Expression.or(leftExpression, rightExpression));
        }

        return this.copy(query);
    }

    where(lambda) {
        var rightExpression;
        var query = copyQuery(this.getQuery());

        if (typeof lambda === "function") {
            lambda = lambda || function() {};
            rightExpression = lambda.call(ExpressionBuilder, new ExpressionBuilder(this.Type));
        } else if (lambda instanceof Expression) {
            rightExpression = lambda;
        } else {
            throw new Error("Expected an expression to be supplied.");
        }

        if (query.where.children.length === 0) {
            query.where.children.push(rightExpression);
        } else {
            var leftExpression = query.where.children.pop();
            query.where.children.push(Expression.and(leftExpression, rightExpression));
        }

        return this.copy(query);
    }

    and(lambda) {
        return this.where(lambda);
    }

    take(value) {
        if (typeof value !== "number") {
            throw new Error("Illegal Argument Exception: value needs to be a number.");
        }

        var query = copyQuery(this.getQuery());
        query.take = Expression.take(value);

        return this.copy(query);
    }

    skip(value) {
        if (typeof value !== "number") {
            throw new Error("Illegal Argument Exception: value needs to be a number.");
        }

        var query = copyQuery(this.getQuery());
        query.skip = Expression.skip(value);

        return this.copy(query);
    }

    orderByDesc(lambda) {
        var propertyExpression;
        var query = copyQuery(this.getQuery());

        if (typeof lambda === "function") {
            lambda = lambda || function() {};
            propertyExpression = lambda.call(ExpressionBuilder, new ExpressionBuilder(this.Type)).getExpression();
        } else if (lambda instanceof OperationExpressionBuilder) {
            propertyExpression = lambda.getExpression();
        } else {
            throw new Error("Expected a property to orderByDesc.");
        }

        var descendingExpression = Expression.descending(propertyExpression);

        if (!query.orderBy.contains(propertyExpression)) {
            query.orderBy.children.push(descendingExpression);
            return this.copy(query);
        } else {
            return this;
        }
    }

    orderBy(lambda) {
        var propertyExpression;
        var query = copyQuery(this.getQuery());

        if (typeof lambda === "function") {
            lambda = lambda || function() {};
            propertyExpression = lambda.call(ExpressionBuilder, new ExpressionBuilder(this.Type)).getExpression();
        } else if (lambda instanceof OperationExpressionBuilder) {
            propertyExpression = lambda.getExpression();
        } else {
            throw new Error("Expected a property to orderBy.");
        }

        var ascendingExpression = Expression.ascending(propertyExpression);

        if (!query.orderBy.contains(propertyExpression)) {
            query.orderBy.children.push(ascendingExpression);
            return this.copy(query);
        } else {
            return this;
        }
    }

    setParameters(params) {
        if (!params) {
            throw new Error("Expected parameters to be passed in.");
        }
        var parameters = this.query.parameters;

        Object.keys(params).forEach(function(key) {
            parameters[key] = params[key];
        });
        return this;
    }

    withParameters(params) {
        if (!params) {
            throw new Error("Expected parameters to be passed in.");
        }

        var parameters = (this.query.parameters = {});
        Object.keys(params).forEach(function(key) {
            parameters[key] = params[key];
        });
        return this;
    }

    include(lambda) {
        var propertyExpression;
        var query = copyQuery(this.getQuery());

        if (typeof lambda === "function") {
            lambda = lambda || function() {};
            propertyExpression = lambda.call(ExpressionBuilder, new ExpressionBuilder(this.Type)).getExpression();
        } else if (lambda instanceof OperationExpressionBuilder) {
            propertyExpression = lambda.getExpression();
        } else {
            throw new Error("Expected a property to include.");
        }

        if (propertyExpression.nodeName !== "queryable") {
            propertyExpression = Expression.queryable(propertyExpression, Expression.expression(Expression.where()));
        }

        query.include.children.push(propertyExpression);
        return this.copy(query);
    }

    merge(queryable) {
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
                cloneQuery.where.children.push(Expression.and(leftExpression, rightExpression.copy()));
            }
        }

        query.include.children.forEach(function(expression) {
            cloneQuery.include.children.push(expression.copy());
        });

        query.orderBy.children.forEach(function(expression) {
            if (!cloneQuery.orderBy.contains(expression)) {
                cloneQuery.orderBy.children.push(expression.copy());
            }
        });

        return this.copy(cloneQuery);
    }

    toArrayAsync() {
        assertHasProvider(this);
        return this.provider.executeAsync(this);
    }

    toGuid(value) {
        return Expression.guid(Expression.constant(value));
    }

    forEachAsync(onEach) {
        return this.toArrayAsync().then(function(results) {
            results.forEach(onEach);
            return results;
        });
    }

    countAsync() {
        assertHasProvider(this);
        return this.provider.countAsync(this);
    }

    toArrayWithCountAsync() {
        assertHasProvider(this);
        return this.provider.toArrayWithCountAsync(this);
    }

    allAsync(lambda) {
        assertHasProvider(this);
        return this.provider.allAsync(this, lambda);
    }

    anyAsync(lambda) {
        assertHasProvider(this);
        return this.provider.anyAsync(this, lambda);
    }

    firstOrDefaultAsync(lambda) {
        assertHasProvider(this);
        return this.provider.firstOrDefaultAsync(this, lambda);
    }

    firstAsync(lambda) {
        assertHasProvider(this);
        return this.provider.firstAsync(this, lambda);
    }

    lastAsync(lambda) {
        assertHasProvider(this);
        return this.provider.lastAsync(this, lambda);
    }

    selectAsync(lambda) {
        assertHasProvider(this);
        return this.provider.selectAsync(this, lambda);
    }

    containsAsync(lambda) {
        assertHasProvider(this);
        return this.provider.containsAsync(this, lambda);
    }

    ifNone(callback) {
        this.countAsync().then(function(count) {
            if (count === 0) {
                callback();
            }
        });

        return this;
    }

    ifAny(callback) {
        this.toArrayAsync(function(a) {
            if (a.length > 0) {
                callback(a);
            }
        });

        return this;
    }

    intersectsAsync(compareToQueryable) {
        assertHasProvider(this);
        if (compareToQueryable instanceof Array) {
            compareToQueryable = compareToQueryable.asQueryable();
        }
        return this.provider.intersectsAsync(this, compareToQueryable);
    }

    ofType(Type) {
        var queryable = new Queryable(Type);
        queryable.provider = this.provider;
        return queryable;
    }

    copy(query) {
        var queryable = new Queryable(this.Type, query || copyQuery(this.query));
        queryable.provider = this.provider;
        return queryable;
    }
}
