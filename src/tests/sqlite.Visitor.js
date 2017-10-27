import assert from "assert";
import Visitor from "./../sqlite/Visitor";
import { Queryable } from "queryablejs";
import edm from "./../mock/edm";

exports["sqlite.Visitor: Constructor."] = () => {

    let visitor = new Visitor("Source", edm);

}

exports["sqlite.Visitor: IsEqualTo."] = () => {

    let visitor = new Visitor("Source", edm);
    let queryable = new Queryable("Source");

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    let query = queryable.getQuery();
    let sql = visitor.createSql(query);

    assert.equal(sql, `SELECT * FROM "Source" WHERE ("Source"."string" = 'Hello World') OFFSET 0 LIMIT -1`);
}

exports["sqlite.Visitor: Select."] = () => {

    let visitor = new Visitor("Source", edm);
    let queryable = new Queryable("Source");

    queryable = queryable.select(["string"]).where((expBuilder) => {
        return expBuilder.property("string").isEqualTo("Hello World");
    });

    let query = queryable.getQuery();
    let sql = visitor.createSql(query);

}

exports["sqlite.Visitor: isIn with array."] = () => {

    let visitor = new Visitor("Source", edm);
    let queryable = new Queryable("Source");

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isIn(["John", "Doe"]);
    });

    let query = queryable.getQuery();
    let sql = visitor.createSql(query);

}

exports["sqlite.Visitor: isIn with queryable."] = () => {

    let visitor = new Visitor("Source", edm);
    let queryable = new Queryable("Source");
    let otherQueryable = new Queryable("OtherForeign").select(["string"]).where((expBuilder) => {
        return expBuilder.property("string").startsWith("J");
    });


    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isIn(otherQueryable);
    });

    let query = queryable.getQuery();
    let sql = visitor.createSql(query);

}