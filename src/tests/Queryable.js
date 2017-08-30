import * as assert from "assert";
import Queryable from "./../query/Queryable";
import { ExpressionBuilder } from "../query/ExpressionBuilder";

exports["Queryable: Constructor."] = function() {
    const queryable = new Queryable();
    assert.ok(true);
};

exports["Queryable: Constructor with query (where: single)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.where(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    const query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (where: chain)"] = function() {
    let queryable = new Queryable();
    queryable = queryable
        .where(expBuilder => {
            return expBuilder.property("firstName").isEqualTo("Jared");
        })
        .where(expBuilder => {
            return expBuilder.property("lastName").isEqualTo("Barnes");
        });

    const query = queryable.getQuery();

    assert.equal("and", query.where.children[0].nodeName);
    assert.equal("equalTo", query.where.children[0].children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[0].children[1].value);
    assert.equal("equalTo", query.where.children[0].children[1].nodeName);
    assert.equal("lastName", query.where.children[0].children[1].children[0].children[1].value);
    assert.equal("Barnes", query.where.children[0].children[1].children[1].value);
};

exports["Queryable: Constructor with query (where: with ExpressionBuilder instance.)"] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isEqualTo("Jared");
    let queryable = new Queryable();
    queryable = queryable.where(expression);

    const query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (where: w/o lambda or ExpressionBuilder instance)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.where();
    });
};

exports["Queryable: Constructor with query (orderBy: single)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.orderBy(expBuilder => {
        return expBuilder.property("firstName");
    });

    const query = queryable.getQuery();

    assert.equal("ascending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderBy: chain)"] = function() {
    let queryable = new Queryable();
    queryable = queryable
        .orderBy(expBuilder => {
            return expBuilder.property("firstName");
        })
        .orderBy(expBuilder => {
            return expBuilder.property("lastName");
        });

    const query = queryable.getQuery();

    assert.equal("ascending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
    assert.equal("ascending", query.orderBy.children[1].nodeName);
    assert.equal("lastName", query.orderBy.children[1].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderBy: with ExpressionBuilder instance.)"] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName");
    let queryable = new Queryable();
    queryable = queryable.orderBy(expression);

    const query = queryable.getQuery();

    assert.equal("ascending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderBy: with the same expression called twice.)"] = function() {
    let queryable = new Queryable();
    queryable = queryable
        .orderBy(expBuilder => {
            return expBuilder.property("firstName");
        })
        .orderBy(expBuilder => {
            return expBuilder.property("firstName");
        });

    const query = queryable.getQuery();

    assert.equal(1, query.orderBy.children.length);
};

exports["Queryable: Constructor with query (orderBy: w/o lambda or ExpressionBuilder instance)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.orderBy();
    });
};

exports["Queryable: Constructor with query (include: single)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.include(expBuilder => {
        return expBuilder.property("firstName");
    });

    const query = queryable.getQuery();

    assert.equal("queryable", query.include.children[0].nodeName);
    assert.equal("firstName", query.include.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (include: chain)"] = function() {
    let queryable = new Queryable();
    queryable = queryable
        .include(expBuilder => {
            return expBuilder.property("firstName");
        })
        .include(expBuilder => {
            return expBuilder.property("lastName");
        });

    const query = queryable.getQuery();

    assert.equal("queryable", query.include.children[0].nodeName);
    assert.equal("firstName", query.include.children[0].children[0].children[1].value);
    assert.equal("queryable", query.include.children[1].nodeName);
    assert.equal("lastName", query.include.children[1].children[0].children[1].value);
};

exports["Queryable: Constructor with query (include: with ExpressionBuilder instance.)"] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName");
    let queryable = new Queryable();
    queryable = queryable.include(expression);

    const query = queryable.getQuery();

    assert.equal("queryable", query.include.children[0].nodeName);
    assert.equal("firstName", query.include.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (include: w/o lambda or ExpressionBuilder instance)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.include();
    });
};

exports["Queryable: Constructor with query (take: value === number)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.take(10);

    const query = queryable.getQuery();

    assert.equal(10, query.take.children[0].value);
};

exports["Queryable: Constructor with query (take: value !== number)"] = function() {
    let queryable = new Queryable();
    assert.throws(() => {
        queryable = queryable.take();
    });
};

exports["Queryable: Constructor with query (skip: value === number)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.skip(10);

    const query = queryable.getQuery();

    assert.equal(10, query.skip.children[0].value);
};

