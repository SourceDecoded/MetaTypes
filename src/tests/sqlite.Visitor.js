import assert from "assert";
import Visitor from "./../sqlite/Visitor";
import Queryable from "./../query/Queryable";
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

    let statement = visitor.createSelectStatement(query);

    assert.equal(statement, "SELECT 'Source'.'id' AS 'Source___id', 'Source'.'string' AS 'Source___string', 'Source'.'number' AS 'Source___number', 'Source'.'date' AS 'Source___date', 'Source'.'boolean' AS 'Source___boolean', 'Source'.'float' AS 'Source___float' FROM 'Source' WHERE ('Source'.'string' = 'Hello World') LIMIT -1 OFFSET 0");
}

exports["sqlite.Visitor: Include nested object."] = () => {

    let visitor = new Visitor("Source", edm);
    let queryable = new Queryable("Source");

    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("string").isEqualTo("Hello World");
    }).include((expBuilder) => {
        return expBuilder.property("foreigner");
    });

    let query = queryable.getQuery();

    let statement = visitor.createSelectStatement(query);

    assert.equal(statement, "SELECT 'Source'.'id' AS 'Source___id', 'Source'.'string' AS 'Source___string', 'Source'.'number' AS 'Source___number', 'Source'.'date' AS 'Source___date', 'Source'.'boolean' AS 'Source___boolean', 'Source'.'float' AS 'Source___float', 'OtherForeign'.'id' AS 'OtherForeign___id', 'OtherForeign'.'foreignKey' AS 'OtherForeign___foreignKey', 'OtherForeign'.'string' AS 'OtherForeign___string' FROM 'Source' LEFT JOIN 'OtherForeign' ON 'Source'.'id' = 'OtherForeign'.'foreignKey' WHERE ('Source'.'string' = 'Hello World') LIMIT -1 OFFSET 0");
}