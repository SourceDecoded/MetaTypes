import assert from "assert";
import QueryBuilder from "./../sqlite/QueryBuilder";
import { Queryable } from "queryablejs";
import edm from "./../mock/edm";

exports["sqlite.QueryBuilder: Constructor."] = () => {

    let queryBuilder = new QueryBuilder(edm);

}

exports["sqlite.QueryBuilder: IsEqualTo."] = () => {

    let queryBuilder = new QueryBuilder(edm);
    let queryable = new Queryable("Source");

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT * FROM "Source" WHERE "Source"."string" = 'Hello World' LIMIT -1 OFFSET 0`);
}

exports["sqlite.QueryBuilder: Select."] = () => {

    let queryBuilder = new QueryBuilder(edm);
    let queryable = new Queryable("Source");

    queryable = queryable.select(["string"]).where((expBuilder) => {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT "string" AS "string" FROM "Source" WHERE "Source"."string" = 'Hello World' LIMIT -1 OFFSET 0`);
}

exports["sqlite.QueryBuilder: isIn with array."] = () => {

    let queryBuilder = new QueryBuilder(edm);
    let queryable = new Queryable("Source");

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isIn(["John", "Doe"]);
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT * FROM "Source" WHERE "Source"."string" IN ('John', 'Doe') LIMIT -1 OFFSET 0`);
}

exports["sqlite.QueryBuilder: isIn with queryable."] = () => {

    let queryBuilder = new QueryBuilder(edm);
    let queryable = new Queryable("Source");

    let otherQueryable = new Queryable("OtherForeign").select(["string"]).where((expBuilder) => {
        return expBuilder.property("string").startsWith("J");
    });

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isIn(otherQueryable);
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT * FROM "Source" WHERE "Source"."string" IN (SELECT "string" AS "string" FROM "OtherForeign" WHERE "OtherForeign"."string" LIKE 'J%' LIMIT -1 OFFSET 0) LIMIT -1 OFFSET 0`);
}