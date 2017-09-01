import assert from "assert";
import Table from "./../sqlite/Table";
import edm from "./../mock/edm";

exports["Table: addEntityAsync"] = () => {
    var table = new Table("Source", {
        edm: edm,
        sqlite: {
            run: (statement, values) => {
                assert.equal(statement, 'INSERT INTO "Source" ("string") VALUES (?)');
                assert.equal(values[0], "Hello World");

                return Promise.resolve({ lastID: 1 });
            }
        }
    });

    table.addEntityAsync({ string: "Hello World" });
};

exports["Table.createAsync: Create a Source Table."] = () => {
    var table = new Table("Source", {
        edm: edm,
        sqlite: {
            exec: (statement, values) => {
                assert.equal(statement, 'CREATE TABLE IF NOT EXISTS "Source" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "string" TEXT, "number" NUMERIC, "date" NUMERIC, "boolean" NUMERIC, "float" REAL);CREATE INDEX IF NOT EXISTS "id" ON "Source" ("id")');
                return Promise.resolve(null);
            }
        }
    });

    table.createAsync();
};

exports["Table.createAsync: Create a Target Table."] = () => {
    var table = new Table("Foreign", {
        edm: edm,
        sqlite: {
            exec: (statement, values) => {
                assert.equal(
                    statement,
                    'CREATE TABLE IF NOT EXISTS "Foreign" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "foreignKey" INTEGER, FOREIGN KEY ("foreignKey") REFERENCES "Source" ("id"));CREATE INDEX IF NOT EXISTS "id" ON "Foreign" ("id");CREATE INDEX IF NOT EXISTS "foreignKey" ON "Foreign" ("foreignKey")'
                );
                return Promise.resolve(null);
            }
        }
    });

    table.createAsync();
};