import assert from "assert";
import Database from "./../sqlite/Database";
import edm from "./../mock/edm";
import sqlite from "sqlite";

exports["Database._getTableBuildOrder"] = () => {

    sqlite.open(":memory:").then((db) => {
        var database = new Database({
            edm: edm,
            sqlite: sqlite
        });

        let buildOrder = database._getTableBuildOrder();
    });

};


exports["Database.createAsync"] = () => {

    return sqlite.open(":memory:").then((db) => {
        var database = new Database({
            edm: edm,
            sqlite: sqlite
        });

        return database.createAsync();
    });

};

exports["Database.addEntityAsync"] = () => {

    return sqlite.open(":memory:").then((db) => {
        var database = new Database({
            edm: edm,
            sqlite: sqlite
        });

        let table = database.getTable("Source");
        return database.createAsync().then(() => {
            return table.addEntityAsync({
                string: "Hello World",
                integer: 1
            });
        }).then((entity) => {
            assert.equal(entity.id, 1);
            return table.asQueryable().where((expBuilder) => {
                return expBuilder.property("string").isEqualTo("Hello World");
            }).toArrayAsync();
        }).then((result) => {
            assert.equal(result[0].string, "Hello World");
        });
    });

};

exports["Database.updateEntityAsync"] = () => {

    return sqlite.open(":memory:").then((db) => {
        var database = new Database({
            edm: edm,
            sqlite: sqlite
        });

        let table = database.getTable("Source");

        return database.createAsync().then(() => {
            return table.addEntityAsync({
                string: "Hello World",
                integer: 1
            });
        }).then((entity) => {
            return table.updateEntityAsync(entity, {
                string: "Hello World 2"
            });
        }).then((entity) => {
            assert.equal(entity.string, "Hello World 2");
            return table.asQueryable().where((expBuilder)=>{
                return expBuilder.property("string").endsWith("World 2");
            }).toArrayAsync();
        }).then((results) => {
            assert.equal(results.length, 1);
        });
    });

};

exports["Database.removeEntityAsync"] = () => {

    return sqlite.open(":memory:").then((db) => {
        var database = new Database({
            edm: edm,
            sqlite: sqlite
        });

        let table = database.getTable("Source");

        return database.createAsync().then(() => {
            return table.addEntityAsync({
                string: "Hello World",
                integer: 1
            });
        }).then((entity) => {
            return table.removeEntityAsync(entity);
        }).then((entity) => {
            assert.equal(entity.id, 1);

            return table.asQueryable().toArrayAsync();
        }).then((result) => {
            assert.equal(result, 0);
        });
    });

};