exports["Queryable: Constructor with query (skip: value !== number)"] = function() {
    let queryable = new Queryable();
    assert.throws(() => {
        queryable = queryable.skip();
    });
};

exports["Queryable: Constructor with query (or: single)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.or(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    const query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (or: chain)"] = function() {
    let queryable = new Queryable();
    queryable = queryable
        .or(expBuilder => {
            return expBuilder.property("firstName").isEqualTo("Jared");
        })
        .or(expBuilder => {
            return expBuilder.property("lastName").isEqualTo("Barnes");
        });

    const query = queryable.getQuery();

    assert.equal("or", query.where.children[0].nodeName);
    assert.equal("equalTo", query.where.children[0].children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[0].children[1].value);
    assert.equal("equalTo", query.where.children[0].children[1].nodeName);
    assert.equal("lastName", query.where.children[0].children[1].children[0].children[1].value);
    assert.equal("Barnes", query.where.children[0].children[1].children[1].value);
};

exports["Queryable: Constructor with query (or: with ExpressionBuilder instance.)"] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName").isEqualTo("Jared");
    let queryable = new Queryable();
    queryable = queryable.or(expression);

    const query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (or: w/o lambda or ExpressionBuilder instance)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.or();
    });
};

exports["Queryable: Constructor with query (and: single)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.and(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    const query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderByDesc: single)"] = function() {
    let queryable = new Queryable();
    queryable = queryable.orderByDesc(expBuilder => {
        return expBuilder.property("firstName");
    });

    const query = queryable.getQuery();

    assert.equal("descending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderByDesc: chain)"] = function() {
    let queryable = new Queryable();
    queryable = queryable
        .orderByDesc(expBuilder => {
            return expBuilder.property("firstName");
        })
        .orderByDesc(expBuilder => {
            return expBuilder.property("lastName");
        });

    const query = queryable.getQuery();

    assert.equal("descending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
    assert.equal("descending", query.orderBy.children[1].nodeName);
    assert.equal("lastName", query.orderBy.children[1].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderByDesc: with ExpressionBuilder instance.)"] = function() {
    const expressionBuilder = new ExpressionBuilder();
    const expression = expressionBuilder.property("firstName");
    let queryable = new Queryable();
    queryable = queryable.orderByDesc(expression);

    const query = queryable.getQuery();

    assert.equal("descending", query.orderBy.children[0].nodeName);
    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (orderByDesc: with the same expression called twice.)"] = function() {
    let queryable = new Queryable();
    queryable = queryable
        .orderByDesc(expBuilder => {
            return expBuilder.property("firstName");
        })
        .orderByDesc(expBuilder => {
            return expBuilder.property("firstName");
        });

    const query = queryable.getQuery();

    assert.equal(1, query.orderBy.children.length);
};

exports["Queryable: Constructor with query (orderByDesc: w/o lambda or ExpressionBuilder instance)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.orderByDesc();
    });
};

exports["Queryable: Constructor with query (setParameters: obj passed in)"] = function() {
    let queryable = new Queryable();
    const testParameters = { test1: 1, test2: 2 };
    queryable = queryable.setParameters(testParameters);

    const query = queryable.getQuery();

    assert.deepEqual(testParameters, query.parameters);
};

exports["Queryable: Constructor with query (setParameters: w/o parameters passed in)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.setParameters();
    });
};

exports["Queryable: Constructor with query (withParameters: obj passed in)"] = function() {
    let queryable = new Queryable();
    const testParameters = { test1: 1, test2: 2 };
    queryable = queryable.withParameters(testParameters);

    const query = queryable.getQuery();

    assert.deepEqual(testParameters, query.parameters);
};

exports["Queryable: Constructor with query (withParameters: w/o parameters passed in)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.withParameters();
    });
};

exports["Queryable: Constructor with query (merge: merging queryable is empty)"] = function() {
    let queryable1 = new Queryable();
    let queryable2 = new Queryable();
    queryable2 = queryable2.merge(queryable1);

    const query = queryable2.getQuery();

    assert.equal(0, query.where.children.length);
};

exports["Queryable: Constructor with query (merge: queryable merging doesn't have anything to copy)"] = function() {
    let queryable1 = new Queryable();
    let queryable2 = new Queryable();

    queryable1 = queryable1.where(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });
    queryable2 = queryable2.merge(queryable1);

    const query = queryable2.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};

