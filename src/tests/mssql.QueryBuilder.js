import assert from "assert";
import QueryBuilder from "./../mssql/QueryBuilder";
import { Queryable } from "queryablejs";
import edm from "./../mock/edm";

let schema = "dbo";

exports["mssql.QueryBuilder: Constructor."] = () => {

    let queryBuilder = new QueryBuilder(edm, schema);

}

exports["mssql.QueryBuilder: IsEqualTo."] = () => {

    let queryBuilder = new QueryBuilder(edm, schema);
    let queryable = new Queryable("Source");

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT * FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] = 'Hello World' ORDER BY (SELECT NULL) OFFSET 0 ROWS`);
}

exports["mssql.QueryBuilder: Select."] = () => {

    let queryBuilder = new QueryBuilder(edm, schema);
    let queryable = new Queryable("Source");

    queryable = queryable.select(["string"]).where((expBuilder) => {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT [string] AS [string] FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] = 'Hello World' ORDER BY (SELECT NULL) OFFSET 0 ROWS`);
}

exports["mssql.QueryBuilder: isIn with array."] = () => {

    let queryBuilder = new QueryBuilder(edm, schema);
    let queryable = new Queryable("Source");

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isIn(["John", "Doe"]);
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT * FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] IN ('John', 'Doe') ORDER BY (SELECT NULL) OFFSET 0 ROWS`);
}

exports["mssql.QueryBuilder: isIn with queryable."] = () => {

    let queryBuilder = new QueryBuilder(edm, schema);
    let queryable = new Queryable("Source");

    let otherQueryable = new Queryable("OtherForeign").select(["string"]).where((expBuilder) => {
        return expBuilder.property("string").startsWith("J");
    });

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isIn(otherQueryable);
    });

    let query = queryable.getQuery();
    let sql = queryBuilder.createStatement(query);

    assert.equal(sql, `SELECT * FROM [dbo].[Source__0_0_1] WHERE [dbo].[Source__0_0_1].[string] IN (SELECT [string] AS [string] FROM [dbo].[OtherForeign__0_0_1] WHERE [dbo].[OtherForeign__0_0_1].[string] LIKE 'J%' ORDER BY (SELECT NULL) OFFSET 0 ROWS) ORDER BY (SELECT NULL) OFFSET 0 ROWS`);
}