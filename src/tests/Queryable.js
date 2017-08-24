import * as assert from "assert";
import Queryable from "./../query/Queryable";

exports["Queryable: Constructor."] = function () {
    var queryable = new Queryable();
    assert.ok(true);
};

exports["Queryable: Constructor with query."] = function () {
    var queryable = new Queryable();
    queryable = queryable.where((expBuilder) => {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    var query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);

};