exports["Queryable: Constructor with query (merge: queryable merging has a single where expression)"] = function() {
    let queryable1 = new Queryable();
    let queryable2 = new Queryable();

    queryable1 = queryable1.where(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });
    queryable2 = queryable2
        .where(expBuilder => {
            return expBuilder.property("lastName").isEqualTo("Barnes");
        })
        .merge(queryable1);

    const query = queryable2.getQuery();

    assert.equal("and", query.where.children[0].nodeName);
    assert.equal("Barnes", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].children[1].value);
};

exports["Queryable: Constructor with query (merge: queryable merging has a chained where expression)"] = function() {
    let queryable1 = new Queryable();
    let queryable2 = new Queryable();

    queryable1 = queryable1.where(expBuilder => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });
    queryable2 = queryable2
        .where(expBuilder => {
            return expBuilder.property("lastName").isEqualTo("Barnes");
        })
        .where(expBuilder => {
            return expBuilder.property("age").isEqualTo(35);
        })
        .merge(queryable1);

    const query = queryable2.getQuery();

    assert.equal("and", query.where.children[0].nodeName);
    assert.equal("Barnes", query.where.children[0].children[0].children[1].value);
    assert.equal(35, query.where.children[0].children[1].children[1].value);
    assert.equal("Jared", query.where.children[0].children[2].children[1].value);
};

exports["Queryable: Constructor with query (merge: merging queryable has an include expression)"] = function() {
    let queryable1 = new Queryable();
    let queryable2 = new Queryable();

    queryable1 = queryable1.include(expBuilder => {
        return expBuilder.property("firstName");
    });
    queryable2 = queryable2.merge(queryable1);

    const query = queryable2.getQuery();

    assert.equal("firstName", query.include.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (merge: merging queryable has an orderBy expression)"] = function() {
    let queryable1 = new Queryable();
    let queryable2 = new Queryable();

    queryable1 = queryable1.orderBy(expBuilder => {
        return expBuilder.property("firstName");
    });
    queryable2 = queryable2.merge(queryable1);

    const query = queryable2.getQuery();

    assert.equal("firstName", query.orderBy.children[0].children[0].children[1].value);
};

exports["Queryable: Constructor with query (merge: merging queryable has the same orderBy expression as queryable merging)"] = function() {
    let queryable1 = new Queryable();
    let queryable2 = new Queryable();

    queryable1 = queryable1.orderBy(expBuilder => {
        return expBuilder.property("firstName");
    });
    queryable2 = queryable2
        .orderBy(expBuilder => {
            return expBuilder.property("firstName");
        })
        .merge(queryable1);

    const query = queryable2.getQuery();

    assert.equal(1, query.orderBy.children.length);
};

exports["Queryable: Constructor with query (merge: w/o a queryable passed in)"] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable = queryable.merge();
    });
};

exports["Queryable: Constructor with toArrayAsync called."] = function() {
    let queryable = new Queryable();
    queryable.provider = { executeAsync: () => Promise.resolve([]) };

    queryable.toArrayAsync().then(() => {
        assert.ok(true);
    });
};

exports["Queryable: Constructor with toArrayAsync method called w/o provider."] = function() {
    let queryable = new Queryable();

    assert.throws(() => {
        queryable.toArrayAsync();
    });
};

exports["Queryable: Constructor with countAsync called."] = function() {
    let queryable = new Queryable();
    queryable.provider = { countAsync: queryable => Promise.resolve() };

    queryable.countAsync().then(() => {
        assert.ok(true);
    });
};

exports["Queryable: Constructor with toArrayWithCountAsync called."] = function() {
    let queryable = new Queryable();
    queryable.provider = { toArrayWithCountAsync: queryable => Promise.resolve() };

    queryable.toArrayWithCountAsync().then(() => {
        assert.ok(true);
    });
};

exports["Queryable: Constructor with ofType called."] = function() {
    let queryable = new Queryable();
    const testType = { test: "test" };
    queryable = queryable.ofType(testType);
    assert.deepEqual(queryable.type, testType);
};

exports["Queryable: Constructor with ofType called."] = function() {
    let queryable = new Queryable();
    const testType = { test: "test" };
    queryable = queryable.ofType(testType);
    assert.deepEqual(queryable.type, testType);
};

exports["Queryable: Constructor with copy called."] = function() {
    let queryable = new Queryable();
    let copiedQueryable = queryable.copy();

    assert.deepEqual(queryable, copiedQueryable);
};
