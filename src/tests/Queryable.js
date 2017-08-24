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
